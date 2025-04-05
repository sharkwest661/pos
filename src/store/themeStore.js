// store/themeStore.js
import { create } from "zustand";

// Theme colors for cyberpunk theme
const CYBERPUNK_THEME = {
  darkBg: "#120458", // Dark Blue Base
  lightBg: "#1f0b47", // Dark Purple
  accentPrimary: "#ff00a0", // Neon Pink
  accentSecondary: "#00ffd5", // Cyan
  textLight: "#f5f5f5", // Primary text color
  textDark: "#1a1a2e", // Text on light backgrounds
  electricBlue: "#0984e3", // Alternative accent
  darkTeal: "#005577", // Tertiary color
  warningRed: "#ff2222", // For alerts and errors
  glowEffect: "0 0 10px rgba(255, 0, 160, 0.7)", // Neon glow
};

// Dark hacker theme specifically for Shadow Market sections
const DARK_HACKER_THEME = {
  darkBg: "#000000", // Black
  lightBg: "#111111", // Dark panel background
  accentPrimary: "#33ff00", // Terminal Green
  accentSecondary: "#33ff00", // Also green for consistency
  textLight: "#f5f5f5", // Primary text color
  textDark: "#1a1a2e", // Text on light backgrounds
  electricBlue: "#0088ff", // Alternative accent
  darkTeal: "#003322", // Tertiary color
  warningRed: "#ff3300", // For alerts and errors
  glowEffect: "0 0 10px rgba(51, 255, 0, 0.7)", // Green glow
};

// Visual effects settings (for accessibility)
const DEFAULT_EFFECTS = {
  scanlines: true,
  glitch: false,
  crt: true,
};

const useThemeStore = create((set) => ({
  // Theme configuration (static, no theme switching)
  themeConfig: CYBERPUNK_THEME,

  // Dark hacker theme for shadow market sections
  darkHackerConfig: DARK_HACKER_THEME,

  // Visual effects toggle states (for accessibility)
  effectsEnabled: { ...DEFAULT_EFFECTS },

  // Toggle individual visual effects
  toggleEffect: (effect, enabled) =>
    set((state) => ({
      effectsEnabled: {
        ...state.effectsEnabled,
        [effect]:
          enabled !== undefined ? enabled : !state.effectsEnabled[effect],
      },
    })),

  // Reset effects to default
  resetEffects: () => set({ effectsEnabled: { ...DEFAULT_EFFECTS } }),
}));

// Export the store and theme constants
export { useThemeStore, CYBERPUNK_THEME, DARK_HACKER_THEME };
