// components/apps/searchEngine/SearchEngine.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  History,
  Bookmark,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useThemeStore, useSearchEngineStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import WebContent from "./WebContent";
import styles from "./SearchEngine.module.scss";
import { WEB_CONTENT } from "../../../data/webContent";

// Common search terms relevant to the investigation
const SUGGESTED_SEARCHES = [
  "shadow market",
  "alex karimov",
  "leyla mahmudova",
  "ibrahim nasirov",
  "cyberpunk",
  "venom",
  "prometheus",
  "ghost doc",
  "fire",
];

// Helper to build search results from web content
const buildSearchResults = (query) => {
  const results = [];

  // Convert query to lowercase for case-insensitive search
  const lowercaseQuery = query.toLowerCase();

  // Search through all web content
  for (const url in WEB_CONTENT) {
    const page = WEB_CONTENT[url];

    // Check title
    const titleMatch = page.title.toLowerCase().includes(lowercaseQuery);

    // Check content paragraphs
    let contentMatch = false;
    for (const section of page.content) {
      for (const paragraph of section.paragraphs) {
        if (paragraph.toLowerCase().includes(lowercaseQuery)) {
          contentMatch = true;
          break;
        }
      }
      if (contentMatch) break;
    }

    // If we have a match, add to results
    if (titleMatch || contentMatch) {
      // Extract a snippet that contains the search term
      let snippet = "";
      if (contentMatch) {
        // Find a paragraph containing the query
        for (const section of page.content) {
          for (const paragraph of section.paragraphs) {
            if (paragraph.toLowerCase().includes(lowercaseQuery)) {
              // Get context around the matching term
              const index = paragraph.toLowerCase().indexOf(lowercaseQuery);
              const start = Math.max(0, index - 40);
              const end = Math.min(
                paragraph.length,
                index + lowercaseQuery.length + 80
              );
              snippet = "..." + paragraph.substring(start, end) + "...";
              break;
            }
          }
          if (snippet) break;
        }
      }

      // Use first paragraph as fallback snippet
      if (
        !snippet &&
        page.content.length > 0 &&
        page.content[0].paragraphs.length > 0
      ) {
        const firstParagraph = page.content[0].paragraphs[0];
        snippet =
          firstParagraph.substring(0, Math.min(120, firstParagraph.length)) +
          "...";
      }

      results.push({
        title: page.title,
        url: url,
        snippet: snippet,
        date: page.date,
        source: page.source,
      });
    }
  }

  return results;
};

