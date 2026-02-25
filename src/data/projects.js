// src/data/projects.js

import p1 from "../assets/project1.jpg";
import p2 from "../assets/project2.jpg";
import p3 from "../assets/project3.jpg";

// immagini interne ai progetti
import p1Front from "../assets/RenderPieve1.png";
import p1Teleport from "../assets/project1_b.jpg";
import p1Hands from "../assets/handsVR.jpg";
import p1Interno from "../assets/luciunity.jpg";
import p1P1 from "../assets/one.png";
import p1P2 from "../assets/DueHD.jpg";
import p1P3 from "../assets/AmboneIpotesi1.jpg";
import p1P1a from "../assets/Timeline1.jpg";
import p1P2b from "../assets/Timeline2.jpg";
import p1P3c from "../assets/amboneantico1.jpg";

import p2Progetto from "../assets/FormellaProgetto.png";
import p2Risultato from "../assets/FormellaStampa.png";

import p3HD1 from "../assets/ColumnHD.jpg";
import p3LD1 from "../assets/ColumnLD.jpg";
import p3Mod from "../assets/bianca-rotaru-immagine-2025-08-20-124028.png";
import p3Full from "../assets/project3.jpg";

import p1PreviewA from "../assets/com.oculus.vrshell-20250313-090753.jpg";
import p1HeroImage from "../assets/RenderPieve2.png";
import centerPlaceholder from "../assets/20241203_124918.png";
import videoPlaceholder from "../assets/AudioOrgano.mov";
import formellaCenter from "../assets/Formella.png";
import formellaVideo from "../assets/FormellaVideo.mp4";
import formellaPreviewA from "../assets/FormellaProgetto.png";
import formellaPreviewB from "../assets/FormellaStampa.png";
import optimizationVideo from "../assets/3DOptimization.mp4";
import render3Center from "../assets/Render2.png";
import columnHDPreview from "../assets/ColumnHD.jpg";
import columnLDPreview from "../assets/ColumnLD.jpg";

