# Bianca Rotaru — portfolio

Portfolio React + Vite, con contenuti IT/EN, colonna Three.js, timeline e progetti responsive.

## Avvio

```powershell
npm install
npm run dev
```

`npm run build` genera `dist/`; `npm run preview` lo serve localmente. `npm run lint` controlla il codice e `npm test` esegue i test dello scorrimento.

## GitHub Pages e vecchio portfolio

La procedura pronta per sostituire il vecchio sito, conservarlo come `OldPortfolio` e pubblicare il nuovo è descritta in [docs/MIGRAZIONE.md](docs/MIGRAZIONE.md). Dopo la migrazione, `npm run deploy` pubblica dal clone GitHub i sorgenti su `main` e la build su `gh-pages`.

## Modificare i contenuti

La guida completa è in [docs/CONTENUTI.md](docs/CONTENUTI.md), con una tabella per ogni sezione, esempi per immagini e CV e la mappa degli stili.

- `src/data/`: testi, progetti, esperienze, competenze e collegamenti.
- `src/components/sections/`: Hero, About, Journey, hobby e contatti.
- `src/components/projects/`: galleria, anteprime e finestra di dettaglio.
- `src/components/layout/`: menu e footer.
- `src/components/contact/`: modulo e pagina di ringraziamento.
- `src/services/`: invio del modulo, separato dall'interfaccia.
- `src/components/ui/`: elementi riutilizzabili.
- `src/components/motion/`: animazioni decorative.
- `src/components/three/`: scena 3D.
- `src/config/`: breakpoint, camera, luci e asset della colonna.
- `src/hooks/`: comportamento condiviso delle scene e media query.
- `src/styles/`: stili suddivisi per responsabilità; `src/styles.css` li importa.
- `public/media/`: modelli e immagini; `public/cv/`: curriculum.
- `tests/`: regressioni sul calcolo dello scroll.

I controlli verificano anche i testi IT/EN, la presenza degli asset e le risposte del servizio contatti. I file temporanei e gli asset scartati sono conservati in `.asset-import/`, esclusa da Git e dalla migrazione.

## Scorrimento

Journey e Work condividono `useHorizontalScene`: ciascuna ha un palco `position: sticky` e una lunghezza misurata dal contenuto. Nessun blocco GSAP, spacer o wrapper trasformato modifica l'altezza della pagina. GSAP gestisce soltanto le animazioni decorative. Il passaggio desktop/tablet/mobile considera larghezza, altezza, orientamento e movimento ridotto.

## Colonna e immagine di riserva

Il modello viene caricato separatamente dal resto dell'applicazione. Il PNG ad alta risoluzione resta visibile durante il caricamento o se WebGL non è disponibile. Asset e illuminazione si configurano in `src/config/column.js`.

Per rigenerare il render statico dal modello, con Blender installato:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.0\blender.exe' --background --factory-startup --python scripts/render-column.py
```

Il render offline usa luci impostate nello script; per farlo corrispondere a una nuova illuminazione Three.js aggiorna anche quelle. Non viene pubblicato nulla automaticamente.
