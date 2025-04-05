// store/appStore.js
import { create } from "zustand";

const useAppStore = create((set) => ({
  // Application state
  isInitialized: false,
  isLoading: false,
  currentUser: null,

  // Game progress tracking
  gameProgress: {
    currentPhase: 0, // Investigation phase
    completedTasks: [],
    discoveredEvidence: [],
    unlockedAreas: [],
    timeElapsed: 0,
  },

  // Global notifications
  notifications: [],

  // Music player state (keeping these here since they're referenced in multiple components)
  isPlaying: false,
  currentTrack: 0,
  volume: 30,

  // Actions

  // Initialize the application
  initializeApp: () => set({ isInitialized: true }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Update game progress
  updateGameProgress: (progress) =>
    set((state) => ({
      gameProgress: { ...state.gameProgress, ...progress },
    })),

  // Add a notification
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          timestamp: new Date(),
          read: false,
          ...notification,
        },
      ],
    })),

  // Mark notification as read
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    })),

  // Clear all notifications
  clearNotifications: () => set({ notifications: [] }),

  // Music player controls
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrack: (trackIndex) => set({ currentTrack: trackIndex }),
  setVolume: (volume) => set({ volume }),
}));

export { useAppStore };
