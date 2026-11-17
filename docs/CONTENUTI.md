# Come modificare il portfolio

I contenuti sono separati dai componenti. Per cambiare testi, esperienze, skill o progetti, apri i file in `src/data/`: normalmente non serve modificare il codice React.

## Dove modificare ogni sezione

| Sezione | File | Campi principali |
| --- | --- | --- |
| Nome e collegamenti | `src/data/site.js` | `name`, `heroName`, `linkedin`, `github`, `publicEmail` |
| Hero | `src/data/copy.js` | `en` / `it`: `heroEyebrow`, `heroClaim`, `heroDesc`, `heroCta`, `asset` |
| Chi sono | `src/data/copy.js` | `aboutTitleLines`, `about1`, `about2`, `aboutEyebrow` |
| Competenze | `src/data/skills.js` | `name.en/it`, lista `items` di ogni categoria |
| Introduzione Journey | `src/data/copy.js` | `journeyEyebrow`, `journeyTitleLines`, `journeyLead` |
| Tappe Journey | `src/data/timeline.js` | `year`, `title.en/it`, `text.en/it` |
| Etichetta sezione progetti | `src/data/copy.js` | `workEyebrow`, `workMobileHint`; la sezione inizia direttamente dal primo elemento di `projects.js` |
| Schede e dettagli progetti | `src/data/projects.js` | `title`, `summary`, `subtitle`, `details`, `stack`, `image`, `demo`, `repository` |
| Hobby | `src/data/creative.js` | `name.en/it`, `tag.en/it`, `image` |
| Introduzione hobby | `src/data/copy.js` | `creativeEyebrow`, `creativeTitle`, `creativeLead` |
| Testi contatti e footer | `src/data/copy.js` | `contactTitle`, `contactLead`, `contactAvailable`, `form*`, `footer`, `backToTop` |
| CV e modulo contatti | `src/data/site.js` | `cv`, `cvReady`, `existingPublicCv`, `contactFormAction` |

`copy.js` contiene due oggetti: `en` per inglese e `it` per italiano. Aggiorna entrambi per mantenere il cambio lingua completo. I titoli `aboutTitleLines` e `journeyTitleLines` sono array di due righe; la seconda viene mostrata in corsivo.

## Cambiare le immagini

1. Inserisci il file in `public/media/`, ad esempio `journal.webp`.
2. In `src/data/projects.js`, modifica `image` del progetto:

```js
"image": "/media/journal.webp"
```

Il percorso pubblico non include `public`. Per i progetti puoi aggiungere `imageAlt.en/it`, `imageFit` (`cover` o `contain`), `imagePosition` e un titolo sovrapposto `imageHeading.en/it`. Le immagini attuali sono in `public/media/projects/`. Per il terzo progetto il file atteso è `portfolio.png`.

Il quarto progetto usa `images`: un array con `src`, `alt.en/it` e `label.en/it` per ciascuna immagine. Le due immagini restano affiancate sia nella galleria sia nei dettagli. Per gli hobby puoi continuare a impostare `image` in `creative.js`; con `null` rimane la grafica provvisoria.

## Aggiungere un progetto o una tappa

Le tre schede “Beyond the screen” sono configurate in `src/data/creative.js`: `name` per il titolo, `tag` per la didascalia, `image` per la foto, `imageAlt` per il testo accessibile e `imagePosition` per il ritaglio. Le foto sono in `public/media/creative/`. La correzione cromatica calda è applicata dalle regole `.creative-photo` in `src/styles/sections.css`, quindi gli originali rimangono intatti.

### Immagini aggiuntive in “Esplora progetto”

Ogni progetto in `src/data/projects.js` ha un array `gallery: []`. Inserisci qui le immagini aggiuntive: appariranno solo nella finestra di dettaglio, dopo la descrizione. La copertina e il confronto delle colonne restano separati.

Salva i file in `public/media/projects/` e compila, ad esempio:

```js
"gallery": [
  {
    "src": "/media/projects/pieve-interno.jpg",
    "alt": { "it": "Interno della Pieve in VR", "en": "Church interior in VR" },
    "caption": { "it": "Esplorazione degli interni.", "en": "Exploring the interior." },
    "position": "center"
  }
]
```

Duplica l'oggetto per aggiungere altre foto. `caption` e `position` sono facoltativi. Le immagini riempiono il riquadro senza deformarsi; `position` permette di scegliere il punto del ritaglio (ad esempio `center top`). Puoi impostare `aspectRatio` (ad esempio `"16 / 9"`) per adattare il riquadro alle proporzioni della foto: la galleria della Pieve lo usa per mostrare anche schemi e confronti completi. Un array vuoto non mostra alcuna galleria aggiuntiva.

