import { describe, it, expect } from 'vitest';
import { editorReducer, initialEditorState, INITIAL_ELEMENTS } from '../reducers/editorReducer';
import { EditorState } from '../types/editor';

describe('editorReducer Unit Tests', () => {
  it('should handle ADD_ELEMENT correctly', () => {
    const state = editorReducer(initialEditorState, {
      type: 'ADD_ELEMENT',
      payload: { type: 'button', x: 100, y: 100 },
    });

    expect(state.elements.length).toBe(INITIAL_ELEMENTS.length + 1);
    const lastAdded = state.elements[state.elements.length - 1];
    expect(lastAdded.type).toBe('button');
    expect(lastAdded.x).toBe(100);
    expect(lastAdded.y).toBe(100);
    expect(state.selectedElementId).toBe(lastAdded.id);
    expect(state.isDirty).toBe(true);
    expect(state.history.past.length).toBe(1);
  });

  it('should handle UPDATE_ELEMENT correctly', () => {
    const targetId = INITIAL_ELEMENTS[0].id;
    const state = editorReducer(initialEditorState, {
      type: 'UPDATE_ELEMENT',
      payload: { id: targetId, updates: { text: 'Updated Title', width: 400 } },
    });

    const updated = state.elements.find((e) => e.id === targetId);
    expect(updated?.text).toBe('Updated Title');
    expect(updated?.width).toBe(400);
    expect(state.isDirty).toBe(true);
  });

  it('should handle DELETE_ELEMENT correctly', () => {
    const targetId = INITIAL_ELEMENTS[0].id;
    const state = editorReducer(initialEditorState, {
      type: 'DELETE_ELEMENT',
      payload: { id: targetId },
    });

    expect(state.elements.length).toBe(INITIAL_ELEMENTS.length - 1);
    expect(state.elements.find((e) => e.id === targetId)).toBeUndefined();
  });

  it('should handle MOVE_ELEMENT and clamp to canvas boundaries', () => {
    const targetId = INITIAL_ELEMENTS[0].id;
    const state = editorReducer(initialEditorState, {
      type: 'MOVE_ELEMENT',
      payload: { id: targetId, x: 950, y: 650 }, // Out of bounds coordinates
    });

    const moved = state.elements.find((e) => e.id === targetId)!;
    expect(moved.x).toBeLessThanOrEqual(800 - moved.width);
    expect(moved.y).toBeLessThanOrEqual(500 - moved.height);
  });

  it('should handle DUPLICATE_ELEMENT correctly', () => {
    const targetId = INITIAL_ELEMENTS[0].id;
    const state = editorReducer(initialEditorState, {
      type: 'DUPLICATE_ELEMENT',
      payload: { id: targetId },
    });

    expect(state.elements.length).toBe(INITIAL_ELEMENTS.length + 1);
    const dup = state.elements[state.elements.length - 1];
    expect(dup.id).not.toBe(targetId);
    expect(dup.text).toBe(INITIAL_ELEMENTS[0].text);
  });

  it('should handle UNDO and REDO correctly', () => {
    // Perform an action
    const state1 = editorReducer(initialEditorState, {
      type: 'ADD_ELEMENT',
      payload: { type: 'text' },
    });
    expect(state1.elements.length).toBe(INITIAL_ELEMENTS.length + 1);

    // Undo action
    const state2 = editorReducer(state1, { type: 'UNDO' });
    expect(state2.elements.length).toBe(INITIAL_ELEMENTS.length);
    expect(state2.history.future.length).toBe(1);

    // Redo action
    const state3 = editorReducer(state2, { type: 'REDO' });
    expect(state3.elements.length).toBe(INITIAL_ELEMENTS.length + 1);
    expect(state3.history.future.length).toBe(0);
  });

  it('should handle layer reordering BRING_FORWARD and SEND_BACKWARD', () => {
    const firstElemId = INITIAL_ELEMENTS[0].id;
    const secondElemId = INITIAL_ELEMENTS[1].id;

    const stateForward = editorReducer(initialEditorState, {
      type: 'BRING_FORWARD',
      payload: { id: firstElemId },
    });

    const elem1 = stateForward.elements.find((e) => e.id === firstElemId);
    const elem2 = stateForward.elements.find((e) => e.id === secondElemId);
    expect(elem1!.zIndex).toBeGreaterThan(elem2!.zIndex);
  });

  it('should handle RESET_LAYOUT correctly', () => {
    const dirtyState: EditorState = {
      ...initialEditorState,
      elements: [],
      selectedElementId: null,
    };

    const resetState = editorReducer(dirtyState, { type: 'RESET_LAYOUT' });
    expect(resetState.elements.length).toBe(INITIAL_ELEMENTS.length);
    expect(resetState.selectedElementId).toBe(INITIAL_ELEMENTS[0].id);
  });
});
