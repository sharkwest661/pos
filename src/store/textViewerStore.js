import { create } from "zustand";
import { DOCUMENTS } from "../data/documents";

// Create a modified version of the TextViewerStore that uses the updated files
const useTextViewerStore = create((set, get) => ({
  // List of available files with updated README
  files: DOCUMENTS,

  // Currently open file
  currentFile: null,

  // Open a specific file by ID
  openFile: (fileId) => {
    const { files } = get();
    const fileToOpen = files[fileId];

    if (fileToOpen) {
      set({ currentFile: fileToOpen });
      return true;
    }

    return false;
  },

  // Add a new file to the store
  addFile: (file) => {
    set((state) => ({
      files: {
        ...state.files,
        [file.id]: file,
      },
    }));
  },

  // Close the current file
  closeFile: () => {
    set({ currentFile: null });
  },
}));

export { useTextViewerStore };
