import { CanvasElement } from '../types/canvas';
import { validateLayoutData } from './validation';

const STORAGE_KEY = 'canvascraft_saved_layout';

export interface SavedState {
  elements: CanvasElement[];
  savedAt: string;
}

export function saveLayoutToLocalStorage(elements: CanvasElement[]): boolean {
  try {
    const payload: SavedState = {
      elements,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Failed to save layout to localStorage:', error);
    return false;
  }
}

export function loadLayoutFromLocalStorage(): { elements: CanvasElement[]; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const elementsToValidate = parsed.elements ? parsed.elements : parsed;

    const validation = validateLayoutData(elementsToValidate);
    if (validation.valid && validation.data) {
      return {
        elements: validation.data.elements,
        savedAt: parsed.savedAt || new Date().toISOString(),
      };
    } else {
      console.warn('Corrupted layout found in localStorage, clearing key:', validation.error);
      clearSavedLayout();
      return null;
    }
  } catch (error) {
    console.error('Failed to parse localStorage layout data:', error);
    clearSavedLayout();
    return null;
  }
}

export function clearSavedLayout(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
