// components/ui/Window/Window.jsx
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects";
import styles from "./Window.module.scss";

const Window = ({
  id,
  title,
  children,
  initialPosition = { x: 100, y: 100, width: 600, height: 400 },
  isActive = false,
  isMinimized = false,
  zIndex = 10,
  resizable = false,
  onClose,
  onFocus,
  onMinimize,
  className = "",
  hideControls = false,
  darkHackerTheme = false,
}) => {
  const windowRef = useRef(null);
  const dragTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Get effects configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Local state
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  // Close window
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(id);
    }
  };

  // Minimize window
  const handleMinimize = (e) => {
    e.stopPropagation();
    if (onMinimize) {
      onMinimize(id);
    }
  };

  // Set position when dragging starts
  const handleDragStart = () => {
    // Set both the state and the ref for redundancy
    setIsDragging(true);
    isDraggingRef.current = true;

    // Cancel any ongoing animations
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Clear any pending timeouts
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  // Set position when dragging stops
  const handleDragStop = (e, d) => {
    // Immediately update dragging ref for redundancy
    isDraggingRef.current = false;

    // Clear any pending timeouts
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    // Use timeout for state updates to ensure they happen after React's current cycle
    dragTimeoutRef.current = setTimeout(() => {
      // Double-check that we're still in the component before updating state
      if (windowRef.current) {
        setPosition((prev) => ({
          ...prev,
          x: d.x,
          y: d.y,
        }));
        setIsDragging(false);
      }
      dragTimeoutRef.current = null;
    }, 50);
  };

  // Set size when resizing stops
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setPosition({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: position.x,
      y: position.y,
    });
  };

  // Force reset dragging state on window click
  const handleWindowClick = () => {
    // First reset dragging state if it's stuck
    if (isDraggingRef.current || isDragging) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }

    // Then call the onFocus handler
    if (onFocus) {
      onFocus(id);
    }
  };

  // Clean up any pending animations on unmount
  // useEffect(() => {
  //   return () => {
  //     if (dragTimeoutRef.current) {
  //       clearTimeout(dragTimeoutRef.current);
  //     }
  //     if (rafRef.current) {
  //       cancelAnimationFrame(rafRef.current);
  //     }
  //   };
  // }, []);

  // Add an emergency reset mechanism with useEffect
  useEffect(() => {
    // Emergency reset for dragging state if mouse is released outside window
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        // If we detect a mouse up while dragging ref is still true,
        // the normal drag stop probably didn't fire
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    // Add global mouse up listener
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Set initial position
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // Combine class names
  const windowClass = [
    styles.window,
    isActive ? styles.active : "",
    isDragging || isDraggingRef.current ? styles.dragging : "",
    isMinimized ? styles.minimized : "",
    darkHackerTheme ? styles.darkHacker : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const titleBarClass = [
    styles.titleBar,
    darkHackerTheme ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleClass = [
    styles.title,
    isActive && !isDragging ? styles.active : "",
    darkHackerTheme ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClass = [
    styles.content,
    isDragging ? styles.dragging : "",
    darkHackerTheme ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Rnd
      ref={windowRef}
      className={windowClass}
      style={{
        zIndex,
        display: isMinimized ? "none" : "flex",
        visibility: isMinimized ? "hidden" : "visible",
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: position.height }}
      enableResizing={resizable && !isDragging && !isMinimized}
      disableDragging={isMinimized}
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      enableUserSelectHack={false} // Important performance fix
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onClick={handleWindowClick}
      onMouseUp={() => {
        // Additional safety check
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          setIsDragging(false);
        }
      }}
      onResizeStop={handleResizeStop}
      minWidth={300}
      minHeight={200}
      bounds="parent"
    >
      {/* Window Title Bar */}
      <div className={`${titleBarClass} window-drag-handle`}>
        <div className={titleClass}>{title}</div>

        {!hideControls && (
          <div className={styles.windowControls}>
            <button
              onClick={handleMinimize}
              className={`${styles.minimizeButton} window-no-drag`}
              aria-label="Minimize window"
              type="button"
            />
            <button
              onClick={handleClose}
              className={`${styles.closeButton} window-no-drag`}
              aria-label="Close window"
              type="button"
            />
          </div>
        )}
      </div>

      {/* Window Content */}
      <div className={contentClass}>
        {/* Keep children mounted but hidden when minimized */}
        {children}

        {/* Apply scanlines effect if enabled */}
        {effectsEnabled?.scanlines && !isDragging && (
          <Scanlines opacity={0.25} />
        )}
      </div>
    </Rnd>
  );
};

export default Window;
