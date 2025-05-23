// components/apps/musicPlayer/MusicPlayer.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  List,
  Music,
  Heart,
  HeartOff,
} from "lucide-react";
import { useThemeStore, useAudioStore } from "../../../store";
import { PLAYLIST_DATA } from "../../../constants/musicData";
import GifVisualizer from "./GifVisualizer";
import styles from "./MusicPlayer.module.scss";

const MusicPlayer = () => {
  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);

  // Get music player state from audio store
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const currentTrackIndex = useAudioStore((state) => state.currentTrackIndex);
  const changeTrack = useAudioStore((state) => state.changeTrack);
  const volume = useAudioStore((state) => state.volume);
  const setVolume = useAudioStore((state) => state.setVolume);
  const duration = useAudioStore((state) => state.duration);
  const currentTime = useAudioStore((state) => state.currentTime);
  const seekTo = useAudioStore((state) => state.seekTo);
  const playlist = useAudioStore((state) => state.playlist);
  const setPlaylist = useAudioStore((state) => state.setPlaylist);
  const favorites = useAudioStore((state) => state.favorites);
  const toggleFavorite = useAudioStore((state) => state.toggleFavorite);
  const isFavorite = useAudioStore((state) => state.isFavorite);
  const initAudio = useAudioStore((state) => state.initAudio);

  // Local state
  const [progress, setProgress] = useState(0);
  const [selectedView, setSelectedView] = useState("player"); // 'player' or 'playlist'
  const [previousVolume, setPreviousVolume] = useState(40);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const progressChangeTimeoutRef = useRef(null);

  // For styling the progress input
  const progressStyle = {
    "--progress-percent": `${progress}%`,
  };

  // Initialize audio player when component mounts

  useEffect(() => {
    return () => {
      if (progressChangeTimeoutRef.current) {
        clearTimeout(progressChangeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize audio element
    initAudio();

    // Set playlist if it's empty
    if (playlist.length === 0) {
      setPlaylist(PLAYLIST_DATA);
    }

    // Mark as initialized
    setIsInitialized(true);

    // Cleanup function when component unmounts
    return () => {
      // We don't call cleanup() here because we want to keep playing when minimized
      // The cleanup will be handled by windowsStore when the window is fully closed
    };
  }, [initAudio, setPlaylist, playlist]);

  // Handle first track when play button is pressed
  const handlePlay = () => {
    // If we have a playlist but no track is selected, choose the first one
    if (
      playlist.length > 0 &&
      currentTrackIndex === 0 &&
      currentTime === 0 &&
      !isPlaying
    ) {
      // Ensure the first track is loaded before playing
      changeTrack(0);
      // Wait a tiny bit to ensure track is loaded
      setTimeout(() => {
        togglePlay();
      }, 50);
    } else {
      togglePlay();
    }
  };

  // Update progress only when currentTime changes significantly
  useEffect(() => {
    if (duration > 0) {
      const calculatedProgress = (currentTime / duration) * 100;
      const newProgress = isNaN(calculatedProgress) ? 0 : calculatedProgress;

      // Only update if the change is significant (> 0.5%)
      if (Math.abs(newProgress - progress) > 0.5) {
        setProgress(newProgress);
      }
    } else if (progress !== 0) {
      setProgress(0);
    }
  }, [currentTime, duration]);

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    changeTrack(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex =
      currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    changeTrack(prevIndex);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };
  const handleProgressChange = useCallback(
    (e) => {
      const newProgress = parseFloat(e.target.value);
      setProgress(newProgress);

      // Clear existing timeout
      if (progressChangeTimeoutRef.current) {
        clearTimeout(progressChangeTimeoutRef.current);
      }

      // Debounce the actual seek
      progressChangeTimeoutRef.current = setTimeout(() => {
        const newTime = (newProgress / 100) * duration;
        seekTo(newTime);
      }, 50);
    },
    [duration, seekTo]
  );

  const selectTrack = (index) => {
    changeTrack(index);
  };

  // Format time in minutes:seconds
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Volume icon logic
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  // Mute/unmute toggle function
  const muteVolume = () => {
    if (volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = (trackId) => {
    toggleFavorite(trackId);
  };

  // Current track information
  const currentTrack = useMemo(() => {
    return playlist.length > 0 ? playlist[currentTrackIndex] : null;
  }, [playlist, currentTrackIndex]);

  // Player view
  const renderPlayerView = () => (
    <div className={styles.playerView}>
      {/* GIF Visualizer */}
      <GifVisualizer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        themeConfig={themeConfig}
      />

      {/* Track info */}
      <div className={styles.trackInfo}>
        <h3 className={styles.trackTitle}>
          {currentTrack?.title || "No Track"}
        </h3>
        <p className={styles.trackArtist}>{currentTrack?.artist || ""}</p>
        {currentTrack && (
          <button
            onClick={() => handleToggleFavorite(currentTrack.id)}
            className={styles.favoriteButton}
          >
            {isFavorite(currentTrack.id) ? (
              <Heart
                size={18}
                fill={themeConfig.accentPrimary}
                color={themeConfig.accentPrimary}
              />
            ) : (
              <HeartOff size={18} color={themeConfig.textLight} />
            )}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.progressContainer}>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className={styles.progressInput}
          style={progressStyle}
        />
        <div className={styles.progressTimes}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.controlButton}>
          <SkipBack size={24} />
        </button>

        <button
          onClick={handlePlay}
          className={`${styles.playButton} ${
            isPlaying ? styles.isPlaying : ""
          }`}
        >
          {isPlaying ? (
            <Pause size={24} className={styles.pauseIcon} />
          ) : (
            <Play size={24} className={styles.playIcon} />
          )}
        </button>

        <button onClick={handleNext} className={styles.controlButton}>
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume slider */}
      <div className={styles.volumeContainer}>
        <button className={styles.volumeButton} onClick={muteVolume}>
          {getVolumeIcon()}
        </button>

        <div className={styles.volumeSliderContainer}>
          <div className={styles.volumeTrack}></div>
          <div
            className={styles.volumeProgress}
            style={{ width: `${volume}%` }}
          ></div>
          <div
            className={styles.volumeThumb}
            style={{ left: `calc(${volume}% - 6px)` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeInput}
          />
        </div>
      </div>
    </div>
  );

  // Playlist view
  const renderPlaylistView = () => (
    <div className={styles.playlistView}>
      <div className={styles.playlistHeader}>
        <h3 className={styles.playlistTitle}>TRACKS</h3>
        <div className={styles.playlistCount}>{playlist.length} songs</div>
      </div>

      <div
        className={styles.tracksList}
        style={{ maxHeight: "calc(100% - 80px)" }}
      >
        {playlist.map((track, index) => (
          <div
            key={track.id}
            onClick={() => selectTrack(index)}
            className={`${styles.trackItem} ${
              index === currentTrackIndex ? styles.active : ""
            }`}
          >
            <div
              className={`${styles.trackNumber} ${
                index === currentTrackIndex ? styles.active : ""
              }`}
            >
              {isPlaying && index === currentTrackIndex ? (
                <div className={styles.playingAnimation}>
                  <span className={styles.bar}></span>
                  <span className={styles.bar}></span>
                  <span className={styles.bar}></span>
                </div>
              ) : (
                <span>{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>

            <div className={styles.trackDetails}>
              <div
                className={`${styles.trackItemTitle} ${
                  index === currentTrackIndex ? styles.active : ""
                }`}
              >
                {track.title}
              </div>
              <div className={styles.trackItemArtist}>{track.artist}</div>
            </div>

            <div className={styles.trackActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(track.id);
                }}
                className={styles.trackFavorite}
              >
                {isFavorite(track.id) ? (
                  <Heart
                    size={14}
                    fill={themeConfig.accentPrimary}
                    color={themeConfig.accentPrimary}
                  />
                ) : (
                  <Heart size={14} color={themeConfig.textLight} />
                )}
              </button>

              <div className={styles.trackDuration}>{track.duration}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.playlistFooter}>
        <div className={styles.playlistFooterText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Navigation tabs */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${
            selectedView === "player" ? styles.active : ""
          }`}
          onClick={() => setSelectedView("player")}
        >
          <Music size={16} className={styles.tabIcon} />
          Player
        </button>

        <button
          className={`${styles.tab} ${
            selectedView === "playlist" ? styles.active : ""
          }`}
          onClick={() => setSelectedView("playlist")}
        >
          <List size={16} className={styles.tabIcon} />
          Playlist
        </button>
      </div>

      {/* Content area */}
      <div className={styles.content}>
        {selectedView === "player" ? renderPlayerView() : renderPlaylistView()}
      </div>
    </div>
  );
};

export default MusicPlayer;
