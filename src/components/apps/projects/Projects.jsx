// components/apps/projects/Projects.jsx
import React, { useState } from "react";
import {
  Folder,
  File,
  ArrowLeft,
  Search,
  Grid,
  List,
  Info,
  Monitor,
  Globe,
  Smartphone,
  Github,
  ExternalLink,
} from "lucide-react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import ProjectDetails from "./ProjectDetails";
import styles from "./Projects.module.scss";

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

const Projects = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Component state
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Filter projects based on search query
  const filteredProjects =
    searchQuery.trim() === ""
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter(
          (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            project.technologies.some((tech) =>
              tech.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

  // Handle navigation back
  const handleBack = () => {
    if (showProjectDetails) {
      setShowProjectDetails(false);
      setSelectedProject(null);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Handle project click
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Get project icon based on type
  const getProjectIcon = (projectType) => {
    switch (projectType) {
      case "web":
        return <Globe size={24} />;
      case "mobile":
        return <Smartphone size={24} />;
      case "game":
        return <Monitor size={24} />;
      case "audio":
        return <File size={24} />;
      default:
        return <File size={24} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fileExplorerHeader}>
        <div className={styles.navigationControls}>
          <button
            className={styles.backButton}
            onClick={handleBack}
            disabled={!showProjectDetails}
          >
            <ArrowLeft size={18} />
          </button>
          <div className={styles.pathDisplay}>
            {showProjectDetails
              ? `/${selectedProject?.name || ""}`
              : "/Projects"}
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <Search size={16} className={styles.searchIcon} />
        </div>

        <div className={styles.viewControls}>
          <button
            className={`${styles.viewButton} ${
              viewMode === "grid" ? styles.active : ""
            }`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${
              viewMode === "list" ? styles.active : ""
            }`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className={styles.fileExplorerContent}>
        {showProjectDetails ? (
          <ProjectDetails project={selectedProject} onBack={handleBack} />
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className={styles.noResults}>
                <Info size={48} className={styles.noResultsIcon} />
                <p>No projects match your search criteria.</p>
                <button
                  className={styles.clearSearchButton}
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div
                className={`${styles.projectsGrid} ${
                  viewMode === "list" ? styles.listView : ""
                }`}
              >
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectItem}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className={styles.projectIcon}>
                      {getProjectIcon(project.projectType)}
                    </div>

                    <div className={styles.projectInfo}>
                      <div className={styles.projectName}>{project.name}</div>
                      <div className={styles.projectFileName}>
                        {project.fileName}
                      </div>

                      {viewMode === "list" && (
                        <>
                          <div className={styles.projectDescription}>
                            {project.description}
                          </div>
                          <div className={styles.projectTechnologies}>
                            {project.technologies.join(", ")}
                          </div>
                        </>
                      )}

                      <div className={styles.projectDate}>
                        {new Date(project.date).toLocaleDateString()}
                      </div>
                    </div>

                    {viewMode === "list" && (
                      <div className={styles.projectLinks}>
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} />
                        </a>
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.fileExplorerStatus}>
        <div className={styles.statusInfo}>
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </div>
        <div className={styles.diskSpace}>Available Space: 1.44 MB</div>
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default Projects;
