// components/desktop/Taskbar/Taskbar.jsx
import React from "react";
import { useWindowsStore, useThemeStore } from "../../../store";
import { useClock } from "../../../hooks/useClock";
import styles from "./Taskbar.module.scss";

const Taskbar = () => {
  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);

  // Get windows from store
  const windows = useWindowsStore((state) => state.windows);
  const activeWindowId = useWindowsStore((state) => state.activeWindowId);
  const setActiveWindow = useWindowsStore((state) => state.setActiveWindow);
  const toggleMinimize = useWindowsStore((state) => state.toggleMinimize);

  // Get current time
  const time = useClock();

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
      <div className={styles.startButton}>
        <div className={styles.startIcon}></div>
        <span className={styles.startText}>START</span>
      </div>

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
        <div className={styles.clock}>{time}</div>
      </div>
    </div>
  );
};

export default Taskbar;
