// store/notesStore.js
import { create } from "zustand";

// Helper to generate unique IDs
const generateId = () =>
  `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Helper to save notes to sessionStorage
const saveNotesTosessionStorage = (notes) => {
  try {
    sessionStorage.setItem("vaporwave_os_notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to sessionStorage:", error);
  }
};

// Helper to load notes from sessionStorage
const loadNotesFromsessionStorage = () => {
  try {
    const savedNotes = sessionStorage.getItem("vaporwave_os_notes");
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
      title: "Welcome to Notes",
      content:
        "Welcome to the Vaporwave OS Notes app! Use this to jot down your ideas and thoughts in aesthetic vaporwave style.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

const useNotesStore = create((set, get) => ({
  // Notes data
  notes: loadNotesFromsessionStorage(),
  activeNoteId: null,
  isEditing: false,
  editTitle: "",
  showInfo: false,
  showHelp: false,

  // Set active note ID
  setActiveNoteId: (id) => {
    set({ activeNoteId: id });
  },

  // Create a new note
  createNote: () => {
    const newNote = {
      id: generateId(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => {
      const updatedNotes = [...state.notes, newNote];
      saveNotesTosessionStorage(updatedNotes);
      return {
        notes: updatedNotes,
        activeNoteId: newNote.id,
      };
    });

    return newNote;
  },

  // Update a note
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

      // If deleting the active note, select another one
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

  // Toggle/Set editing state
  setIsEditing: (value) => set({ isEditing: value }),

  // Set edit title
  setEditTitle: (title) => set({ editTitle: title }),

  // Toggle/Set info panel visibility
  setShowInfo: (value) => set({ showInfo: value }),

  // Toggle/Set help panel visibility
  setShowHelp: (value) => set({ showHelp: value }),
}));

export { useNotesStore };
