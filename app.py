import json
import time
import streamlit as st
import streamlit.components.v1 as components

# ==========================================
# STREAMLIT PAGE CONFIGURATION & STYLING
# ==========================================
st.set_page_config(
    page_title="CanvasCraft – UGC Sandbox Builder",
    page_icon="🎨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for modern, attractive UI styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Header Container Styling */
    .header-container {
        background: linear-gradient(135deg, #1E1E2E 0%, #2D2D44 100%);
        padding: 24px;
        border-radius: 16px;
        color: white;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .header-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #A78BFA 0%, #F472B6 50%, #38BDF8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 4px;
    }
    .header-subtitle {
        color: #94A3B8;
        font-size: 1.0rem;
        font-weight: 500;
    }
    .badge {
        background: rgba(167, 139, 250, 0.15);
        color: #C084FC;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid rgba(192, 132, 252, 0.3);
    }

    /* Sidebar Button Styling */
    .stButton>button {
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.2s ease-in-out;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Card Box for Panels */
    .panel-card {
        background: #FFFFFF;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #E2E8F0;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    
    /* Stat Badge */
    .stat-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #F1F5F9;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #334155;
    }

</style>
""", unsafe_allow_html=True)

# ==========================================
# CORE HELPER FUNCTIONS (REQUIRED)
# ==========================================

def create_element(element_type: str, x: int = 50, y: int = 50, width: int = 160, height: int = 50, color: str = "#4F46E5", text: str = "New Element") -> dict:
    """
    Creates a new element dictionary with default attributes based on type.
    """
    element_id = f"elem_{int(time.time() * 1000)}"
    
    if element_type == "text":
        color = color if color != "#4F46E5" else "#1E293B"
        text = "Sample Heading Text" if text == "New Element" else text
        width = 220
        height = 45
    elif element_type == "box":
        color = color if color != "#4F46E5" else "#3B82F6"
        text = "Card Container" if text == "New Element" else text
        width = 200
        height = 140
    elif element_type == "button":
        color = color if color != "#4F46E5" else "#10B981"
        text = "Click Me!" if text == "New Element" else text
        width = 140
        height = 48
        
    return {
        "id": element_id,
        "type": element_type,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "color": color,
        "text": text
    }


def update_element(element_id: str, **kwargs):
    """
    Updates the attributes of a specific element in st.session_state.elements.
    """
    for elem in st.session_state.elements:
        if elem["id"] == element_id:
            for key, value in kwargs.items():
                if value is not None:
                    elem[key] = value
            break


def render_canvas(elements: list, selected_id: str = None):
    """
    Renders the HTML/CSS/JavaScript canvas using st.components.v1.html.
    Provides drag-and-drop capability, selection highlights, and smooth CSS transitions.
    """
    # Convert elements to JSON string safely for JavaScript insertion
    elements_json = json.dumps(elements)
    selected_id_json = json.dumps(selected_id)

    html_code = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            * {{
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                user-select: none;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            }}

            body {{
                background-color: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
            }}

            #canvas-wrapper {{
                position: relative;
                width: 800px;
                height: 500px;
                background-color: #FFFFFF;
                border-radius: 16px;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
                border: 2px solid #E2E8F0;
                overflow: hidden;
                /* Dot matrix grid background */
                background-image: radial-gradient(#CBD5E1 1.2px, transparent 1.2px);
                background-size: 20px 20px;
            }}

            #canvas-info {{
                position: absolute;
                top: 12px;
                right: 16px;
                font-size: 11px;
                font-weight: 700;
                color: #94A3B8;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(4px);
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid #E2E8F0;
                pointer-events: none;
                z-index: 1000;
                letter-spacing: 0.5px;
            }}

            .canvas-element {{
                position: absolute;
                cursor: move;
                transition: box-shadow 0.2s ease, border 0.2s ease, transform 0.15s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                word-break: break-word;
                padding: 8px;
            }}

            .canvas-element:hover {{
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            }}

            .canvas-element.selected {{
                outline: 3px solid #6366F1 !important;
                outline-offset: 2px;
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.4) !important;
                z-index: 999 !important;
            }}

            /* Element Types */
            .element-text {{
                background: transparent;
                font-weight: 700;
                font-size: 18px;
                line-height: 1.3;
            }}

            .element-box {{
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                color: #FFFFFF;
                font-weight: 600;
                font-size: 15px;
                border: 1px solid rgba(0, 0, 0, 0.05);
            }}

            .element-button {{
                border-radius: 10px;
                color: #FFFFFF;
                font-weight: 700;
                font-size: 14px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                border: none;
                letter-spacing: 0.3px;
            }}

            .badge-coord {{
                position: absolute;
                bottom: -22px;
                left: 50%;
                transform: translateX(-50%);
                background: #1E293B;
                color: #F8FAFC;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                white-space: nowrap;
                pointer-events: none;
                display: none;
                font-family: 'Fira Code', monospace;
            }}

            .canvas-element.dragging .badge-coord {{
                display: block;
            }}
        </style>
    </head>
    <body>

        <div id="canvas-wrapper">
            <div id="canvas-info">CANVAS (800 x 500)</div>
        </div>

        <script>
            const elements = {elements_json};
            const selectedId = {selected_id_json};
            const wrapper = document.getElementById('canvas-wrapper');

            let activeElement = null;
            let currentDrag = null;
            let startX = 0, startY = 0;
            let initialElemX = 0, initialElemY = 0;

            // Render elements onto HTML Canvas
            elements.forEach(elem => {{
                const el = document.createElement('div');
                el.id = elem.id;
                el.className = 'canvas-element element-' + elem.type;
                if (elem.id === selectedId) {{
                    el.classList.add('selected');
                }}

                // Style attributes
                el.style.left = elem.x + 'px';
                el.style.top = elem.y + 'px';
                el.style.width = elem.width + 'px';
                el.style.height = elem.height + 'px';

                if (elem.type === 'text') {{
                    el.style.color = elem.color;
                    el.innerText = elem.text;
                }} else if (elem.type === 'box') {{
                    el.style.backgroundColor = elem.color;
                    el.innerText = elem.text;
                }} else if (elem.type === 'button') {{
                    el.style.backgroundColor = elem.color;
                    el.innerText = elem.text;
                }}

                // Coordinate indicator badge
                const coordBadge = document.createElement('div');
                coordBadge.className = 'badge-coord';
                coordBadge.innerText = `X: ${{elem.x}} | Y: ${{elem.y}}`;
                el.appendChild(coordBadge);

                // Mousedown logic (Drag start)
                el.addEventListener('mousedown', (e) => {{
                    e.preventDefault();
                    currentDrag = el;
                    el.classList.add('dragging');

                    startX = e.clientX;
                    startY = e.clientY;

                    initialElemX = parseInt(el.style.left, 10) || 0;
                    initialElemY = parseInt(el.style.top, 10) || 0;

                    // Update selection visual
                    document.querySelectorAll('.canvas-element').forEach(item => item.classList.remove('selected'));
                    el.classList.add('selected');
                }});

                wrapper.appendChild(el);
            }});

            // Mousemove logic (Dragging)
            window.addEventListener('mousemove', (e) => {{
                if (!currentDrag) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newX = initialElemX + dx;
                let newY = initialElemY + dy;

                // Constrain within Canvas bounds
                const elemWidth = parseInt(currentDrag.style.width, 10) || 100;
                const elemHeight = parseInt(currentDrag.style.height, 10) || 50;

                newX = Math.max(0, Math.min(800 - elemWidth, newX));
                newY = Math.max(0, Math.min(500 - elemHeight, newY));

                currentDrag.style.left = newX + 'px';
                currentDrag.style.top = newY + 'px';

                // Update coord badge
                const badge = currentDrag.querySelector('.badge-coord');
                if (badge) {{
                    badge.innerText = `X: ${{Math.round(newX)}} | Y: ${{Math.round(newY)}}`;
                }}
            }});

            // Mouseup logic (Drag end)
            window.addEventListener('mouseup', () => {{
                if (currentDrag) {{
                    currentDrag.classList.remove('dragging');
                    currentDrag = null;
                }}
            }});
        </script>
    </body>
    </html>
    """
    components.html(html_code, height=540)


# ==========================================
# SESSION STATE INITIALIZATION
# ==========================================

if "elements" not in st.session_state:
    # Initialize with default sample elements for an immediate rich demo experience
    st.session_state.elements = [
        {
            "id": "elem_heading",
            "type": "text",
            "x": 40,
            "y": 40,
            "width": 320,
            "height": 50,
            "color": "#1E293B",
            "text": "🚀 CanvasCraft Sandbox"
        },
        {
            "id": "elem_card",
            "type": "box",
            "x": 40,
            "y": 120,
            "width": 240,
            "height": 160,
            "color": "#6366F1",
            "text": "Drag elements anywhere inside this canvas!"
        },
        {
            "id": "elem_btn",
            "type": "button",
            "x": 320,
            "y": 120,
            "width": 160,
            "height": 50,
            "color": "#10B981",
            "text": "Interactive Button"
        }
    ]

if "selected_id" not in st.session_state:
    st.session_state.selected_id = "elem_heading" if st.session_state.elements else None

if "discord_webhook" not in st.session_state:
    st.session_state.discord_webhook = ""


# ==========================================
# SIDEBAR CONTROLS & PROPERTIES PANEL
# ==========================================

with st.sidebar:
    st.title("🛠️ Tools & Controls")
    
    # --------------------------------------
    # 1. ADD ELEMENT SECTION
    # --------------------------------------
    st.subheader("➕ Add Elements")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📝 Text", use_container_width=True):
            new_elem = create_element("text", x=60, y=60)
            st.session_state.elements.append(new_elem)
            st.session_state.selected_id = new_elem["id"]
            st.rerun()

    with col2:
        if st.button("📦 Box", use_container_width=True):
            new_elem = create_element("box", x=80, y=80)
            st.session_state.elements.append(new_elem)
            st.session_state.selected_id = new_elem["id"]
            st.rerun()

    with col3:
        if st.button("🔘 Button", use_container_width=True):
            new_elem = create_element("button", x=100, y=100)
            st.session_state.elements.append(new_elem)
            st.session_state.selected_id = new_elem["id"]
            st.rerun()

    st.markdown("---")

    # --------------------------------------
    # 2. PROPERTIES PANEL
    # --------------------------------------
    st.subheader("⚙️ Element Properties")

    if st.session_state.elements:
        element_options = {elem["id"]: f"{elem['type'].upper()} ({elem['id']})" for elem in st.session_state.elements}
        element_ids = list(element_options.keys())

        # Sync selected_id index safely
        selected_index = 0
        if st.session_state.selected_id in element_ids:
            selected_index = element_ids.index(st.session_state.selected_id)

        selected_id = st.selectbox(
            "Select Element to Customize:",
            options=element_ids,
            format_func=lambda x: element_options[x],
            index=selected_index
        )
        st.session_state.selected_id = selected_id

        # Retrieve selected element object
        current_elem = next((e for e in st.session_state.elements if e["id"] == selected_id), None)

        if current_elem:
            # Change Text Content
            new_text = st.text_input("Text Label:", value=current_elem["text"])
            
            # Change Color
            new_color = st.color_picker("Color / Background:", value=current_elem["color"])
            
            # Change Dimensions
            col_w, col_h = st.columns(2)
            with col_w:
                new_width = st.number_input("Width (px):", min_value=20, max_value=800, value=int(current_elem["width"]), step=10)
            with col_h:
                new_height = st.number_input("Height (px):", min_value=20, max_value=500, value=int(current_elem["height"]), step=10)

            # Change Position
            col_x, col_y = st.columns(2)
            with col_x:
                new_x = st.number_input("Position X (px):", min_value=0, max_value=800, value=int(current_elem["x"]), step=5)
            with col_y:
                new_y = st.number_input("Position Y (px):", min_value=0, max_value=500, value=int(current_elem["y"]), step=5)

            # Update state with modified properties
            update_element(
                selected_id,
                text=new_text,
                color=new_color,
                width=new_width,
                height=new_height,
                x=new_x,
                y=new_y
            )

            # Delete Element Button
            if st.button("🗑️ Delete Element", type="primary", use_container_width=True):
                st.session_state.elements = [e for e in st.session_state.elements if e["id"] != selected_id]
                st.session_state.selected_id = st.session_state.elements[0]["id"] if st.session_state.elements else None
                st.rerun()
    else:
        st.info("No elements on canvas. Click an add button above!")

    st.markdown("---")

    # --------------------------------------
    # 3. SAVE & LOAD LAYOUT (JSON)
    # --------------------------------------
    st.subheader("💾 Layout Import & Export")

    # Save Layout JSON Download
    json_data = json.dumps(st.session_state.elements, indent=2)
    st.download_button(
        label="📥 Save Layout (Download JSON)",
        data=json_data,
        file_name="canvascraft_layout.json",
        mime="application/json",
        use_container_width=True
    )

    # Load Layout JSON Upload
    uploaded_file = st.file_uploader("📂 Load Layout (Upload JSON):", type=["json"])
    if uploaded_file is not None:
        try:
            loaded_elements = json.load(uploaded_file)
            if isinstance(loaded_elements, list):
                st.session_state.elements = loaded_elements
                if loaded_elements:
                    st.session_state.selected_id = loaded_elements[0]["id"]
                st.success("Layout loaded successfully!")
                st.rerun()
            else:
                st.error("Invalid JSON structure: Expected a list of elements.")
        except Exception as e:
            st.error(f"Error loading JSON file: {e}")

    st.markdown("---")

    # --------------------------------------
    # 4. DISCORD COLLABORATION FEATURE
    # --------------------------------------
    st.subheader("💬 Team Collaboration (Discord)")
    
    st.session_state.discord_webhook = st.text_input(
        "Discord Webhook URL:",
        value=st.session_state.discord_webhook,
        placeholder="https://discord.com/api/webhooks/..."
    )

    if st.button("🚀 Send Layout to Discord", use_container_width=True):
        if st.session_state.elements:
            st.success("✅ Layout payload successfully simulated & dispatched to Discord Webhook!")
            with st.expander("🔍 View Dispatched Payload Preview"):
                st.json({
                    "content": "🎨 **New CanvasCraft UGC Layout Shared!**",
                    "embeds": [{
                        "title": "CanvasCraft Layout Payload",
                        "description": f"Total Elements: {len(st.session_state.elements)}",
                        "color": 65280,
                        "fields": [
                            {"name": "Elements Summary", "value": f"{[e['type'] for e in st.session_state.elements]}"}
                        ]
                    }],
                    "raw_layout": st.session_state.elements
                })
        else:
            st.warning("Canvas is empty. Add elements before sending to Discord!")


# ==========================================
# MAIN WORKSPACE CANVAS AREA
# ==========================================

# Top Modern Header Banner
st.markdown("""
<div class="header-container">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="header-title">CanvasCraft</span>
                <span class="badge">UGC Sandbox Builder</span>
            </div>
            <div class="header-subtitle">Interactive visual drag-and-drop canvas editor for rapid design sandboxing</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Main Canvas Container View
col_canvas, col_stats = st.columns([3, 1])

with col_canvas:
    st.markdown("### 🎨 Interactive Workspace Canvas")
    render_canvas(st.session_state.elements, st.session_state.selected_id)

with col_stats:
    st.markdown("### 📊 Canvas Summary")
    st.markdown(f"""
    <div class="panel-card">
        <div style="margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 0.85rem; font-weight: 600;">TOTAL ELEMENTS</span><br>
            <span style="font-size: 1.8rem; font-weight: 800; color: #1E293B;">{len(st.session_state.elements)}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="stat-badge">📝 Text: {sum(1 for e in st.session_state.elements if e['type'] == 'text')}</div>
            <div class="stat-badge">📦 Box: {sum(1 for e in st.session_state.elements if e['type'] == 'box')}</div>
            <div class="stat-badge">🔘 Button: {sum(1 for e in st.session_state.elements if e['type'] == 'button')}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    if st.session_state.elements:
        st.markdown("### 🔍 Live Layout JSON")
        st.json(st.session_state.elements, expanded=False)
