/**
 * utils.js - Utility Functions
 * Common helper functions used throughout the application
 */

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1400);
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(str) {
  return escapeHtml(str).replace(/\n/g, '&#10;');
}

export function hexToRgb(hex) {
  const clean = String(hex || '').trim().replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbaFromHex(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'rgba(0,0,0,' + alpha + ')';
  return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function preserveMathTokens(str) {
  const tokens = [];
  let out = String(str ?? '');
  const patterns = [/\$\$[\s\S]+?\$\$/g, /\\\[[\s\S]+?\\\]/g, /\\\([\s\S]+?\\\)/g, /\$(?!\s)[^$\n]+?\$/g];
  patterns.forEach((pattern) => {
    out = out.replace(pattern, (m) => {
      const key = '@@MATH' + tokens.length + '@@';
      tokens.push(m);
      return key;
    });
  });
  return { out, tokens };
}

export function restoreMathTokens(str, tokens) {
  return String(str).replace(/@@MATH(\d+)@@/g, (_, i) => tokens[Number(i)] ?? '');
}

export function randomHexColor() {
  const n = Math.floor(Math.random() * 0xffffff);
  return '#' + n.toString(16).padStart(6, '0');
}

export function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function waitFrames(count = 2) {
  return new Promise(resolve => {
    function step(n) {
      if (n <= 0) resolve();
      else requestAnimationFrame(() => step(n - 1));
    }
    step(count);
  });
}

export function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label || 'Timed out')), ms);
    promise.then(
      v => { clearTimeout(t); resolve(v); },
      e => { clearTimeout(t); reject(e); }
    );
  });
}

export function defaultReusableBlock(kind) {
  const presets = {
    theorem: { mode: 'panel', title: 'Theorem', content: '\\begin{card}{Theorem}\nState the theorem clearly here.\n\\end{card}' },
    proof: { mode: 'panel', title: 'Proof', content: '\\begin{card}{Proof}\nSketch the argument here.\n\\end{card}' },
    recap: { mode: 'panel', title: 'Recap', content: '\\begin{card}{Recap}\n\\begin{itemize}\n\\item First takeaway\n\\item Second takeaway\n\\end{itemize}\n\\end{card}' },
    algorithm: { mode: 'pseudocode-latex', title: 'Algorithm', content: 'Input: \\(x\\)\n\nfor \\(t = 1\\) to \\(T\\) do\n  step\nend\n\nreturn output' },
    citation: { mode: 'panel', title: 'Citation', content: '\\begin{card}{Citation}\nAuthor, Title, Venue, Year.\n\\end{card}' },
    reminder: { mode: 'panel', title: 'Speaker reminder', content: '\\begin{card}{Speaker reminder}\nMention the intuition before the formal statement.\n\\end{card}' }
  };
  return clone(presets[kind] || presets.recap);
}

export async function saveTextFileAs(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadFile(filename, content, mimeType) {
  return saveTextFileAs(filename, content, mimeType);
}