const projects = [
  {
    id: 1,
    title: "Immersive VR Tour",
    subtitle: "Applicazione interattiva per la realta' virtuale",
    cover: p1,
    heroImage: p1HeroImage,
    heroScale: 2.1,
    centerImage: centerPlaceholder,
    centerScale: 1.3,
    previewVideo: videoPlaceholder,
    previewVideoScale: 1.28,
    previewImageA: p1PreviewA,
    previewTitle: "Pieve di Fornovo",

    blocks: [
      {
        type: "text",
        title: "Overview",
        text:
          "Questo progetto nasce con l'obiettivo di creare un'esperienza immersiva in realta' virtuale, pensata per valorizzare il territorio di Fornovo e guidare l'utente attraverso contenuti informativi e interattivi. \n L'applicazione e' stata sviluppata in Unity, con particolare attenzione all'ottimizzazione per dispositivi VR, garantendo un'esperienza fluida e coinvolgente. \n Il tour virtuale permette agli utenti di esplorare ambienti ricostruiti in 3D, interagire con elementi informativi e vivere un viaggio immersivo alla scoperta della storia e delle bellezze di Fornovo. \n Il progetto ha richiesto competenze in modellazione 3D, sviluppo software e design dell'esperienza utente, con un focus particolare sull'accessibilita' e l'usabilita' in ambiente VR."
      },

      {
        type: "image",
        src: p1Front,
        alt: "VR Tour screenshot",
        caption: "Vista del ambiente principale in VR"
      },

      {
        type: "text",
        title: "Interno",
        text:
          "L'interno e' stato modellato con cura per ricreare l'atmosfera autentica del luogo, con particolare attenzione all'illuminazione e ai dettagli architettonici. \n L'ottimizzazione per VR ha richiesto un bilanciamento tra qualità visiva e performance, implementando tecniche di LOD e occlusion culling per garantire un'esperienza fluida anche su hardware meno potente, come l'Oculus Quest 2. \n Alcuni degli elementi architettonici storici, come statue o bassorilievi, sono stati scannerizzati in 3D, ottimizzati e integrati nell'ambiente virtuale, permettendo agli utenti di avvicinarsi e interagire con essi per scoprire informazioni dettagliate sulla loro storia e significato."
      },

      {
        type: "image",
        src: p1Interno,
        alt: "Luci ambiente interno",
        caption: "Luci ambiente interno"
      },

      {
        type: "text",
        title: "Interazione",
        text:
          "Particolare cura e' stata dedicata all'esperienzza dell'utente, con riguardo per utenti di eta' e abilita' diverse. L'interazione e' stata progettata per essere intuitiva e accessibile, permettendo agli utenti di esplorare anche senza l'utilizzo di controller, grazie a un sistema di riconoscimento delle mani e della posizione delle dita. Permettendo dunque un'esperienza piu' naturale e immersiva, soprattutto per utenti meno esperti o con limitazioni motorie. L'interazione senza controller consente agli utenti di navigare attraverso il tour virtuale semplicemente muovendo le mani, toccando o afferrando virtualmente gli oggetti di interesse, e attivando contenuti informativi con gesti naturali. Questo approccio ha richiesto l'integrazione di tecnologie avanzate di tracking e riconoscimento dei gesti."
      },

      {
        type: "gallery",
        columns: 2,
        images: [
          { src: p1Teleport, alt: "Teleport Mani" },
          { src: p1Hands, alt: "Interazione utente" }
        ],
        caption: "Interazione senza contoller"
      },


      {
        type: "text",
        title: "Ricostruzione Storica",
        text:
          "Per offrire un esperienza unica, si permette agli utenti di tornare indietro nel tempo e vedere diverse fasi della Pieve, a seconda del periodo storico selezionato. Questo e' stato possibile grazie alla modellazione 3D basata su dati storici, fotografie d'epoca e rilievi, che ha permesso di ricostruire fedelmente l'evoluzione architettonica del sito. Gli utenti possono esplorare le diverse fasi storiche della Pieve, osservando come si e' trasformata nel corso dei secoli, e accedere a contenuti informativi che spiegano i cambiamenti architettonici e storici avvenuti nel tempo."
      },

      {
        type: "gallery",
        columns: 3,
        rows: 2,
        images: [
          { src: p1P1, alt: "Timeline 1" },
          { src: p1P2, alt: "Timeline 2" },
          { src: p1P3, alt: "Timeline 3" },
          { src: p1P1a, alt: "Timeline 1" },
          { src: p1P2b, alt: "Timeline 2" },
          { src: p1P3c, alt: "Timeline 3" }
        ],
        caption: "Interazione senza contoller"
      },

      
      {
        type: "list",
        title: "Tecnologie utilizzate",
        items: [
          "Unity",
          "XR Interaction Toolkit",
          "Blender",
          "Photogrammetry",
          "Substance Painter",
          "Ottimizzazione per VR"
        ]
      }
    ]
  },

  {
    id: 2,
    title: "Modellazione per 3D Printing",
    subtitle: "Formazione e progettazione orientata alla stampa 3D",
    cover: p2,
    heroScale: 1.0,
    centerImage: formellaCenter,
    centerScale: 2.0,
    previewVideo: formellaVideo,
    previewImageA: formellaPreviewA,
    previewImageB: formellaPreviewB,
    previewTitle: "Formella 3D",

    blocks: [
      {
        type: "text",
        title: "Overview",
        text:
          "Attivita' di insegnamento e progettazione focalizzata sulla modellazione 3D funzionale alla stampa, con attenzione a tolleranze, volumi e ottimizzazione delle mesh. Corso insegnato ai studenti del corso di Ambiente e Territorio presso la scuola Toschi di Parma. L'obbiettivo del progetto e'stato quello di fornire agli studenti le competenze necessarie per creare modelli 3D usando gli insegnamenti di architettura e storytelling, al fine di ottenere un prodotto finale da proporre al pubblico."
      },

      {
        type: "image",
        src: p2,
        alt: "Modello 3D pronto per la stampa",
        caption: "Anteprima del modello in Blender"
      },

      {
        type: "image",
        src: p2Progetto,
        alt: "Progetto iniziale",
        caption: "Progetto iniziale"
      },

      {
        type: "image",
        src: p2Risultato,
        alt: "Risultato stampa 3D",
        caption: "Risultato finale dopo stampa 3D"
      },

      {
        type: "list",
        title: "Competenze",
        items: ["Blender", "Insegnamento", "3D Printing Workflow"]
      }
    ]
  },

  {
    id: 3,
    title: "Ottimizzazione Modelli 3D",
    subtitle: "Riduzione della complessita' per applicazioni real-time",
    cover: p3,
    heroScale: 2.1,
    centerImage: render3Center,
    centerScale: 3.8,
    previewVideo: optimizationVideo,
    previewImageA: columnHDPreview,
    previewImageB: columnLDPreview,
    previewTitle: "Baking Texture PBR",

    blocks: [
      {
        type: "text",
        title: "Overview",
        text:
          "Progetto personale incentrato sulla modellazione ad alta definizione di una colonna corinzia, realizzata con elevata densità di vertici per preservare ogni dettaglio ornamentale. Successivamente, tramite Substance Painter, sono stati generati materiali PBR a partire dal modello high-poly, al fine di trasferire i dettagli su una versione low-poly ottimizzata. Questo workflow ha permesso di mantenere un’elevata qualità visiva migliorando significativamente le performance, rendendo il modello adatto a contesti real-time e web. Nelle immagini sotto vediamo lo stesso modello. Le texture applicate al semplice cilindro, permettono di ricreare la tridimensionalita'."
      },

      {
        type: "gallery",
        columns: 2,
        images: [
          { src: p3HD1, alt: "High Poly Texture" },
          { src: p3LD1, alt: "Low Poly Mesh" },
          { src: p3Mod, alt: "Modular Assets" },
          { src: p3Full, alt: "Complete Look" }
        ],
        caption: "HD Texture, LD Mesh e modello modularizzato"
      },


      {
        type: "list",
        title: "Tecniche applicate",
        items: [
          "Modellazione High-Poly",
          "Ottimizzazione Low-Poly",
          "Baking & Texture Workflow (PBR)",
          "Creazione modular assets",
          "Ottimizzazione per Real-Time / Web"
        ]
      }
    ]
  }
];

export default projects;
