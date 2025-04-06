import React from "react";
import { Scanlines, CRTEffect } from "../../effects/Scanlines";
import styles from "./UnsupportedResolution.module.scss";

const UnsupportedResolution = () => {
  return (
    <div className={styles.container}>
      {/* Background effects */}
      <div className={styles.backgroundOverlay}>
        <div className={styles.gridBackground}></div>
      </div>

      <div className={styles.sun}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>Resolution Not Supported</h1>

        <div className={styles.computerArt}>
          <pre className={styles.asciiArt}>
            {`
  _____________________________
 /|                           |\\
| |                           | |
| |      ＥＲＲＯＲ４０４      | |
| |                           | |
| |       ＳＣＲＥＥＮ         | |
| |                           | |
| |  ＲＥＳＯＬＵＴＩＯＮ       | |
| |                           | |
| |  ＴＯＯ  ＳＭＡＬＬ        | |
| |                           | |
| |___________________________|_|
|/___________________________\\|
     _____[_]__[_]_____
    /                   \\
   /                     \\
  /_____________________ _\\
 |  _________________  ||
 | |                 | ||
 | |                 | ||
 | |                 | ||
 | |_________________| ||
 |_____________________||
`}
          </pre>
        </div>

        <div className={styles.messageBox}>
          <p className={styles.message}>
            This experience requires a viewport of at least{" "}
            <span className={styles.highlight}>720px width</span>.
          </p>
          <p className={styles.message}>
            Please view on a larger screen for the full experience.
          </p>
        </div>

        <div className={styles.palmContainer}>
          <div className={styles.palm}>🌴</div>
        </div>
      </div>

      {/* Visual effects */}
      <Scanlines opacity={0.2} />
      <CRTEffect opacity={0.3} />
    </div>
  );
};

export default UnsupportedResolution;
