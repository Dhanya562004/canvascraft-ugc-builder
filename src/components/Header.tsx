import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { useHistory } from '../hooks/useHistory';
import {
  Sparkles,
  Undo2,
  Redo2,
  Eye,
  Edit3,
  Share2,
  HelpCircle,
  Save,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { ShareDialog } from './ShareDialog';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

export const Header: React.FC = () => {
  const { state, togglePreview, saveToLocalStorage, resetLayout } = useEditor();
  const { canUndo, canRedo, undo, redo } = useHistory();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const handleManualSave = () => {
    saveToLocalStorage();
  };

  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">CanvasCraft</span>
              <span className="brand-badge">UGC Sandbox</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Interactive Canvas Architecture &amp; UI Sandbox
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* History Controls */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo action"
            >
              <Undo2 size={16} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo action"
            >
              <Redo2 size={16} />
            </button>
          </div>

          {/* Saved Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-pill ${state.isDirty ? 'unsaved' : 'saved'}`}>
              {state.isDirty ? <Clock size={12} /> : <CheckCircle2 size={12} />}
              {state.isDirty ? 'Unsaved Changes' : 'Saved'}
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleManualSave}
              title="Save to Browser Storage (Ctrl+S)"
              aria-label="Save layout"
            >
              <Save size={15} />
              Save
            </button>
          </div>

          {/* Reset Layout */}
          <button
            className="btn btn-secondary"
            onClick={resetLayout}
            title="Reset to default layout"
            aria-label="Reset layout"
          >
            <RotateCcw size={15} />
            Reset
          </button>

          {/* Preview Toggle */}
          <button
            className={`btn ${state.previewMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={togglePreview}
            title="Toggle Edit / Preview mode"
            aria-label="Toggle preview mode"
          >
            {state.previewMode ? <Edit3 size={15} /> : <Eye size={15} />}
            {state.previewMode ? 'Edit Mode' : 'Preview'}
          </button>

          {/* Share Button */}
          <button
            className="btn btn-success"
            onClick={() => setIsShareOpen(true)}
            title="Simulate Discord payload sharing"
            aria-label="Share layout"
          >
            <Share2 size={15} />
            Share Payload
          </button>

          {/* Help Modal */}
          <button
            className="btn btn-secondary"
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts & Help"
            aria-label="Open shortcuts help"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      {/* Share Dialog */}
      {isShareOpen && <ShareDialog onClose={() => setIsShareOpen(false)} />}

      {/* Keyboard Shortcuts Modal */}
      {isShortcutsOpen && <KeyboardShortcutsModal onClose={() => setIsShortcutsOpen(false)} />}
    </>
  );
};
