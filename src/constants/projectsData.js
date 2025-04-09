// Sample project data - In a real app, this would come from a store or API
export const PROJECTS_DATA = [
  {
    id: "project1",
    name: "React Strategy Game",
    fileName: "react_strategy_game.exe",
    category: "Web Game",
    description:
      "Turn-based strategy game featuring a resource management mechanic",
    technologies: ["React", "Redux Toolkit", "Styled Components"],
    thumbnail: "",
    date: "12-01-2022",
    projectType: "game",
    links: {
      live: "https://dreamy-pithivier-a31e03.netlify.app/",
      github: "https://github.com/ccavad/react-strategy-game",
    },
    features: [
      "Interactive Map",
      "Resource Management",
      "Region-Based Gameplay",
      "Zone Management",
      "Turn-Based System",
    ],
    longDescription: `
      This project is a React-based strategy game where players manage resources, assign zones to regions, and make strategic decisions to achieve victory. The game is built with modern web technologies, including React, Redux, and Styled Components, and uses Vite for fast development and build processes.
    `,
  },
  {
    id: "project2",
    name: "Edumetrics",
    fileName: "edumetrics.exe",
    category: "Web Site",
    description: "Freelance project - Website with exam functionality",
    technologies: ["React", "Chakra UI", "Zustand", "Recharts"],
    thumbnail: "",
    date: "10-04-2025",
    projectType: "web",
    links: {
      live: "https://edumetrics-demo.netlify.app/",
      // github: "",
    },
    features: [
      "Exam Management",
      "User Authentication",
      "Statistics and Analytics",
      "Multilingual Support",
      "Payment Integration",
      "Dynamic Content Rendering",
    ],
    longDescription: `
      This app is an educational platform designed to enhance learning experiences for students, parents, and teachers. It provides a variety of features to facilitate education, track progress, and manage exams. 
    `,
  },
];
