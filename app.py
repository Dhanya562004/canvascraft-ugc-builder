import os
import streamlit as st
import streamlit.components.v1 as components

# Streamlit Page Configuration
st.set_page_config(
    page_title="CanvasCraft – UGC Sandbox Builder",
    page_icon="🎨",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Custom Global CSS for seamless embedded display
st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        max-width: 100% !important;
    }
    iframe {
        border: none !important;
        width: 100% !important;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Path to compiled Vite React build artifact
    dist_path = os.path.join(os.path.dirname(__file__), "dist", "index.html")

    if os.path.exists(dist_path):
        with open(dist_path, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Render self-contained React app inside Streamlit iframe
        components.html(html_content, height=920, scrolling=True)
    else:
        st.error("⚠️ Compiled Frontend Build Artifact Missing!")
        st.warning(
            "Please build the React application first by executing:\n\n"
            "```bash\n"
            "npm install\n"
            "npm run build\n"
            "```\n\n"
            "This generates `dist/index.html` which Streamlit embeds."
        )

if __name__ == "__main__":
    main()
