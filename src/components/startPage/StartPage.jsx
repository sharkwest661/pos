// components/startPage/StartPage.jsx
import React, { useState, useEffect } from "react";
import { useAppStore, useThemeStore } from "../../store";
import { Scanlines } from "../effects/Scanlines";
import {
  LOADING_SIMULATION_DELAY,
  GLITCH_EFFECT_DURATION,
  GLITCH_EFFECT_INTERVAL,
  PROGRESS_UPDATE_INTERVAL,
} from "../../constants/app";
import styles from "./StartPage.module.scss";

const StartPage = () => {
  // Get app store and theme store
  const initializeApp = useAppStore((state) => state.initializeApp);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Loading state
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [isGlitching, setIsGlitching] = useState(false);

  // Simulated loading progress
  useEffect(() => {
    // Start with initial delay
    const startTimer = setTimeout(() => {
      // This simulates increasing progress percentage
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // When progress reaches 100%, initialize the app after a short delay
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => initializeApp(), 500);
            return 100;
          }

          // Update loading status message based on progress
          if (prev === 0) {
            setStatus("Initializing system...");
          } else if (prev === 20) {
            setStatus("Loading vaporwave aesthetic...");
          } else if (prev === 40) {
            setStatus("Booting retro interface...");
          } else if (prev === 60) {
            setStatus("Syncing RGB channels...");
          } else if (prev === 80) {
            setStatus("Almost there...");
          } else if (prev === 95) {
            setStatus("Launching VaporwaveOS...");
          }

          // Generate a random increment between 1-3% to simulate variable loading speed
          const increment = Math.floor(Math.random() * 3) + 1;
          return Math.min(prev + increment, 100);
        });
      }, PROGRESS_UPDATE_INTERVAL);

      // Cleanup progress interval
      return () => clearInterval(progressInterval);
    }, 1000);

    // Cleanup start timer
    return () => clearTimeout(startTimer);
  }, [initializeApp]);

  // Random glitch effect
  useEffect(() => {
    // Trigger random glitch effects during loading
    const glitchInterval = setInterval(() => {
      // Only glitch if we're still loading
      if (progress < 100) {
        setIsGlitching(true);
        // Turn off glitch effect after a short duration
        setTimeout(() => setIsGlitching(false), GLITCH_EFFECT_DURATION);
      }
    }, GLITCH_EFFECT_INTERVAL);

    // Cleanup glitch interval
    return () => clearInterval(glitchInterval);
  }, [progress]);

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.gridBackground}></div>

      <div className={styles.sun}></div>

      <div className={styles.loadingContent}>
        <h1
          className={`${styles.loadingTitle} ${
            isGlitching ? styles.glitching : ""
          }`}
        >
          VAPORWAVE OS
        </h1>

        <div className={styles.loadingBar}>
          <div
            className={styles.loadingProgress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className={styles.loadingStatus}>
          <span className={styles.statusText}>{status}</span>
          <span className={styles.progressText}>{progress}%</span>
        </div>

        <div className={styles.floppyAnimation}>
          <div className={styles.floppy}>
            <div className={styles.floppySlot}></div>
            <div className={styles.floppyLabel}>SYSTEM DISK</div>
          </div>
        </div>

        <div className={styles.copyrightText}>
          © 2025 VaporwaveOS Corp. All rights aesthetically reserved.
        </div>
      </div>

      {/* Vaporwave UI Elements */}
      <div className={styles.decorations}>
        <div className={styles.palm}>🌴</div>
        <div className={styles.statue}>🗿</div>
      </div>

      {/* Scanlines effect */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.2} />}
    </div>
  );
};

export default StartPage;
