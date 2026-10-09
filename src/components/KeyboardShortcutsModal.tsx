import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shortcuts = [
    { key: 'Delete / Backspace', action: 'Delete selected canvas element' },
    { key: 'Arrow Keys', action: 'Nudge selected element position by 1px' },
    { key: 'Shift + Arrow Keys', action: 'Fast move selected element position by 10px' },
    { key: 'Ctrl / Cmd + D', action: 'Duplicate selected element' },
    { key: 'Ctrl / Cmd + S', action: 'Save layout to browser localStorage' },
    { key: 'Ctrl / Cmd + Z', action: 'Undo last editor action' },
    { key: 'Ctrl / Cmd + Shift + Z', action: 'Redo previously undone action' },
    { key: 'Ctrl / Cmd + Y', action: 'Redo action' },
    { key: 'Escape', action: 'Close dialog / Deselect element' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={20} style={{ color: '#818CF8' }} />
            <h3 id="shortcuts-modal-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Keyboard Shortcuts Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '4px 8px' }}
            aria-label="Close shortcuts guide"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-dark)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>{sc.action}</span>
              <kbd
                style={{
                  background: '#0F172A',
                  color: '#A78BFA',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
