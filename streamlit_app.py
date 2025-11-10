import streamlit as st
import streamlit.components.v1 as components

# Konfiguracja strony
st.set_page_config(
    page_title="Historyczny Inwestor",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Ukryj header i footer Streamlit
hide_streamlit_style = """
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Wczytaj i wyświetl grę HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Wyświetl grę w pełnej wysokości
components.html(html_content, height=900, scrolling=True)
