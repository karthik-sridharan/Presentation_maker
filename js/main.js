import * as State from './state.js';
import * as Renderer from './renderer.js';
import { initEditor } from './editor.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize State
    const hasData = State.loadFromLocalStorage();
    
    // Initialize UI
    initTabs();
    initEditor();
    
    // Initial Render
    Renderer.renderActiveSlide();

    // Autosave listener
    window.addEventListener('beforeunload', () => State.saveToLocalStorage());
});

function initTabs() {
    const tabs = document.querySelectorAll('.left-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            // Logic to switch visible pane...
        });
    });
}
