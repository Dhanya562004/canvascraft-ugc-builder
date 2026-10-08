import { describe, it, expect } from 'vitest';
import { validateLayoutData, validateElement, sanitizeText } from '../utils/validation';

describe('validation.ts Unit Tests', () => {
  it('should sanitize unsafe script tags from text', () => {
    const raw = '<script>alert("xss")</script>Hello World';
    expect(sanitizeText(raw)).toBe('Hello World');
  });

  it('should validate valid element objects', () => {
    const validElem = {
      id: 'elem_1',
      type: 'box',
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      text: 'Test Box',
    };
    expect(validateElement(validElem)).toBe(true);
  });

  it('should reject invalid element types or missing fields', () => {
    expect(validateElement({ id: 'elem_1', type: 'circle', x: 0, y: 0, width: 10, height: 10, text: '' })).toBe(false);
    expect(validateElement({ id: 'elem_1', type: 'box', x: 'abc', y: 0, width: 10, height: 10, text: '' })).toBe(false);
    expect(validateElement(null)).toBe(false);
  });

  it('should validate complete layout JSON data payload', () => {
    const payload = {
      version: 1,
      canvas: { width: 800, height: 500 },
      elements: [
        {
          id: 'elem_1',
          type: 'text',
          x: 40,
          y: 40,
          width: 200,
          height: 40,
          zIndex: 1,
          text: 'Title Text',
          style: { color: '#000000' },
        },
      ],
    };

    const result = validateLayoutData(payload);
    expect(result.valid).toBe(true);
    expect(result.data?.elements.length).toBe(1);
    expect(result.data?.elements[0].text).toBe('Title Text');
  });

  it('should handle raw array input format', () => {
    const rawArray = [
      {
        id: 'elem_1',
        type: 'button',
        x: 50,
        y: 50,
        width: 120,
        height: 40,
        text: 'Click',
      },
    ];

    const result = validateLayoutData(rawArray);
    expect(result.valid).toBe(true);
    expect(result.data?.elements.length).toBe(1);
  });

  it('should reject malformed layout JSON objects', () => {
    expect(validateLayoutData(null).valid).toBe(false);
    expect(validateLayoutData('invalid string').valid).toBe(false);
    expect(validateLayoutData({ invalidKey: true }).valid).toBe(false);
    expect(validateLayoutData({ elements: [{ id: 123, type: 'unknown' }] }).valid).toBe(false);
  });
});
