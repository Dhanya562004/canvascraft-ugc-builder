export type ElementType = 'text' | 'box' | 'button';

export interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  boxShadow?: string;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  style: ElementStyle;
  text: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
}

export interface BoxElement extends BaseElement {
  type: 'box';
}

export interface ButtonElement extends BaseElement {
  type: 'button';
}

export type CanvasElement = TextElement | BoxElement | ButtonElement;

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface LayoutData {
  version: number;
  canvas: CanvasDimensions;
  elements: CanvasElement[];
  exportedAt?: string;
}

export interface SharePayload {
  content: string;
  embeds: Array<{
    title: string;
    description: string;
    color: number;
    fields: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
  }>;
  raw_layout: CanvasElement[];
}
