// components/apps/projects/ProjectDetails.jsx
import React from "react";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Code,
  CheckSquare,
  FileText,
  Github, // Changed from GitHub to Github (lowercase 'h')
  ExternalLink,
} from "lucide-react";
import styles from "./ProjectDetails.module.scss";

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
              <Github size={16} />
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
