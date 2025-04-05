// components/apps/profile/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import styles from "./MyProfile.module.scss";

const MyProfile = () => {
  // Get theme configuration and effects status
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);
  const [visitorCount, setVisitorCount] = useState(418); // Starting visitor count

  // Simulate visitor count incrementing randomly
  useEffect(() => {
    const timer = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3)); // Random increment
    }, 30000); // Every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Get current date as last updated
  const lastUpdated = new Date()
    .toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");

  // Add glitch effect to title text
  const handleGlitchEffect = () => {
    const glitchElement = document.querySelector(`.${styles.glitchText}`);
    if (glitchElement) {
      glitchElement.classList.add(styles.glitching);
      setTimeout(() => {
        glitchElement.classList.remove(styles.glitching);
      }, 1000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.profileImage}>
          {/* Replace the emoji with actual profile image */}
          <div className={styles.profileImageInner}>👤</div>
          <div className={styles.scanline}></div>
        </div>

        <div className={styles.profileText}>
          <h2
            className={styles.glitchText}
            data-text="DEVELOPER"
            onClick={handleGlitchEffect}
          >
            DEVELOPER
          </h2>

          <p>
            Welcome to my vaporwave OS portfolio! I'm a creative front-end
            developer passionate about building unique interfaces that combine
            nostalgia with modern web techniques.
          </p>

          <p>
            Exploring the aesthetics of digital past while crafting the web of
            tomorrow.
          </p>

          <div className={styles.statsSection}>
            <div className={styles.divider}>▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅</div>
            <div className={styles.stats}>
              <span>Visitors: {visitorCount.toString().padStart(6, "0")}</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          <div className={styles.skills}>
            <h3>SKILLS</h3>
            <div className={styles.skillsGrid}>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>React</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>JavaScript</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>CSS/SCSS</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>UI Design</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>Animation</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.constructionBar}>
            <img
              src="/assets/images/under-construction.gif"
              alt="Under Construction"
            />
            <span>Always improving...</span>
            <img
              src="/assets/images/under-construction.gif"
              alt="Under Construction"
            />
          </div>
        </div>
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default MyProfile;
