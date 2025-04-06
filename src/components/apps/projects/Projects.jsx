// components/apps/projects/Projects.jsx
import React from "react";
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
import { useThemeStore, useProjectsStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import ProjectDetails from "./ProjectDetails";
import styles from "./Projects.module.scss";

const Projects = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Get projects state from store
  const viewMode = useProjectsStore((state) => state.viewMode);
  const searchQuery = useProjectsStore((state) => state.searchQuery);
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const showProjectDetails = useProjectsStore(
    (state) => state.showProjectDetails
  );
  const filteredProjects = useProjectsStore((state) =>
    state.getFilteredProjects()
  );

  // Get actions from store
  const setViewMode = useProjectsStore((state) => state.setViewMode);
  const setSearchQuery = useProjectsStore((state) => state.setSearchQuery);
  const selectProject = useProjectsStore((state) => state.selectProject);
  const clearSelectedProject = useProjectsStore(
    (state) => state.clearSelectedProject
  );

  // Handle navigation back
  const handleBack = () => {
    clearSelectedProject();
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
    selectProject(project);
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
