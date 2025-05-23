// src/constants/systemInfo.js
// Centralized location for system information and version details

export const SYSTEM_INFO = {
  // Version information
  VERSION: "1.0.4",
  CODENAME: "AESTHETIC",
  BUILD_DATE: "05/23/2025",

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
    "現実は心の状態にすぎない", // Reality is just a state of mind
    "デジタルサンセットを受け入れる", // Embrace the digital sunset
    "システムは正常に動作しています", // All systems operational
    "デジタル世界へようこそ", // Welcome to the digital world
    "現実からの脱出", // Escape from reality
    "過去の未来", // Future of the past
    "永遠のサンセット", // Eternal sunset
    "ノスタルジアが最大化", // Nostalgia maximized
    "Time is an illusion in cyberspace",
    "Embrace the digital sunset",
    "All systems operational",
    "Loading paradise.exe...",
    "Welcome to the digital afterlife",
    "Error: too much nostalgia detected",
    "Remember when the future was cool?",
    "Surfing the electronic waves",
    "Please insert feelings.dll",
    "Initialization complete: dream mode activated",
    "Vaporizing reality since 1995",
    "Connection established to the collective unconscious",
    "Downloading memories from a better time",
    "System update: melancholy.vw installed",
    "Retrowave protocols engaged",
    "Palm trees and grid lines loading...",
    "Escape velocity achieved",
    "Simulation running at optimal sadness",
    "Reticulating retro splines",
    "Synthwave sequence initialized",
    "Lost in digital space since forever",
    "Nostalgia levels at maximum capacity",
    "System status: aesthetically pleased",
    "Accessing the virtual plaza",
    "Finding meaning in abandoned software",
    "Echoes of the information superhighway",
    "Press any key to continue dreaming",
    "Your digital sunset awaits",
    "Reality.exe has stopped working",
    "Welcome to yesterday's tomorrow",
    "Feelings transmitted successfully",
    "404: Future not found, reverting to past",
    "Now entering the electronic void",
  ],
};

// Get a random message from the system
export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * SYSTEM_INFO.MESSAGES.length);
  return SYSTEM_INFO.MESSAGES[randomIndex];
};
