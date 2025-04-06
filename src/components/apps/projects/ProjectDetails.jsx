// components/apps/projects/ProjectDetails.jsx
import React from "react";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Code,
  CheckSquare,
  FileText,
  ExternalLink,
} from "lucide-react";
import styles from "./ProjectDetails.module.scss";

const githubIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-github-icon lucide-github"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProjectDetails = ({ project, onBack }) => {
  if (!project) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.detailsHeader}>
          <h2 className={styles.projectTitle}>Project Not Found</h2>
        </div>
        <div className={styles.detailsContent}>
          <p>The requested project could not be found.</p>
        </div>
        <div className={styles.detailsFooter}>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectDetails}>
      <div className={styles.detailsHeader}>
        <h2 className={styles.projectTitle}>{project.name}</h2>
        <div className={styles.projectCategory}>{project.category}</div>
      </div>

      <div className={styles.detailsContent}>
        {/* Project thumbnail */}
        <div className={styles.projectThumbnail}>
          <div className={styles.thumbnailPlaceholder}>
            {project.name.charAt(0)}
          </div>
        </div>

        {/* Project metadata */}
        <div className={styles.projectMetadata}>
          <div className={styles.metadataItem}>
            <Calendar size={16} />
            <span>{project.date}</span>
          </div>
          <div className={styles.metadataItem}>
            <Tag size={16} />
            <span>{project.projectType}</span>
          </div>
        </div>

        {/* Project description */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Overview</h3>
          <p className={styles.projectDescription}>{project.description}</p>
        </div>

        {/* Technologies */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Technologies</h3>
          <div className={styles.technologiesList}>
            {project.technologies.map((tech, index) => (
              <div key={index} className={styles.technologyTag}>
                <Code size={14} />
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Key Features</h3>
          <ul className={styles.featuresList}>
            {project.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <CheckSquare size={16} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Long description */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Details</h3>
          <div className={styles.longDescription}>
            {project.longDescription.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Project links */}
        <div className={styles.projectLinks}>
          {project.links && project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              {githubIcon}
              GitHub Repository
            </a>
          )}
          {project.links && project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>

      <div className={styles.detailsFooter}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
