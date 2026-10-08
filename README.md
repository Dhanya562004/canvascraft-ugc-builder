<div align="center">

# 🎨 CanvasCraft – UGC Sandbox Builder

**A high-performance, responsive visual canvas editor & UGC sandbox engineered with React, TypeScript, Vite, and Streamlit.**

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.64-FF4B4B?logo=streamlit&logoColor=white)

---

### 🌐 [**👉 Click Here to Launch Live Streamlit Demo**](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)

</div>

---

## 🚀 Overview

**CanvasCraft** is a production-style, browser-based visual canvas editor for user-generated content (UGC) layout sandboxing (similar to Canva / Figma). Targeted specifically at high-performance frontend engineering roles, it features:

- **Centralized React State Architecture**: Powered by React Context API and `useReducer` with typed discriminated union models.
- **High-Performance Canvas Editor**: Smooth 60fps drag-and-drop with `requestAnimationFrame` position throttling and boundary clamping across an 800x500 dot-matrix viewport.
- **Robust Persistence & Schema Validation**: Automated `localStorage` autosave with corrupt layout recovery and typed JSON schema import/export.
- **Full Editor History**: True `Undo` / `Redo` stack with debounced continuous drag state management.
- **Streamlit Containerized Deployment**: Vite bundled single-file HTML artifact seamlessly loaded inside Streamlit Community Cloud.

---

## ✨ Key Features

- 🖱️ **Interactive Workspace Canvas (800x500)**: Real-time pointer event tracking (`X`, `Y`), dynamic selection highlights, layer ordering, and visual bounding boxes.
- 🧩 **Typed Canvas Elements**:
  - **Text**: Heading, label, and typography blocks with customizable font sizes, colors, and alignments.
  - **Box Card**: Structuring containers with custom background colors, borders, and corner radiuses.
  - **Button**: Interactive call-to-action buttons with customizable styling.
- ⚙️ **Live Properties Panel**: Modify coordinates, dimensions, background/text colors, font sizes, corner radiuses, duplication, and element deletion.
- 🥞 **Layer Hierarchy Panel**: Reorder element Z-indexes deterministically (`Bring Forward`, `Send Backward`) and select layers directly.
- 👁️ **Live Preview & Edit Modes**: Seamlessly toggle between full interactive editor mode and clean user-facing composition preview mode.
- 💾 **JSON Layout Import & Export**: Download layout payloads with typed schema metadata (`version`, `canvas`, `elements`), and upload layout JSON files with instant validation and user error feedback.
- 💬 **Discord Webhook Share Simulation**: Generate simulated Discord payload embeds with live card preview and one-click copy to clipboard.
- ⌨️ **Keyboard Shortcuts & Accessibility**: Complete keyboard navigation (Arrow keys nudge, Shift+Arrow fast move, Del/Backspace, Ctrl+Z, Ctrl+Shift+Z, Ctrl+D, Ctrl+S, Esc) with semantic inputs and visual focus states.

---

## 🏗️ Architecture & Component Hierarchy

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
├── .github/
├── .gitignore
├── README.md
├── app.py                      # Streamlit application container
├── requirements.txt            # Python dependencies (streamlit)
├── package.json                # Node.js dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite & Vitest configuration
├── index.html                  # Main HTML entry point
├── dist/                       # Self-contained compiled React artifact
│   └── index.html
└── src/
    ├── __tests__/              # Vitest test suite
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
    ├── context/                # State provider
    │   └── EditorContext.tsx
    ├── hooks/                  # Custom React hooks
    │   ├── useAutosave.ts
    │   └── useHistory.ts
    ├── reducers/               # Central editor reducer
    │   └── editorReducer.ts
    ├── styles/                 # Glassmorphic CSS design system
    │   └── index.css
    ├── test/                   # Vitest setup
    │   └── setup.ts
    ├── types/                  # TypeScript interfaces & discriminated unions
    │   ├── canvas.ts
    │   └── editor.ts
    └── utils/                  # Core utilities
        ├── canvas.ts
        ├── persistence.ts
        └── validation.ts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Core** | React 18, TypeScript 5.7, Vite 6.0 |
