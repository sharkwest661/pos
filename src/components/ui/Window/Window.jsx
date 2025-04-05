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

  // Get effects configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Local state
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  // Handle window focus when clicked
  const handleWindowClick = () => {
    if (onFocus) {
      onFocus(id);
    }
  };

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
    setIsDragging(true);
    // Cancel any ongoing animations
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  // Set position when dragging stops
  const handleDragStop = (e, d) => {
    // Clear any pending timeouts
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      setPosition((prev) => ({
        ...prev,
        x: d.x,
        y: d.y,
      }));
      setIsDragging(false);
      rafRef.current = null;
    });
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

  // Clean up any pending animations on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Set initial position
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // Don't render if window is minimized
  if (isMinimized) {
    return null;
  }

  // Combine class names
  const windowClass = [
    styles.window,
    isActive ? styles.active : "",
    isDragging ? styles.dragging : "",
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
      style={{ zIndex, display: isMinimized ? "none" : "flex" }}
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: position.height }}
      enableResizing={resizable && !isDragging && !isMinimized}
      disableDragging={isMinimized}
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      enableUserSelectHack={false} // Important performance fix
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={handleWindowClick}
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
        {/* The key is to keep children mounted but apply optimizations via CSS */}
        {children}

        {/* Apply scanlines effect if enabled */}
        {effectsEnabled?.scanlines && !isDragging && (
          <Scanlines opacity={0.15} />
        )}
      </div>
    </Rnd>
  );
};

export default Window;
