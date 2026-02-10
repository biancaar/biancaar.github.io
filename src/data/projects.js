// src/data/projects.js

import p1 from "../assets/project1.jpg";
import p2 from "../assets/project2.jpg";
import p3 from "../assets/project3.jpg";

// immagini interne ai progetti
import p1a from "../assets/project1_a.jpg";
import p1b from "../assets/project1_b.jpg";

const projects = [
  {
    id: 1,
    title: "Immersive VR Tour",
    subtitle: "Applicazione interattiva per la realtà virtuale",
    cover: p1,

    blocks: [
      {
        type: "text",
        title: "Overview",
        text:
          "Questo progetto nasce con l’obiettivo di creare un’esperienza immersiva in realtà virtuale, pensata per valorizzare lo spazio e guidare l’utente attraverso contenuti informativi e interattivi."
      },

      {
        type: "image",
        src: p1a,
        alt: "VR Tour screenshot",
        caption: "Vista dell’ambiente principale in VR"
      },

      {
        type: "gallery",
        columns: 2,
        images: [
          { src: p1a, alt: "Dettaglio ambiente" },
          { src: p1b, alt: "Interazione utente" }
        ]
      },

      {
        type: "list",
        title: "Tecnologie utilizzate",
        items: [
          "Unity",
          "XR Interaction Toolkit",
          "Blender",
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

    blocks: [
      {
        type: "text",
        title: "Concept",
        text:
          "Attività di insegnamento e progettazione focalizzata sulla modellazione 3D funzionale alla stampa, con attenzione a tolleranze, volumi e ottimizzazione del mesh."
      },

      {
        type: "image",
        src: p2,
        alt: "Modello 3D pronto per la stampa",
        caption: "Anteprima del modello in Blender"
      },

      {
        type: "list",
        title: "Competenze",
        items: ["Blender", "Topology", "3D Printing Workflow"]
      }
    ]
  },

  {
    id: 3,
    title: "Ottimizzazione Modelli 3D",
    subtitle: "Riduzione della complessità per applicazioni real-time",
    cover: p3,

    blocks: [
      {
        type: "text",
        title: "Obiettivo",
        text:
          "Sperimentazione di diverse tecniche di ottimizzazione per migliorare le performance di modelli complessi, mantenendo un buon livello visivo."
      },

      {
        type: "list",
        title: "Tecniche applicate",
        items: [
          "LOD Group",
          "Occlusion Culling",
          "Texture Baking",
          "Mesh Simplification"
        ]
      }
    ]
  }
];

export default projects;
