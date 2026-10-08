import { CanvasElement, LayoutData, ElementType } from '../types/canvas';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: LayoutData;
}

const VALID_TYPES: ElementType[] = ['text', 'box', 'button'];

export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  return text.replace(/<script\b[^<]*>(?:[\s\S]*?)<\/script>/gi, '').replace(/<[^>]*>?/gm, '').trim();
}

export function validateElement(elem: any): elem is CanvasElement {
  if (!elem || typeof elem !== 'object') return false;
  if (typeof elem.id !== 'string' || !elem.id.trim()) return false;
  if (!VALID_TYPES.includes(elem.type)) return false;
  if (typeof elem.x !== 'number' || isNaN(elem.x)) return false;
  if (typeof elem.y !== 'number' || isNaN(elem.y)) return false;
  if (typeof elem.width !== 'number' || isNaN(elem.width) || elem.width <= 0) return false;
  if (typeof elem.height !== 'number' || isNaN(elem.height) || elem.height <= 0) return false;
  if (typeof elem.text !== 'string') return false;

  return true;
}

export function validateLayoutData(input: any): ValidationResult {
  if (!input) {
    return { valid: false, error: 'Input is empty or null.' };
  }

  let elementsArray: any[] = [];
  let width = 800;
  let height = 500;
  let version = 1;

  if (Array.isArray(input)) {
    elementsArray = input;
  } else if (typeof input === 'object') {
    if (Array.isArray(input.elements)) {
      elementsArray = input.elements;
    } else {
      return { valid: false, error: 'Layout object must contain an "elements" array.' };
    }

    if (input.canvas && typeof input.canvas === 'object') {
      if (typeof input.canvas.width === 'number' && input.canvas.width > 0) {
        width = input.canvas.width;
      }
      if (typeof input.canvas.height === 'number' && input.canvas.height > 0) {
        height = input.canvas.height;
      }
    }

    if (typeof input.version === 'number') {
      version = input.version;
    }
  } else {
    return { valid: false, error: 'Layout data must be a JSON array or object.' };
  }

  const sanitizedElements: CanvasElement[] = [];
  for (let i = 0; i < elementsArray.length; i++) {
    const raw = elementsArray[i];
    if (!validateElement(raw)) {
      return { valid: false, error: `Invalid element structure at index ${i}.` };
    }

    sanitizedElements.push({
      id: raw.id,
      type: raw.type,
      x: Math.max(0, raw.x),
      y: Math.max(0, raw.y),
      width: raw.width,
      height: raw.height,
      zIndex: typeof raw.zIndex === 'number' ? raw.zIndex : i + 1,
      text: sanitizeText(raw.text),
      style: {
        color: raw.style?.color || (raw as any).color || '#1E293B',
        backgroundColor: raw.style?.backgroundColor || (raw.type !== 'text' ? (raw as any).color : 'transparent'),
        borderColor: raw.style?.borderColor || (raw as any).borderColor,
        borderRadius: raw.style?.borderRadius ?? (raw as any).borderRadius ?? 8,
        fontSize: raw.style?.fontSize ?? (raw as any).fontSize ?? 16,
        fontWeight: raw.style?.fontWeight ?? (raw as any).fontWeight ?? 600,
        textAlign: raw.style?.textAlign || 'center',
        opacity: raw.style?.opacity ?? 1,
      },
    });
  }

  return {
    valid: true,
    data: {
      version,
      canvas: { width, height },
      elements: sanitizedElements,
      exportedAt: new Date().toISOString(),
    },
  };
}
