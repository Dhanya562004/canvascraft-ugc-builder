import React, { useRef, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Download, Upload, FileCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { validateLayoutData } from '../utils/validation';

export const ExportImportPanel: React.FC = () => {
  const { state, loadLayout } = useEditor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle Export / Download JSON
  const handleExport = () => {
    try {
      const exportPayload = {
        version: 1,
        canvas: state.canvasDimensions,
        elements: state.elements,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `canvascraft_layout_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setFeedback({ type: 'success', message: 'Layout JSON downloaded successfully!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to generate layout JSON download.' });
    }
  };

  // Handle Import JSON Upload
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = validateLayoutData(parsed);

        if (result.valid && result.data) {
          loadLayout(result.data);
          setFeedback({ type: 'success', message: `Imported ${result.data.elements.length} elements successfully!` });
        } else {
          setFeedback({ type: 'error', message: result.error || 'Invalid layout JSON schema.' });
        }
      } catch (err) {
        setFeedback({ type: 'error', message: 'Malformed JSON file. Please check syntax.' });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setFeedback(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="panel-title">
        <FileCode size={16} />
        Import &amp; Export JSON
      </div>

      {feedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '12px',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: feedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: feedback.type === 'success' ? '#34D399' : '#FCA5A5',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          style={{ justifyContent: 'center' }}
          title="Download layout as canvascraft_layout.json"
        >
          <Download size={15} />
          Save &amp; Export JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />

        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          style={{ justifyContent: 'center' }}
          title="Upload JSON layout file"
        >
          <Upload size={15} />
          Load Layout JSON
        </button>
      </div>
    </div>
  );
};
