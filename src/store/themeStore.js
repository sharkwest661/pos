// store/themeStore.js (updated for Vaporwave OS)
import { create } from "zustand";

// Vaporwave theme colors
const VAPORWAVE_THEME = {
  darkBg: "#2d1b4e", // Dark purple-blue base
  lightBg: "#1a1259", // Deep purple base
  accentPrimary: "#ff00ff", // Bright magenta/pink
  accentSecondary: "#00ffff", // Bright cyan
  textLight: "#ffffff", // White text
  textDark: "#2a2a4a", // Dark text on light backgrounds
  electricBlue: "#0080ff", // Electric blue
  warningRed: "#ff2222", // For alerts and errors
  glowEffect: "0 0 10px rgba(255, 0, 255, 0.7)", // Neon glow
  gridColor: "rgba(255, 0, 255, 0.1)", // Grid line color
  sunsetGradient: "linear-gradient(180deg, #FF9E68 0%, #FF5F95 100%)", // Sunset gradient
};

// Synthwave theme - an alternative vaporwave-like theme
const SYNTHWAVE_THEME = {
  darkBg: "#241734", // Dark indigo base
  lightBg: "#4b2555", // Medium purple
  accentPrimary: "#fe53bb", // Hot pink
  accentSecondary: "#09fbd3", // Bright aqua
  textLight: "#f5f5f5", // Light text
  textDark: "#2a2a4a", // Dark text
  electricBlue: "#08f7fe", // Bright blue
  warningRed: "#ff2222", // Alert red
  glowEffect: "0 0 10px rgba(254, 83, 187, 0.7)", // Pink glow
  gridColor: "rgba(8, 247, 254, 0.1)", // Grid line color
  sunsetGradient: "linear-gradient(180deg, #FC28FB, #03EDF9)", // Gradient
};

// Dark hacker theme for terminal and specialized apps
const DARK_HACKER_THEME = {
  darkBg: "#000000", // Black background
  lightBg: "#111111", // Dark panel background
  accentPrimary: "#33ff00", // Hacker green
  accentSecondary: "#00ffff", // Terminal cyan
  textLight: "#ffffff", // White text
  textDark: "#000000", // Black text
  electricBlue: "#0088ff", // Blue accent
  warningRed: "#ff3300", // Warning red
  glowEffect: "0 0 10px rgba(51, 255, 0, 0.7)", // Green glow
  gridColor: "rgba(51, 255, 0, 0.1)", // Grid line color
};

// Visual effects settings (for accessibility and aesthetics)
const DEFAULT_EFFECTS = {
  scanlines: true, // CRT scanline effect
  glitch: false, // Glitch effect for text and UI
  crt: true, // CRT curvature and vignette effect
  vhs: false, // VHS tracking distortion effect
};

const useThemeStore = create((set) => ({
  // Theme configuration - default to vaporwave
  themeConfig: VAPORWAVE_THEME,

  // Current theme name
  currentTheme: "vaporwave",

  // Visual effects toggle states (for accessibility and performance)
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

  // Switch theme
  setTheme: (themeName) => {
    let newTheme;

    switch (themeName) {
      case "synthwave":
        newTheme = SYNTHWAVE_THEME;
        break;
      case "hacker":
        newTheme = DARK_HACKER_THEME;
        break;
      case "vaporwave":
      default:
        newTheme = VAPORWAVE_THEME;
        break;
    }

    set({
      themeConfig: newTheme,
      currentTheme: themeName,
    });
  },

  // Reset effects to default
  resetEffects: () => set({ effectsEnabled: { ...DEFAULT_EFFECTS } }),
}));

// Export the store and theme constants
export { useThemeStore, VAPORWAVE_THEME, SYNTHWAVE_THEME, DARK_HACKER_THEME };
