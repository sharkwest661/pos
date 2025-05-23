// components/apps/musicPlayer/GifVisualizer.jsx
import React, { useState, useEffect, useRef } from "react";
import { VISUALIZER_GIFS } from "../../../constants/gifData";
import styles from "./GifVisualizer.module.scss";
import { getRandomElement } from "../../../utils/random";

const GifVisualizer = ({ currentTrack, isPlaying, themeConfig }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentGif, setCurrentGif] = useState(null);
  const [alternateGif, setAlternateGif] = useState(false);
  const gifCache = useRef(new Map());
  const loadingTimeoutRef = useRef(null);
  const imageRef = useRef(null);
  const isMountedRef = useRef(true);

  // Get GIF URL based on track or use random one
  const getGifUrl = (track, useAlternate = false) => {
    if (track?.gifSrc) {
      return useAlternate && track.gifAlt ? track.gifAlt : track.gifSrc;
    }
    return getRandomElement(VISUALIZER_GIFS);
  };

  // Cleanup function for image loading
  const cleanupImageLoading = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
      imageRef.current.src = "";
      imageRef.current = null;
    }
  };

  // Update GIF when track changes
  useEffect(() => {
    if (currentTrack) {
      setIsLoaded(false);

      // Cleanup previous loading
      cleanupImageLoading();

      // Get GIF URL
      const newGifUrl = getGifUrl(currentTrack, alternateGif);

      // Manage cache size
      if (gifCache.current.size > 5) {
        const keysIterator = gifCache.current.keys();
        const oldestKey = keysIterator.next().value;
        gifCache.current.delete(oldestKey);
      }

      // Check cache
      if (gifCache.current.has(newGifUrl)) {
        if (isMountedRef.current) {
          setCurrentGif(newGifUrl);
          setIsLoaded(true);
        }
      } else {
        // Load new GIF with timeout
        loadingTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;

          const img = new Image();
          imageRef.current = img;

          img.onload = () => {
            if (isMountedRef.current) {
              gifCache.current.set(newGifUrl, true);
              setCurrentGif(newGifUrl);
              setIsLoaded(true);
            }
            // Clean up references
            img.onload = null;
            img.onerror = null;
            imageRef.current = null;
          };

          img.onerror = () => {
            console.warn("Failed to load GIF:", newGifUrl);
            if (isMountedRef.current) {
              setIsLoaded(true);
            }
            // Clean up references
            img.onload = null;
            img.onerror = null;
            imageRef.current = null;
          };

          img.src = newGifUrl;
        }, 300);
      }
    }
  }, [currentTrack, alternateGif]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupImageLoading();
      // Clear cache on unmount to free memory
      gifCache.current.clear();
    };
  }, []);

  // Toggle between alternate GIFs
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
