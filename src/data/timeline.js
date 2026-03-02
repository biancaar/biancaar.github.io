const timelineByLanguage = {
  it: [
    {
      period: "2017",
      title: "Diploma Tecnico in Informatica e Telecomunicazioni",
      description:
        "Percorso tecnico con base solida su sviluppo software, sistemi informatici e networking."
    },
    {
      period: "2017",
      title: "First Certificate in English",
      description: "Cambridge English Language Assessment."
    },
    {
      period: "Mag 2023 - Lug 2025",
      title: "Programmatore Informatico",
      description:
        "Infinitodesign SRL (Parma): sopralluoghi fotografici e scan 3D, coordinamento progetto su GitHub, sviluppo funzionalita, modellazione 3D, tutorial utente e test visori VR."
    },
    {
      period: "2025",
      title: "Laurea Triennale in INFORMATICA",
      description:
        "Universita degli Studi di Parma: approfondimento su programmazione, algoritmi, sistemi operativi, database, intelligenza artificiale e sviluppo software."
    },
    {
      period: "2025",
      title: "Meta Front-End Developer Specialization",
      description: "Specializzazione completata su Coursera."
    }
  ],
  en: [
    {
      period: "2017",
      title: "Technical Diploma in IT and Telecommunications",
      description:
        "Technical program with a solid foundation in software development, information systems and networking."
    },
    {
      period: "2017",
      title: "First Certificate in English",
      description: "Cambridge English Language Assessment."
    },
    {
      period: "May 2023 - Jul 2025",
      title: "Software Developer",
      description:
        "Infinitodesign SRL (Parma): photo surveys and 3D scans, project coordination on GitHub, feature development, 3D modeling, user tutorials and VR headset testing."
    },
    {
      period: "2025",
      title: "Bachelor's Degree in Computer Science",
      description:
        "University of Parma: focused studies on programming, algorithms, operating systems, databases, artificial intelligence and software development."
    },
    {
      period: "2025",
      title: "Meta Front-End Developer Specialization",
      description: "Specialization completed on Coursera."
    }
  ]
};

export const getTimeline = (language = "it") =>
  timelineByLanguage[language] || timelineByLanguage.it;

const timeline = timelineByLanguage.it;

export default timeline;
