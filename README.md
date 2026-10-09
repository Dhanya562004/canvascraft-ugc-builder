<div align="center">

# 🎨 CanvasCraft – UGC Sandbox Builder

**A production-grade, high-performance visual canvas editor & UGC layout sandbox built with React 18, TypeScript 5.7, Vite 6.0, Vercel, and Streamlit.**

[![Live Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)
![Lighthouse A11y](https://img.shields.io/badge/Lighthouse_A11y-100-brightgreen?logo=lighthouse&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

### 🌐 Live Application Demos

- 🚀 **Existing Streamlit Live Demo**: [https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)
- ⚡ **Standalone React Vercel Deployment**: Standard Vite SPA build configured via `vercel.json` (Root Directory, `npm run build`, `dist` output).

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
│ 🔍 VIEWPORT     │  │ │ Card Container       │  │ Interactive     │ │  │ [#3730A3]     │
│ Zoom: [ 100% ]  │  │ │                      │  │ Button          │ │  │               │
│ [-]  [+]        │  │ └──────────────────────┘  └─────────────────┘ │  │ Width / Height│
│                 │  └────────────────────────────────────────────────┘  │ [240px][160px]│
│                 ├──────────────────────────────────────────────────────┼───────────────┤
│                 │ 🥞 LAYERS HIERARCHY (3)   💾 IMPORT/EXPORT JSON      │ 🗑️ [Delete]   │
│                 │ z:3 • Interactive Button [Bring Forward][Send Back]  │ 📋 [Duplicate]│
└─────────────────┴──────────────────────────────────────────────────────┴───────────────┘
```

---

## 📊 Automated Lighthouse Audit Results

Lighthouse audits executed against the standalone React production build (`http://127.0.0.1:4173` preview server):

| Audit Category | Baseline (Before) | Measured Score (After Improvements) | Audit Mode |
|---|---|---|---|
| **Accessibility** | **83** | **100** 🟢 | Desktop & Mobile |
| **Performance** | **81** | **92** 🟢 | Desktop |
| **Performance** | **74** | **69 - 81** | Mobile |

### Key Improvements Implemented:
1. **Accessibility (a11y)**:
   - Fixed `button-name` audits by adding explicit `aria-label="Zoom out viewport"` and `aria-label="Zoom in viewport"` controls.
   - Fixed `label-content-name-mismatch` by matching Share button `aria-label` with visible text `"Share Payload"`.
   - Fixed `label` form element audits by binding explicit `htmlFor` and `id` attributes across all input controls in `PropertiesPanel`.
   - Added ARIA modal metadata (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) and keyboard trap prevention to `KeyboardShortcutsModal` and `ShareDialog`.
   - Enhanced canvas element color contrast ratios to satisfy WCAG AA/AAA standards.

2. **React Hooks & Performance Optimization**:
   - **`useEffect`**: Clean lifecycle event management for global hotkeys (`Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`, `Ctrl+S`, `Escape`) ignoring active input/textarea fields, with teardown cleanup.
   - **`useCallback`**: Reference-stable editor action dispatchers preventing unnecessary child re-renders.
   - **`useMemo`**: Derived layer sorting (`sortElementsByZIndex`), canvas component statistics, and share payload serialization memoized against dependency changes.

---

## 🧪 Automated Testing Suite

Built with **Vitest** and **React Testing Library** with 100% mocked browser APIs (zero external network dependencies required):

```bash
npm run test
```

- **5 Test Files Passed**
- **25 Tests Passed (100% Pass Rate)**

### Test Coverage Highlights:
- **Editor Rendering**: Verified main workspace layout, header controls, canvas viewport, and toolbar components.
- **User Interaction & Properties**: Verified element addition and real-time Properties Panel state reflection.
- **Keyboard Shortcuts & History**: Tested `Ctrl+D` duplication, `Ctrl+Z` undo stack, and `Backspace`/`Delete` removals.
- **Lifecycle & Modal Cleanup**: Verified modal opening, ARIA properties, and `Escape` key event listener cleanup.
- **REST API Integration**: Tested Discord webhook payload generation, clipboard copying, and HTTP response handling.

---

## 📡 REST API & Webhook Integration

CanvasCraft integrates a RESTful HTTP payload dispatch service (`ShareDialog.tsx`):

- **HTTP Verb**: `POST`
- **Payload Schema**: Structured JSON containing canvas metadata (`width`, `height`), layer breakdown, and raw array payload.
- **Header**: `Content-Type: application/json`
- **Status Code Handling**:
  - `200 OK` / `204 No Content`: Successful REST webhook delivery.
  - `400 Bad Request` / `404 Not Found`: Formatted HTTP status error feedback.
  - Network Failure / CORS Exception: Graceful fallback error reporting to user interface.

---

## 🛠️ Technology Stack & Local Setup

### Tech Stack
- **Frontend Core**: React 18.3, TypeScript 5.7, HTML5
- **Styling**: Modern Vanilla CSS with CSS variables, Glassmorphism, and Flexbox/Grid
- **Build Tool**: Vite 6.0 (`vite-plugin-singlefile`)
- **Testing**: Vitest 2.1, React Testing Library 16.1, JSDOM 25.0
- **Deployment**: Vercel (`vercel.json`) & Streamlit (`app.py`)

### Local Development Commands

```bash
# Clean dependency installation
npm ci

# Launch local Vite dev server
npm run dev

# Run full Vitest test suite
npm run test

# Compile production build artifact (dist/index.html)
npm run build

# Preview compiled production build
npm run preview
```

---

## 🌿 Git Branch & PR Workflow

- **Feature Branch**: `feat/canvascraft-frontend-quality`
- **Pull Request Title**: `Improve CanvasCraft frontend deployment, accessibility, and testing`
- **Target Branch**: `main`
