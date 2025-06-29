// components/desktop/Desktop/Desktop.jsx (updated)
import React, { useState, useEffect, memo } from "react";
import {
  Music,
  FileText,
  Terminal,
  Mail,
  FolderOpen,
  Notebook,
  // FileText2,
} from "lucide-react";
import {
  useWindowsStore,
  useThemeStore,
  APP_TYPES,
  useAudioStore,
} from "../../../store";
import { Window } from "../../ui";
import { Scanlines, CRTEffect } from "../../effects/Scanlines";
import MusicPlayer from "../../apps/musicPlayer";
import Notepad from "../../apps/notepad/Notepad";
import TerminalApp from "../../apps/terminal";
import Taskbar from "../Taskbar";
import MyProfile from "../../apps/profile";
import Resume from "../../apps/resume";
import Contact from "../../apps/contact";
import Projects from "../../apps/projects";
import Notes from "../../apps/notes";
import TextViewer from "../../apps/textViewer";
import styles from "./Desktop.module.scss";

// Memoized app components for performance
const MemoizedMusicPlayer = memo(MusicPlayer);
const MemoizedNotepad = memo(Notepad);
const MemoizedTerminal = memo(TerminalApp);
const MemoizedMyProfile = memo(MyProfile);
const MemoizedResume = memo(Resume);
const MemoizedContact = memo(Contact);
const MemoizedProjects = memo(Projects);
const MemoizedNotes = memo(Notes);
const MemoizedTextViewer = memo(TextViewer);

// Map of app types to memoized components
const APP_COMPONENTS = {
  [APP_TYPES.MUSIC_PLAYER]: MemoizedMusicPlayer,
  [APP_TYPES.NOTEPAD]: MemoizedNotepad,
  [APP_TYPES.TERMINAL_APP]: MemoizedTerminal,
  [APP_TYPES.TEXT_VIEWER]: MemoizedTextViewer,
  [APP_TYPES.MY_PROFILE]: MemoizedMyProfile,
  [APP_TYPES.RESUME]: MemoizedResume,
  [APP_TYPES.CONTACT]: MemoizedContact,
  [APP_TYPES.PROJECTS]: MemoizedProjects,
  [APP_TYPES.NOTES]: MemoizedNotes,
};

// Desktop app definitions
const desktopApps = [
  {
    id: "my-profile",
    title: "MyProfile.html",
    icon: <FileText size={24} />,
    appType: APP_TYPES.MY_PROFILE,
  },
  {
    id: "projects",
    title: "Projects Folder",
    icon: <FolderOpen size={24} />,
    appType: APP_TYPES.PROJECTS,
  },
  {
    id: "resume",
    title: "Resume.doc",
    icon: <FileText size={24} />,
    appType: APP_TYPES.RESUME,
  },
  {
    id: "terminal",
    title: "Terminal.bat",
    icon: <Terminal size={24} />,
    appType: APP_TYPES.TERMINAL_APP,
  },
  {
    id: "contact",
    title: "Contact.msg",
    icon: <Mail size={24} />,
    appType: APP_TYPES.CONTACT,
  },
  {
    id: "music-player",
    title: "WavePlayer.wav",
    icon: <Music size={24} />,
    appType: APP_TYPES.MUSIC_PLAYER,
  },
  {
    id: "notes",
    title: "Notes.txt",
    icon: <Notebook size={24} />,
    appType: APP_TYPES.NOTES,
  },
];

