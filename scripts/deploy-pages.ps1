param([switch]$SkipInstall)

# Run from a writable clone authenticated to biancaar/biancaar.github.io.
# Publishes source to main and the compiled site to the existing gh-pages branch.
$ErrorActionPreference = 'Stop'
$projectPath = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$expectedRemote = 'https://github.com/biancaar/biancaar.github.io.git'

function Invoke-CheckedGit {
    param([string]$At, [string[]]$Arguments)
    & git -C $At @Arguments
    if ($LASTEXITCODE -ne 0) { throw ('Git failed: ' + ($Arguments -join ' ')) }
}

if (-not (Test-Path -LiteralPath (Join-Path $projectPath '.git'))) {
    throw 'Run this script from the GitHub repository clone, after Migrate-Portfolio.ps1.'
}
$actualRemote = (& git -C $projectPath remote get-url origin).Trim()
if ($actualRemote -ne $expectedRemote -and $actualRemote -ne 'git@github.com:biancaar/biancaar.github.io.git') {
    throw 'Unexpected origin: publishing stopped.'
}
$branch = (& git -C $projectPath branch --show-current).Trim()
if ($branch -ne 'main') { throw 'Switch to main before publishing.' }

Push-Location $projectPath
try {
    if (-not $SkipInstall) {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
    }
    foreach ($check in @('lint', 'test', 'build')) {
        & npm.cmd run $check
        if ($LASTEXITCODE -ne 0) { throw ('Check failed: ' + $check) }
    }
    Invoke-CheckedGit -At $projectPath -Arguments @('add', '--all')
    & git -C $projectPath diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        Invoke-CheckedGit -At $projectPath -Arguments @('commit', '-m', 'Replace portfolio with the Monumental React site')
    } elseif ($LASTEXITCODE -ne 0) { throw 'Unable to inspect staged changes.' }
    Invoke-CheckedGit -At $projectPath -Arguments @('push', 'origin', 'main')
    Invoke-CheckedGit -At $projectPath -Arguments @('fetch', 'origin', 'gh-pages')

    $pagesTempRoot = [IO.Path]::GetFullPath($env:TEMP).TrimEnd('\')
    $pagesPath = [IO.Path]::GetFullPath((Join-Path $pagesTempRoot ('BiancaPages-' + [Guid]::NewGuid().ToString('N'))))
    if (-not $pagesPath.StartsWith($pagesTempRoot + '\', [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Unexpected deployment workspace.'
    }
    Invoke-CheckedGit -At $projectPath -Arguments @('worktree', 'add', '--detach', $pagesPath, 'FETCH_HEAD')
    try {
        # This worktree was just created above; remove only its tracked published files.
        Invoke-CheckedGit -At $pagesPath -Arguments @('rm', '-r', '--ignore-unmatch', '--', '.')
        Get-ChildItem -LiteralPath (Join-Path $projectPath 'dist') -Force | Copy-Item -Destination $pagesPath -Recurse -Force
        [IO.File]::WriteAllText((Join-Path $pagesPath '.nojekyll'), '')
        Copy-Item -LiteralPath (Join-Path $pagesPath 'index.html') -Destination (Join-Path $pagesPath '404.html') -Force
        Invoke-CheckedGit -At $pagesPath -Arguments @('add', '--all')
        & git -C $pagesPath diff --cached --quiet
        if ($LASTEXITCODE -eq 1) {
            Invoke-CheckedGit -At $pagesPath -Arguments @('commit', '-m', 'Publish Monumental portfolio to GitHub Pages')
        } elseif ($LASTEXITCODE -ne 0) { throw 'Unable to inspect deployment changes.' }
        Invoke-CheckedGit -At $pagesPath -Arguments @('push', 'origin', 'HEAD:gh-pages')
    } finally {
        # No --force: keep the workspace for inspection if a failed build left changes.
        & git -C $projectPath worktree remove $pagesPath
        if ($LASTEXITCODE -ne 0) { Write-Warning ('Deployment workspace retained at ' + $pagesPath) }
    }
    Write-Host 'Published: https://biancaar.github.io/ (GitHub Pages may take a few minutes).' -ForegroundColor Green
} finally {
    Pop-Location
}
