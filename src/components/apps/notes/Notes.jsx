// components/apps/notes/Notes.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Save,
  Trash,
  FileText,
  Edit,
  Check,
  Info,
  HelpCircle,
} from "lucide-react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import styles from "./Notes.module.scss";

// Sample notes data - In a real app, this would be stored in localStorage or a backend
const INITIAL_NOTES = [
  {
    id: "note-1",
    title: "Welcome to Notes",
    content: `Welcome to the Vaporwave OS Notes app!

This is a simple text editor designed with typewriter styling. You can create, edit, and manage your notes here.

Features:
- Create new notes
- Edit note content
- Rename notes
- Delete notes
- Multiple notes accessible via tabs

Feel free to delete this note and create your own.`,
    createdAt: new Date("2025-03-15T12:00:00"),
    updatedAt: new Date("2025-03-15T12:00:00"),
  },
  {
    id: "note-2",
    title: "Project Ideas",
    content: `Future Project Ideas:

1. Vaporwave music visualizer with WebGL
2. Retro-themed interactive portfolio
3. 80s/90s inspired game with synthwave soundtrack
4. Cyberpunk text adventure
5. Virtual retro computer environment`,
    createdAt: new Date("2025-03-20T14:30:00"),
    updatedAt: new Date("2025-03-25T16:45:00"),
  },
];

const Notes = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Component state
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // References
  const textAreaRef = useRef(null);
  const editInputRef = useRef(null);

  // Focus textarea when active note changes
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [activeNoteId]);

  // Focus title input when editing
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // Get active note
  const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  // Handle creating a new note
  const handleCreateNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    setIsEditing(true); // Start editing the title for a new note
    setEditTitle("Untitled Note");
  };

  // Handle deleting a note
  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);

    // Set a new active note if the deleted note was active
    if (id === activeNoteId && updatedNotes.length > 0) {
      setActiveNoteId(updatedNotes[0].id);
    } else if (updatedNotes.length === 0) {
      setActiveNoteId(null);
    }
  };

  // Handle note content changes
  const handleContentChange = (e) => {
    if (!activeNoteId) return;

    const updatedNotes = notes.map((note) => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          content: e.target.value,
          updatedAt: new Date(),
        };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  // Start editing the title
  const handleStartEditingTitle = () => {
    if (activeNote) {
      setIsEditing(true);
      setEditTitle(activeNote.title);
    }
  };

  // Save the edited title
  const handleSaveTitle = () => {
    if (!activeNoteId) return;

    const updatedNotes = notes.map((note) => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          title: editTitle || "Untitled Note",
          updatedAt: new Date(),
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convert content to a character and word count
  const countStats = (content) => {
    if (!content) return { chars: 0, words: 0 };

    const chars = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    return { chars, words };
  };

  const stats = activeNote
    ? countStats(activeNote.content)
    : { chars: 0, words: 0 };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Save title when pressing Enter
    if (isEditing && e.key === "Enter") {
      handleSaveTitle();
    }

    // Cancel editing with Escape
    if (isEditing && e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.noteTabs}>
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${styles.noteTab} ${
                note.id === activeNoteId ? styles.active : ""
              }`}
              onClick={() => setActiveNoteId(note.id)}
            >
              <FileText size={14} />
              <span className={styles.noteTabTitle}>{note.title}</span>
              {notes.length > 1 && note.id === activeNoteId && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  title="Delete note"
                >
                  <Trash size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.sidebarActions}>
          <button
            className={styles.newNoteButton}
            onClick={handleCreateNote}
            title="Create new note"
          >
            <PlusCircle size={16} />
            <span>New Note</span>
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {activeNote ? (
          <>
            <div className={styles.noteHeader}>
              {isEditing ? (
                <div className={styles.titleEditContainer}>
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleKeyDown}
                    className={styles.titleInput}
                  />
                  <button
                    className={styles.confirmButton}
                    onClick={handleSaveTitle}
                    title="Save title"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <h2
                  className={styles.noteTitle}
                  onClick={handleStartEditingTitle}
                >
                  {activeNote.title}
                  <button
                    className={styles.editButton}
                    onClick={handleStartEditingTitle}
                    title="Edit title"
                  >
                    <Edit size={14} />
                  </button>
                </h2>
              )}

              <div className={styles.noteMetadata}>
                <span className={styles.noteDate}>
                  Last updated: {formatDate(activeNote.updatedAt)}
                </span>
                <button
                  className={styles.infoButton}
                  onClick={() => setShowInfo(!showInfo)}
                  title="Note details"
                >
                  <Info size={14} />
                </button>
                <button
                  className={styles.helpButton}
                  onClick={() => setShowHelp(!showHelp)}
                  title="Help"
                >
                  <HelpCircle size={14} />
                </button>
              </div>
            </div>

            {/* Details panel */}
            {showInfo && (
              <div className={styles.infoPanel}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Created:</span>
                  <span>{formatDate(activeNote.createdAt)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Characters:</span>
                  <span>{stats.chars}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Words:</span>
                  <span>{stats.words}</span>
                </div>
              </div>
            )}

            {/* Help panel */}
            {showHelp && (
              <div className={styles.helpPanel}>
                <h3>Notes Help</h3>
                <ul>
                  <li>Click on the note title to edit it</li>
                  <li>Press Enter to save the title, or Escape to cancel</li>
                  <li>Create new notes with the "New Note" button</li>
                  <li>Delete notes using the trash icon in the tab</li>
                </ul>
              </div>
            )}

            <div className={styles.editorContainer}>
              <textarea
                ref={textAreaRef}
                value={activeNote.content}
                onChange={handleContentChange}
                className={styles.textEditor}
                placeholder="Start typing..."
              />
            </div>

            <div className={styles.statusBar}>
              <div className={styles.typingSound}>
                <span
                  className={`${styles.typingSoundDot} ${styles.active}`}
                ></span>
                <span>Typing sounds: ON</span>
              </div>
              <div className={styles.wordCount}>
                {stats.chars} characters | {stats.words} words
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <p>No notes yet</p>
            <button className={styles.createButton} onClick={handleCreateNote}>
              Create your first note
            </button>
          </div>
        )}
      </div>

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default Notes;
