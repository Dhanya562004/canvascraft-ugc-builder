import { CanvasElement, CanvasDimensions, LayoutData } from './canvas';

export interface HistoryState {
  past: CanvasElement[][];
  future: CanvasElement[][];
}

export interface EditorState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  canvasDimensions: CanvasDimensions;
  history: HistoryState;
  isDirty: boolean;
  lastSavedAt: string | null;
  previewMode: boolean;
  zoom: number;
}

export type EditorAction =
  | { type: 'ADD_ELEMENT'; payload: { type: CanvasElement['type']; x?: number; y?: number } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<Omit<CanvasElement, 'id' | 'type'>> & { style?: Partial<CanvasElement['style']> } } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; x: number; y: number } }
  | { type: 'DUPLICATE_ELEMENT'; payload: { id: string } }
  | { type: 'BRING_FORWARD'; payload: { id: string } }
  | { type: 'SEND_BACKWARD'; payload: { id: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_LAYOUT'; payload: { layout: LayoutData | CanvasElement[] } }
  | { type: 'RESET_LAYOUT' }
  | { type: 'SET_CANVAS_SIZE'; payload: CanvasDimensions }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'MARK_SAVED'; payload: { timestamp: string } }
  | { type: 'SET_ZOOM'; payload: { zoom: number } };
