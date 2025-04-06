// store/projectsStore.js
import { create } from "zustand";

// Helper to save projects state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    localStorage.setItem(
      "vaporwave_projects",
      JSON.stringify({
        currentPath: state.currentPath,
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        selectedProject: state.selectedProject
          ? state.selectedProject.id
          : null,
        showProjectDetails: state.showProjectDetails,
      })
    );
  } catch (error) {
    console.error("Error saving projects state to localStorage:", error);
  }
};

// Helper to load projects state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem("vaporwave_projects");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading projects state from localStorage:", error);
  }
  return null;
};

// Load saved state
const savedState = loadStateFromLocalStorage();

// Sample project data - In a real app, this would come from a store or API
const PROJECTS_DATA = [
  {
    id: "project1",
    name: "Project Alpha",
    fileName: "project_alpha.exe",
    category: "Web Application",
    description:
      "A responsive dashboard for monitoring analytics with real-time data visualization and interactive elements.",
    technologies: ["React", "Chart.js", "Styled Components", "Node.js"],
    thumbnail: "project_alpha.png",
    date: "2024-02-15",
    projectType: "web",
    links: {
      live: "https://example.com/project-alpha",
      github: "https://github.com/username/project-alpha",
    },
    features: [
      "Real-time data visualization",
      "Interactive charts and graphs",
      "Responsive design for all devices",
      "Dark and light theme support",
    ],
    longDescription: `
      Project Alpha is a comprehensive analytics dashboard built with modern web technologies.
      
      The application provides users with a streamlined interface to monitor key metrics and visualize data trends in real-time. The dashboard includes customizable widgets, allowing users to focus on their most important KPIs.
      
      The front-end is built with React for a smooth, single-page application experience. Chart.js is utilized for creating beautiful, interactive data visualizations that update in real-time. Styled Components ensure a consistent, themeable UI across the entire application.
      
      The back-end is powered by Node.js, providing API endpoints that serve data from various sources. WebSockets enable the real-time updates that make this dashboard particularly valuable for monitoring live metrics.
    `,
  },
  {
    id: "project2",
    name: "Neon Beats",
    fileName: "neon_beats.wav",
    category: "Music Application",
    description:
      "A vaporwave-inspired music player with visualizations and playlist management.",
    technologies: ["React", "Web Audio API", "SCSS", "Zustand"],
    thumbnail: "neon_beats.png",
    date: "2023-11-22",
    projectType: "audio",
    links: {
      live: "https://example.com/neon-beats",
      github: "https://github.com/username/neon-beats",
    },
    features: [
      "Audio visualizations",
      "Playlist management",
      "Custom audio controls",
      "Vaporwave aesthetic design",
    ],
    longDescription: `
      Neon Beats is a music player application designed with vaporwave aesthetics in mind.
      
      The application allows users to upload and organize their music library with custom playlists. The player features a unique audio visualization that responds to the audio frequency and amplitude, creating an immersive listening experience.
      
      Built with React for the user interface and the Web Audio API for sound processing and visualization, Neon Beats provides a smooth and responsive user experience. The state management is handled by Zustand for efficient updates and a clean architecture.
      
      The design incorporates classic vaporwave elements like neon colors, retro graphics, and nostalgic UI components that harken back to earlier computing eras while providing modern functionality.
    `,
  },
  {
    id: "project3",
    name: "Retro Grid",
    fileName: "retro_grid.html",
    category: "Web Design",
    description:
      "A retro-futuristic grid-based layout system with cyberpunk influences.",
    technologies: ["HTML5", "CSS Grid", "JavaScript", "GSAP"],
    thumbnail: "retro_grid.png",
    date: "2023-09-08",
    projectType: "web",
    links: {
      live: "https://example.com/retro-grid",
      github: "https://github.com/username/retro-grid",
    },
    features: [
      "Customizable grid layouts",
      "Animation library integration",
      "Responsive design system",
      "Cyberpunk-inspired components",
    ],
    longDescription: `
      Retro Grid is a design system and component library that draws inspiration from cyberpunk and retro-futuristic aesthetics.
      
      The project provides developers with a set of customizable grid layouts and components that can be used to create immersive, visually striking web experiences. The design system includes pre-built elements like cards, buttons, forms, and navigation components with a consistent cyberpunk styling.
      
      Built primarily with HTML5 and CSS Grid, the library is lightweight yet powerful. JavaScript is used sparingly to add interactive elements and animations. GSAP (GreenSock Animation Platform) integration provides smooth, performant animations that enhance the futuristic feel of the interface.
      
      The system is fully responsive, ensuring that designs look great on everything from small mobile screens to large desktop displays, while maintaining the distinctive grid-based aesthetic.
    `,
  },
  {
    id: "project4",
    name: "Synthwave Runner",
    fileName: "synthwave_runner.exe",
    category: "Game",
    description:
      "An endless runner game with synthwave aesthetics and procedurally generated obstacles.",
    technologies: ["JavaScript", "Canvas API", "Howler.js", "Webpack"],
    thumbnail: "synthwave_runner.png",
    date: "2023-07-14",
    projectType: "game",
    links: {
      live: "https://example.com/synthwave-runner",
      github: "https://github.com/username/synthwave-runner",
    },
    features: [
      "Procedurally generated levels",
      "Original synthwave soundtrack",
      "Global leaderboard",
      "Progressive difficulty",
    ],
    longDescription: `
      Synthwave Runner is a browser-based endless runner game set in a retro-futuristic synthwave world.
      
      Players navigate a character through an ever-changing landscape of neon obstacles, collecting power-ups and avoiding hazards. The game features procedurally generated levels, ensuring that no two runs are exactly the same. As players progress, the difficulty increases gradually, challenging even the most skilled players.
      
      The game is built using vanilla JavaScript and the Canvas API for rendering. Howler.js provides the audio functionality, playing both sound effects and an original synthwave soundtrack that adapts to the game state. Webpack is used for bundling and optimization.
      
      Synthwave Runner includes a global leaderboard, allowing players to compete for high scores and bragging rights. The game's visual style draws heavily from synthwave and vaporwave aesthetics, featuring vibrant neon colors, grid-based backgrounds, and retro-inspired UI elements.
    `,
  },
  {
    id: "project5",
    name: "VaporChat",
    fileName: "vapor_chat.msg",
    category: "Communication App",
    description:
      "A themed messaging application with retro aesthetics and modern features.",
    technologies: ["React", "Firebase", "Styled Components", "PWA"],
    thumbnail: "vapor_chat.png",
    date: "2023-05-19",
    projectType: "mobile",
    links: {
      live: "https://example.com/vapor-chat",
      github: "https://github.com/username/vapor-chat",
    },
    features: [
      "Real-time messaging",
      "User authentication",
      "Customizable themes",
      "Progressive Web App capabilities",
    ],
    longDescription: `
      VaporChat is a messaging application that combines nostalgic retro aesthetics with modern communication features.
      
      The app allows users to create accounts, join chat rooms, and communicate in real-time. Messages support rich formatting, emoji reactions, and media attachments. The interface is designed with a vaporwave aesthetic, featuring pastel colors, retro patterns, and nostalgic design elements.
      
      Built with React for the front-end and Firebase for the back-end services, VaporChat provides a seamless, real-time communication experience. Firebase handles authentication, real-time database updates, and cloud storage for media attachments. Styled Components are used for the themeable UI, allowing users to customize their experience.
      
      As a Progressive Web App (PWA), VaporChat can be installed on users' devices, providing a native-like experience with offline capabilities and push notifications. This approach ensures the app is accessible across platforms without requiring separate native applications.
    `,
  },
];

