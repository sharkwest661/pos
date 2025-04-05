// components/apps/notepad/Notepad.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Search,
  Save,
  Plus,
  Trash,
  List,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useThemeStore, useNotepadStore } from "../../../store";
import { formatDate } from "../../../utils/formatters";
import styles from "./Notepad.module.scss";

const Notepad = () => {
  // Get theme configuration
  const themeConfig = useThemeStore((state) => state.themeConfig);

  // Selectively pick state and actions to prevent unnecessary re-renders
  const notes = useNotepadStore((state) => state.notes);
  const activeNoteId = useNotepadStore((state) => state.activeNoteId);
  const createNote = useNotepadStore((state) => state.createNote);
  const updateNote = useNotepadStore((state) => state.updateNote);
  const deleteNote = useNotepadStore((state) => state.deleteNote);
  const setActiveNote = useNotepadStore((state) => state.setActiveNote);

  // Local state
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const textAreaRef = useRef(null);
  const titleInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Find active note - memoized to prevent unnecessary recalculations
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, notes]);

  // Update local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content);
      setTitle(activeNote.title);
      updateCounts(activeNote.content);
    } else {
      setContent("");
      setTitle("");
      updateCounts("");
    }
  }, [activeNote]);

  // Focus on title when creating a new note
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Update word and character counts
  const updateCounts = useCallback((text) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
  }, []);

  // Handle content changes with debouncing
  const handleContentChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setContent(newContent);
      updateCounts(newContent);

      // Debounce the auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (activeNote) {
        saveTimeoutRef.current = setTimeout(() => {
          saveChanges(activeNote.id, title, newContent);
          saveTimeoutRef.current = null;
        }, 1000); // 1 second debounce
      }
    },
    [activeNote, title, updateCounts]
  );

  // Handle title changes
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  // Save changes to a note - only save if content actually changed
  const saveChanges = useCallback(
    (id, noteTitle, noteContent) => {
      const currentNote = notes.find((note) => note.id === id);
      if (
        currentNote &&
        (currentNote.title !== noteTitle || currentNote.content !== noteContent)
      ) {
        updateNote(id, {
          title: noteTitle,
          content: noteContent,
          lastModified: new Date(),
        });
      }
    },
    [notes, updateNote]
  );

  // Create a new note
  const handleCreateNote = useCallback(() => {
    const newNote = createNote();
    setActiveNote(newNote.id);
    setIsEditing(true);
  }, [createNote, setActiveNote]);

  // Show delete confirmation modal
  const handleDeleteClick = useCallback(() => {
    if (activeNote) {
      setShowDeleteModal(true);
    }
  }, [activeNote]);

  // Delete the active note
  const handleDeleteConfirm = useCallback(() => {
    if (activeNote) {
      deleteNote(activeNote.id);
      setShowDeleteModal(false);
    }
  }, [activeNote, deleteNote]);

  // Toggle title editing mode
  const toggleEditing = useCallback(() => {
    if (isEditing && activeNote) {
      // Save the title when exiting edit mode, only if it changed
      if (activeNote.title !== title || activeNote.content !== content) {
        saveChanges(activeNote.id, title, content);
      }
    }
    setIsEditing(!isEditing);
  }, [isEditing, activeNote, title, content, saveChanges]);

  // Handle search input
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  return (
    <div className={styles.container}>
      {/* Sidebar with notes list */}
      {showSidebar && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>NOTES</h3>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <Search size={16} className={styles.searchIcon} />
            </div>
          </div>

          <div className={styles.notesList}>
            {filteredNotes.length === 0 ? (
              <div className={styles.emptyMessage}>No notes found</div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`${styles.noteItem} ${
                    note.id === activeNoteId ? styles.active : ""
                  }`}
                >
                  <div className={styles.noteTitle}>
                    {note.title || "Untitled Note"}
                  </div>
                  <div className={styles.noteDate}>
                    {formatDate(note.lastModified)}
                  </div>
                  <div className={styles.notePreview}>
                    {note.content.substring(0, 60)}
                    {note.content.length > 60 ? "..." : ""}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.sidebarFooter}>
            <button
              onClick={handleCreateNote}
              className={styles.newNoteButton}
              style={{ height: "36px" }}
            >
              <Plus size={16} />
              New Note
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        className={`${styles.contentArea} ${
          !showSidebar ? styles.fullWidth : ""
        }`}
      >
        {/* Main toolbar */}
        <div className={styles.toolbar}>
          <button
            onClick={toggleSidebar}
            className={styles.toolbarButton}
            title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
          >
            {showSidebar ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {activeNote && (
            <>
              <button
                onClick={toggleEditing}
                className={styles.toolbarButton}
                title={isEditing ? "Save Title" : "Edit Title"}
              >
                {isEditing ? <Save size={18} /> : <Edit size={18} />}
              </button>

              <button
                onClick={handleDeleteClick}
                className={styles.toolbarButton}
                title="Delete Note"
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>

        {/* Note editor */}
        {activeNote ? (
          <div className={styles.editor}>
            <div className={styles.titleBar}>
              {isEditing ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={() => {
                    toggleEditing();
                  }}
                  className={styles.titleInput}
                  placeholder="Enter note title..."
                />
              ) : (
                <h2 className={styles.editorTitle} onClick={toggleEditing}>
                  {title || "Untitled Note"}
                </h2>
              )}
            </div>

            <textarea
              ref={textAreaRef}
              value={content}
              onChange={handleContentChange}
              className={styles.contentEditor}
              placeholder="Type your notes here..."
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <h3>No Note Selected</h3>
              <p>Create a new note or select an existing one.</p>
              <button
                onClick={handleCreateNote}
                className={styles.createButton}
              >
                <Plus size={16} />
                Create Note
              </button>
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className={styles.statusBar}>
          {activeNote && (
            <>
              <div className={styles.statusItem}>Chars: {charCount}</div>
              <div className={styles.statusItem}>Words: {wordCount}</div>
              <div className={styles.statusItem}>
                Last Modified: {formatDate(activeNote.lastModified)}
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Note"
          message={`Are you sure you want to delete "${
            activeNote?.title || "Untitled Note"
          }"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default Notepad;