L'ordine degli oggetti nell'array `projects` determina la sequenza: Pieve, Journal App, sito, ottimizzazione.

Duplica un oggetto nello stesso array, assegna un `id` univoco ai progetti e completa le traduzioni. Per i progetti aggiorna anche `number`. Contatori, pulsanti e lunghezza dello scorrimento si adattano al numero di elementi. Aggiorna manualmente l'introduzione se cita un numero specifico di progetti.

`timeline.js` è ordinato dal più recente al più vecchio. Il componente lo mostra in ordine cronologico, dal più vecchio al più recente.

## Aggiornare il CV

Inserisci i PDF in `public/cv/`, aggiorna i percorsi in `site.cv` e imposta il relativo valore in `site.cvReady` a `true`. Se nessuna versione è pronta viene utilizzato `existingPublicCv`.

## Aspetto e animazioni

### Modulo contatti e ringraziamento

Formspree rimane il servizio di invio, configurato con `contactFormAction` in `src/data/site.js`. Il modulo invia con JavaScript e mostra la pagina di conferma solo dopo una risposta HTTP positiva. Errori di rete o del servizio mantengono il testo nel modulo. Non inserire chiavi private o credenziali email nel frontend.

- Modulo: `src/components/contact/ContactForm.jsx`.
- Servizio di invio sostituibile: `src/services/contact.js`.
- Pagina di ringraziamento: `src/components/contact/ThankYou.jsx`.
- Aspetto: `src/styles/contact-feedback.css`.
- Testi IT/EN: campi `thank*`, `formSending`, `formError` in `src/data/copy.js`.

Anteprima della conferma: apri `/#thank-you/it` oppure `/#thank-you/en` sul sito locale o pubblicato. È una vista React con URL hash, compatibile con GitHub Pages anche ricaricando la pagina. Aprire direttamente questo URL serve solo a visualizzare la pagina e non invia messaggi. Non è necessario configurare un redirect nel pannello Formspree.

Verifica manuale consigliata prima della pubblicazione: invio reale, ricezione email, invio con rete disconnessa, pulsante disabilitato durante l’attesa, ritorno al portfolio, cambio lingua e ricarica della conferma. I test automatici simulano le risposte del provider e non inviano email.

| Modifica | File |
| --- | --- |
| Colori, font, regole generali | `src/styles/base.css` (`:root`) |
| Menu e footer | `src/styles/layout.css` |
| Hero desktop, mobile e tablet | `src/styles/hero.css` |
| About, hobby, contatti | `src/styles/sections.css` |
| Schede, illustrazioni e finestra progetto | `src/styles/projects.css` |
| Timeline e scene orizzontali | `src/styles/scroll-scenes.css` |
| Luci, camera, modello e PNG della colonna | `src/config/column.js` |
| Implementazione Three.js | `src/components/three/ColumnExperience.jsx` |
| Animazioni decorative | `src/components/motion/PageMotion.jsx` |
| Scorrimento condiviso Journey / Work | `src/hooks/useHorizontalScene.js` |

I componenti di sezione sono in `src/components/sections/`. Il layout generale e l'ordine delle sezioni sono in `src/App.jsx`. Evita di inserire testi nei componenti: aggiungili a `copy.js`.

## Responsive e controlli

Le scene orizzontali richiedono almeno **1100 px di larghezza**, **650 px di altezza**, orientamento orizzontale e assenza della preferenza di movimento ridotto. Altrimenti Journey diventa verticale e Work usa il carosello. La hero è centrata su schermi compatti e in orientamento verticale.

Il breakpoint condiviso è in `src/config/responsive.js`; se lo cambi, aggiorna anche la query documentata in `src/styles/scroll-scenes.css`. La hero ha la propria composizione in `hero.css` e l'inquadratura in `ColumnExperience.jsx`.

Controlla desktop 1887×1126, 1920×1080 e 1366×768; tablet 768×1024, 820×1180 e 1024×1366; telefono 390×844 e 430×932. Prova anche il cambio orientamento, lo scroll in entrambe le direzioni, entrambe le lingue e la preferenza di movimento ridotto. Non devono comparire spazi dopo il footer.

```powershell
npm run dev
npm run build
npm run lint
npm test
```

I test automatici verificano il calcolo dello scorrimento e i vincoli responsive; non sostituiscono una prova visiva sui dispositivi.
