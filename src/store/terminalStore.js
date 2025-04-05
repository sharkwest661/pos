// src/store/terminalStore.js
import { create } from "zustand";

// Helper to save terminal state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    localStorage.setItem(
      "shadow_market_terminal",
      JSON.stringify({
        history: state.history,
        commandHistory: state.commandHistory,
        currentDir: state.currentDir,
        crackingMode: state.crackingMode,
        targetSystem: state.targetSystem,
        targetPassword: state.targetPassword,
        maxAttempts: state.maxAttempts,
        passwordHint: state.passwordHint,
        isCracked: state.isCracked,
        crackedVendors: state.crackedVendors,
      })
    );
  } catch (error) {
    console.error("Error saving terminal state to localStorage:", error);
  }
};

// Helper to load terminal state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem("shadow_market_terminal");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading terminal state from localStorage:", error);
  }
  return null;
};

// Load saved state
const savedState = loadStateFromLocalStorage();

// Terminal store to persist state across minimization/maximization
const useTerminalStore = create((set, get) => ({
  // Terminal history
  history: savedState?.history || [
    { text: "Shadow OS Terminal v1.3.37", type: "system" },
  ],

  // Command history for up/down navigation
  commandHistory: savedState?.commandHistory || [],
  historyIndex: -1,

  // Current directory
  currentDir: savedState?.currentDir || "/home/investigator",

  // Password cracking state
  crackingMode: savedState?.crackingMode || false,
  targetSystem: savedState?.targetSystem || "",
  targetPassword: savedState?.targetPassword || "",
  maxAttempts: savedState?.maxAttempts || 5,
  passwordHint: savedState?.passwordHint || "",
  isCracked: savedState?.isCracked || false,

  // Track which vendor systems have been cracked
  crackedVendors: savedState?.crackedVendors || {
    cobra: false,
    ghost: false,
    prometheus: false,
  },

  // Add a line to the terminal history
  addToHistory: (line) =>
    set((state) => {
      const updatedHistory = [...state.history, line];
      const newState = { history: updatedHistory };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Add multiple lines to the terminal history
  addOutput: (lines) =>
    set((state) => {
      const newLines = lines.map((line) => ({ text: line, type: "output" }));
      const updatedHistory = [...state.history, ...newLines];
      const newState = { history: updatedHistory };
      saveStateToLocalStorage({ ...state, ...newState });
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

      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Clear the terminal
  clearTerminal: () =>
    set((state) => {
      const clearedHistory = [{ text: "Terminal cleared.", type: "system" }];
      const newState = { history: clearedHistory };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Set current directory
  setCurrentDir: (dir) =>
    set((state) => {
      const newState = { currentDir: dir };
      saveStateToLocalStorage({ ...state, ...newState });
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

      return { historyIndex: newIndex };
    }),

  // Get current command from history based on index
  getCurrentCommandFromHistory: () => {
    const { commandHistory, historyIndex } = get();

    if (historyIndex === -1 || commandHistory.length === 0) {
      return "";
    }

    return commandHistory[commandHistory.length - 1 - historyIndex];
  },

  // Set password cracking mode
  setCrackingMode: (mode) =>
    set((state) => {
      const newState = { crackingMode: mode };
      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Setup password cracking attempt
  setupPasswordCracking: (
    targetSystem,
    targetPassword,
    maxAttempts,
    passwordHint
  ) =>
    set((state) => {
      const newState = {
        crackingMode: true,
        targetSystem,
        targetPassword,
        maxAttempts,
        passwordHint,
      };

      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Mark a vendor as cracked
  setVendorCracked: (vendorId) =>
    set((state) => {
      const updatedVendors = {
        ...state.crackedVendors,
        [vendorId]: true,
      };

      const newState = {
        isCracked: true,
        crackedVendors: updatedVendors,
      };

      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Reset cracking state
  resetCrackingState: () =>
    set((state) => {
      const newState = {
        crackingMode: false,
        targetSystem: "",
        targetPassword: "",
        maxAttempts: 5,
        passwordHint: "",
        isCracked: false,
      };

      saveStateToLocalStorage({ ...state, ...newState });
      return newState;
    }),

  // Reset everything (for debugging or game reset)
  resetTerminal: () => {
    const defaultState = {
      history: [{ text: "Shadow OS Terminal v1.3.37", type: "system" }],
      commandHistory: [],
      historyIndex: -1,
      currentDir: "/home/investigator",
      crackingMode: false,
      targetSystem: "",
      targetPassword: "",
      maxAttempts: 5,
      passwordHint: "",
      isCracked: false,
      crackedVendors: {
        cobra: false,
        ghost: false,
        prometheus: false,
      },
    };

    saveStateToLocalStorage(defaultState);
    return set(defaultState);
  },
}));

export default useTerminalStore;
