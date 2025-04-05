// store/notepadStore.js
import { create } from "zustand";

// Helper to generate unique IDs
const generateId = () =>
  `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Helper to save notes to localStorage
const saveNotesToLocalStorage = (notes) => {
  try {
    localStorage.setItem("shadow_market_notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
  }
};

// Helper to load notes from localStorage
const loadNotesFromLocalStorage = () => {
  try {
    const savedNotes = localStorage.getItem("shadow_market_notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
  } catch (error) {
    console.error("Error loading notes from localStorage:", error);
  }

  // Return default notes if nothing is saved
  return [
    {
      id: "note-welcome",
      title: "Welcome to Digital Sleuth",
      content:
        "This notepad is where you can keep track of your investigation. Use it to record your thoughts, theories, and evidence connections.\n\nAs you discover information about the Shadow Market and its vendors, you can organize your findings here.",
      created: new Date(),
      lastModified: new Date(),
    },
  ];
};

const useNotepadStore = create((set, get) => ({
  // List of all notes
  notes: loadNotesFromLocalStorage(),

  // ID of the currently active note
  activeNoteId: null,

  // Create a new note
  createNote: () => {
    const newNote = {
      id: generateId(),
      title: "",
      content: "",
      created: new Date(),
      lastModified: new Date(),
    };

    set((state) => {
      const updatedNotes = [newNote, ...state.notes];
      saveNotesToLocalStorage(updatedNotes);
      return { notes: updatedNotes, activeNoteId: newNote.id };
    });

    return newNote;
  },

  // Update an existing note
  updateNote: (id, updates) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      );
      saveNotesToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  // Delete a note
  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveNotesToLocalStorage(updatedNotes);

      // Set next active note if deleting the active one
      let newActiveId = state.activeNoteId;
      if (state.activeNoteId === id) {
        newActiveId = updatedNotes.length > 0 ? updatedNotes[0].id : null;
      }

      return {
        notes: updatedNotes,
        activeNoteId: newActiveId,
      };
    });
  },

  // Set the active note
  setActiveNote: (id) => {
    set({ activeNoteId: id });
  },

  // Import notes (for game state loading)
  importNotes: (notes) => {
    saveNotesToLocalStorage(notes);
    set({
      notes,
      activeNoteId: notes.length > 0 ? notes[0].id : null,
    });
  },

  // Clear all notes
  clearNotes: () => {
    const emptyNotes = [];
    saveNotesToLocalStorage(emptyNotes);
    set({ notes: emptyNotes, activeNoteId: null });
  },
}));

export { useNotepadStore };
