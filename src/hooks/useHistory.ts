import { useEditor } from '../context/EditorContext';

export function useHistory() {
  const { state, undo, redo } = useEditor();

  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    historyDepth: state.history.past.length,
    futureDepth: state.history.future.length,
  };
}
