import React, { useEffect, useState } from "react";
import Desktop from "./components/desktop/Desktop/Desktop";
import UnsupportedResolution from "./components/desktop/UnsupportedResolution";
import { useAppStore, useAudioStore } from "./store";
import { PLAYLIST_DATA } from "./constants/musicData";
import styles from "./App.module.scss";

// Global styles
import "./styles/index.scss";

const App = () => {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const initAudio = useAudioStore((state) => state.initAudio);
  const setPlaylist = useAudioStore((state) => state.setPlaylist);

  // State to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Initialize audio system and app immediately
  useEffect(() => {
    // Initialize app immediately
    initializeApp();

    // Initialize audio element
    initAudio();

    // Set playlist data
    setPlaylist(PLAYLIST_DATA);

    // Setup memory monitoring in development
    if (import.meta.env.DEV) {
      console.log("Setting up memory monitor...");
      import("./utils/memoryMonitor").then(({ setupMemoryMonitor }) => {
        setupMemoryMonitor();
      });
    }

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listener
    document.addEventListener("contextmenu", handleContextMenu);

    // Handle window resize for responsive check
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      useAudioStore.getState().cleanup();
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, [initAudio, setPlaylist, initializeApp]);

  return (
    <div className={styles.app}>
      {windowWidth < 720 ? <UnsupportedResolution /> : <Desktop />}
    </div>
  );
};

export default App;
