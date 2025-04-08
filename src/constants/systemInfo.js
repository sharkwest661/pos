// src/constants/systemInfo.js
// Centralized location for system information and version details

export const SYSTEM_INFO = {
  // Version information
  VERSION: "1.0.1",
  CODENAME: "AESTHETIC",
  BUILD_DATE: "04/08/2025",

  // System specs (fictitious retro values)
  MEMORY: {
    CONVENTIONAL: "640K",
    EXTENDED: "3584K",
    TOTAL: "4096K",
  },

  // System status
  STATUS: {
    AESTHETIC_LEVEL: "MAXIMUM",
    NOSTALGIA_FACTOR: "EXTREME",
    SYSTEM_STABILITY: "ENHANCED",
  },

  // Easter egg messages for Start menu
  MESSAGES: [
    "Enjoy the A E S T H E T I C",
    "Reality is just a state of mind",
    "Time is an illusion in cyberspace",
    "Embrace the digital sunset",
    "All systems operational",
  ],
};

// Get a random message from the system
export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * SYSTEM_INFO.MESSAGES.length);
  return SYSTEM_INFO.MESSAGES[randomIndex];
};
