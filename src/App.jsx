import React, { useEffect } from "react";
import Desktop from "./components/desktop/Desktop/Desktop";
import StartPage from "./components/startPage/StartPage";
import { useAppStore, useAudioStore } from "./store";
import { PLAYLIST_DATA } from "./constants/musicData";
import styles from "./App.module.scss";

// Global styles
import "./styles/index.scss";

const App = () => {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const initializeApp = useAppStore((state) => state.initializeApp);
  const initAudio = useAudioStore((state) => state.initAudio);
  const setPlaylist = useAudioStore((state) => state.setPlaylist);

  // Initialize audio system
  useEffect(() => {
    // Initialize audio element
    initAudio();

    // Set playlist data
    setPlaylist(PLAYLIST_DATA);

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listener
    document.addEventListener("contextmenu", handleContextMenu);

    // Simulate initialization process
    const timer = setTimeout(() => {
      initializeApp(); // This will set isInitialized to true
    }, 5000); // 5-second delay to show the loading screen

    // Cleanup on unmount
    return () => {
      useAudioStore.getState().cleanup();
      document.removeEventListener("contextmenu", handleContextMenu);
      clearTimeout(timer);
    };
  }, [initAudio, setPlaylist, initializeApp]);

  return (
    <div className={styles.app}>
      {isInitialized ? <Desktop /> : <StartPage />}
    </div>
  );
};

export default App;
