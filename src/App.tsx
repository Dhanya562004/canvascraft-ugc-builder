import React from 'react';
import { EditorProvider } from './context/EditorContext';
import { useAutosave } from './hooks/useAutosave';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { CanvasEditor } from './components/CanvasEditor';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { ExportImportPanel } from './components/ExportImportPanel';
import { PreviewPanel } from './components/PreviewPanel';
import './styles/index.css';

const MainWorkspace: React.FC = () => {
  // Activate automatic background persistence
  useAutosave(10000);

  return (
    <div className="app-container">
      <Header />

      <main className="workspace-layout">
        {/* Left Toolbar Column */}
        <Toolbar />

        {/* Center Interactive Canvas Viewport */}
        <CanvasEditor />

        {/* Right Properties, Layers & Export Panel Column */}
        <div className="sidebar right-sidebar">
          <PropertiesPanel />
          <div style={{ height: '1px', background: 'var(--border-dark)', margin: '4px 0' }} />
          <LayersPanel />
          <div style={{ height: '1px', background: 'var(--border-dark)', margin: '4px 0' }} />
          <ExportImportPanel />
          <div style={{ height: '1px', background: 'var(--border-dark)', margin: '4px 0' }} />
          <PreviewPanel />
        </div>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EditorProvider>
      <MainWorkspace />
    </EditorProvider>
  );
};

export default App;
