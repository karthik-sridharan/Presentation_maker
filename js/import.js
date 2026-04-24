/**
 * import.js - Import Handlers
 * 
 * Import from Markdown, Beamer LaTeX, JSON, etc.
 */

import { loadDeckFromJSON } from './state.js';
import { renderPreview } from './renderer.js';

export function initImport() {
  setupImportHandlers();
  console.log('✓ Import handlers initialized');
}

function setupImportHandlers() {
  // JSON import
  const jsonImportBtn = document.getElementById('importJsonBtn');
  if (jsonImportBtn) {
    jsonImportBtn.addEventListener('click', importFromJSON);
  }
  
  // Markdown import
  const mdImportBtn = document.getElementById('importMdBtn');
  if (mdImportBtn) {
    mdImportBtn.addEventListener('click', importFromMarkdown);
  }
}

function importFromJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (loadDeckFromJSON(event.target.result)) {
          renderPreview();
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

function importFromMarkdown() {
  // TODO: Implement Markdown import
  console.log('Import from Markdown');
}
