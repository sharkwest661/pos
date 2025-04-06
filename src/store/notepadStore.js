// store/notepadStore.js
import { create } from "zustand";

// Helper to generate unique IDs
const generateId = () =>
  `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Helper to save notes to sessionStorage
const saveNotesTosessionStorage = (notes) => {
  try {
    sessionStorage.setItem("shadow_market_notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to sessionStorage:", error);
  }
};

// Helper to load notes from sessionStorage
const loadNotesFromsessionStorage = () => {
  try {
    const savedNotes = sessionStorage.getItem("shadow_market_notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
  } catch (error) {
    console.error("Error loading notes from sessionStorage:", error);
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
  notes: loadNotesFromsessionStorage(),

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
      saveNotesTosessionStorage(updatedNotes);
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
      saveNotesTosessionStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  // Delete a note
  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveNotesTosessionStorage(updatedNotes);

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
    saveNotesTosessionStorage(notes);
    set({
      notes,
      activeNoteId: notes.length > 0 ? notes[0].id : null,
    });
  },

  // Clear all notes
  clearNotes: () => {
    const emptyNotes = [];
    saveNotesTosessionStorage(emptyNotes);
    set({ notes: emptyNotes, activeNoteId: null });
  },
}));

export { useNotepadStore };
