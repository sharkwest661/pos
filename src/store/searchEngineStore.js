// store/searchEngineStore.js
import { create } from "zustand";

// Helper to save bookmarks to localStorage
const saveBookmarksToLocalStorage = (bookmarks) => {
  try {
    localStorage.setItem("search_bookmarks", JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving bookmarks to localStorage:", error);
  }
};

// Helper to load bookmarks from localStorage
const loadBookmarksFromLocalStorage = () => {
  try {
    const savedBookmarks = localStorage.getItem("search_bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch (error) {
    console.error("Error loading bookmarks from localStorage:", error);
    return [];
  }
};

// Helper to save browsing state to localStorage
const saveBrowsingStateToLocalStorage = (url, showContent) => {
  try {
    localStorage.setItem("search_state", JSON.stringify({ url, showContent }));
  } catch (error) {
    console.error("Error saving browsing state to localStorage:", error);
  }
};

// Helper to load browsing state from localStorage
const loadBrowsingStateFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem("search_state");
    return savedState
      ? JSON.parse(savedState)
      : { url: null, showContent: false };
  } catch (error) {
    console.error("Error loading browsing state from localStorage:", error);
    return { url: null, showContent: false };
  }
};

// Helper to save search history to localStorage
const saveHistoryToLocalStorage = (history) => {
  try {
    localStorage.setItem("search_history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving search history to localStorage:", error);
  }
};

// Helper to load search history from localStorage
const loadHistoryFromLocalStorage = () => {
  try {
    const savedHistory = localStorage.getItem("search_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Error loading search history from localStorage:", error);
    return [];
  }
};

const useSearchEngineStore = create((set, get) => {
  // Initialize from localStorage
  const initialBookmarks = loadBookmarksFromLocalStorage();
  const initialBrowsingState = loadBrowsingStateFromLocalStorage();
  const initialHistory = loadHistoryFromLocalStorage();

  return {
    // Bookmarks
    bookmarks: initialBookmarks,

    // Current URL and web content visibility
    currentUrl: initialBrowsingState.url,
    showWebContent: initialBrowsingState.showContent,

    // Search history
    searchHistory: initialHistory,

    // Methods to manipulate state
    addBookmark: (url, title) => {
      // Check if already bookmarked
      const isBookmarked = get().bookmarks.some(
        (bookmark) => bookmark.url === url
      );

      if (!isBookmarked) {
        const updatedBookmarks = [...get().bookmarks, { url, title }];
        saveBookmarksToLocalStorage(updatedBookmarks);
        set({ bookmarks: updatedBookmarks });
        return true;
      }
      return false;
    },

    removeBookmark: (url) => {
      const updatedBookmarks = get().bookmarks.filter(
        (bookmark) => bookmark.url !== url
      );
      saveBookmarksToLocalStorage(updatedBookmarks);
      set({ bookmarks: updatedBookmarks });
    },

    isBookmarked: (url) => {
      return get().bookmarks.some((bookmark) => bookmark.url === url);
    },

    setBrowsingState: (url, showContent) => {
      saveBrowsingStateToLocalStorage(url, showContent);
      set({ currentUrl: url, showWebContent: showContent });
    },

    addToHistory: (query) => {
      const lowerQuery = query.toLowerCase();
      // Don't add duplicates
      if (!get().searchHistory.includes(lowerQuery)) {
        const updatedHistory = [lowerQuery, ...get().searchHistory].slice(
          0,
          10
        );
        saveHistoryToLocalStorage(updatedHistory);
        set({ searchHistory: updatedHistory });
      }
    },

    clearHistory: () => {
      saveHistoryToLocalStorage([]);
      set({ searchHistory: [] });
    },
  };
});

export { useSearchEngineStore };
