// store/terminalStore.js
import { create } from "zustand";
import { SYSTEM_INFO } from "./../constants/systemInfo";

// Helper to save terminal state to sessionStorage
const saveStateTosessionStorage = (state) => {
  try {
    sessionStorage.setItem(
      "os_terminal",
      JSON.stringify({
        history: state.history,
        commandHistory: state.commandHistory,
        currentDir: state.currentDir,
        inGameMode: state.inGameMode,
        gameType: state.gameType,
      })
    );
  } catch (error) {
    console.error("Error saving terminal state to sessionStorage:", error);
  }
};

// Helper to load terminal state from sessionStorage
const loadStateFromsessionStorage = () => {
  try {
    const savedState = sessionStorage.getItem("os_terminal");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading terminal state from sessionStorage:", error);
  }
  return null;
};

// Load saved state
const savedState = loadStateFromsessionStorage();

// Terminal store to persist state across minimization/maximization
const useTerminalStore = create((set, get) => ({
  // Terminal history
  history: savedState?.history || [
    {
      text: `ＶＡＰＯＲＷＡＶＥ  ＯＳ  [Version ${SYSTEM_INFO.VERSION}]`,
      type: "system",
    },
    { text: "(c) 2025 Vaporwave Corp. All rights reserved.", type: "system" },
  ],

  // Command history for up/down navigation
  commandHistory: savedState?.commandHistory || [],
  historyIndex: -1,

  // Current directory
  currentDir: savedState?.currentDir || "C:\\Users\\Guest",

  // Game mode state
  inGameMode: savedState?.inGameMode || false,

  // Game type (puzzle, adventure, etc.)
  gameType: savedState?.gameType || null,

  // Add a line to the terminal history
  addToHistory: (line) =>
    set((state) => {
      const updatedHistory = [...state.history, line];
      const newState = { history: updatedHistory };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Add multiple lines to the terminal history
  addOutput: (lines) =>
    set((state) => {
      const newLines = lines.map((line) => ({ text: line, type: "output" }));
      const updatedHistory = [...state.history, ...newLines];
      const newState = { history: updatedHistory };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Add a command to history
  addCommandToHistory: (command) =>
    set((state) => {
      // Add command to display history
      const newLine = {
        text: `${state.currentDir}> ${command}`,
        type: "command",
      };
      const updatedHistory = [...state.history, newLine];

      // Add to command history for up/down arrows
      const updatedCommandHistory = [...state.commandHistory, command];

      const newState = {
        history: updatedHistory,
        commandHistory: updatedCommandHistory,
        historyIndex: -1,
      };

      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Clear the terminal
  clearTerminal: () =>
    set((state) => {
      const clearedHistory = [
        { text: "ＶＡＰＯＲＷＡＶＥ  ＯＳ  [Version 1.0.0]", type: "system" },
        {
          text: "(c) 2025 Vaporwave Corp. All rights reserved.",
          type: "system",
        },
      ];
      const newState = { history: clearedHistory };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Set current directory
  setCurrentDir: (dir) =>
    set((state) => {
      const newState = { currentDir: dir };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Navigate command history (for up/down keys)
  navigateCommandHistory: (direction) =>
    set((state) => {
      const { commandHistory, historyIndex } = state;

      if (commandHistory.length === 0) return {};

      let newIndex = historyIndex;

      if (direction === "up" && historyIndex < commandHistory.length - 1) {
        newIndex = historyIndex + 1;
      } else if (direction === "down" && historyIndex > 0) {
        newIndex = historyIndex - 1;
      } else if (direction === "down" && historyIndex === 0) {
        newIndex = -1;
      } else {
        return {};
      }

      const newState = { historyIndex: newIndex };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Get current command from history based on index
  getCurrentCommandFromHistory: () => {
    const { commandHistory, historyIndex } = get();

    if (historyIndex === -1 || commandHistory.length === 0) {
      return "";
    }

    return commandHistory[commandHistory.length - 1 - historyIndex];
  },

  // Set game mode state
  setInGameMode: (mode) =>
    set((state) => {
      const newState = { inGameMode: mode };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Set game type (puzzle, adventure, etc.)
  setGameType: (gameType) =>
    set((state) => {
      const newState = { gameType };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),
}));

export { useTerminalStore };
