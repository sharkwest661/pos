import React, { useEffect } from "react";
import Desktop from "./components/desktop/Desktop/Desktop";
import { useAppStore, useAudioStore } from "./store";
import { PLAYLIST_DATA } from "./constants/musicData";
import styles from "./App.module.scss";

// Global styles
import "./styles/index.scss";

const App = () => {
  const isInitialized = useAppStore((state) => state.isInitialized);
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

    // Cleanup on unmount
    return () => {
      useAudioStore.getState().cleanup();
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [initAudio, setPlaylist]);

  return (
    <div className={styles.app}>
      {/* {isInitialized ? <Desktop /> : <StartPage />} */}
      <Desktop />
    </div>
  );
};

export default App;
