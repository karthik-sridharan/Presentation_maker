/**
 * renderer.js - Preview and Export Rendering
 * 
 * Handles rendering of slides in the preview pane and for export.
 */

import { getCurrentPayload, getCurrentSlide } from './state.js';
import { escapeHtml } from './utils.js';

export function initRenderer() {
  console.log('✓ Renderer initialized');
}

export function renderPreview() {
  const payload = getCurrentPayload();
  const slide = getCurrentSlide();
  
  if (!slide) return;
  
  const previewContainer = document.querySelector('.preview-scale');
  if (!previewContainer) return;
  
  previewContainer.innerHTML = renderSlideHTML(slide);
  
  // Trigger MathJax if available
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([previewContainer]).catch(err => console.warn('MathJax error:', err));
  }
}

export function renderSlideHTML(slide) {
  const classes = [
    'slide',
    slide.slideType || 'single',
    slide.beamerStyle ? `style-${slide.beamerStyle}` : ''
  ].filter(Boolean).join(' ');
  
  const style = `
    background: ${slide.backgroundColor || '#ffffff'};
    color: ${slide.fontColor || '#111111'};
  `.trim();
  
  return `
    <div class="${classes}" style="${style}">
      ${renderSlideTitle(slide)}
      ${renderSlideBody(slide)}
    </div>
  `;
}

function renderSlideTitle(slide) {
  const level = slide.headingLevel || 'h2';
  const title = escapeHtml(slide.title || '');
  return `<${level}>${title}</${level}>`;
}

function renderSlideBody(slide) {
  if (!slide.blocks || slide.blocks.length === 0) {
    return '<div class="slide-body"><div class="placeholder">Add content blocks</div></div>';
  }
  
  const blocksHTML = slide.blocks.map(block => renderBlock(block)).join('\n');
  return `<div class="slide-body">${blocksHTML}</div>`;
}

function renderBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return `<div class="rich"><p>${escapeHtml(block.content || '')}</p></div>`;
    case 'list':
      const items = (block.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
      return `<div class="rich"><ul>${items}</ul></div>`;
    case 'code':
      return `<div class="pseudo-block">${escapeHtml(block.content || '')}</div>`;
    case 'math':
      return `<div class="display-math">$$${block.content || ''}$$</div>`;
    default:
      return `<div class="placeholder">Unknown block type: ${block.type}</div>`;
  }
}
