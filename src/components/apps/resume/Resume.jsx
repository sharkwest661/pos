// components/apps/resume/Resume.jsx
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
import styles from "./Resume.module.scss";

const Resume = () => {
  // Get theme configuration and effects status
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Define sections for the resume
  const [activeSection, setActiveSection] = useState("experience");

  // Resume data - in a real app, this would come from a store or API
  const resumeData = {
    personalInfo: {
      name: "John Doe",
      title: "Frontend Developer",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      website: "johndoe.com",
    },
    experience: [
      {
        id: 1,
        role: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        period: "2020 - Present",
        description:
          "Led front-end development for multiple web applications using React and modern JavaScript. Implemented responsive designs and improved performance by 40%.",
        highlights: [
          "Developed reusable component library used across 5+ projects",
          "Optimized loading times from 4.5s to 1.8s",
          "Mentored junior developers and conducted code reviews",
        ],
      },
      {
        id: 2,
        role: "Frontend Developer",
        company: "WebSolutions Ltd.",
        period: "2018 - 2020",
        description:
          "Created responsive web applications with focus on user experience and performance. Collaborated with design and backend teams.",
        highlights: [
          "Built interactive dashboards with complex data visualizations",
          "Implemented accessibility improvements across company websites",
          "Reduced bundle size by 35% through code splitting techniques",
        ],
      },
      {
        id: 3,
        role: "UI Developer",
        company: "CreativeLab",
        period: "2016 - 2018",
        description:
          "Designed and developed user interfaces for client websites. Created responsive layouts and interactive elements.",
        highlights: [
          "Worked on 20+ client websites across various industries",
          "Created CSS animations and transitions for enhanced UI",
          "Collaborated with UX designers to implement user-friendly interfaces",
        ],
      },
    ],
    education: [
      {
        id: 1,
        degree: "Master of Science, Computer Science",
        institution: "Stanford University",
        period: "2014 - 2016",
        description: "Specialized in Human-Computer Interaction",
      },
      {
        id: 2,
        degree: "Bachelor of Science, Software Engineering",
        institution: "University of California",
        period: "2010 - 2014",
        description: "Minor in Digital Media Arts",
      },
    ],
    skills: [
      { name: "React", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 95 },
      { name: "TypeScript", level: 85 },
      { name: "Responsive Design", level: 90 },
      { name: "UI/UX Design", level: 80 },
      { name: "Next.js", level: 75 },
      { name: "Redux", level: 85 },
      { name: "GraphQL", level: 70 },
      { name: "Git/GitHub", level: 90 },
      { name: "Webpack", level: 75 },
      { name: "Jest/Testing", level: 80 },
    ],
  };

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Show skills in two columns
  const skillsFirstColumn = resumeData.skills.slice(
    0,
    Math.ceil(resumeData.skills.length / 2)
  );
  const skillsSecondColumn = resumeData.skills.slice(
    Math.ceil(resumeData.skills.length / 2)
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.docTitle}>Resume.doc</div>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarButton}>
            <Download size={16} />
            <span>Download</span>
          </button>
          <button className={styles.toolbarButton}>
            <Printer size={16} />
            <span>Print</span>
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
              <div className={styles.contactItem}>
                <Phone size={14} />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={14} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
              <div className={styles.contactItem}>
                <Globe size={14} />
                <span>{resumeData.personalInfo.website}</span>
              </div>
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
                <div className={styles.skillsColumn}>
                  {skillsFirstColumn.map((skill, index) => (
                    <div key={index} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={styles.skillBar}>
                        <div
                          className={styles.skillFill}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.skillsColumn}>
                  {skillsSecondColumn.map((skill, index) => (
                    <div key={index} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={styles.skillBar}>
                        <div
                          className={styles.skillFill}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
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
