// components/apps/profile/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import styles from "./MyProfile.module.scss";
import { Construction } from "lucide-react";
import { getRandomNumber } from "../../../utils/random";

const MyProfile = () => {
  // Get theme configuration and effects status
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);
  const [visitorCount, setVisitorCount] = useState(418); // Starting visitor count

  // Simulate visitor count incrementing randomly
  useEffect(() => {
    const timer = setInterval(() => {
      setVisitorCount((prev) => prev + getRandomNumber(0, 3)); // Random increment
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
          <div className={styles.profileImageInner}>
            <img src="/assets/images/avatar.jpeg" alt="Developer Profile" />
          </div>
          <div className={styles.scanline}></div>
        </div>

        <div className={styles.profileText}>
          <h2
            className={styles.glitchText}
            data-text="FRONTEND DEVELOPER"
            onClick={handleGlitchEffect}
          >
            FRONTEND DEVELOPER
          </h2>

          <p>
            Welcome to my OS portfolio! I'm a front-end developer with 2 years
            of experience in React.js, Next.js, and React Native.
          </p>

          <p>
            I build responsive web and mobile apps, with a working knowledge of
            backend tech like Node.js and MongoDB. I focus on clean code,
            performance, and reliable solutions.
          </p>

          <div className={styles.statsSection}>
            <div className={styles.divider}>▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅</div>
            <div className={styles.stats}>
              <span>Visitors: {visitorCount.toString().padStart(6, "0")}</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          <div className={styles.skills}>
            <h3>C:\SKILLS\</h3>
            <div className={styles.fileExplorer}>
              <div className={styles.fileHeader}>
                <div className={styles.fileName}>Name</div>
                <div className={styles.fileType}>Type</div>
                <div className={styles.fileDate}>Modified</div>
                <div className={styles.fileSize}>Size</div>
              </div>

              <div className={styles.fileDirectory}>
                {/* Frontend Directory */}
                <div className={styles.directoryItem}>
                  <div className={styles.directoryName}>
                    <span className={styles.folderIcon}>📁</span>
                    FRONTEND
                  </div>
                </div>

                <div className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <span className={styles.fileIcon}>📄</span>
                    React
                  </div>
                  <div className={styles.fileType}>.jsx</div>
                  <div className={styles.fileDate}>01.05.24</div>
                  <div className={styles.fileSize}>64KB</div>
                </div>

                <div className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <span className={styles.fileIcon}>📄</span>
                    JavaScript
                  </div>
                  <div className={styles.fileType}>.js</div>
                  <div className={styles.fileDate}>02.15.24</div>
                  <div className={styles.fileSize}>128KB</div>
                </div>

                <div className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <span className={styles.fileIcon}>📄</span>
                    Styling
                  </div>
                  <div className={styles.fileType}>.scss</div>
                  <div className={styles.fileDate}>03.10.24</div>
                  <div className={styles.fileSize}>96KB</div>
                </div>

                {/* Backend Directory */}
                <div className={styles.directoryItem}>
                  <div className={styles.directoryName}>
                    <span className={styles.folderIcon}>📁</span>
                    BACKEND
                  </div>
                </div>

                <div className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <span className={styles.fileIcon}>📄</span>
                    Node_Express
                  </div>
                  <div className={styles.fileType}>.js</div>
                  <div className={styles.fileDate}>02.18.24</div>
                  <div className={styles.fileSize}>96KB</div>
                </div>

                <div className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <span className={styles.fileIcon}>📄</span>
                    MongoDB
                  </div>
                  <div className={styles.fileType}>.db</div>
                  <div className={styles.fileDate}>01.30.24</div>
                  <div className={styles.fileSize}>64KB</div>
                </div>
              </div>

              <div className={styles.diskInfo}>
                <div>8 File(s)</div>
                <div>1,216 KB</div>
                <div>42.0 MB Free</div>
              </div>
            </div>
          </div>

          <div className={styles.constructionBar}>
            <Construction />

            <span>Always improving...</span>
            <Construction />
          </div>
        </div>
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default MyProfile;
