// components/apps/musicPlayer/GifVisualizer.jsx
import React, { useState, useEffect, useRef } from "react";
import { VISUALIZER_GIFS } from "../../../constants/gifData";
import styles from "./GifVisualizer.module.scss";
import { getRandomElement } from "../../../utils/random";

/**
 * GIF visualizer component for the music player
 *
 * @param {Object} props - Component props
 * @param {Object} props.currentTrack - The currently playing track
 * @param {boolean} props.isPlaying - Whether music is currently playing
 * @param {Object} props.themeConfig - Theme configuration
 */
const GifVisualizer = ({ currentTrack, isPlaying, themeConfig }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentGif, setCurrentGif] = useState(null);
  const [alternateGif, setAlternateGif] = useState(false);
  const gifCache = useRef(new Map());

  // Get GIF URL based on track or use random one
  const getGifUrl = (track, useAlternate = false) => {
    // If track has specific GIF, use it
    if (track?.gifSrc) {
      return useAlternate && track.gifAlt ? track.gifAlt : track.gifSrc;
    }

    // Otherwise, use a random GIF from our collection
    return getRandomElement(VISUALIZER_GIFS);
  };

  // Update GIF when track changes
  useEffect(() => {
    if (currentTrack) {
      setIsLoaded(false);

      // Get GIF URL (either from track or randomly)
      const newGifUrl = getGifUrl(currentTrack, alternateGif);

      // Check if we have this GIF cached
      if (gifCache.current.has(newGifUrl)) {
        setCurrentGif(newGifUrl);
        setIsLoaded(true);
      } else {
        // Preload the GIF
        const img = new Image();
        img.onload = () => {
          gifCache.current.set(newGifUrl, true);
          setCurrentGif(newGifUrl);
          setIsLoaded(true);
        };
        img.src = newGifUrl;
      }

      // Clean up cache if it gets too large
      if (gifCache.current.size > 5) {
        const keysIterator = gifCache.current.keys();
        const oldestKey = keysIterator.next().value;
        gifCache.current.delete(oldestKey);
      }
    }
  }, [currentTrack, alternateGif]);

  // Toggle between alternate GIFs for the same track
  const handleGifClick = () => {
    setAlternateGif(!alternateGif);
  };

  return (
    <div className={styles.visualizerContainer} onClick={handleGifClick}>
      {!isLoaded && (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.retroLoading}>LOADING...</div>
        </div>
      )}

      <div
        className={`${styles.gifVisualizer} ${isPlaying ? "" : styles.paused}`}
        style={{
          backgroundImage: currentGif ? `url(${currentGif})` : "none",
          display: isLoaded ? "block" : "none",
        }}
      />

      {isPlaying && (
        <div className={styles.trackingEffect}>
          <div
            className={styles.trackingLine}
            style={{ backgroundColor: themeConfig.accentPrimary }}
          ></div>
        </div>
      )}

      <div className={styles.visualizerOverlay}>
        <div className={styles.gifTip}>Click to change visualization</div>
      </div>
    </div>
  );
};

export default GifVisualizer;