const SearchEngine = () => {
  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Get search engine state from store
  const bookmarks = useSearchEngineStore((state) => state.bookmarks);
  const addBookmark = useSearchEngineStore((state) => state.addBookmark);
  const removeBookmark = useSearchEngineStore((state) => state.removeBookmark);
  const isBookmarked = useSearchEngineStore((state) => state.isBookmarked);
  const currentUrl = useSearchEngineStore((state) => state.currentUrl);
  const showWebContent = useSearchEngineStore((state) => state.showWebContent);
  const setBrowsingState = useSearchEngineStore(
    (state) => state.setBrowsingState
  );
  const searchHistory = useSearchEngineStore((state) => state.searchHistory);
  const addToHistory = useSearchEngineStore((state) => state.addToHistory);

  // Local state (for UI and transient state)
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setResults([]);
    setNoResults(false);
    setShowError(false);
    setBrowsingState(null, false); // Hide web content

    // Add to search history
    addToHistory(searchQuery);

    // Simulate network delay
    setTimeout(() => {
      // Search using our helper function
      const foundResults = buildSearchResults(searchQuery);

      if (foundResults.length > 0) {
        setResults(foundResults);
      } else {
        setNoResults(true);
      }

      setIsSearching(false);
    }, 1200); // Search delay for realism
  };

  // Handle input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update suggestions
    if (value.trim()) {
      const lowercaseValue = value.toLowerCase();
      const filtered = SUGGESTED_SEARCHES.filter((term) =>
        term.toLowerCase().includes(lowercaseValue)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    // Auto-search the suggestion
    setIsSearching(true);
    setResults([]);
    setNoResults(false);
    setShowError(false);
    setBrowsingState(null, false); // Hide web content

    // Add to search history
    addToHistory(suggestion);

    // Simulate network delay
    setTimeout(() => {
      const foundResults = buildSearchResults(suggestion);

      if (foundResults.length > 0) {
        setResults(foundResults);
      } else {
        setNoResults(true);
      }
      setIsSearching(false);
    }, 1200);
  };

  // Handle history click
  const handleHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    // Auto-search
    setIsSearching(true);
    setResults([]);
    setNoResults(false);
    setShowError(false);
    setBrowsingState(null, false); // Hide web content

    // Simulate network delay
    setTimeout(() => {
      const foundResults = buildSearchResults(historyItem);

      if (foundResults.length > 0) {
        setResults(foundResults);
      } else {
        setNoResults(true);
      }
      setIsSearching(false);
    }, 1200);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setNoResults(false);
    setSuggestions([]);
    setShowError(false);
  };

  // Handle result click - show web content
  const handleResultClick = (url) => {
    setBrowsingState(url, true);

    // Add to visit history
    if (!visitHistory.includes(url)) {
      setVisitHistory([...visitHistory, url]);
      setCurrentHistoryIndex(visitHistory.length);
    }
  };

  // Handle web content navigation
  const handleWebContentNavigate = (url) => {
    setBrowsingState(url, true);
  };

  // Handle web content close
  const handleWebContentClose = () => {
    setBrowsingState(currentUrl, false);
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (url, title) => {
    if (isBookmarked(url)) {
      removeBookmark(url);
      return false;
    } else {
      addBookmark(url, title);
      return true;
    }
  };

  // Effect to simulate some network issues occasionally
  useEffect(() => {
    if (isSearching) {
      const shouldShowError = Math.random() < 0.05; // 5% chance of error
      if (shouldShowError) {
        const timer = setTimeout(() => {
          setIsSearching(false);
          setShowError(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isSearching]);

  return (
    <div className={styles.container}>
      {showWebContent ? (
        <WebContent
          url={currentUrl}
          onClose={handleWebContentClose}
          onNavigate={handleWebContentNavigate}
          onBookmark={handleToggleBookmark}
          isBookmarked={isBookmarked(currentUrl)}
        />
      ) : (
        <>
          <header className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoText}>NEXA</span>
              <span className={styles.logoSecondary}>FIND</span>
            </div>

            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                  placeholder="Search the web..."
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClearSearch}
                  >
                    ×
                  </button>
                )}
                <button type="submit" className={styles.searchButton}>
                  {isSearching ? (
                    <RefreshCw size={18} className={styles.loadingIcon} />
                  ) : (
                    <Search size={18} />
                  )}
                </button>

                {/* Search suggestions */}
                {suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Search size={14} />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </header>

          <div className={styles.contentContainer}>
            <aside className={styles.sidebar}>
              <div className={styles.historySection}>
                <div className={styles.sectionHeader}>
                  <History size={16} />
                  <span>Search History</span>
                </div>
                {searchHistory.length > 0 ? (
                  <ul className={styles.historyList}>
                    {searchHistory.map((item, index) => (
                      <li
                        key={index}
                        className={styles.historyItem}
                        onClick={() => handleHistoryClick(item)}
                      >
                        <Search size={14} className={styles.historyIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyHistory}>No search history</div>
                )}
              </div>

              <div className={styles.bookmarksSection}>
                <div className={styles.sectionHeader}>
                  <Bookmark size={16} />
                  <span>Bookmarks</span>
                </div>
                <ul className={styles.bookmarksList}>
                  {bookmarks.length > 0 ? (
                    bookmarks.map((bookmark, index) => (
                      <li
                        key={index}
                        className={styles.bookmarkItem}
                        onClick={() => handleResultClick(bookmark.url)}
                      >
                        <span>{bookmark.title}</span>
                        <ChevronRight
                          size={14}
                          className={styles.bookmarkIcon}
                        />
                      </li>
                    ))
                  ) : (
                    <div className={styles.emptyHistory}>No bookmarks</div>
                  )}
                </ul>
              </div>

              <div className={styles.bookmarksSection}>
                <div className={styles.sectionHeader}>
                  <Search size={16} />
                  <span>Suggested Searches</span>
                </div>
                <ul className={styles.bookmarksList}>
                  {SUGGESTED_SEARCHES.slice(0, 6).map((term, index) => (
                    <li
                      key={index}
                      className={styles.bookmarkItem}
                      onClick={() => handleSuggestionClick(term)}
                    >
                      <span>{term}</span>
                      <ChevronRight size={14} className={styles.bookmarkIcon} />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <main className={styles.resultsContainer}>
              {isSearching ? (
                <div className={styles.loadingState}>
                  <RefreshCw size={30} className={styles.loadingIcon} />
                  <div className={styles.loadingText}>Searching the web...</div>
                </div>
              ) : showError ? (
                <div className={styles.errorState}>
                  <AlertTriangle size={30} className={styles.errorIcon} />
                  <div className={styles.errorTitle}>Connection Error</div>
                  <div className={styles.errorMessage}>
                    Unable to connect to search servers. Please check your
                    connection and try again.
                  </div>
                  <button className={styles.retryButton} onClick={handleSearch}>
                    Retry Search
                  </button>
                </div>
              ) : noResults ? (
                <div className={styles.noResultsState}>
                  <div className={styles.noResultsTitle}>No results found</div>
                  <div className={styles.noResultsMessage}>
                    Your search - <strong>{searchQuery}</strong> - did not match
                    any documents.
                  </div>
                  <div className={styles.noResultsSuggestions}>
                    Suggestions:
                    <ul>
                      <li>Make sure all words are spelled correctly.</li>
                      <li>Try different keywords.</li>
                      <li>Try more general keywords.</li>
                    </ul>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className={styles.searchResults}>
                  <div className={styles.resultsInfo}>
                    Found {results.length} results for "{searchQuery}"
                  </div>

                  <div className={styles.resultsList}>
                    {results.map((result, index) => (
                      <div key={index} className={styles.resultItem}>
                        <a
                          href="#"
                          className={styles.resultTitle}
                          onClick={(e) => {
                            e.preventDefault();
                            handleResultClick(result.url);
                          }}
                        >
                          {result.title}
                        </a>
                        <div className={styles.resultMeta}>
                          <div className={styles.resultUrl}>{result.url}</div>
                          <div className={styles.resultSource}>
                            {result.source} · {result.date}
                          </div>
                        </div>
                        <div className={styles.resultSnippet}>
                          {result.snippet}
                        </div>
                        <div className={styles.resultActions}>
                          <a
                            href="#"
                            className={styles.resultLink}
                            onClick={(e) => {
                              e.preventDefault();
                              handleResultClick(result.url);
                            }}
                          >
                            <ExternalLink size={14} />
                            Visit Page
                          </a>
                          <a
                            href="#"
                            className={styles.resultLink}
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleBookmark(result.url, result.title);
                            }}
                          >
                            <Bookmark size={14} />
                            {isBookmarked(result.url)
                              ? "Bookmarked"
                              : "Bookmark"}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.initialState}>
                  <div className={styles.initialStateContent}>
                    <div className={styles.searchLogo}>
                      <span className={styles.initialLogoText}>NEXA</span>
                      <span className={styles.initialLogoSecondary}>FIND</span>
                    </div>
                    <div className={styles.initialMessage}>
                      Search for information about people, events, or topics.
                    </div>
                    <div className={styles.popularSearches}>
                      <div className={styles.popularSearchesTitle}>
                        Popular Searches:
                      </div>
                      <div className={styles.popularSearchTags}>
                        {SUGGESTED_SEARCHES.slice(0, 5).map((term, index) => (
                          <div
                            key={index}
                            className={styles.searchTag}
                            onClick={() => handleSuggestionClick(term)}
                          >
                            {term}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* Apply scanline effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.2} />}
    </div>
  );
};

export default SearchEngine;
