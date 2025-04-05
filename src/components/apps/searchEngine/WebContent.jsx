// components/apps/searchEngine/WebContent.jsx
// This component displays a text-only version of web content
// It's designed for the cyberpunk aesthetic with minimal visuals
import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Globe,
  Search,
} from "lucide-react";
import { useThemeStore, useSearchEngineStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import { WEB_CONTENT } from "../../../data/webContent";
import styles from "./WebContent.module.scss";

// Mock web content data - in a real app, this would come from a store or API

const WebContent = ({ url, onClose, onNavigate, onBookmark }) => {
  // Error checking for invalid URL
  if (!url) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigationControls}>
            <button className={styles.navButton} disabled>
              <ChevronLeft size={18} />
            </button>
            <button className={styles.navButton} disabled>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.urlBar}>
            <Globe size={14} className={styles.urlIcon} />
            <span className={styles.urlText}>No URL specified</span>
          </div>

          <div className={styles.headerControls}>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={styles.errorContainer}>
          <AlertTriangle size={30} className={styles.errorIcon} />
          <div className={styles.errorText}>
            No URL specified. Please select a search result to view content.
          </div>
        </div>
      </div>
    );
  }

  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Get bookmark status from store
  const isBookmarked = useSearchEngineStore((state) => state.isBookmarked(url));

  // Local state
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Load content when URL changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    const timer = setTimeout(() => {
      try {
        // Try to find this URL in our mock content
        if (WEB_CONTENT[url]) {
          setContent(WEB_CONTENT[url]);

          // Add to history if this is a new navigation
          if (!visitHistory.includes(url)) {
            setVisitHistory((prev) => [...prev, url]);
            setCurrentHistoryIndex(visitHistory.length);
          }
        } else {
          setError(
            "Content not found. The page might be unavailable or restricted."
          );
        }
      } catch (err) {
        setError("Error loading content: " + err.message);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [url]);

  // Toggle bookmark
  const handleToggleBookmark = () => {
    onBookmark(url, content?.title || "Untitled Page");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      if (onNavigate) {
        onNavigate(visitHistory[newIndex]);
      }
    }
  };

  // Handle forward navigation
  const handleForward = () => {
    if (currentHistoryIndex < visitHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      if (onNavigate) {
        onNavigate(visitHistory[newIndex]);
      }
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString; // Return as is if invalid
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigationControls}>
            <button
              className={styles.navButton}
              onClick={handleBack}
              disabled={currentHistoryIndex <= 0}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={styles.navButton}
              onClick={handleForward}
              disabled={currentHistoryIndex >= visitHistory.length - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.urlBar}>
            <Globe size={14} className={styles.urlIcon} />
            <span className={styles.urlText}>{url}</span>
          </div>

          <div className={styles.headerControls}>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAnimation}>
            <div className={styles.loadingBar}></div>
          </div>
          <div className={styles.loadingText}>Loading content...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigationControls}>
            <button
              className={styles.navButton}
              onClick={handleBack}
              disabled={currentHistoryIndex <= 0}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={styles.navButton}
              onClick={handleForward}
              disabled={currentHistoryIndex >= visitHistory.length - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.urlBar}>
            <Globe size={14} className={styles.urlIcon} />
            <span className={styles.urlText}>{url}</span>
          </div>

          <div className={styles.headerControls}>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={styles.errorContainer}>
          <AlertTriangle size={30} className={styles.errorIcon} />
          <div className={styles.errorText}>{error}</div>
        </div>
      </div>
    );
  }

  // If no content, show empty state
  if (!content) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigationControls}>
            <button
              className={styles.navButton}
              onClick={handleBack}
              disabled={currentHistoryIndex <= 0}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={styles.navButton}
              onClick={handleForward}
              disabled={currentHistoryIndex >= visitHistory.length - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.urlBar}>
            <Globe size={14} className={styles.urlIcon} />
            <span className={styles.urlText}>{url}</span>
          </div>

          <div className={styles.headerControls}>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyText}>No content available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header with navigation */}
      <div className={styles.header}>
        <div className={styles.navigationControls}>
          <button
            className={styles.navButton}
            onClick={handleBack}
            disabled={currentHistoryIndex <= 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className={styles.navButton}
            onClick={handleForward}
            disabled={currentHistoryIndex >= visitHistory.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className={styles.urlBar}>
          <Globe size={14} className={styles.urlIcon} />
          <span className={styles.urlText}>{url}</span>
        </div>

        <div className={styles.headerControls}>
          <button
            className={styles.bookmarkButton}
            onClick={handleToggleBookmark}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkPlus
              size={18}
              className={isBookmarked ? styles.bookmarkedIcon : ""}
            />
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Page title */}
        <h1 className={styles.title}>{content.title}</h1>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.source}>
            <span className={styles.sourceLabel}>Source:</span> {content.source}
          </div>
          <div className={styles.date}>
            <Clock size={14} className={styles.dateIcon} />
            {formatDate(content.date)}
          </div>
        </div>

        {/* Content sections */}
        <div className={styles.textContent}>
          {content.content.map((section, index) => (
            <div key={index} className={styles.section}>
              {section.heading && (
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
              )}
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Related Pages - Just showing other available pages for simplicity */}
        <div className={styles.relatedPages}>
          <h3 className={styles.relatedPagesHeading}>Related Pages</h3>
          <div className={styles.relatedList}>
            {Object.keys(WEB_CONTENT)
              .filter((pageUrl) => pageUrl !== url)
              .slice(0, 3)
              .map((pageUrl, index) => {
                const pageInfo = WEB_CONTENT[pageUrl];
                if (!pageInfo) return null;

                return (
                  <div
                    key={index}
                    className={styles.relatedItem}
                    onClick={() => onNavigate && onNavigate(pageUrl)}
                  >
                    <div className={styles.relatedTitle}>{pageInfo.title}</div>
                    <div className={styles.relatedSource}>
                      {pageInfo.source}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Apply scanline effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default WebContent;
