# Zustand State Management Patterns

This document outlines the recommended patterns for working with Zustand state management in the Digital Sleuth project.

## Importing Zustand

Always use the correct import syntax:

```javascript
import { create } from "zustand";
```

## Accessing State

### Selecting Specific State Values

To prevent unnecessary re-renders, always select only the specific state values you need:

```javascript
// CORRECT: Selective state picking
const currentDocumentId = useDocumentsStore((state) => state.currentDocumentId);
```

### Accessing Multiple State Values

When accessing multiple state values, you have two options:

#### Option 1: Multiple Selectors (Preferred for unrelated values)

```javascript
const currentDocumentId = useDocumentsStore((state) => state.currentDocumentId);
const isDocumentLoading = useDocumentsStore((state) => state.isLoading);
```

#### Option 2: Combined Selector (For related values)

```javascript
const { currentDocumentId, isDocumentLoading } = useDocumentsStore((state) => ({
  currentDocumentId: state.currentDocumentId,
  isDocumentLoading: state.isLoading,
}));
```

### Accessing Actions

Select actions directly from the store:

```javascript
const setCurrentDocument = useDocumentsStore(
  (state) => state.setCurrentDocument
);
```

## Patterns to Avoid

### Never Destructure the Entire Store

```javascript
// INCORRECT: This will cause unnecessary re-renders
const { currentDocumentId } = useDocumentsStore();
```

### Don't Access State Values Inside Actions

Instead, use the `get` function provided to the store creator:

```javascript
// CORRECT:
const useStore = create((set, get) => ({
  count: 0,
  incrementWithValue: (value) => {
    const currentCount = get().count;
    set({ count: currentCount + value });
  },
}));

// INCORRECT:
let count = 0;
const useStore = create((set) => ({
  count,
  incrementWithValue: (value) => {
    count += value;
    set({ count });
  },
}));
```

## Example Usage

### In Components

```jsx
import React from 'react';
import { useWindowsStore, useThemeStore } from '../store';

const MyComponent = () => {
  // Get only what you need
  const windows = useWindowsStore(state => state.windows);
  const activeWindowId = useWindowsStore(state => state.activeWindowId);
  const closeWindow = useWindowsStore(state => state.closeWindow);

  // Get theme configuration
  const themeConfig = useThemeStore(state => state.themeConfig);

  // Component logic

  return (
    // JSX
  );
};
```

## Store Organization

The application state is divided into several specialized stores:

- **appStore**: Core application state, user state, and global functionality
- **themeStore**: Theme configuration and visual effects settings
- **windowsStore**: Window management for the OS simulator

Each store should focus on a specific domain and minimize dependencies on other stores.
