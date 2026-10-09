import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { ShareDialog } from '../components/ShareDialog';
import { EditorProvider } from '../context/EditorContext';

describe('Frontend Quality Features & Interaction Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('updates element content when property input changes in Properties Panel', async () => {
    render(<App />);

    // Click on the initial heading element on canvas by ID
    const headingElem = document.getElementById('elem_heading')!;
    expect(headingElem).toBeInTheDocument();
    fireEvent.click(headingElem);

    // Find property content input
    const input = screen.getByLabelText('Element Content / Label');
    expect(input).toHaveValue('🚀 CanvasCraft Sandbox');

    // Change input value
    fireEvent.change(input, { target: { value: 'Updated Sandbox Title' } });

    // Expect the element on canvas to reflect the updated title
    expect(screen.getAllByText('Updated Sandbox Title').length).toBeGreaterThan(0);
  });

  it('duplicates selected element with Ctrl+D and undoes action with Ctrl+Z', () => {
    render(<App />);

    // Total count initially 3
    expect(screen.getByText('3')).toBeInTheDocument();

    // Select the button element on canvas by ID
    const btnElem = document.getElementById('elem_btn')!;
    expect(btnElem).toBeInTheDocument();
    fireEvent.click(btnElem);

    // Fire Ctrl+D shortcut to duplicate
    fireEvent.keyDown(window, { key: 'd', ctrlKey: true });

    // Total count becomes 4
    expect(screen.getByText('4')).toBeInTheDocument();

    // Fire Ctrl+Z shortcut to undo
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });

    // Total count reverts to 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders KeyboardShortcutsModal with ARIA dialog roles and cleans up Escape key listener on close', () => {
    const handleClose = vi.fn();
    const { unmount } = render(<KeyboardShortcutsModal onClose={handleClose} />);

    // Verify ARIA dialog role and modal title
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Keyboard Shortcuts Guide')).toBeInTheDocument();

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Unmount modal to verify listener cleanup without throwing errors
    unmount();
  });

  it('handles REST API Webhook dispatch simulation and clipboard copying in ShareDialog', async () => {
    // Mock navigator.clipboard.writeText
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(
      <EditorProvider>
        <ShareDialog onClose={vi.fn()} />
      </EditorProvider>
    );

    // Verify dialog ARIA elements
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Discord Webhook Share Simulation')).toBeInTheDocument();

    // Click Copy JSON
    const copyBtn = screen.getByText('Copy JSON');
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalled();

    // Click Dispatch Payload button
    const dispatchBtn = screen.getByText('Dispatch Payload');
    fireEvent.click(dispatchBtn);

    // Expect loading state and success feedback
    await waitFor(() => {
      expect(screen.getByText(/dispatched/i)).toBeInTheDocument();
    });
  });
});
