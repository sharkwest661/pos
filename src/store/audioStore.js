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

  // Initialize audio (this will be called once from App.jsx)
  initAudio: () => {
    // Create audio element if it doesn't exist
    if (!get().audioElement) {
      const audio = new Audio();

      // Set initial volume
      audio.volume = get().volume / 100;

      // Store references to event handlers so they can be properly removed
      const timeUpdateHandler = () => {
        // Use requestAnimationFrame to optimize UI updates
        if (!get().isUpdatingUI) {
          set({ isUpdatingUI: true });
          requestAnimationFrame(() => {
            set({
              currentTime: audio.currentTime,
              isUpdatingUI: false,
            });
          });
        }
      };

      const durationChangeHandler = () => {
        set({ duration: audio.duration || 0 });
      };

      const endedHandler = () => {
        // Auto play next track
        const nextIndex = (get().currentTrackIndex + 1) % get().playlist.length;
        get().changeTrack(nextIndex);
      };

      // Store event handlers for proper cleanup later
      set({
        audioEventHandlers: {
          timeUpdate: timeUpdateHandler,
          durationChange: durationChangeHandler,
          ended: endedHandler,
        },
      });

      // Add event listeners with stored handlers
      audio.addEventListener("timeupdate", timeUpdateHandler);
      audio.addEventListener("durationchange", durationChangeHandler);
      audio.addEventListener("ended", endedHandler);

      // Store in state
      set({
        audioElement: audio,
        isUpdatingUI: false,
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

  initWebAudio: async (audioUrl) => {
    try {
      // Create audio context if it doesn't exist
      let audioContext = get().audioContext;
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        set({ audioContext });
      }

      // Fetch audio data
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Clean up previous source if exists
      if (get().audioSource) {
        get().audioSource.disconnect();
      }

      // Create new source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      // Store references
      set({
        audioBuffer,
        audioSource: source,
      });

      return source;
    } catch (error) {
      console.error("Error initializing Web Audio:", error);
      return null;
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

    // Update state only (no sessionStorage)
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
    const { audioElement, audioEventHandlers } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";

      // Properly remove event listeners using stored handlers
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
    }

    // Reset all state to initial values
    set({
      audioElement: null,
      audioEventHandlers: null,
      isPlaying: false,
      currentTrackIndex: 0,
      currentTime: 0,
      duration: 0,
      favorites: [],
      isUpdatingUI: false,
    });
  },
}));

export { useAudioStore };
