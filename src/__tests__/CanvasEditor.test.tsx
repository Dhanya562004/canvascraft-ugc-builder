import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('CanvasCraft UI Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders header, workspace canvas, and toolbar elements', () => {
    render(<App />);

    expect(screen.getByText('CanvasCraft')).toBeInTheDocument();
    expect(screen.getByText('UGC Sandbox')).toBeInTheDocument();
    expect(screen.getByText('Add Text Block')).toBeInTheDocument();
    expect(screen.getByText('Add Box Card')).toBeInTheDocument();
    expect(screen.getByText('Add Button Element')).toBeInTheDocument();
  });

  it('adds a new text block when clicking Add Text Block', () => {
    render(<App />);

    // Initial total elements count is 3
    expect(screen.getByText('3')).toBeInTheDocument();

    const addTextBtn = screen.getByText('Add Text Block');
    fireEvent.click(addTextBtn);

    // Total elements count increases to 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('toggles preview mode when Preview button is clicked', () => {
    render(<App />);

    const previewBtn = screen.getByText('Preview');
    fireEvent.click(previewBtn);

    expect(screen.getByText('Edit Mode')).toBeInTheDocument();

    const editBtn = screen.getByText('Edit Mode');
    fireEvent.click(editBtn);

    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
