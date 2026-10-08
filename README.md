<div align="center">

# 🎨 CanvasCraft – UGC Sandbox Builder

**A production-style, high-performance visual canvas editor & UGC layout sandbox built with React 18, TypeScript 5.7, Vite 6.0, and Streamlit.**

[![Live Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.64-FF4B4B?logo=streamlit&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

### 🌐 [**👉 Click Here to Launch Live Streamlit Demo**](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)

</div>

---

## 📸 Interactive Workspace Preview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎨 CanvasCraft – UGC Sandbox Builder                 [Undo] [Redo] [Saved ✓] [Preview]  │
├─────────────────┬──────────────────────────────────────────────────────┬───────────────┤
│ 🛠️ TOOLBAR       │ 🎨 INTERACTIVE WORKSPACE CANVAS (800 x 500)          │ ⚙️ PROPERTIES  │
│                 │                                                      │               │
│ [📝 Add Text]   │  ┌────────────────────────────────────────────────┐  │ Text Content: │
│ [📦 Add Box]    │  │ 🚀 CanvasCraft Sandbox                            │  │ [ Heading... ]│
│ [🔘 Add Button] │  │                                                │  │               │
│                 │  │ ┌──────────────────────┐  ┌─────────────────┐ │  │ Color Picker: │
│ 🔍 VIEWPORT     │  │ │ Card Container       │  │ Interactive     │ │  │ [#6366F1]     │
│ Zoom: [ 100% ]  │  │ │                      │  │ Button          │ │  │               │
│ [-]  [+]        │  │ └──────────────────────┘  └─────────────────┘ │  │ Width / Height│
│                 │  └────────────────────────────────────────────────┘  │ [240px][160px]│
│                 ├──────────────────────────────────────────────────────┼───────────────┤
│                 │ 🥞 LAYERS HIERARCHY (3)   💾 IMPORT/EXPORT JSON      │ 🗑️ [Delete]   │
│                 │ z:3 • Interactive Button [Bring Forward][Send Back]  │ 📋 [Duplicate]│
└─────────────────┴──────────────────────────────────────────────────────┴───────────────┘
```

---

## 🚀 Key Highlights & Engineering Features

- **Centralized React State Architecture**: Engineered with React Context API and `useReducer` managing typed discriminated unions (`TextElement | BoxElement | ButtonElement`).
- **60fps Drag-and-Drop Performance**: High-frequency pointer interactions throttled with `requestAnimationFrame` for stutter-free position tracking across an 800x500 dot-matrix viewport.
- **Robust Schema Validation & Persistence**: Automatic background persistence to `localStorage` with corrupt layout auto-recovery and typed JSON import/export validation.
- **Full History Stack (`Undo` / `Redo`)**: Transactional state history stack capping drag noise and supporting standard hotkeys (`Ctrl+Z`, `Ctrl+Shift+Z`, `Ctrl+Y`).
- **Layer Hierarchy Control**: Deterministic Z-index layer management (`Bring Forward`, `Send Backward`) with real-time layer ordering.
- **Discord Webhook Share Simulation**: Simulated Discord embed payload generator with real-time card preview and one-click JSON payload clipboard copying.
- **Streamlit Cloud Compatible Architecture**: Compiled into a single self-contained Vite HTML bundle loaded seamlessly inside Streamlit Community Cloud without Node.js server dependencies.

---

## 🎯 Headout Software Engineer (Frontend) Alignment

This codebase demonstrates core competencies required for high-grade frontend engineering roles:

| Skill / Domain | Implementation Details |
|---|---|
| **React 18 & TypeScript** | Component-driven frontend with strict TS types, discriminated unions, zero `any` usage. |
| **State Management** | Centralized `EditorContext` and `editorReducer` implementing predictable state transitions. |
| **Performance Engineering** | Pointer event capture with `requestAnimationFrame` position throttling preventing React render lag. |
| **Responsive UI Design** | Flexbox/Grid CSS system adapting toolbar, canvas viewport, and property drawers across viewports. |
| **Testing & Quality** | Vitest + React Testing Library unit & integration test suite covering reducers, storage, and UI workflows. |
| **Accessibility (a11y)** | Keyboard positioning nudges (Arrow keys / Shift+Arrow), semantic ARIA controls, focus outlines. |
| **Deployment Packaging** | Bundled Vite single-file distribution embedded in Streamlit container shell (`app.py`). |

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Streamlit Shell (app.py)                         │
│   Reads dist/index.html & renders React bundle inside components.html  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  React Context Provider (EditorContext)                 │
│              Centralized State via editorReducer (useReducer)          │
└─────┬──────────────────────────────┬─────────────────────────────┬─────┘
      │                              │                             │
┌─────▼──────────────┐   ┌───────────▼───────────┐    ┌────────────▼──────────────┐
│  Toolbar (Left)    │   │ CanvasEditor (Center) │    │ Right Sidebar Panel       │
│ - Element Palette  │   │ - Pointer Interactions│    │ - Properties Panel        │
│ - Zoom Viewport    │   │ - RAF Drag Updates    │    │ - Layers Hierarchy        │
└────────────────────┘   │ - Selection Handles   │    │ - Import / Export JSON    │
                         └───────────────────────┘    │ - Live Preview & Stats    │
                                                      └───────────────────────────┘
```

---

## 📂 Project Structure

```
CanvasCraft – UGC Sandbox Builder/
├── app.py                      # Streamlit application container shell
├── requirements.txt            # Python dependencies (streamlit)
├── package.json                # Node.js dependencies, scripts & Vitest setup
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite & Vitest single-file build configuration
├── index.html                  # HTML5 entry point
├── dist/                       # Compiled production React artifact (single HTML bundle)
│   └── index.html
└── src/
    ├── __tests__/              # Automated test suite
    │   ├── CanvasEditor.test.tsx
    │   ├── editorReducer.test.ts
    │   ├── persistence.test.ts
    │   └── validation.test.ts
    ├── components/             # React UI components
    │   ├── CanvasEditor.tsx
    │   ├── ExportImportPanel.tsx
    │   ├── Header.tsx
    │   ├── KeyboardShortcutsModal.tsx
    │   ├── LayersPanel.tsx
    │   ├── PreviewPanel.tsx
    │   ├── PropertiesPanel.tsx
    │   ├── ShareDialog.tsx
    │   └── Toolbar.tsx
    ├── context/                # Context provider & custom hooks
    │   └── EditorContext.tsx
    ├── hooks/
    │   ├── useAutosave.ts
    │   └── useHistory.ts
    ├── reducers/               # Central editor reducer logic
    │   └── editorReducer.ts
    ├── styles/                 # Dark glassmorphism CSS design system
    │   └── index.css
    ├── types/                  # Typed interfaces & discriminated unions
    │   ├── canvas.ts
    │   └── editor.ts
    └── utils/                  # Core helpers
        ├── canvas.ts
        ├── persistence.ts
        └── validation.ts
```

---

## 💻 Local Development & Setup

### 1. Prerequisites
- **Node.js**: v18.0+ (Tested on v22.15)
- **Python**: 3.9+ (Tested on 3.13)

### 2. Clone Repository
```bash
git clone https://github.com/Dhanya562004/canvascraft-ugc-builder.git
cd "CanvasCraft – UGC Sandbox Builder"
```

### 3. Install Dependencies
```bash
npm install
pip install -r requirements.txt
```

### 4. Run Local React Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build Production Bundle
```bash
npm run build
```
Generates `dist/index.html` (single-file HTML artifact).

### 6. Launch Streamlit Application
```bash
streamlit run app.py
```
Open `http://localhost:8501` in your browser.

---

## 🧪 Testing & Verification

The project features automated Vitest suite covering state reducers, persistence, schema validation, and UI interaction workflows.

Execute tests:
```bash
npm test
```

### Execution Output:
```
 ✓ src/__tests__/validation.test.ts (6 tests)
 ✓ src/__tests__/persistence.test.ts (4 tests)
 ✓ src/__tests__/editorReducer.test.ts (8 tests)
 ✓ src/__tests__/CanvasEditor.test.tsx (3 tests)

 Test Files  4 passed (4)
      Tests  21 passed (21)
   Duration  7.43s
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
|---|---|
| `Delete` / `Backspace` | Delete currently selected element |
| `Arrow Keys` | Nudge element position by 1px |
| `Shift + Arrow Keys` | Fast move element position by 10px |
| `Ctrl / Cmd + D` | Duplicate selected element |
| `Ctrl / Cmd + S` | Trigger manual layout save to `localStorage` |
| `Ctrl / Cmd + Z` | Undo last editor action |
| `Ctrl / Cmd + Shift + Z` / `Ctrl + Y` | Redo action |
| `Escape` | Clear element selection |

---

## 📜 Layout JSON Schema Specification

Exported and imported layouts adhere to the typed schema structure:

```json
{
  "version": 1,
  "canvas": {
    "width": 800,
    "height": 500
  },
  "elements": [
    {
      "id": "elem_1700000000_abc",
      "type": "box",
      "x": 40,
      "y": 120,
      "width": 240,
      "height": 160,
      "zIndex": 2,
      "text": "Card Container",
      "style": {
        "color": "#FFFFFF",
        "backgroundColor": "#6366F1",
        "borderRadius": 12,
        "fontSize": 15,
        "fontWeight": 600,
        "textAlign": "center"
      }
    }
  ],
  "exportedAt": "2026-10-08T08:30:00.000Z"
}
```

---

## ☁️ Streamlit Community Cloud Deployment Guide

1. Ensure `dist/index.html` generated by `npm run build` is committed to the GitHub repository.
2. Sign in to [Streamlit Community Cloud](https://share.streamlit.io/).
3. Create a **New App** pointing to repository `Dhanya562004/canvascraft-ugc-builder` (`main` branch).
4. Select `app.py` as the Main File Path.
5. Deploy!

👉 **Live App**: [CanvasCraft Live App](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)

---

## 📄 Disclaimers & Technical Notes

- **Discord Sharing**: Discord integration is a local payload simulation designed for demonstrating team payload sharing flows.
- **Storage Persistence**: Layout persistence is saved in browser `localStorage`.
- **Streamlit Container**: Streamlit serves the React bundle via an iframe (`st.components.v1.html`).

---

## 📄 License

Distributed under the [MIT License](LICENSE).
