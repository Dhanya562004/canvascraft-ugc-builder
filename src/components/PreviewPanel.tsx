import React, { useState, useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import { Layout, Code, ChevronDown, ChevronUp } from 'lucide-react';

export const PreviewPanel: React.FC = () => {
  const { state } = useEditor();
  const [showJson, setShowJson] = useState(false);

  const stats = useMemo(() => {
    return {
      textCount: state.elements.filter((e) => e.type === 'text').length,
      boxCount: state.elements.filter((e) => e.type === 'box').length,
      buttonCount: state.elements.filter((e) => e.type === 'button').length,
    };
  }, [state.elements]);

  const { textCount, boxCount, buttonCount } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="panel-title">
        <Layout size={16} />
        Canvas Composition Stats
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>
            TOTAL ELEMENTS
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC' }}>
            {state.elements.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Text</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38BDF8' }}>{textCount}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Box</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#818CF8' }}>{boxCount}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Button</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34D399' }}>{buttonCount}</div>
          </div>
        </div>
      </div>

      {/* JSON Schema Viewer */}
      <div className="card">
        <button
          onClick={() => setShowJson(!showJson)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            border: 'none',
            color: '#E2E8F0',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Code size={15} style={{ color: '#A78BFA' }} />
            Live State JSON
          </span>
          {showJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showJson && (
          <pre
            style={{
              marginTop: '12px',
              padding: '10px',
              background: '#0B0F17',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: '#A78BFA',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            {JSON.stringify(state.elements, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
