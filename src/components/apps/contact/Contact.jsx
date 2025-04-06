// components/apps/contact/Contact.jsx
import React, { useState } from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import styles from "./Contact.module.scss";

const Contact = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Simplified state
  const [status, setStatus] = useState("Ready");

  return (
    <div className={styles.container}>
      <div className={styles.emailHeader}>
        <div className={styles.emailTitle}>
          <Mail size={18} />
          <span>Contact</span>
        </div>
      </div>

      <div className={styles.contactContainer}>
        <div className={styles.headerGraphic}>
          <div className={styles.gridSun}></div>
          <div className={styles.gridLines}></div>
        </div>

        <div className={styles.contactContent}>
          <h2 className={styles.contactTitle}>ＣＯＮＮＥＣＴ</h2>
          <p className={styles.contactSubtitle}>Find me in the digital space</p>

          <div className={styles.socialGrid}>
            <a
              href="https://github.com/ccavad"
              className={styles.socialCard}
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.socialIcon}>
                <Github size={32} />
              </div>
              <div className={styles.socialInfo}>
                <h3>GitHub</h3>
                <p>@ccavad</p>
              </div>
            </a>

            <a
              href="mailto:ccavad2015@gmail.com"
              className={styles.socialCard}
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.socialIcon}>
                <Mail size={32} />
              </div>
              <div className={styles.socialInfo}>
                <h3>Email</h3>
                <p>ccavad2015@gmail.com</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/ccavad/"
              className={styles.socialCard}
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.socialIcon}>
                <Linkedin size={32} />
              </div>
              <div className={styles.socialInfo}>
                <h3>LinkedIn</h3>
                <p>/in/ccavad</p>
              </div>
            </a>

            {/* <a
              href="#"
              className={styles.socialCard}
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.socialIcon}>
                <Twitter size={32} />
              </div>
              <div className={styles.socialInfo}>
                <h3>Twitter</h3>
                <p>@handle</p>
              </div>
            </a> */}
          </div>
        </div>

        <div className={styles.contactFooter}>
          <p>All messages received will be answered within 24-48 hours</p>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.statusBar}>
          <div className={styles.status}>{status}</div>
          <div className={styles.clientInfo}>VaporMail v1.0</div>
        </div>
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default Contact;