// Function to find a project by ID
const findProjectById = (id) => {
  return PROJECTS_DATA.find((project) => project.id === id) || null;
};

const useProjectsStore = create((set, get) => ({
  // Projects state
  projects: PROJECTS_DATA,
  currentPath: savedState?.currentPath || "/",
  viewMode: savedState?.viewMode || "grid", // "grid" or "list"
  searchQuery: savedState?.searchQuery || "",
  selectedProject: savedState?.selectedProject
    ? findProjectById(savedState.selectedProject)
    : null,
  showProjectDetails: savedState?.showProjectDetails || false,

  // Filter projects based on search query
  getFilteredProjects: () => {
    const { projects, searchQuery } = get();

    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
    );
  },

  // Update current path
  setCurrentPath: (path) =>
    set((state) => {
      const newState = { currentPath: path };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Update view mode
  setViewMode: (mode) =>
    set((state) => {
      const newState = { viewMode: mode };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Update search query
  setSearchQuery: (query) =>
    set((state) => {
      const newState = { searchQuery: query };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Select a project
  selectProject: (project) =>
    set((state) => {
      const newState = {
        selectedProject: project,
        showProjectDetails: true,
      };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Clear selected project
  clearSelectedProject: () =>
    set((state) => {
      const newState = {
        selectedProject: null,
        showProjectDetails: false,
      };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),
}));

export { useProjectsStore };
