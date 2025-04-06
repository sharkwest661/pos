// store/projectsStore.js
import { create } from "zustand";
import { PROJECTS_DATA } from "../constants/projectsData";

// Helper to save projects state to sessionStorage
const saveStateTosessionStorage = (state) => {
  try {
    sessionStorage.setItem(
      "os_projects",
      JSON.stringify({
        currentPath: state.currentPath,
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        selectedProject: state.selectedProject
          ? state.selectedProject.id
          : null,
        showProjectDetails: state.showProjectDetails,
      })
    );
  } catch (error) {
    console.error("Error saving projects state to sessionStorage:", error);
  }
};

// Helper to load projects state from sessionStorage
const loadStateFromsessionStorage = () => {
  try {
    const savedState = sessionStorage.getItem("os_projects");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading projects state from sessionStorage:", error);
  }
  return null;
};

// Load saved state
const savedState = loadStateFromsessionStorage();

// Function to find a project by ID
const findProjectById = (id) => {
  return PROJECTS_DATA.find((project) => project.id === id) || null;
};

const useProjectsStore = create((set, get) => ({
  // Projects state
  projects: PROJECTS_DATA,
  currentPath: savedState?.currentPath || "/",
  viewMode: savedState?.viewMode || "grid", // "grid" or "list"
  searchQuery: savedState?.searchQuery || "",
  selectedProject: savedState?.selectedProject
    ? findProjectById(savedState.selectedProject)
    : null,
  showProjectDetails: savedState?.showProjectDetails || false,

  // Filter projects based on search query
  getFilteredProjects: () => {
    const { projects, searchQuery } = get();

    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
    );
  },

  // Update current path
  setCurrentPath: (path) =>
    set((state) => {
      const newState = { currentPath: path };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Update view mode
  setViewMode: (mode) =>
    set((state) => {
      const newState = { viewMode: mode };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Update search query
  setSearchQuery: (query) =>
    set((state) => {
      const newState = { searchQuery: query };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Select a project
  selectProject: (project) =>
    set((state) => {
      const newState = {
        selectedProject: project,
        showProjectDetails: true,
      };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),

  // Clear selected project
  clearSelectedProject: () =>
    set((state) => {
      const newState = {
        selectedProject: null,
        showProjectDetails: false,
      };
      saveStateTosessionStorage({ ...state, ...newState });
      return newState;
    }),
}));

export { useProjectsStore };
