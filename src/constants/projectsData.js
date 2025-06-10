// src/constants/projectsData.js
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
      github: "https://github.com/ccavad/edumetrics",
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
  {
    id: "project3",
    name: "Vaporwave OS Portfolio",
    fileName: "vaporwave_os.exe",
    category: "Portfolio Website",
    description:
      "Personal portfolio styled as a retro vaporwave-themed operating system interface",
    technologies: ["React", "Zustand", "SCSS", "CSS Modules", "React-RND"],
    thumbnail: "",
    date: "06-10-2025",
    projectType: "web",
    links: {
      live: "https://ccavad-portfolio.netlify.app/",
    },
    features: [
      "Interactive Desktop Environment",
      "Window Management System",
      "Vaporwave Visual Effects",
      "Themed Portfolio Applications",
      "Audio Integration",
      "Responsive Design",
    ],
    longDescription: `
      This project is a personal portfolio website styled as a retro vaporwave-themed operating system interface. It showcases my development projects, skills, and personal information through an interactive OS simulator that evokes 80s/90s nostalgia with a vaporwave aesthetic twist.
      
      The portfolio features a fully interactive desktop with application icons, draggable windows with proper z-index management, a start menu for navigation, and various visual effects like scanlines, VHS distortion, and CRT screen curvature simulation.
      
      Built with React.js and Zustand for state management, the project utilizes React-RND for resizable and draggable windows, providing a smooth and authentic desktop experience. Each "application" represents a section of my portfolio, styled consistently with the vaporwave aesthetic through SCSS modules.
    `,
  },
];
