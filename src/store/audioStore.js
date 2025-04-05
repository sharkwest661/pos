// store/audioStore.js
import { create } from "zustand";
import { PLAYLIST_DATA } from "../constants/musicData";

// Audio store to manage audio playback
const useAudioStore = create((set, get) => ({
  // Audio control state
  isPlaying: false,
  currentTrackIndex: 0,
  volume: 30,
  duration: 0,
  currentTime: 0,

  // Favorites - stored in memory only, not persisted
  favorites: [],

  // Audio element reference
  audioElement: null,

  // Playlist data
  playlist: [],

  // Initialize audio (this will be called once from App.jsx)
  initAudio: () => {
    // Create audio element if it doesn't exist
    if (!get().audioElement) {
      const audio = new Audio();

      // Set initial volume
      audio.volume = get().volume / 100;

      // Set up event listeners
      audio.addEventListener("timeupdate", () => {
        set({ currentTime: audio.currentTime });
      });

      audio.addEventListener("durationchange", () => {
        set({ duration: audio.duration || 0 });
      });

      audio.addEventListener("ended", () => {
        // Auto play next track
        const nextIndex = (get().currentTrackIndex + 1) % get().playlist.length;
        get().changeTrack(nextIndex);
      });

      // Store in state
      set({ audioElement: audio });

      // Load initial playlist if empty
      if (get().playlist.length === 0) {
        get().setPlaylist(PLAYLIST_DATA);
      } else {
        // Ensure current track is loaded
        const currentIndex = get().currentTrackIndex;
        const currentPlaylist = get().playlist;
        if (currentPlaylist.length > currentIndex) {
          audio.src = currentPlaylist[currentIndex].file;
          audio.load();
        }
      }
    }
  },

  // Set playlist
  setPlaylist: (playlist) => {
    set({ playlist });

    // Load first track if nothing is loaded
    const audioElement = get().audioElement;
    if (audioElement && playlist.length > 0) {
      // Always load the first track when setting playlist
      audioElement.src = playlist[0].file;
      audioElement.load();
    }
  },

  // Play/pause toggle
  togglePlay: () => {
    const { isPlaying, audioElement, playlist, currentTrackIndex } = get();

    if (!audioElement) return;

    // If there's no source set but we have a playlist, set the source
    if (!audioElement.src && playlist.length > 0) {
      audioElement.src = playlist[currentTrackIndex].file;
      audioElement.load();
    }

    if (isPlaying) {
      audioElement.pause();
      set({ isPlaying: false });
    } else {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            set({ isPlaying: true });
          })
          .catch((error) => {
            console.warn("Error playing audio:", error);
            set({ isPlaying: false });
          });
      }
    }
  },

  // Change track
  changeTrack: (index) => {
    const { audioElement, playlist, isPlaying } = get();

    if (!audioElement || !playlist.length || index >= playlist.length) return;

    const wasPlaying = isPlaying;

    // Pause current playback
    if (wasPlaying) {
      audioElement.pause();
    }

    // Update track
    audioElement.src = playlist[index].file;
    audioElement.load();
    set({ currentTrackIndex: index });

    // Resume playback if it was playing
    if (wasPlaying) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Error playing new track:", error);
          set({ isPlaying: false });
        });
      }
    }
  },

  // Set volume
  setVolume: (newVolume) => {
    if (get().audioElement) {
      get().audioElement.volume = newVolume / 100;
    }
    set({ volume: newVolume });
  },

  // Seek to position
  seekTo: (time) => {
    if (get().audioElement) {
      get().audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  // Toggle favorite status for a track
  toggleFavorite: (trackId) => {
    const favorites = get().favorites;
    let updatedFavorites;

    if (favorites.includes(trackId)) {
      // Remove from favorites
      updatedFavorites = favorites.filter((id) => id !== trackId);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, trackId];
    }

    // Update state only (no localStorage)
    set({ favorites: updatedFavorites });

    // Return the new favorite status
    return !favorites.includes(trackId);
  },

  // Check if a track is favorited
  isFavorite: (trackId) => {
    return get().favorites.includes(trackId);
  },

  // Clean up
  cleanup: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      // Remove event listeners
      audioElement.removeEventListener("timeupdate", () => {});
      audioElement.removeEventListener("durationchange", () => {});
      audioElement.removeEventListener("ended", () => {});
    }
    // Reset all state to initial values
    set({
      audioElement: null,
      isPlaying: false,
      currentTrackIndex: 0,
      currentTime: 0,
      duration: 0,
      favorites: [], // Clear favorites when app is closed
    });
  },
}));

export { useAudioStore };
