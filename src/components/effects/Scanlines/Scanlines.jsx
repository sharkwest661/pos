import React from "react";
import styles from "./Scanlines.module.scss";

/**
 * Scanlines component - Creates a CRT scanline effect overlay
 * Performance optimized version
 */
export const Scanlines = ({ opacity = 0.3, className = "" }) => {
  return (
    <div className={`${styles.scanlines} ${className}`} style={{ opacity }} />
  );
};

/**
 * CRT effect component - More efficient implementation
 */
export const CRTEffect = ({ opacity = 0.3, className = "" }) => {
  return (
    <div className={`${styles.crtEffect} ${className}`} style={{ opacity }} />
  );
};
