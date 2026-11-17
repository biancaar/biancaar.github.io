// Editable portfolio content. Keep both en/it translations in sync.
// Array order controls the project sequence; gallery contains optional detail images.
export const projects = [
  {
    "id": "pieve",
    "number": "01",
    "featured": true,
    "image": "/media/projects/pieve.png",
    "category": {
      "en": "Immersive development",
      "it": "Sviluppo immersivo"
    },
    "title": {
      "en": "Pieve di Fornovo",
      "it": "Pieve di Fornovo"
    },
    "subtitle": {
      "it": "Visitare la Pieve con un visore, anche senza controller.",
      "en": "Visiting the church in VR, with or without controllers."
    },
    "summary": {
      "it": "Da Infinitodesign ho lavorato alla visita virtuale della Pieve di Fornovo: sviluppo in Unity, ricostruzioni 3D e interazione con le mani su Meta Quest 2.",
      "en": "At Infinitodesign, I worked on a virtual visit to the Pieve di Fornovo, developing in Unity, creating 3D reconstructions and adding hand interaction on Meta Quest 2."
    },
    "details": {
      "it": "Da Infinitodesign ho lavorato alla visita virtuale della Pieve di Fornovo, occupandomi dello sviluppo in Unity, della modellazione e dell’ottimizzazione degli ambienti 3D per Meta Quest 2. La visita permette di esplorare la chiesa, consultare contenuti e vedere ricostruzioni storiche.\n\nDurante le prove con il pubblico, alcuni visitatori lasciavano cadere i controller. Ho quindi introdotto una modalità con il tracciamento delle mani, per consentire la visita anche senza impugnarli. È stata una delle modifiche nate osservando le persone usare l’applicazione.\n\nPer alleggerire la scena ho lavorato su luci precalcolate, livelli di dettaglio e occlusione degli oggetti non visibili. Il progetto fa parte anche del mio percorso di tesi.",
      "en": "At Infinitodesign, I worked on a virtual visit to the Pieve di Fornovo, handling Unity development, 3D modeling and scene optimization for Meta Quest 2. Visitors can explore the church, access information and view historical reconstructions.\n\nDuring public demonstrations, some visitors dropped the controllers. I introduced a hand-tracking mode so they could continue without holding them. This was one of the changes that came from watching people use the application.\n\nTo reduce the scene’s rendering cost, I worked on baked lighting, levels of detail and occlusion culling. The project also formed part of my thesis work."
    },
    "stack": [
      "Unity",
      "C#",
      "Blender",
      "XR Interaction Toolkit"
    ],
    "demo": "",
    "repository": "",
    "status": "complete",
    "imageAlt": {
      "en": "3D reconstruction of the Pieve di Fornovo facade",
      "it": "Ricostruzione 3D della facciata della Pieve di Fornovo"
    },
    "imageHeading": {
      "en": "PIEVE\ndi Fornovo",
      "it": "PIEVE\ndi Fornovo"
    },
    "imageFit": "cover",
    "gallery": [
      {
        "src": "/media/projects/pieve-interazione-vr.jpg",
        "alt": {
          "it": "Interazione con i contenuti informativi in realtà virtuale.",
          "en": "Interacting with information in virtual reality."
        },
        "caption": {
          "it": "Interazione con i contenuti informativi in realtà virtuale.",
          "en": "Interacting with information in virtual reality."
        },
        "aspectRatio": "16 / 9"
      },
      {
        "src": "/media/projects/pieve-hand-tracking.jpg",
        "alt": {
          "it": "Hand tracking per interagire senza controller.",
          "en": "Hand tracking for controller-free interaction."
        },
        "caption": {
          "it": "Hand tracking per interagire senza controller.",
          "en": "Hand tracking for controller-free interaction."
        },
        "aspectRatio": "853 / 662"
      },
      {
        "src": "/media/projects/pieve-interno.jpg",
        "alt": {
          "it": "Ricostruzione e illuminazione degli interni in Unity.",
          "en": "Interior reconstruction and lighting in Unity."
        },
        "caption": {
          "it": "Ricostruzione e illuminazione degli interni in Unity.",
          "en": "Interior reconstruction and lighting in Unity."
        },
        "aspectRatio": "1185 / 803"
      },
      {
        "src": "/media/projects/pieve-esperienza-condivisa.jpg",
        "alt": {
          "it": "Esplorazione dello spazio virtuale con avatar.",
          "en": "Exploring the virtual space with avatars."
        },
        "caption": {
          "it": "Esplorazione dello spazio virtuale con avatar.",
          "en": "Exploring the virtual space with avatars."
        },
        "aspectRatio": "1065 / 871"
      },
      {
        "src": "/media/projects/pieve-organo.jpg",
        "alt": {
          "it": "Modellazione dell'organo a confronto con il riferimento fotografico.",
          "en": "Organ modeling alongside the photographic reference."
        },
        "caption": {
          "it": "Modellazione dell'organo a confronto con il riferimento fotografico.",
          "en": "Organ modeling alongside the photographic reference."
        },
        "aspectRatio": "1635 / 935"
      },
      {
        "src": "/media/projects/pieve-teletrasporto.jpg",
        "alt": {
          "it": "Teletrasporto tramite interazione delle mani.",
          "en": "Teleportation using hand interaction."
        },
        "caption": {
          "it": "Teletrasporto tramite interazione delle mani.",
          "en": "Teleportation using hand interaction."
        },
        "aspectRatio": "863 / 731"
      },
      {
        "src": "/media/projects/pieve-ambone-riferimento.jpg",
        "alt": {
          "it": "Ipotesi ricostruttiva dell'ambone e collocazione in pianta.",
          "en": "Ambo reconstruction hypothesis and floor plan."
        },
        "caption": {
          "it": "Ipotesi ricostruttiva dell'ambone e collocazione in pianta.",
          "en": "Ambo reconstruction hypothesis and floor plan."
        },
        "aspectRatio": "1003 / 478"
      },
      {
        "src": "/media/projects/pieve-ambone-3d.jpg",
        "alt": {
          "it": "Ricostruzione tridimensionale dell'ambone.",
          "en": "Three-dimensional reconstruction of the ambo."
        },
        "caption": {
          "it": "Ricostruzione tridimensionale dell'ambone.",
          "en": "Three-dimensional reconstruction of the ambo."
        },
        "aspectRatio": "717 / 647"
      }
    ]
  },
  {
    "id": "journal",
    "number": "02",
    "featured": true,
    "image": "/media/projects/journal-temp.png",
    "category": {
      "en": "Frontend development",
      "it": "Sviluppo frontend"
    },
    "title": {
      "en": "Journal App",
      "it": "Journal App"
    },
    "subtitle": {
      "it": "Dal diario su carta a un’app che sto costruendo.",
      "en": "From a paper journal to an app I’m building."
    },
    "summary": {
      "it": "Sto sviluppando un’agenda in React per riunire diario, attività, calendario e abitudini. Un progetto personale che cresce una funzione alla volta.",
      "en": "I’m building a React planner for journal notes, tasks, a calendar and habits. A personal project that grows one feature at a time."
    },
    "details": {
      "it": "Tengo un diario su carta e sto costruendo un’app per portare parte di quell’organizzazione sul web. Il progetto comprende diario, attività, calendario e monitoraggio delle abitudini; è ancora in sviluppo.\n\nUna delle scelte è separare la data selezionata dalle informazioni salvate per quel giorno: posso spostarmi nel calendario anche dove non ho ancora scritto nulla. Ho lavorato anche sullo storico delle abitudini, con viste settimanali e mensili.\n\nMi occupo dell’interfaccia e dello sviluppo in React. Aggiungo le funzioni gradualmente, rivedendo la struttura dei componenti mentre il progetto cresce.",
      "en": "I keep a paper journal and am building an app to bring some of that organization to the web. The project includes journal notes, tasks, a calendar and habit tracking, and is still in development.\n\nOne design choice is to keep the selected date separate from the information saved for that day, so I can browse dates without creating an entry first. I’ve also worked on habit history with weekly and monthly views.\n\nI handle the interface and React development, adding features gradually and revisiting the component structure as the project grows."
    },
    "stack": [
      "React",
      "JavaScript",
      "CSS",
      "UI design"
    ],
    "demo": "",
    "repository": "",
    "status": "in-progress",
    "imageAlt": {
      "en": "Hand-painted illustrated journal spread by Bianca Rotaru",
      "it": "Pagine di diario illustrate e dipinte a mano da Bianca Rotaru"
    },
    "imageHeading": {
      "en": "Make today\nyour own.",
      "it": "Make today\nyour own."
    },
    "imagePosition": "center",
    "gallery": []
  },
  {
    "id": "portfolio",
    "number": "03",
    "featured": false,
    "image": "/media/projects/portfolio.png",
    "category": {
      "en": "Creative frontend",
      "it": "Frontend creativo"
    },
    "title": {
      "en": "Portfolio Website",
      "it": "Portfolio Website"
    },
    "subtitle": {
      "it": "Il sito che stai visitando.",
      "en": "The website you’re browsing."
    },
    "summary": {
      "it": "Ho riunito qui sviluppo web, grafica e modellazione 3D. La colonna della prima schermata è un mio modello realizzato in Blender.",
      "en": "A place for my web development, graphic design and 3D work. The column on the opening screen is my own Blender model."
    },
    "details": {
      "it": "Ho iniziato questo portfolio per mostrare i miei lavori oltre il CV e mettere in pratica quello che stavo studiando sul frontend. Ho rivisto più volte il layout, passando dalla versione precedente a quella che stai visitando.\n\nLa colonna iniziale è un mio modello Blender, visualizzato con Three.js. Su desktop la luce segue il cursore; su telefono rimane fissa. Quando il 3D non è disponibile, viene mostrato un render statico.\n\nUna parte del lavoro è stata adattare lo scorrimento a schermi diversi: la timeline è orizzontale sui desktop con spazio sufficiente e verticale su telefono e tablet in verticale. Qui sotto trovi la versione precedente e gli schizzi del layout.",
      "en": "I started this portfolio to show my work beyond a résumé and put my frontend studies into practice. I revised the layout several times, moving from the earlier version to the one you’re browsing.\n\nThe opening column is my own Blender model, rendered with Three.js. On desktop, a light follows the cursor; on phones, it stays fixed. A static render is shown when 3D is unavailable.\n\nPart of the work was adapting scrolling to different screens. The timeline runs horizontally on desktops with enough space, and vertically on phones and portrait tablets. Below are the previous version and layout sketches."
    },
    "stack": [
      "React",
      "Three.js",
      "GSAP",
      "Responsive design"
    ],
    "demo": "",
    "repository": "https://github.com/biancaar/biancaar.github.io",
    "status": "complete",
    "imageAlt": {
      "en": "Bianca Rotaru portfolio homepage",
      "it": "Homepage del portfolio di Bianca Rotaru"
    },
    "imageFit": "cover",
    "gallery": [
      {
        "src": "/media/projects/old-portfolio.png",
        "alt": {
          "it": "Aspetto della hero del layout vecchio",
          "en": "Look of the old hero page"
        },
        "caption": {
          "it": "Aspetto della hero del layout vecchio",
          "en": "Look of the old hero page"
        },
        "aspectRatio": "1003 / 478"
      },
      {
        "src": "/media/projects/old-timeline.png",
        "alt": {
          "it": "Aspetto della timeline vecchia",
          "en": "Look of the old timeline"
        },
        "caption": {
          "it": "Aspetto della timeline vecchia",
          "en": "Look of the old timeline"
        },
        "aspectRatio": "1003 / 478"
      },
      {
        "src": "/media/projects/wireframe-low-fid.png",
        "alt": {
          "it": "Wireframe low fidelity scelto",
          "en": "Wireframe low fidelity picked"
        },
        "caption": {
          "it": "Wireframe low fidelity scelto",
          "en": "Wireframe low fidelity picked"
        },
        "aspectRatio": "724 / 2172"
      }
    ]
  },
  {
    "id": "column",
    "number": "04",
    "featured": false,
    "image": null,
    "category": {
      "en": "3D technical art",
      "it": "Arte tecnica 3D"
    },
    "title": {
      "en": "3D Optimization",
      "it": "Ottimizzazione 3D"
    },
    "subtitle": {
      "it": "Dallo stesso modello, due livelli di dettaglio.",
      "en": "One model, two levels of detail."
    },
    "summary": {
      "it": "Ho modellato questa colonna in Blender e ne ho preparato una versione più leggera, trasferendo i dettagli nelle texture con Substance Painter.",
      "en": "I modeled this column in Blender and made a lighter version, transferring surface detail to textures with Substance Painter."
    },
    "details": {
      "it": "Sono partita da una colonna ad alto dettaglio modellata in Blender. Per usarla in una scena interattiva ho preparato una mesh con meno poligoni, curato le UV e trasferito i dettagli nelle texture tramite baking in Substance Painter.\n\nLe due immagini mostrano il modello con materiali e la struttura della mesh ottimizzata. Il lavoro consiste nel decidere quali forme mantenere nella geometria e quali dettagli affidare alle texture.\n\nÈ anche la colonna che ho scelto per la prima schermata di questo portfolio.",
      "en": "I started with a detailed column modeled in Blender. To use it in an interactive scene, I prepared a lower-poly mesh, worked on its UVs and baked surface details into textures with Substance Painter.\n\nThe two images show the textured model and the optimized mesh structure. The work involves deciding which shapes need geometry and which details can be carried by textures.\n\nThis is also the column I chose for the opening screen of this portfolio."
    },
    "stack": [
      "Blender",
      "Substance Painter",
      "PBR",
      "GLB"
    ],
    "demo": "",
    "repository": "",
    "status": "complete",
    "images": [
      {
        "src": "/media/projects/column-hd.jpg",
        "label": {
          "en": "HIGH DETAIL",
          "it": "ALTO DETTAGLIO"
        },
        "alt": {
          "en": "High-detail fluted column with textured materials",
          "it": "Colonna scanalata ad alto dettaglio con materiali e texture"
        }
      },
      {
        "src": "/media/projects/column-ld.jpg",
        "label": {
          "en": "LOW POLY MESH",
          "it": "MESH LOW POLY"
        },
        "alt": {
          "en": "Optimized column geometry",
          "it": "Geometria ottimizzata della colonna"
        }
      }
    ],
    "gallery": []
  }
];
