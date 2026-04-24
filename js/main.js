/**
 * main.js - Application Bootstrapper
 * 
 * Initializes the Lumina Presenter application by:
 * - Loading saved state from localStorage
 * - Setting up event listeners
 * - Initializing all modules
 */

import { initState, loadFromLocalStorage, getCurrentPayload } from './state.js';
import { initRenderer, renderPreview } from './renderer.js';
import { initEditor } from './editor.js';
import { initAnimations } from './animate.js';
import { initImport } from './import.js';
import { initExport } from './export.js';
import { initCopilot } from './copilot.js';
import { debounce, showToast } from './utils.js';

// Global app state
let appState = {
  initialized: false,
  currentSlideIndex: 0,
  leftTab: 'edit',
  rightTab: 'preview'
};

/**
 * Initialize the application
 */
async function init() {
  console.log('🚀 Initializing Lumina Presenter...');
  
  try {
    // Initialize state management
    await initState();
    
    // Load from localStorage if available
    const saved = loadFromLocalStorage();
    if (saved) {
      console.log('✓ Loaded saved presentation from localStorage');
    }
    
    // Initialize all modules
    initRenderer();
    initEditor();
    initAnimations();
    initImport();
    initExport();
    initCopilot();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Render initial preview
    renderPreview();
    
    appState.initialized = true;
    console.log('✓ Lumina Presenter initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    showToast('Failed to initialize application. Check console for details.', 'error');
  }
}

/**
 * Set up all UI event listeners
 */
function setupEventListeners() {
  // Left tab switching
  const leftTabs = document.querySelectorAll('[data-left-tab]');
  leftTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.leftTab;
      switchLeftTab(tabName);
    });
  });
  
  // Sub-tab switching
  const subtabs = document.querySelectorAll('[data-subtab]');
  subtabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const subtabName = tab.dataset.subtab;
      switchSubtab(subtabName);
    });
  });
  
  // Deck title input
  const deckTitleInput = document.getElementById('deckTitle');
  if (deckTitleInput) {
    deckTitleInput.addEventListener('input', debounce(() => {
      updateDeckTitle(deckTitleInput.value);
    }, 300));
  }
  
  // Slide type selector
  const slideTypeSelect = document.getElementById('slideType');
  if (slideTypeSelect) {
    slideTypeSelect.addEventListener('change', () => {
      updateSlideType(slideTypeSelect.value);
    });
  }
  
  // Background color selector
  const bgColorSelect = document.getElementById('bgColor');
  if (bgColorSelect) {
    bgColorSelect.addEventListener('change', () => {
      updateBackgroundColor(bgColorSelect.value);
    });
  }
  
  // Auto-save on any input
  document.addEventListener('input', debounce(() => {
    autoSave();
  }, 1000));
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  console.log('✓ Event listeners configured');
}

/**
 * Switch left panel tab
 */
function switchLeftTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('[data-left-tab]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.leftTab === tabName);
  });
  
  // Update panes
  document.querySelectorAll('[data-left-pane]').forEach(pane => {
    pane.classList.toggle('active', pane.dataset.leftPane === tabName);
  });
  
  appState.leftTab = tabName;
}

/**
 * Switch sub-tab
 */
function switchSubtab(subtabName) {
  const [group, tab] = subtabName.split(':');
  
  // Update subtab buttons within this group
  document.querySelectorAll(`[data-subtab-group="${group}"] [data-subtab]`).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtab === subtabName);
  });
  
  // Update sub-panes
  document.querySelectorAll(`[data-subpane^="${group}:"]`).forEach(pane => {
    pane.classList.toggle('active', pane.dataset.subpane === subtabName);
  });
}

/**
 * Update deck title
 */
function updateDeckTitle(newTitle) {
  const payload = getCurrentPayload();
  payload.deckTitle = newTitle;
  renderPreview();
}

/**
 * Update slide type
 */
function updateSlideType(newType) {
  // Implementation depends on state.js
  console.log('Update slide type:', newType);
  renderPreview();
}

/**
 * Update background color
 */
function updateBackgroundColor(newColor) {
  // Implementation depends on state.js
  console.log('Update background color:', newColor);
  renderPreview();
}

/**
 * Auto-save to localStorage
 */
function autoSave() {
  try {
    const payload = getCurrentPayload();
    localStorage.setItem('lumina_autosave', JSON.stringify(payload));
    console.log('✓ Auto-saved');
  } catch (error) {
    console.warn('Failed to auto-save:', error);
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
  // Cmd/Ctrl + S: Save
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    autoSave();
    showToast('Presentation saved');
  }
  
  // Cmd/Ctrl + Z: Undo (if implemented)
  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    // TODO: Implement undo
    console.log('Undo triggered');
  }
  
  // Cmd/Ctrl + Shift + Z: Redo (if implemented)
  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
    e.preventDefault();
    // TODO: Implement redo
    console.log('Redo triggered');
  }
  
  // Arrow keys: Navigate slides
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    // TODO: Implement slide navigation
    console.log('Navigate:', e.key);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.LuminaApp = {
  getState: () => appState,
  getCurrentPayload,
  renderPreview
};