| **State Architecture** | React Context API, `useReducer` |
| **Styling & Design** | Vanilla CSS3, Modern Glassmorphism, Google Fonts (`Plus Jakarta Sans`, `Fira Code`) |
| **Icons** | Lucide React |
| **Testing** | Vitest, React Testing Library, JSDOM |
| **Deployment Shell** | Streamlit Community Cloud, Python 3.9+ |

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0+ (Tested on v22.15)
- **Python**: 3.9+

### 2. Clone Repository
```bash
git clone https://github.com/Dhanya562004/canvascraft-ugc-builder.git
cd "CanvasCraft – UGC Sandbox Builder"
```

### 3. Install Node & Python Dependencies
```bash
npm install
pip install -r requirements.txt
```

### 4. Run React Dev Server (Local Frontend)
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build React Application
```bash
npm run build
```
This outputs `dist/index.html`, a single self-contained HTML bundle.

### 6. Run Streamlit App
```bash
streamlit run app.py
```
Open `http://localhost:8501` in your browser.

---

## 🧪 Testing Suite

The project includes unit tests for reducers, persistence, schema validation, and UI integration workflows.

Run all tests:
```bash
npm test
```

### Test Results Summary
```
 ✓ src/__tests__/validation.test.ts (6 tests)
 ✓ src/__tests__/persistence.test.ts (4 tests)
 ✓ src/__tests__/editorReducer.test.ts (8 tests)
 ✓ src/__tests__/CanvasEditor.test.tsx (3 tests)

 Test Files  4 passed (4)
      Tests  21 passed (21)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Delete` / `Backspace` | Delete selected element |
| `Arrow Keys` | Nudge element position by 1px |
| `Shift + Arrow Keys` | Fast move element position by 10px |
| `Ctrl / Cmd + D` | Duplicate selected element |
| `Ctrl / Cmd + S` | Save layout to `localStorage` |
| `Ctrl / Cmd + Z` | Undo last action |
| `Ctrl / Cmd + Shift + Z` / `Ctrl + Y` | Redo action |
| `Escape` | Deselect element / Clear selection |

---

## ⚡ Performance Optimization

1. **`requestAnimationFrame` Drag Throttling**: Drag positioning updates are synchronized with browser screen refreshes to prevent React rerender lag during high-frequency pointer moves.
2. **Local Component State**: Transient drag coordinates are maintained locally before committing final bounds to reducer state.
3. **Optimized Selection Rendering**: Elements are rendered in deterministic Z-index order with memoized pointer event listeners.

---

## ♿ Accessibility (a11y)

- **Semantic Controls**: Built using semantic HTML `<button>`, `<input>`, `<label>`, and `<header>` tags.
- **ARIA Labels & Focus**: Includes `aria-label` attributes and visible keyboard focus outlines (`:focus-visible`).
- **Keyboard Alternatives**: Complete keyboard positioning alternatives provided for canvas element manipulation.

---

## 🔒 Security & Schema Validation

- **XSS Prevention**: Imported text content is sanitized using HTML tag stripping regex rules.
- **Strict Schema Enforcement**: Imported JSON files and `localStorage` payloads must pass layout structure validation (`version`, `canvas`, `elements` array, numeric bounds) before loading.
- **Corrupt Storage Recovery**: Corrupted `localStorage` data is automatically cleared without crashing the UI.

---

## ☁️ Streamlit Community Cloud Deployment

To deploy this project to Streamlit Community Cloud:

1. Push the repository to GitHub ensuring `dist/index.html` is committed.
2. Sign in to [Streamlit Community Cloud](https://share.streamlit.io/).
3. Create a **New App** selecting repository `Dhanya562004/canvascraft-ugc-builder`.
4. Set Main File Path to `app.py`.
5. Click **Deploy!**

---

## 📝 Technical Notes & Honest Disclaimers

- **Discord Sharing**: Discord integration is a local payload simulation for demonstrating share flow capabilities; it does not connect directly to external Discord servers unless provided a valid webhook URL.
- **Local Persistence**: Persistence relies on browser `localStorage`. Clearing browser data will reset saved layouts.
- **Streamlit Embedding**: The React application is embedded inside Streamlit via a single-file compiled HTML bundle inside `st.components.v1.html`.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
