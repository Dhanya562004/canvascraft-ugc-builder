import { describe, it, expect, beforeEach } from 'vitest';
import { saveLayoutToLocalStorage, loadLayoutFromLocalStorage, clearSavedLayout } from '../utils/persistence';
import { CanvasElement } from '../types/canvas';

describe('persistence.ts Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleElements: CanvasElement[] = [
    {
      id: 'elem_test_1',
      type: 'box',
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      zIndex: 1,
      text: 'Saved Card',
      style: { color: '#FFFFFF', backgroundColor: '#6366F1' },
    },
  ];

  it('should save and load layout to/from localStorage', () => {
    const saved = saveLayoutToLocalStorage(sampleElements);
    expect(saved).toBe(true);

    const loaded = loadLayoutFromLocalStorage();
    expect(loaded).not.toBeNull();
    expect(loaded?.elements.length).toBe(1);
    expect(loaded?.elements[0].text).toBe('Saved Card');
  });

  it('should return null when localStorage is empty', () => {
    expect(loadLayoutFromLocalStorage()).toBeNull();
  });

  it('should clear localStorage and handle corrupt JSON data safely', () => {
    localStorage.setItem('canvascraft_saved_layout', '{ corrupted_json... }');

    const loaded = loadLayoutFromLocalStorage();
    expect(loaded).toBeNull();
    expect(localStorage.getItem('canvascraft_saved_layout')).toBeNull();
  });

  it('should clear saved layout on demand', () => {
    saveLayoutToLocalStorage(sampleElements);
    clearSavedLayout();
    expect(localStorage.getItem('canvascraft_saved_layout')).toBeNull();
  });
});
