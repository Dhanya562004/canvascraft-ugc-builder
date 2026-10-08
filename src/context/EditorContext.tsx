import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { EditorState, EditorAction } from '../types/editor';
import { editorReducer, initialEditorState } from '../reducers/editorReducer';
import { CanvasElement, ElementType, LayoutData } from '../types/canvas';
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage, clearSavedLayout } from '../utils/persistence';

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addElement: (type: ElementType, x?: number, y?: number) => void;
  updateElement: (id: string, updates: Partial<Omit<CanvasElement, 'id' | 'type'>> & { style?: Partial<CanvasElement['style']> }) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (id: string, x: number, y: number) => void;
  duplicateElement: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  undo: () => void;
  redo: () => void;
  loadLayout: (layout: LayoutData | CanvasElement[]) => void;
  resetLayout: () => void;
  togglePreview: () => void;
  saveToLocalStorage: () => boolean;
  restoreFromLocalStorage: () => boolean;
  clearSavedState: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState, (initial) => {
    const saved = loadLayoutFromLocalStorage();
    if (saved && saved.elements.length > 0) {
      return {
        ...initial,
        elements: saved.elements,
        selectedElementId: saved.elements[0]?.id || null,
        lastSavedAt: saved.savedAt,
        isDirty: false,
      };
    }
    return initial;
  });

  const addElement = useCallback((type: ElementType, x?: number, y?: number) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { type, x, y } });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<Omit<CanvasElement, 'id' | 'type'>> & { style?: Partial<CanvasElement['style']> }) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: { id } });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: { id } });
  }, []);

  const moveElement = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { id, x, y } });
  }, []);

  const duplicateElement = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_ELEMENT', payload: { id } });
  }, []);

  const bringForward = useCallback((id: string) => {
    dispatch({ type: 'BRING_FORWARD', payload: { id } });
  }, []);

  const sendBackward = useCallback((id: string) => {
    dispatch({ type: 'SEND_BACKWARD', payload: { id } });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const loadLayout = useCallback((layout: LayoutData | CanvasElement[]) => {
    dispatch({ type: 'LOAD_LAYOUT', payload: { layout } });
  }, []);

  const resetLayout = useCallback(() => {
    dispatch({ type: 'RESET_LAYOUT' });
  }, []);

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  const saveToLocalStorage = useCallback(() => {
    const success = saveLayoutToLocalStorage(state.elements);
    if (success) {
      const timestamp = new Date().toISOString();
      dispatch({ type: 'MARK_SAVED', payload: { timestamp } });
    }
    return success;
  }, [state.elements]);

  const restoreFromLocalStorage = useCallback(() => {
    const saved = loadLayoutFromLocalStorage();
    if (saved && saved.elements.length > 0) {
      dispatch({ type: 'LOAD_LAYOUT', payload: { layout: saved.elements } });
      dispatch({ type: 'MARK_SAVED', payload: { timestamp: saved.savedAt } });
      return true;
    }
    return false;
  }, []);

  const clearSavedState = useCallback(() => {
    clearSavedLayout();
    dispatch({ type: 'RESET_LAYOUT' });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        moveElement,
        duplicateElement,
        bringForward,
        sendBackward,
        undo,
        redo,
        loadLayout,
        resetLayout,
        togglePreview,
        saveToLocalStorage,
        restoreFromLocalStorage,
        clearSavedState,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
