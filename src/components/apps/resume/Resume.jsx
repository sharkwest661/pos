// Updated Resume.jsx without progress bars
import React, { useState } from "react";
import {
  Download,
  Printer,
  Star,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import { resumeData } from "../../../constants/resumeData";
import styles from "./Resume.module.scss";

const Resume = () => {
  // Get theme configuration and effects status
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Define sections for the resume
  const [activeSection, setActiveSection] = useState("experience");

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Handle resume download
  const handleDownload = () => {
    // Path to the static resume file in public/assets
    const resumePath = "/assets/documents/resume.pdf";

    // Create an anchor element
    const link = document.createElement("a");
    link.href = resumePath;

    // Set download attribute to suggest a filename
    link.download = "resume.pdf";

    // Append to document body
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.docTitle}>Resume.doc</div>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarButton} onClick={handleDownload}>
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <button
            className={`${styles.sidebarButton} ${
              activeSection === "experience" ? styles.active : ""
            }`}
            onClick={() => handleSectionChange("experience")}
          >
            Experience
          </button>
          <button
            className={`${styles.sidebarButton} ${
              activeSection === "education" ? styles.active : ""
            }`}
            onClick={() => handleSectionChange("education")}
          >
            Education
          </button>
          <button
            className={`${styles.sidebarButton} ${
              activeSection === "skills" ? styles.active : ""
            }`}
            onClick={() => handleSectionChange("skills")}
          >
            Skills
          </button>
        </div>

        <div className={styles.resumeContent}>
          <div className={styles.header}>
            <h1 className={styles.name}>{resumeData.personalInfo.name}</h1>
            <h2 className={styles.title}>{resumeData.personalInfo.title}</h2>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={14} />
                <span>{resumeData.personalInfo.email}</span>
              </div>
              {resumeData.personalInfo.phone && (
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}

              <div className={styles.contactItem}>
                <MapPin size={14} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
              {resumeData.personalInfo.website && (
                <div className={styles.contactItem}>
                  <Globe size={14} />
                  <span>{resumeData.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider}></div>

          {activeSection === "experience" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Professional Experience</h3>

              {resumeData.experience.map((exp) => (
                <div key={exp.id} className={styles.experienceItem}>
                  <div className={styles.experienceHeader}>
                    <div>
                      <h4 className={styles.role}>{exp.role}</h4>
                      <h5 className={styles.company}>{exp.company}</h5>
                    </div>
                    <div className={styles.period}>{exp.period}</div>
                  </div>

                  <p className={styles.description}>{exp.description}</p>

                  <ul className={styles.highlights}>
                    {exp.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeSection === "education" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Education</h3>

              {resumeData.education.map((edu) => (
                <div key={edu.id} className={styles.educationItem}>
                  <div className={styles.educationHeader}>
                    <div>
                      <h4 className={styles.degree}>{edu.degree}</h4>
                      <h5 className={styles.institution}>{edu.institution}</h5>
                    </div>
                    <div className={styles.period}>{edu.period}</div>
                  </div>

                  <p className={styles.description}>{edu.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === "skills" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Technical Skills</h3>

              <div className={styles.skillsGrid}>
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page count indicator */}
      <div className={styles.footer}>
        <div className={styles.pageIndicator}>Page 1 of 1</div>
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default Resume;
