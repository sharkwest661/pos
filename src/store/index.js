// store/index.js
import { useAppStore } from "./appStore";
import { useThemeStore, VAPORWAVE_THEME, SYNTHWAVE_THEME } from "./themeStore";
import { useWindowsStore, APP_TYPES } from "./windowsStore";
import { useNotepadStore } from "./notepadStore";
import { useAudioStore } from "./audioStore";
import { useSearchEngineStore } from "./searchEngineStore";
import { useTextViewerStore } from "./textViewerStore";
import terminalStore from "./terminalStore";

// Export all stores and constants
export {
  // Main application store
  useAppStore,

  // Theme store and constants
  useThemeStore,
  VAPORWAVE_THEME,
  SYNTHWAVE_THEME,

  // Window management store and constants
  useWindowsStore,
  APP_TYPES,

  // Notepad store
  useNotepadStore,

  // Audio store
  useAudioStore,

  // Search Engine store
  useSearchEngineStore,

  // Text Viewer store
  useTextViewerStore,

  // Terminal store
  terminalStore as useTerminalStore,
};
