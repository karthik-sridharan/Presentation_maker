/**
 * export.js - Export Handlers
 * 
 * Export to standalone HTML, PDF, JSON.
 */

import { getCurrentPayload, exportDeckToJSON } from './state.js';
import { renderSlideHTML } from './renderer.js';
import { downloadFile } from './utils.js';

export function initExport() {
  setupExportHandlers();
  console.log('✓ Export handlers initialized');
}

function setupExportHandlers() {
  // JSON export
  const jsonExportBtn = document.getElementById('exportJsonBtn');
  if (jsonExportBtn) {
    jsonExportBtn.addEventListener('click', exportJSON);
  }
  
  // HTML export
  const htmlExportBtn = document.getElementById('exportHtmlBtn');
  if (htmlExportBtn) {
    htmlExportBtn.addEventListener('click', exportHTML);
  }
}

function exportJSON() {
  const json = exportDeckToJSON();
  const payload = getCurrentPayload();
  const filename = (payload.deckTitle || 'presentation').replace(/[^\w-]+/g, '_') + '.json';
  downloadFile(filename, json, 'application/json');
}

function exportHTML() {
  const payload = getCurrentPayload();
  const html = buildStandaloneHTML(payload);
  const filename = (payload.deckTitle || 'presentation').replace(/[^\w-]+/g, '_') + '.html';
  downloadFile(filename, html, 'text/html');
}

function buildStandaloneHTML(payload) {
  const slidesHTML = payload.slides.map(slide => renderSlideHTML(slide)).join('\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${payload.deckTitle || 'Presentation'}</title>
<style>
  /* TODO: Include slide CSS */
</style>
</head>
<body>
${slidesHTML}
</body>
</html>`;
}
