import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import { CanvasElement } from '../types/canvas';
import { sortElementsByZIndex } from '../utils/canvas';

export const CanvasEditor: React.FC = () => {
  const {
    state,
    selectElement,
    moveElement,
    deleteElement,
    duplicateElement,
    undo,
    redo,
    saveToLocalStorage,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    id: string;
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const rafRef = useRef<number | null>(null);

  // Pointer Down (Drag Start)
  const handlePointerDown = (e: React.PointerEvent, elem: CanvasElement) => {
    if (state.previewMode) return;
    e.stopPropagation();

    // Select the element
    selectElement(elem.id);

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    setDragState({
      id: elem.id,
      startX: e.clientX,
      startY: e.clientY,
      initialElemX: elem.x,
      initialElemY: elem.y,
      currentX: elem.x,
      currentY: elem.y,
    });
  };

  // Pointer Move (Dragging with requestAnimationFrame)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;

      const dx = (e.clientX - dragState.startX) / state.zoom;
      const dy = (e.clientY - dragState.startY) / state.zoom;

      const nextX = Math.round(dragState.initialElemX + dx);
      const nextY = Math.round(dragState.initialElemY + dy);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setDragState((prev) => (prev ? { ...prev, currentX: nextX, currentY: nextY } : null));
        moveElement(dragState.id, nextX, nextY);
      });
    },
    [dragState, state.zoom, moveElement]
  );

  // Pointer Up (Drag Finish)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      setDragState(null);
    }
  };

  // Canvas background click clears selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      selectElement(null);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut keys if user is typing inside an input/textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const selectedId = state.selectedElementId;
      const selectedElem = state.elements.find((e) => e.id === selectedId);

      // Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
      }

      // Duplicate (Ctrl + D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
      }

      // Save (Ctrl + S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveToLocalStorage();
      }

      // Undo (Ctrl + Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Ctrl + Shift + Z or Ctrl + Y)
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
      }

      // Escape key clears selection
      if (e.key === 'Escape') {
        selectElement(null);
      }

      // Nudge position with Arrow keys
      if (selectedElem && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let deltaX = 0;
        let deltaY = 0;

        if (e.key === 'ArrowLeft') deltaX = -step;
        if (e.key === 'ArrowRight') deltaX = step;
        if (e.key === 'ArrowUp') deltaY = -step;
        if (e.key === 'ArrowDown') deltaY = step;

        moveElement(selectedElem.id, selectedElem.x + deltaX, selectedElem.y + deltaY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementId, state.elements, deleteElement, duplicateElement, saveToLocalStorage, undo, redo, selectElement, moveElement]);

  const sortedElements = useMemo(
    () => sortElementsByZIndex(state.elements),
    [state.elements]
  );

  return (
    <div className="editor-viewport">
      <div
        className="canvas-container-wrapper"
        style={{
          transform: `scale(${state.zoom})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          ref={containerRef}
          className={`canvas-board ${state.previewMode ? 'preview-mode' : ''}`}
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="region"
          aria-label="Interactive Canvas Workspace"
          tabIndex={0}
        >
          {/* Canvas Tag */}
          <div className="canvas-info-tag">
            CANVAS ({state.canvasDimensions.width} x {state.canvasDimensions.height})
          </div>

          {/* Render Elements */}
          {sortedElements.map((elem) => {
            const isSelected = state.selectedElementId === elem.id;
            const isDraggingThis = dragState?.id === elem.id;

            const posX = isDraggingThis ? dragState.currentX : elem.x;
            const posY = isDraggingThis ? dragState.currentY : elem.y;

            return (
              <div
                key={elem.id}
                id={elem.id}
                className={`canvas-element ${isSelected ? 'selected' : ''} ${
                  isDraggingThis ? 'dragging' : ''
                } ${state.previewMode ? 'preview-mode' : ''}`}
                onPointerDown={(e) => handlePointerDown(e, elem)}
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`,
                  width: `${elem.width}px`,
                  height: `${elem.height}px`,
                  zIndex: elem.zIndex,
                  color: elem.style.color,
                  backgroundColor: elem.style.backgroundColor || 'transparent',
                  border: elem.style.borderColor ? `2px solid ${elem.style.borderColor}` : 'none',
                  borderRadius: elem.style.borderRadius ? `${elem.style.borderRadius}px` : '0px',
                  fontSize: elem.style.fontSize ? `${elem.style.fontSize}px` : '16px',
                  fontWeight: elem.style.fontWeight || 'normal',
                  textAlign: elem.style.textAlign || 'center',
                  opacity: elem.style.opacity ?? 1,
                  padding: '8px',
                }}
              >
                {elem.text}

                {/* Coordinate Badge Overlay on Drag */}
                {isDraggingThis && (
                  <div className="badge-coord">
                    X: {posX} | Y: {posY}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
