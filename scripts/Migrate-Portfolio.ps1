param(
    [string]$Repository = 'C:\Users\Bia\Documents\GitHub\biancaar.github.io',
    [switch]$KeepOldFolder
)

# One-time migration. Run in the user's PowerShell, with GitHub write access.
# The original checkout is renamed, never erased. No force pushes are used.
$ErrorActionPreference = 'Stop'
$sourceProject = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent)).TrimEnd('\')
$repositoryPath = [IO.Path]::GetFullPath($Repository).TrimEnd('\')
$archivePath = [IO.Path]::GetFullPath((Join-Path (Split-Path $repositoryPath -Parent) 'OldPortfolio'))
$newRepositoryPath = if ($KeepOldFolder) {
    [IO.Path]::GetFullPath($repositoryPath + '-NewPortfolio')
} else { $repositoryPath }
$remote = 'https://github.com/biancaar/biancaar.github.io.git'

function Invoke-MigrationGit {
    param([string]$At, [string[]]$Arguments)
    & git -C $At @Arguments
    if ($LASTEXITCODE -ne 0) { throw ('Git failed: ' + ($Arguments -join ' ')) }
}

if (-not (Test-Path -LiteralPath (Join-Path $sourceProject 'src\App.jsx'))) { throw 'New portfolio source not found.' }
if (-not (Test-Path -LiteralPath (Join-Path $repositoryPath '.git'))) { throw 'Old repository not found.' }
if ($sourceProject -eq $repositoryPath -or $sourceProject.StartsWith($repositoryPath + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'The new project must be separate from the old repository.'
}
if ($archivePath -eq $repositoryPath -or (Test-Path -LiteralPath $archivePath)) {
    throw ('Archive already exists or is unsafe: ' + $archivePath + '. Nothing was moved.')
}
if ($KeepOldFolder -and (Test-Path -LiteralPath $newRepositoryPath)) {
    throw ('New checkout already exists: ' + $newRepositoryPath + '. Nothing was changed.')
}
$actualRemote = (& git -C $repositoryPath remote get-url origin).Trim()
if ($actualRemote -ne $remote -and $actualRemote -ne 'git@github.com:biancaar/biancaar.github.io.git') {
    throw 'Unexpected repository origin.'
}

# Make recoverable remote snapshots before touching the local checkout.
Invoke-MigrationGit -At $repositoryPath -Arguments @('fetch', 'origin')
foreach ($backup in @(@('OldPortfolio', 'main'), @('OldPortfolio-Published', 'gh-pages'))) {
    $existing = & git -C $repositoryPath ls-remote --heads origin ('refs/heads/' + $backup[0])
    if ($LASTEXITCODE -ne 0) { throw 'Cannot verify GitHub backup branches.' }
    if (-not $existing) {
        Invoke-MigrationGit -At $repositoryPath -Arguments @('push', 'origin', ('refs/remotes/origin/' + $backup[1] + ':refs/heads/' + $backup[0]))
    }
}

# KeepOldFolder avoids renaming a directory locked by an editor or dev server.
# Preserve the working files and Git history, including uncommitted changes.
if ($KeepOldFolder) {
    & robocopy $repositoryPath $archivePath /E /XJ /XD node_modules /R:1 /W:1 /NFL /NDL /NJH /NJS
    if ($LASTEXITCODE -gt 7) { throw 'Cannot finish the local archive. Original checkout was not changed.' }
    Write-Host ('Original checkout kept at ' + $repositoryPath)
} else {
    # Both absolute paths were checked above. The destination did not exist.
    Move-Item -LiteralPath $repositoryPath -Destination $archivePath
}
& git clone --branch main $remote $newRepositoryPath
if ($LASTEXITCODE -ne 0) {
    throw ('Clone failed. Original files are safe at ' + $archivePath + '. No site was published.')
}
$verifiedClone = (Resolve-Path -LiteralPath $newRepositoryPath).Path.TrimEnd('\')
if ($verifiedClone -ne $newRepositoryPath) { throw 'Unexpected clone location.' }
Invoke-MigrationGit -At $verifiedClone -Arguments @('rm', '-r', '--ignore-unmatch', '--', '.')

# Copy source, documentation, tests and media. Exclude archives and generated output.
& robocopy $sourceProject $verifiedClone /E /XD node_modules dist OldPortfolio .git .asset-import .publish /XF '*.log' /R:1 /W:1 /NFL /NDL /NJH /NJS
if ($LASTEXITCODE -gt 7) {
    throw ('Copy failed. Original portfolio remains at ' + $archivePath)
}
& (Join-Path $verifiedClone 'scripts\deploy-pages.ps1')
Write-Host ('Old checkout: ' + $archivePath) -ForegroundColor Green
Write-Host ('New checkout: ' + $verifiedClone) -ForegroundColor Green
