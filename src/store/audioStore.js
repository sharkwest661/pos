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
  audioBuffer: null,
  audioContext: null,
  audioSource: null,

  // Favorites - stored in memory only, not persisted
  favorites: [],

  // Audio element reference
  audioElement: null,

  // Playlist data
  playlist: [],

  // Animation frame reference for cleanup
  animationFrameId: null,

  // Last update time to throttle updates
  lastUpdateTime: 0,

  // Initialize audio (this will be called once from App.jsx)
  initAudio: () => {
    // Create audio element if it doesn't exist
    if (!get().audioElement) {
      const audio = new Audio();

      // Set initial volume
      audio.volume = get().volume / 100;

      // Throttled time update handler
      const timeUpdateHandler = () => {
        const now = Date.now();
        const lastUpdate = get().lastUpdateTime;

        // Throttle updates to once every 250ms
        if (now - lastUpdate < 250) return;

        set({
          currentTime: audio.currentTime,
          lastUpdateTime: now,
        });
      };

      const durationChangeHandler = () => {
        set({ duration: audio.duration || 0 });
      };

      const endedHandler = () => {
        // Auto play next track
        const nextIndex = (get().currentTrackIndex + 1) % get().playlist.length;
        get().changeTrack(nextIndex);
      };

      // Add event listeners
      audio.addEventListener("timeupdate", timeUpdateHandler);
      audio.addEventListener("durationchange", durationChangeHandler);
      audio.addEventListener("ended", endedHandler);

      // Store references for cleanup
      set({
        audioElement: audio,
        audioEventHandlers: {
          timeUpdate: timeUpdateHandler,
          durationChange: durationChangeHandler,
          ended: endedHandler,
        },
      });

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

    // Clear any buffered data
    audioElement.src = "";
    audioElement.load();

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
      // Update time and reset the throttle timer
      set({
        currentTime: time,
        lastUpdateTime: Date.now(),
      });
    }
  },

  // Toggle favorite status for a track
  toggleFavorite: (trackId) => {
    const favorites = get().favorites;
    let updatedFavorites;

    if (favorites.includes(trackId)) {
      updatedFavorites = favorites.filter((id) => id !== trackId);
    } else {
      updatedFavorites = [...favorites, trackId];
    }

    set({ favorites: updatedFavorites });
    return !favorites.includes(trackId);
  },

  // Check if a track is favorited
  isFavorite: (trackId) => {
    return get().favorites.includes(trackId);
  },

  // Clean up
  cleanup: () => {
    const { audioElement, audioEventHandlers, animationFrameId } = get();

    // Cancel any pending animation frames
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    if (audioElement) {
      // Pause and reset
      audioElement.pause();
      audioElement.currentTime = 0;

      // Remove event listeners
      if (audioEventHandlers) {
        audioElement.removeEventListener(
          "timeupdate",
          audioEventHandlers.timeUpdate
        );
        audioElement.removeEventListener(
          "durationchange",
          audioEventHandlers.durationChange
        );
        audioElement.removeEventListener("ended", audioEventHandlers.ended);
      }

      // Clear source to release memory
      audioElement.src = "";
      audioElement.load();
    }

    // Clean up audio context if it exists
    const audioContext = get().audioContext;
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close();
    }

    // Reset all state
    set({
      audioElement: null,
      audioEventHandlers: null,
      isPlaying: false,
      currentTrackIndex: 0,
      currentTime: 0,
      duration: 0,
      favorites: [],
      audioContext: null,
      audioSource: null,
      audioBuffer: null,
      animationFrameId: null,
      lastUpdateTime: 0,
    });
  },
}));

export { useAudioStore };
