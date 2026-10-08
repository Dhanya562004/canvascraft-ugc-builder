import React from 'react';
import { useEditor } from '../context/EditorContext';
import { Type, Square, MousePointerClick, ZoomIn, ZoomOut } from 'lucide-react';
import { ElementType } from '../types/canvas';

export const Toolbar: React.FC = () => {
  const { state, addElement, dispatch } = useEditor();

  const handleAdd = (type: ElementType) => {
    addElement(type);
  };

  const handleZoom = (delta: number) => {
    dispatch({ type: 'SET_ZOOM', payload: { zoom: state.zoom + delta } });
  };

  return (
    <div className="sidebar left-sidebar">
      <div>
        <div className="panel-title">
          <Type size={16} />
          Element Palette
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
            onClick={() => handleAdd('text')}
            title="Add heading or paragraph text block"
          >
            <Type size={18} style={{ color: '#38BDF8' }} />
            Add Text Block
          </button>

          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
            onClick={() => handleAdd('box')}
            title="Add container card or box element"
          >
            <Square size={18} style={{ color: '#818CF8' }} />
            Add Box Card
          </button>

          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
            onClick={() => handleAdd('button')}
            title="Add call to action button"
          >
            <MousePointerClick size={18} style={{ color: '#34D399' }} />
            Add Button Element
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-dark)', paddingTop: '16px' }}>
        <div className="panel-title">Canvas Viewport</div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.6)', padding: '8px 12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Zoom: {Math.round(state.zoom * 100)}%</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 8px' }}
              onClick={() => handleZoom(-0.1)}
              disabled={state.zoom <= 0.6}
            >
              <ZoomOut size={14} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 8px' }}
              onClick={() => handleZoom(0.1)}
              disabled={state.zoom >= 1.8}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
