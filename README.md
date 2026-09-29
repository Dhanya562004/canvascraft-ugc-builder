<div align="center">

# 🎨 CanvasCraft – UGC Sandbox Builder

**A lightweight, interactive visual canvas editor and UGC sandbox built with Streamlit & HTML5/JS.**

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)
![Python Version](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28%2B-FF4B4B?logo=streamlit&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

### 🌐 [**👉 Click Here to Open Live Demo App**](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)

</div>

---

## 🚀 Overview

**CanvasCraft** is a mini web-based canvas editor (similar to Canva / Figma) engineered for user-generated content (UGC) layout design and sandboxing. 

It combines **Streamlit**'s python backend and control widgets with an embedded **HTML5 / CSS3 / Vanilla JavaScript** canvas rendered inside `st.components.v1.html`. Users can visually drag and drop elements, tweak properties in real-time, import/export layouts as JSON, and share layouts with team members via Discord webhook simulation.

---

## ✨ Features

- 🖱️ **Interactive Canvas (800x500)**: Drag-and-drop elements seamlessly across a modern dot-matrix workspace with real-time coordinate tracking (`X`, `Y`).
- 🧩 **Diverse Element Types**:
  - **Text**: Heading and typography blocks.
  - **Box**: Flexible containers/cards for layout structuring.
  - **Button**: Styled call-to-action buttons.
- ⚙️ **Live Properties Panel**: Customize element attributes dynamically:
  - Text Label & Content
  - Background & Text Colors (`st.color_picker`)
  - Width & Height dimensions
  - `X` and `Y` pixel positions
  - Delete element functionality
- 💾 **JSON Layout Import & Export**:
  - **Save**: Download layout configurations in structured JSON format.
  - **Load**: Restore saved canvas layouts instantly using Streamlit file uploader.
- 💬 **Team Collaboration (Discord Integration)**:
  - Simulate sending UGC canvas layout JSON payloads to a Discord Webhook with formatted embed previews.
- 🎨 **Modern Visual Aesthetics**: Glassmorphism UI touches, dark/light contrast header, badge counters, and smooth CSS transitions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend UI & State** | [Streamlit](https://streamlit.io/) |
| **Canvas Renderer** | Custom HTML5, Vanilla JavaScript, CSS3 (`st.components.v1.html`) |
| **Programming Language** | Python 3.9+ |
| **State Storage** | `st.session_state` & JSON |

---

## 📦 Quick Start & Local Setup

### 1. Prerequisites
Ensure you have **Python 3.9+** and **git** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/Dhanya562004/canvascraft-ugc-builder.git
cd canvascraft-ugc-builder
```

### 3. Install Dependencies
```bash
pip install streamlit
```

### 4. Run the Application
```bash
streamlit run app.py
```

The app will open automatically in your browser at `http://localhost:8501`.

---

## 🏗️ Code Architecture

The codebase (`app.py`) follows clean Python programming patterns:

```python
# Core Functions Structure
create_element(element_type, x, y, width, height, color, text)  # Instantiates new canvas elements
render_canvas(elements, selected_id)                          # Compiles & renders HTML/CSS/JS component
update_element(element_id, **kwargs)                           # Mutates element properties in session_state
```

---

## 📸 Preview & Screenshots

<div align="center">

```
 _________________________________________________________________________
| 🛠️ Controls Sidebar     | 🎨 Interactive Workspace Canvas               |
|-------------------------|-----------------------------------------------|
| [📝 Text] [📦 Box]      |  +-----------------------------------------+  |
|                         |  | 🚀 CanvasCraft Sandbox                     |  |
| ⚙️ Properties Panel     |  | [📦 Card Container]  (X:40, Y:120)       |  |
| - Text Input            |  |                     [🔘 Interactive Button]|  |
| - Color Picker          |  +-----------------------------------------+  |
| - Width / Height        |                                               |
| - Delete Element        | 📊 Live JSON & Element Summary                |
|                         | - Total Elements: 3                           |
| 💾 JSON Save & Load     | - Live JSON Payload Expander                  |
| 💬 Discord Integration  |                                               |
|_________________________|_______________________________________________|
```

</div>

---

## 🌐 Deployment

This application is live on **Streamlit Community Cloud**:
👉 **[CanvasCraft Live App](https://canvascraft-ugc-builder-ctbgdvhxrcpwj3epi38gqs.streamlit.app/)**

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