const Desktop = () => {
  // Get state from stores
  const allWindows = useWindowsStore((state) => state.windows);
  const activeWindowId = useWindowsStore((state) => state.activeWindowId);
  const closeWindow = useWindowsStore((state) => state.closeWindow);
  const setActiveWindow = useWindowsStore((state) => state.setActiveWindow);
  const openWindow = useWindowsStore((state) => state.openWindow);
  const toggleMinimize = useWindowsStore((state) => state.toggleMinimize);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Get audio controls
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);

  // Local state
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [previousWindows, setPreviousWindows] = useState([]);

  // Decorative elements for vaporwave theme
  const [showSun, setShowSun] = useState(true);
  const [showPalm, setShowPalm] = useState(false);
  const [showStatue, setShowStatue] = useState(false);

  // Effect to track window changes and cleanup music player
  useEffect(() => {
    // Check if music player window was closed
    const musicPlayerWasOpen = previousWindows.some(
      (window) => window.appType === APP_TYPES.MUSIC_PLAYER
    );

    const musicPlayerIsOpen = allWindows.some(
      (window) => window.appType === APP_TYPES.MUSIC_PLAYER
    );

    // If music player was open but is no longer open, do full cleanup
    if (musicPlayerWasOpen && !musicPlayerIsOpen) {
      // Get audio store and perform full cleanup
      const audioStore = useAudioStore.getState();
      audioStore.cleanup();
    }

    // Update previous windows
    setPreviousWindows(allWindows);
  }, [allWindows, previousWindows]);

  // Handle single click on icon (select)
  const handleIconClick = (appId) => {
    setSelectedIcon(selectedIcon === appId ? null : appId);
  };

  // Handle double click on icon (open)
  const handleIconDoubleClick = (app) => {
    // Check if app is already open
    const existingWindow = allWindows.find(
      (window) => window.appType === app.appType
    );

    if (existingWindow) {
      // Focus existing window
      setActiveWindow(existingWindow.id);
    } else {
      // Open new window with props if provided
      openWindow(app.appType, app.title, app.props || {});
    }
  };

  // Clear selected icon when clicking desktop background
  const handleDesktopClick = (e) => {
    // Check if clicking on the desktop background
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains(styles.backgroundOverlay)
    ) {
      setSelectedIcon(null);
    }
  };

  return (
    <div className={styles.desktop} onClick={handleDesktopClick}>
      {/* Vaporwave grid background */}
      <div className={styles.backgroundOverlay}>
        <div className={styles.gridBackground}></div>
      </div>

      {/* Decorative elements */}
      {showSun && <div className={styles.sun}></div>}

      <div className={styles.decorations}>
        {showPalm && <div className={styles.palm}>🌴</div>}
        {showStatue && <div className={styles.statue}>🗿</div>}
      </div>

      {/* Desktop icons */}
      <div className={styles.iconsContainer}>
        {desktopApps.map((app) => {
          // Check if this app has an open window
          const isActive = allWindows.some(
            (window) => window.appType === app.appType
          );
          const isHovered = hoveredIcon === app.id;
          const isSelected = selectedIcon === app.id;

          return (
            <div
              key={app.id}
              className={`${styles.desktopIcon} 
                ${isActive ? styles.active : ""} 
                ${isHovered ? styles.hovered : ""} 
                ${isSelected ? styles.selected : ""}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent desktop click handler
                handleIconClick(app.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation(); // Prevent desktop click handler
                handleIconDoubleClick(app);
              }}
              onMouseEnter={() => setHoveredIcon(app.id)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <div className={styles.iconWrapper}>{app.icon}</div>
              <div className={styles.iconLabel}>{app.title}</div>
            </div>
          );
        })}
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.2} />}

      {/* CRT effect if enabled */}
      {effectsEnabled?.crt && <CRTEffect opacity={0.2} />}

      {/* Desktop content - windows */}
      <div className={styles.windows}>
        {allWindows.map((window) => {
          // Determine which component to render
          const AppComponent =
            APP_COMPONENTS[window.appType] ||
            (() => (
              <div className={styles.appPlaceholder}>
                <h2 className={styles.appTitle}>App: {window.appType}</h2>
                <p>
                  This is a placeholder for the {window.appType} application
                </p>
              </div>
            ));

          return (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              initialPosition={window.position}
              isActive={window.id === activeWindowId}
              isMinimized={window.isMinimized}
              zIndex={window.zIndex}
              onClose={closeWindow}
              onMinimize={toggleMinimize}
              resizable={false}
              onFocus={setActiveWindow}
            >
              <AppComponent {...window.props} />
            </Window>
          );
        })}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Desktop;
