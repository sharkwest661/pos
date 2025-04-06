// store/searchEngineStore.js
import { create } from "zustand";

// Helper to save bookmarks to sessionStorage
const saveBookmarksTosessionStorage = (bookmarks) => {
  try {
    sessionStorage.setItem("search_bookmarks", JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving bookmarks to sessionStorage:", error);
  }
};

// Helper to load bookmarks from sessionStorage
const loadBookmarksFromsessionStorage = () => {
  try {
    const savedBookmarks = sessionStorage.getItem("search_bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch (error) {
    console.error("Error loading bookmarks from sessionStorage:", error);
    return [];
  }
};

// Helper to save browsing state to sessionStorage
const saveBrowsingStateTosessionStorage = (url, showContent) => {
  try {
    sessionStorage.setItem(
      "search_state",
      JSON.stringify({ url, showContent })
    );
  } catch (error) {
    console.error("Error saving browsing state to sessionStorage:", error);
  }
};

// Helper to load browsing state from sessionStorage
const loadBrowsingStateFromsessionStorage = () => {
  try {
    const savedState = sessionStorage.getItem("search_state");
    return savedState
      ? JSON.parse(savedState)
      : { url: null, showContent: false };
  } catch (error) {
    console.error("Error loading browsing state from sessionStorage:", error);
    return { url: null, showContent: false };
  }
};

// Helper to save search history to sessionStorage
const saveHistoryTosessionStorage = (history) => {
  try {
    sessionStorage.setItem("search_history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving search history to sessionStorage:", error);
  }
};

// Helper to load search history from sessionStorage
const loadHistoryFromsessionStorage = () => {
  try {
    const savedHistory = sessionStorage.getItem("search_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Error loading search history from sessionStorage:", error);
    return [];
  }
};

const useSearchEngineStore = create((set, get) => {
  // Initialize from sessionStorage
  const initialBookmarks = loadBookmarksFromsessionStorage();
  const initialBrowsingState = loadBrowsingStateFromsessionStorage();
  const initialHistory = loadHistoryFromsessionStorage();

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
        saveBookmarksTosessionStorage(updatedBookmarks);
        set({ bookmarks: updatedBookmarks });
        return true;
      }
      return false;
    },

    removeBookmark: (url) => {
      const updatedBookmarks = get().bookmarks.filter(
        (bookmark) => bookmark.url !== url
      );
      saveBookmarksTosessionStorage(updatedBookmarks);
      set({ bookmarks: updatedBookmarks });
    },

    isBookmarked: (url) => {
      return get().bookmarks.some((bookmark) => bookmark.url === url);
    },

    setBrowsingState: (url, showContent) => {
      saveBrowsingStateTosessionStorage(url, showContent);
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
        saveHistoryTosessionStorage(updatedHistory);
        set({ searchHistory: updatedHistory });
      }
    },

    clearHistory: () => {
      saveHistoryTosessionStorage([]);
      set({ searchHistory: [] });
    },
  };
});

export { useSearchEngineStore };
