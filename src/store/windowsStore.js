// store/windowsStore.js (updated for Vaporwave OS)
import { create } from "zustand";

// Window app types
const APP_TYPES = {
  // Original app types
  MUSIC_PLAYER: "musicPlayer",
  NOTEPAD: "notepad",
  TERMINAL_APP: "terminalApp",
  TEXT_VIEWER: "textViewer",

  // New app types for Vaporwave OS
  MY_PROFILE: "myProfile",
  RESUME: "resume",
  CONTACT: "contact",
  PROJECTS: "projects",
  NOTES: "notes",
};

// Default positions for initial window placement
const DEFAULT_POSITIONS = {
  // Define positions for all app types - x, y are the top-left corner positions
  [APP_TYPES.MY_PROFILE]: { x: 100, y: 50, width: 600, height: 600 },
  [APP_TYPES.PROJECTS]: { x: 150, y: 70, width: 700, height: 600 },
  [APP_TYPES.RESUME]: { x: 200, y: 90, width: 800, height: 700 },
  [APP_TYPES.TERMINAL_APP]: { x: 250, y: 110, width: 750, height: 550 },
  [APP_TYPES.CONTACT]: { x: 300, y: 130, width: 650, height: 500 },
  [APP_TYPES.MUSIC_PLAYER]: { x: 350, y: 150, width: 370, height: 670 },
  [APP_TYPES.NOTES]: { x: 400, y: 170, width: 650, height: 450 },
  [APP_TYPES.TEXT_VIEWER]: { x: 450, y: 190, width: 600, height: 400 },
  [APP_TYPES.NOTEPAD]: { x: 500, y: 210, width: 600, height: 450 },
};

// Create the windows store
const useWindowsStore = create((set, get) => ({
  // List of all open windows
  windows: [],

  // ID of the currently focused window
  activeWindowId: null,

  // Counter for generating unique window IDs
  windowIdCounter: 0,

  // Open a new window
  openWindow: (appType, title, props = {}) => {
    const { windows, windowIdCounter } = get();

    // Generate a unique ID for the window
    const id = `window-${windowIdCounter}`;

    // Get default position or use provided position
    const defaultPosition = DEFAULT_POSITIONS[appType] || {
      x: 100,
      y: 100,
      width: 600,
      height: 400,
    };
    const position = props.position || defaultPosition;

    // Create new window object
    const newWindow = {
      id,
      appType,
      title: title || `${appType} Window`,
      position,
      zIndex: windows.length + 1, // Place on top
      isMinimized: false, // Track minimized state
      props: { ...props },
    };

    // Add to windows array and set as active
    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      windowIdCounter: state.windowIdCounter + 1,
    }));

    return id; // Return window ID for reference
  },

  // Close a window
  closeWindow: (windowId) => {
    const { windows } = get();
    const window = windows.find((w) => w.id === windowId);

    // Special handling for music player - do a FULL cleanup when closing
    if (window && window.appType === APP_TYPES.MUSIC_PLAYER) {
      import("./audioStore")
        .then((module) => {
          const audioStore = module.useAudioStore.getState();
          // Call full cleanup (reset all state)
          audioStore.cleanup();
        })
        .catch((error) => {
          console.error("Failed to import audioStore:", error);
        });
    }

    set((state) => {
      // Filter out the closed window
      const updatedWindows = state.windows.filter(
        (window) => window.id !== windowId
      );

      // If closing the active window, set the top-most remaining window as active
      let activeId = state.activeWindowId;
      if (activeId === windowId && updatedWindows.length > 0) {
        // Find window with highest zIndex
        const topWindow = updatedWindows.reduce(
          (top, window) => (window.zIndex > top.zIndex ? window : top),
          updatedWindows[0]
        );
        activeId = topWindow.id;
      } else if (updatedWindows.length === 0) {
        activeId = null;
      }

      return {
        windows: updatedWindows,
        activeWindowId: activeId,
      };
    });
  },

  // Set a window as active (bring to front)
  setActiveWindow: (windowId) => {
    set((state) => {
      const window = state.windows.find((w) => w.id === windowId);

      // Nothing to do if window doesn't exist
      if (!window) {
        return state;
      }

      // Nothing to do if already active and not minimized
      if (state.activeWindowId === windowId && !window.isMinimized) {
        return state;
      }

      // Find highest z-index
      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));

      // Update windows z-indices and restore from minimized if necessary
      const updatedWindows = state.windows.map((w) => {
        if (w.id === windowId) {
          return {
            ...w,
            zIndex: maxZIndex + 1,
            isMinimized: false, // Always restore from minimized when activating
          };
        }
        return w;
      });

      return {
        windows: updatedWindows,
        activeWindowId: windowId,
      };
    });
  },

  // Toggle window minimized state
  toggleMinimize: (windowId) => {
    set((state) => {
      const window = state.windows.find((w) => w.id === windowId);

      if (!window) return state;

      // Toggle minimize state
      const isMinimized = !window.isMinimized;

      // Update windows
      const updatedWindows = state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized } : w
      );

      // If minimizing the active window, set active to null or next visible window
      let activeId = state.activeWindowId;

      if (isMinimized && state.activeWindowId === windowId) {
        // Find next visible window with highest z-index
        const visibleWindows = updatedWindows.filter((w) => !w.isMinimized);
        if (visibleWindows.length > 0) {
          const nextActive = visibleWindows.reduce(
            (highest, window) =>
              window.zIndex > highest.zIndex ? window : highest,
            visibleWindows[0]
          );
          activeId = nextActive.id;
        } else {
          activeId = null;
        }
      }
      // If we're un-minimizing a window, make it the active window
      else if (!isMinimized) {
        activeId = windowId;

        // Also update z-index to bring window to front
        const maxZIndex = Math.max(...updatedWindows.map((w) => w.zIndex));
        return {
          windows: updatedWindows.map((w) =>
            w.id === windowId ? { ...w, isMinimized, zIndex: maxZIndex + 1 } : w
          ),
          activeWindowId: windowId,
        };
      }

      return {
        windows: updatedWindows,
        activeWindowId: activeId,
      };
    });
  },

  // Update window position and size
  updateWindowPosition: (windowId, position) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId
          ? { ...window, position: { ...window.position, ...position } }
          : window
      ),
    }));
  },

  // Close all windows
  closeAllWindows: () => {
    // Check if music player is open and call cleanup
    const musicPlayerWindow = get().windows.find(
      (w) => w.appType === APP_TYPES.MUSIC_PLAYER
    );
    if (musicPlayerWindow) {
      import("./audioStore")
        .then((module) => {
          const audioStore = module.useAudioStore.getState();
          audioStore.cleanup(); // Full cleanup when closing
        })
        .catch((error) => {
          console.error("Failed to import audioStore:", error);
        });
    }

    set({
      windows: [],
      activeWindowId: null,
    });
  },
}));

// Export the store and constants
export { useWindowsStore, APP_TYPES };
