// hooks/useFullscreen.js
import { useState, useEffect } from "react";

/**
 * Hook to manage fullscreen functionality
 * @param {HTMLElement} elementRef - Optional ref to the element that should go fullscreen (defaults to document.documentElement)
 * @returns {Object} Fullscreen state and methods
 */
export const useFullscreen = (elementRef = null) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update state when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Get the element to make fullscreen
  const getFullscreenElement = () => {
    if (elementRef && elementRef.current) {
      return elementRef.current;
    }
    return document.documentElement;
  };

  /**
   * Enter fullscreen mode
   */
  const enterFullscreen = () => {
    const element = getFullscreenElement();

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  };

  /**
   * Exit fullscreen mode
   */
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  };

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  // Return the state and methods
  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
};
