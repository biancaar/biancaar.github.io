# Migrazione del portfolio GitHub Pages

## Stato preparato il 17 novembre 2026

- Nuovo progetto: `D:\Projects\Bianca`.
- Backup locale del vecchio progetto: `D:\Projects\Bianca\OldPortfolio`.
- Backup verificato: 696 file, senza `node_modules`; comprende sorgenti, immagini, vecchia build e cronologia Git.
- La cartella originale `C:\Users\Bia\Documents\GitHub\biancaar.github.io` non è stata modificata.
- GitHub non è stato aggiornato: l'integrazione ha rifiutato la creazione del ramo di archivio con errore `403 Resource not accessible by integration`.
- Il vecchio CV pubblico è ora in `public/cv/Bianca-Rotaru-CV-Public.pdf`, per mantenerlo disponibile dopo la sostituzione dei sorgenti.

## Applicare la migrazione

### Ultima verifica del progetto

Pulizia completata: eliminati gli stili delle vecchie illustrazioni provvisorie e le traduzioni non utilizzate. Le immagini duplicate o inutilizzate sono state archiviate in `.asset-import/unused`, esclusa da Git e dalla migrazione, insieme ai file temporanei di importazione. Il backup `OldPortfolio` resta escluso dalla pubblicazione.

Build, lint e 14 test superati, incluso il controllo di esistenza di tutte le immagini configurate e del CV disponibile. Gli script PowerShell superano il controllo sintattico. L'invio reale del modulo e la verifica visiva finale sui dispositivi vanno verificati sul sito pubblicato.

La pubblicazione da questa sessione resta bloccata: Git non risolve `github.com` e l'integrazione GitHub risponde `403 Resource not accessible by integration` quando prova a creare il ramo di archivio. Nessun ramo è stato modificato da questo tentativo. Esegui il comando seguente dal tuo PowerShell per completare tramite il tuo accesso GitHub.

Apri PowerShell nel tuo account Windows ed esegui:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Projects\Bianca\scripts\Migrate-Portfolio.ps1"
```

Servono Git, Node/npm e l'accesso in scrittura al repository tramite Git. Se Git richiede l'accesso a GitHub, completa l'autenticazione nel tuo account.

Se Windows impedisce di rinominare la vecchia cartella perché è usata da un programma, usa:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Projects\Bianca\scripts\Migrate-Portfolio.ps1" -KeepOldFolder
```

Questa modalità copia il vecchio progetto in `C:\Users\Bia\Documents\GitHub\OldPortfolio` (senza `node_modules`) e prepara il nuovo in `C:\Users\Bia\Documents\GitHub\biancaar.github.io-NewPortfolio`. La cartella originale non viene rinominata o modificata. I rami di backup già creati vengono conservati. Dopo la pubblicazione usa il nuovo clone per lavorare e per `npm run deploy`.

Lo script:

1. Verifica percorsi e repository di destinazione.
2. Salva gli attuali rami online come `OldPortfolio` e `OldPortfolio-Published`, senza sovrascrivere eventuali archivi già presenti.
3. Rinomina la vecchia cartella locale in `C:\Users\Bia\Documents\GitHub\OldPortfolio`. Conserva anche modifiche non ancora pubblicate e dipendenze installate.
4. Clona nuovamente `biancaar.github.io` nella posizione originale e sostituisce i vecchi sorgenti con il nuovo progetto, senza includere backup, `.asset-import`, `.publish`, `dist` o `node_modules`.
5. Installa le dipendenze, esegue lint, test e build.
6. Pubblica i sorgenti su `main` e il sito compilato su `gh-pages`, mantenendo le cronologie esistenti. Non utilizza force push.

Il sito resta `https://biancaar.github.io/`. La pubblicazione di Pages può richiedere alcuni minuti. La configurazione esistente deve continuare a usare il ramo `gh-pages`, cartella `/ (root)`.

Se la cartella di archivio esiste già, lo script si ferma senza rinominare il repository. Se una fase fallisce, il messaggio indica cosa controllare; gli archivi non vengono cancellati.

## Aggiornamenti successivi

Lavora nella nuova copia del repository:

```powershell
cd "C:\Users\Bia\Documents\GitHub\biancaar.github.io"
npm run dev
```

Quando vuoi pubblicare le modifiche:

```powershell
npm run deploy
```

Questo comando controlla e compila il progetto, crea i commit necessari e pubblica sia `main` sia `gh-pages`. Il progetto in `D:\Projects\Bianca` rimane una copia separata: dopo la migrazione usa la cartella GitHub per le modifiche future.

## Recuperare il vecchio lavoro

Puoi leggere codice, immagini e stile dal backup `OldPortfolio`. Su GitHub i rami di archivio, una volta eseguita la migrazione, conserveranno separatamente il vecchio sorgente e il vecchio sito compilato. Per consultare i contenuti non serve ripristinare il sito online.
