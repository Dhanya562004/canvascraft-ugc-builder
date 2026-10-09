import React, { useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import { Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { sortElementsByZIndex } from '../utils/canvas';

export const LayersPanel: React.FC = () => {
  const { state, selectElement, bringForward, sendBackward } = useEditor();

  const sortedElements = useMemo(
    () => sortElementsByZIndex(state.elements).reverse(),
    [state.elements]
  );

  return (
    <div>
      <div className="panel-title">
        <Layers size={16} />
        Layer Hierarchy ({state.elements.length})
      </div>

      {state.elements.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', padding: '12px' }}>
          No layers on canvas.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sortedElements.map((elem) => {
            const isSelected = state.selectedElementId === elem.id;

            return (
              <div
                key={elem.id}
                onClick={() => selectElement(elem.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                  border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#A78BFA',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    z:{elem.zIndex}
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '120px',
                    }}
                  >
                    {elem.text || elem.type}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '3px 6px' }}
                    onClick={() => bringForward(elem.id)}
                    title="Bring Layer Forward"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '3px 6px' }}
                    onClick={() => sendBackward(elem.id)}
                    title="Send Layer Backward"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
