import { EditorState, EditorAction } from '../types/editor';
import { CanvasElement } from '../types/canvas';
import { createDefaultElement, getMaxZIndex, clampElementPosition, generateElementId } from '../utils/canvas';
import { validateLayoutData } from '../utils/validation';

export const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: 'elem_heading',
    type: 'text',
    x: 40,
    y: 40,
    width: 320,
    height: 50,
    zIndex: 1,
    text: '🚀 CanvasCraft Sandbox',
    style: {
      color: '#1E293B',
      fontSize: 22,
      fontWeight: 800,
      textAlign: 'left',
      backgroundColor: 'transparent',
    },
  },
  {
    id: 'elem_card',
    type: 'box',
    x: 40,
    y: 120,
    width: 240,
    height: 160,
    zIndex: 2,
    text: 'Drag elements anywhere inside this canvas!',
    style: {
      color: '#FFFFFF',
      backgroundColor: '#3730A3',
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 700,
      textAlign: 'center',
    },
  },
  {
    id: 'elem_btn',
    type: 'button',
    x: 320,
    y: 120,
    width: 160,
    height: 50,
    zIndex: 3,
    text: 'Interactive Button',
    style: {
      color: '#FFFFFF',
      backgroundColor: '#065F46',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 700,
      textAlign: 'center',
    },
  },
];

export const initialEditorState: EditorState = {
  elements: INITIAL_ELEMENTS,
  selectedElementId: 'elem_heading',
  canvasDimensions: { width: 800, height: 500 },
  history: { past: [], future: [] },
  isDirty: false,
  lastSavedAt: null,
  previewMode: false,
  zoom: 1,
};

const MAX_HISTORY_LENGTH = 30;

function pushHistory(state: EditorState, newElements: CanvasElement[]): EditorState {
  return {
    ...state,
    elements: newElements,
    isDirty: true,
    history: {
      past: [...state.history.past.slice(-MAX_HISTORY_LENGTH + 1), state.elements],
      future: [],
    },
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const maxZ = getMaxZIndex(state.elements);
      const newElem = createDefaultElement(
        action.payload.type,
        action.payload.x ?? 60,
        action.payload.y ?? 60,
        maxZ
      );
      const updatedElements = [...state.elements, newElem];
      return {
        ...pushHistory(state, updatedElements),
        selectedElementId: newElem.id,
      };
    }

    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload;
      const target = state.elements.find((e) => e.id === id);
      if (!target) return state;

      const updatedElements = state.elements.map((elem) => {
        if (elem.id !== id) return elem;
        
        const mergedStyle = updates.style
          ? { ...elem.style, ...updates.style }
          : elem.style;

        const updated = {
          ...elem,
          ...updates,
          style: mergedStyle,
        };

        const clamped = clampElementPosition(
          updated.x,
          updated.y,
          updated.width,
          updated.height,
          state.canvasDimensions
        );

        return { ...updated, x: clamped.x, y: clamped.y };
      });

      return pushHistory(state, updatedElements);
    }

    case 'DELETE_ELEMENT': {
      const { id } = action.payload;
      const updatedElements = state.elements.filter((e) => e.id !== id);
      const nextSelected = updatedElements.length > 0 ? updatedElements[0].id : null;

      return {
        ...pushHistory(state, updatedElements),
        selectedElementId: nextSelected,
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.payload.id,
      };
    }

    case 'MOVE_ELEMENT': {
      const { id, x, y } = action.payload;
      const target = state.elements.find((e) => e.id === id);
      if (!target) return state;

      const clamped = clampElementPosition(
        x,
        y,
        target.width,
        target.height,
        state.canvasDimensions
      );

      const updatedElements = state.elements.map((e) =>
        e.id === id ? { ...e, x: clamped.x, y: clamped.y } : e
      );

      return {
        ...state,
        elements: updatedElements,
        isDirty: true,
      };
    }

    case 'DUPLICATE_ELEMENT': {
      const { id } = action.payload;
      const target = state.elements.find((e) => e.id === id);
      if (!target) return state;

      const maxZ = getMaxZIndex(state.elements);
      const newX = Math.min(state.canvasDimensions.width - target.width, target.x + 20);
      const newY = Math.min(state.canvasDimensions.height - target.height, target.y + 20);

      const duplicated: CanvasElement = {
        ...target,
        id: generateElementId(),
        x: newX,
        y: newY,
        zIndex: maxZ + 1,
        style: { ...target.style },
      };

      const updatedElements = [...state.elements, duplicated];
      return {
        ...pushHistory(state, updatedElements),
        selectedElementId: duplicated.id,
      };
    }

    case 'BRING_FORWARD': {
      const { id } = action.payload;
      const target = state.elements.find((e) => e.id === id);
      if (!target) return state;

      const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx === -1 || idx === sorted.length - 1) return state;

      const higher = sorted[idx + 1];
      const targetZ = target.zIndex;
      target.zIndex = higher.zIndex;
      higher.zIndex = targetZ;

      const updatedElements = state.elements.map((e) => {
        if (e.id === target.id) return { ...e, zIndex: target.zIndex };
        if (e.id === higher.id) return { ...e, zIndex: higher.zIndex };
        return e;
      });

      return pushHistory(state, updatedElements);
    }

    case 'SEND_BACKWARD': {
      const { id } = action.payload;
      const target = state.elements.find((e) => e.id === id);
      if (!target) return state;

      const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx <= 0) return state;

      const lower = sorted[idx - 1];
      const targetZ = target.zIndex;
      target.zIndex = lower.zIndex;
      lower.zIndex = targetZ;

      const updatedElements = state.elements.map((e) => {
        if (e.id === target.id) return { ...e, zIndex: target.zIndex };
        if (e.id === lower.id) return { ...e, zIndex: lower.zIndex };
        return e;
      });

      return pushHistory(state, updatedElements);
    }

    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);

      return {
        ...state,
        elements: previous,
        selectedElementId: previous.length > 0 ? previous[0].id : null,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future],
        },
        isDirty: true,
      };
    }

    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      return {
        ...state,
        elements: next,
        selectedElementId: next.length > 0 ? next[0].id : null,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture,
        },
        isDirty: true,
      };
    }

    case 'LOAD_LAYOUT': {
      const validated = validateLayoutData(action.payload.layout);
      if (!validated.valid || !validated.data) return state;

      return {
        ...state,
        elements: validated.data.elements,
        selectedElementId: validated.data.elements[0]?.id || null,
        canvasDimensions: validated.data.canvas,
        history: { past: [], future: [] },
        isDirty: false,
      };
    }

    case 'RESET_LAYOUT': {
      return {
        ...state,
        elements: INITIAL_ELEMENTS,
        selectedElementId: INITIAL_ELEMENTS[0].id,
        history: { past: [], future: [] },
        isDirty: true,
      };
    }

    case 'SET_CANVAS_SIZE': {
      return {
        ...state,
        canvasDimensions: action.payload,
      };
    }

    case 'TOGGLE_PREVIEW': {
      return {
        ...state,
        previewMode: !state.previewMode,
      };
    }

    case 'MARK_SAVED': {
      return {
        ...state,
        isDirty: false,
        lastSavedAt: action.payload.timestamp,
      };
    }

    case 'SET_ZOOM': {
      return {
        ...state,
        zoom: Math.max(0.5, Math.min(2, action.payload.zoom)),
      };
    }

    default:
      return state;
  }
}
