// components/desktop/Taskbar/Taskbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useWindowsStore, useThemeStore } from "../../../store";
import { useClock } from "../../../hooks/useClock";
import { useFullscreen } from "../../../hooks/useFullscreen";
import { SYSTEM_INFO, getRandomMessage } from "../../../constants/systemInfo";
import styles from "./Taskbar.module.scss";

const Taskbar = () => {
  // State for Start menu
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [systemMessage, setSystemMessage] = useState(getRandomMessage());
  const startMenuRef = useRef(null);

  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);

  // Get windows from store
  const windows = useWindowsStore((state) => state.windows);
  const activeWindowId = useWindowsStore((state) => state.activeWindowId);
  const setActiveWindow = useWindowsStore((state) => state.setActiveWindow);
  const toggleMinimize = useWindowsStore((state) => state.toggleMinimize);

  // Get current time
  const time = useClock();

  // Use fullscreen hook
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Handle clicking outside the start menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(event.target)
      ) {
        setStartMenuOpen(false);
      }
    };

    if (startMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [startMenuOpen]);

  // Update system message periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMessage(getRandomMessage());
    }, 30000); // Change message every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle Start menu
  const toggleStartMenu = () => {
    setStartMenuOpen(!startMenuOpen);
  };

  const handleWindowClick = (windowId) => {
    const window = windows.find((w) => w.id === windowId);

    if (window) {
      if (window.isMinimized) {
        // First restore the window if it's minimized
        toggleMinimize(windowId);

        // Then set it as active after a small delay to ensure state is updated
        setTimeout(() => {
          setActiveWindow(windowId);
        }, 10);
      } else if (window.id === activeWindowId) {
        // Minimize the window if clicking the active window button
        toggleMinimize(windowId);
      } else {
        // Otherwise just activate the window
        setActiveWindow(windowId);
      }
    }
  };

  return (
    <div className={styles.taskbar}>
      <div
        className={`${styles.startButton} ${
          startMenuOpen ? styles.active : ""
        }`}
        onClick={toggleStartMenu}
      >
        <div className={styles.startIcon}></div>
        <span className={styles.startText}>START</span>
      </div>

      {/* Start Menu Panel */}
      {startMenuOpen && (
        <div className={styles.startMenu} ref={startMenuRef}>
          <div className={styles.startMenuHeader}>
            <h2 className={styles.startMenuTitle}>VAPORWAVE OS</h2>
            <p className={styles.startMenuVersion}>
              Version {SYSTEM_INFO.VERSION}
            </p>
          </div>

          <div className={styles.startMenuContent}>
            <div className={styles.systemInfoSection}>
              <h3 className={styles.systemInfoTitle}>SYSTEM INFORMATION</h3>

              <div className={styles.systemInfoItems}>
                <div className={styles.systemInfoItem}>
                  <span className={styles.systemInfoLabel}>MEMORY:</span>
                  <span className={styles.systemInfoValue}>
                    {SYSTEM_INFO.MEMORY.CONVENTIONAL}
                  </span>
                </div>

                <div className={styles.systemInfoItem}>
                  <span className={styles.systemInfoLabel}>BUILD:</span>
                  <span className={styles.systemInfoValue}>
                    {SYSTEM_INFO.CODENAME}
                  </span>
                </div>

                <div className={styles.systemInfoItem}>
                  <span className={styles.systemInfoLabel}>DATE:</span>
                  <span className={styles.systemInfoValue}>
                    {SYSTEM_INFO.BUILD_DATE}
                  </span>
                </div>

                <div className={styles.systemInfoItem}>
                  <span className={styles.systemInfoLabel}>AESTHETIC:</span>
                  <span className={styles.systemInfoValue}>
                    {SYSTEM_INFO.STATUS.AESTHETIC_LEVEL}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.messageBox}>
              <p>{systemMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.openWindows}>
        {windows.map((window) => (
          <button
            key={window.id}
            className={`${styles.windowButton} ${
              window.id === activeWindowId ? styles.active : ""
            } ${window.isMinimized ? styles.minimized : ""}`}
            onClick={() => handleWindowClick(window.id)}
          >
            <span className={styles.windowTitle}>{window.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.systemTray}>
        <button
          className={styles.fullscreenButton}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
        <div className={styles.clock}>{time}</div>
      </div>
    </div>
  );
};

export default Taskbar;
