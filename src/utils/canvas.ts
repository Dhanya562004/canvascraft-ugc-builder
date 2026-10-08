import { CanvasElement, ElementType, CanvasDimensions } from '../types/canvas';

export function generateElementId(): string {
  return `elem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

export function createDefaultElement(
  type: ElementType,
  x: number = 50,
  y: number = 50,
  maxZIndex: number = 1
): CanvasElement {
  const id = generateElementId();
  const nextZ = maxZIndex + 1;

  switch (type) {
    case 'text':
      return {
        id,
        type: 'text',
        x,
        y,
        width: 260,
        height: 50,
        zIndex: nextZ,
        text: '🚀 CanvasCraft Sandbox',
        style: {
          color: '#1E293B',
          fontSize: 22,
          fontWeight: 700,
          textAlign: 'left',
          backgroundColor: 'transparent',
        },
      };

    case 'box':
      return {
        id,
        type: 'box',
        x,
        y,
        width: 220,
        height: 150,
        zIndex: nextZ,
        text: 'Card Container',
        style: {
          color: '#FFFFFF',
          backgroundColor: '#6366F1',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          textAlign: 'center',
          borderColor: '#4F46E5',
        },
      };

    case 'button':
      return {
        id,
        type: 'button',
        x,
        y,
        width: 160,
        height: 48,
        zIndex: nextZ,
        text: 'Click Me!',
        style: {
          color: '#FFFFFF',
          backgroundColor: '#10B981',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          textAlign: 'center',
        },
      };
  }
}

export function clampElementPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: CanvasDimensions
): { x: number; y: number } {
  const clampedX = Math.max(0, Math.min(canvas.width - width, x));
  const clampedY = Math.max(0, Math.min(canvas.height - height, y));
  return { x: clampedX, y: clampedY };
}

export function getMaxZIndex(elements: CanvasElement[]): number {
  if (elements.length === 0) return 0;
  return Math.max(...elements.map((e) => e.zIndex || 0));
}

export function sortElementsByZIndex(elements: CanvasElement[]): CanvasElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}
