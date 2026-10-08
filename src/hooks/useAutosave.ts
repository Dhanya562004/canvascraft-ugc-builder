import { useEffect } from 'react';
import { useEditor } from '../context/EditorContext';

export function useAutosave(intervalMs: number = 10000) {
  const { state, saveToLocalStorage } = useEditor();

  useEffect(() => {
    if (!state.isDirty) return;

    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [state.elements, state.isDirty, saveToLocalStorage, intervalMs]);
}
