import React from 'react';
import { useEditor } from '../context/EditorContext';
import { Sliders, Copy, Trash2, Layers } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { state, updateElement, deleteElement, duplicateElement, bringForward, sendBackward } = useEditor();

  const selectedElem = state.elements.find((e) => e.id === state.selectedElementId);

  if (!selectedElem) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
        <Sliders size={28} style={{ color: '#64748B', marginBottom: '8px' }} />
        <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
          Select any element on the canvas to inspect and customize its properties.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="panel-title">
        <Sliders size={16} />
        Properties ({selectedElem.type.toUpperCase()})
      </div>

      {/* Label Text Input */}
      <div className="form-group">
        <label className="form-label">Element Content / Label</label>
        <input
          type="text"
          className="form-input"
          value={selectedElem.text}
          onChange={(e) => updateElement(selectedElem.id, { text: e.target.value })}
        />
      </div>

      {/* Color Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              className="color-picker-input"
              value={selectedElem.style.color || '#000000'}
              onChange={(e) =>
                updateElement(selectedElem.id, {
                  style: { color: e.target.value },
                })
              }
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              {selectedElem.style.color}
            </span>
          </div>
        </div>

        {selectedElem.type !== 'text' && (
          <div className="form-group">
            <label className="form-label">Background Color</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                className="color-picker-input"
                value={selectedElem.style.backgroundColor || '#6366F1'}
                onChange={(e) =>
                  updateElement(selectedElem.id, {
                    style: { backgroundColor: e.target.value },
                  })
                }
              />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {selectedElem.style.backgroundColor}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dimensions: Width & Height */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Width (px)</label>
          <input
            type="number"
            className="form-input"
            min={30}
            max={800}
            value={selectedElem.width}
            onChange={(e) =>
              updateElement(selectedElem.id, { width: parseInt(e.target.value, 10) || 30 })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Height (px)</label>
          <input
            type="number"
            className="form-input"
            min={20}
            max={500}
            value={selectedElem.height}
            onChange={(e) =>
              updateElement(selectedElem.id, { height: parseInt(e.target.value, 10) || 20 })
            }
          />
        </div>
      </div>

      {/* Position X & Y */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Position X (px)</label>
          <input
            type="number"
            className="form-input"
            min={0}
            max={800}
            value={selectedElem.x}
            onChange={(e) =>
              updateElement(selectedElem.id, { x: parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Position Y (px)</label>
          <input
            type="number"
            className="form-input"
            min={0}
            max={500}
            value={selectedElem.y}
            onChange={(e) =>
              updateElement(selectedElem.id, { y: parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>
      </div>

      {/* Typography & Border Radius */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Font Size (px)</label>
          <input
            type="number"
            className="form-input"
            min={10}
            max={64}
            value={selectedElem.style.fontSize || 16}
            onChange={(e) =>
              updateElement(selectedElem.id, {
                style: { fontSize: parseInt(e.target.value, 10) || 16 },
              })
            }
          />
        </div>

        {selectedElem.type !== 'text' && (
          <div className="form-group">
            <label className="form-label">Corner Radius</label>
            <input
              type="number"
              className="form-input"
              min={0}
              max={50}
              value={selectedElem.style.borderRadius ?? 8}
              onChange={(e) =>
                updateElement(selectedElem.id, {
                  style: { borderRadius: parseInt(e.target.value, 10) || 0 },
                })
              }
            />
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={() => duplicateElement(selectedElem.id)}
          title="Duplicate Element (Ctrl+D)"
        >
          <Copy size={15} />
          Duplicate
        </button>

        <button
          className="btn btn-danger"
          style={{ flex: 1 }}
          onClick={() => deleteElement(selectedElem.id)}
          title="Delete Element (Del)"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>

      {/* Layer Ordering Quick Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, fontSize: '0.75rem' }}
          onClick={() => bringForward(selectedElem.id)}
        >
          <Layers size={14} /> Bring Forward
        </button>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, fontSize: '0.75rem' }}
          onClick={() => sendBackward(selectedElem.id)}
        >
          <Layers size={14} /> Send Backward
        </button>
      </div>
    </div>
  );
};
