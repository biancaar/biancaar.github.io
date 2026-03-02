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

const projectsIt = [
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
          "Particolare cura e' stata dedicata all'esperienza dell'utente, con riguardo per utenti di eta' e abilita' diverse. L'interazione e' stata progettata per essere intuitiva e accessibile, permettendo agli utenti di esplorare anche senza l'utilizzo di controller, grazie a un sistema di riconoscimento delle mani e della posizione delle dita. Permettendo dunque un'esperienza piu' naturale e immersiva, soprattutto per utenti meno esperti o con limitazioni motorie. L'interazione senza controller consente agli utenti di navigare attraverso il tour virtuale semplicemente muovendo le mani, toccando o afferrando virtualmente gli oggetti di interesse, e attivando contenuti informativi con gesti naturali. Questo approccio ha richiesto l'integrazione di tecnologie avanzate di tracking e riconoscimento dei gesti."
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
    heroMobileScale: 1.35,
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

const projectTranslations = {
  en: {
    1: {
      subtitle: "Interactive virtual reality application",
      previewTitle: "Fornovo Parish Church",
      blocks: [
        {
          title: "Overview",
          text:
            "This project was created to build an immersive virtual reality experience designed to showcase the Fornovo area and guide users through informative and interactive content. The application was developed in Unity with a strong focus on VR optimization to ensure a smooth and engaging experience. The virtual tour allows users to explore reconstructed 3D environments, interact with informative elements, and discover the history and cultural heritage of Fornovo. The project required skills in 3D modeling, software development and user experience design, with special attention to accessibility and usability in VR."
        },
        {
          caption: "Main VR environment view"
        },
        {
          title: "Interior",
          text:
            "The interior was modeled carefully to recreate the authentic atmosphere of the site, with attention to lighting and architectural details. VR optimization required balancing visual quality and performance by implementing LOD and occlusion culling techniques to maintain fluid performance even on less powerful hardware such as Oculus Quest 2. Some historical architectural elements, including statues and reliefs, were scanned in 3D, optimized and integrated in the virtual environment, allowing users to get close and interact with them to discover detailed information about their history and meaning."
        },
        {
          caption: "Interior lighting"
        },
        {
          title: "Interaction",
          text:
            "Special care was dedicated to user experience, with attention to users of different ages and abilities. Interaction was designed to be intuitive and accessible, allowing exploration even without controllers thanks to hand and finger tracking. This creates a more natural and immersive experience, especially for less experienced users or users with motor limitations. Controller-free interaction lets users navigate the virtual tour by moving their hands, virtually touching or grabbing points of interest, and triggering informative content through natural gestures. This approach required integrating advanced tracking and gesture-recognition technologies."
        },
        {
          caption: "Controller-free interaction"
        },
        {
          title: "Historical Reconstruction",
          text:
            "To offer a unique experience, users can travel back in time and view different phases of the church according to the selected historical period. This was possible through 3D modeling based on historical data, archive photos and surveys, which made it possible to faithfully reconstruct the architectural evolution of the site. Users can explore the different historical phases and access informative content explaining the architectural and historical changes across centuries."
        },
        {
          caption: "Historical timeline interaction"
        },
        {
          title: "Technologies Used",
          items: [
            "Unity",
            "XR Interaction Toolkit",
            "Blender",
            "Photogrammetry",
            "Substance Painter",
            "VR optimization"
          ]
        }
      ]
    },
    2: {
      title: "3D Printing Modeling",
      subtitle: "Training and design focused on additive manufacturing",
      previewTitle: "3D Plaque",
      blocks: [
        {
          title: "Overview",
          text:
            "Teaching and design activity focused on 3D modeling for print production, with attention to tolerances, volumes and mesh optimization. The course was taught to students in the Environment and Territory program at Toschi school in Parma. The goal was to provide students with the skills to create 3D models by combining architecture and storytelling methods, producing a final output ready to be presented to the public."
        },
        {
          caption: "Model preview in Blender"
        },
        {
          caption: "Initial project concept"
        },
        {
          caption: "Final result after 3D printing"
        },
        {
          title: "Skills",
          items: ["Blender", "Teaching", "3D Printing Workflow"]
        }
      ]
    },
    3: {
      title: "3D Model Optimization",
      subtitle: "Complexity reduction for real-time applications",
      previewTitle: "PBR Texture Baking",
      blocks: [
        {
          title: "Overview",
          text:
            "Personal project focused on high-definition modeling of a Corinthian column, created with a dense vertex count to preserve ornamental detail. Then, using Substance Painter, PBR materials were generated from the high-poly model to transfer details onto an optimized low-poly version. This workflow preserved visual quality while significantly improving performance, making the model suitable for real-time and web contexts. The images below show the same model: textures applied on a simple cylinder recreate the perception of depth and detail."
        },
        {
          caption: "HD texture, LD mesh and modular model"
        },
        {
          title: "Applied Techniques",
          items: [
            "High-poly modeling",
            "Low-poly optimization",
            "Baking and PBR texture workflow",
            "Modular asset creation",
            "Real-time and web optimization"
          ]
        }
      ]
    }
  }
};

const mergeBlockTranslation = (block, translatedBlock) => {
  if (!translatedBlock) return block;
  return { ...block, ...translatedBlock };
};

const buildLocalizedProjects = (language) => {
  if (language === "it") return projectsIt;

  const source = projectTranslations[language];
  if (!source) return projectsIt;

  return projectsIt.map((project) => {
    const translated = source[project.id];
    if (!translated) return project;

    const localizedBlocks = project.blocks.map((block, index) =>
      mergeBlockTranslation(block, translated.blocks?.[index])
    );

    return {
      ...project,
      ...translated,
      blocks: localizedBlocks
    };
  });
};

const projectsByLanguage = {
  it: projectsIt,
  en: buildLocalizedProjects("en")
};

export const getProjects = (language = "it") =>
  projectsByLanguage[language] || projectsByLanguage.it;

const projects = projectsByLanguage.it;

export default projects;
