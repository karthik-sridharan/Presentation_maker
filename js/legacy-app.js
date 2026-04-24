/**
 * legacy-app.js
 * Exact runtime JS extracted from index-working.html.
 * Safe stage-1 reset: no imports, no ES modules.
 */

const fields = {
  deckTitle: document.getElementById('deckTitle'),
  slideType: document.getElementById('slideType'),
  headingLevel: document.getElementById('headingLevel'),
  bgColor: document.getElementById('bgColor'),
  fontColor: document.getElementById('fontColor'),
  inheritTheme: document.getElementById('inheritTheme'),
  title: document.getElementById('title'),
  kicker: document.getElementById('kicker'),
  lede: document.getElementById('lede'),
  notesTitle: document.getElementById('notesTitle'),
  notesBody: document.getElementById('notesBody')
};
const blockFields = {
  column: document.getElementById('blockColumn'),
  mode: document.getElementById('blockMode'),
  title: document.getElementById('blockTitle'),
  content: document.getElementById('blockContent')
};

const themeFields = {
  name: document.getElementById('themeName'),
  bgColor: document.getElementById('themeBgColor'),
  fontColor: document.getElementById('themeFontColor'),
  accentColor: document.getElementById('themeAccentColor'),
  panelRadius: document.getElementById('themePanelRadius'),
  titleScale: document.getElementById('themeTitleScale'),
  beamerStyle: document.getElementById('themeBeamerStyle'),
  chromeColor: document.getElementById('themeChromeColor'),
  chromeTextColor: document.getElementById('themeChromeTextColor'),
  sidebarWidth: document.getElementById('themeSidebarWidth'),
  titleCaps: document.getElementById('themeTitleCaps')
};
const preview = document.getElementById('preview');
const snippetOutput = document.getElementById('snippetOutput');
const deckList = document.getElementById('deckList');
const blockList = document.getElementById('blockList');
const deckCount = document.getElementById('deckCount');
const previewTitle = document.getElementById('previewTitle');
const toast = document.getElementById('toast');
const columnModeBadge = document.getElementById('columnModeBadge');
const expandDiagramSnippet = document.getElementById('expandDiagramSnippet');
const figureModal = document.getElementById('figureModal');
const figureUrlInput = document.getElementById('figureUrlInput');
const figureAltInput = document.getElementById('figureAltInput');
const figureFileInput = document.getElementById('figureFileInput');
const figureImagePanel = document.getElementById('figureImagePanel');
const figureEditorPanel = document.getElementById('figureEditorPanel');
const blockLibraryList = document.getElementById('blockLibraryList');
const showGridToggle = document.getElementById('showGridToggle');
const showMarginsToggle = document.getElementById('showMarginsToggle');
const snapToGuidesToggle = document.getElementById('snapToGuidesToggle');
const lockAspectToggle = document.getElementById('lockAspectToggle');
const selectedFiguresStatus = document.getElementById('selectedFiguresStatus');
const previewGridOverlay = document.getElementById('previewGridOverlay');
const previewMarginOverlay = document.getElementById('previewMarginOverlay');
const previewBlockLabel = document.getElementById('previewBlockLabel');
const previewBlockFontScale = document.getElementById('previewBlockFontScale');
const previewBlockFontFamily = document.getElementById('previewBlockFontFamily');
const previewBlockFontColor = document.getElementById('previewBlockFontColor');
const previewBlockBulletType = document.getElementById('previewBlockBulletType');
const animateTargetLabel = document.getElementById('animateTargetLabel');
const animateBuildIn = document.getElementById('animateBuildIn');
const animateBuildOut = document.getElementById('animateBuildOut');
const animateStepMode = document.getElementById('animateStepMode');
const animateOrder = document.getElementById('animateOrder');
const copilotEls = {
  prompt: document.getElementById('copilotPrompt'),
  slideCount: document.getElementById('copilotSlideCount'),
  tone: document.getElementById('copilotTone'),
  mode: document.getElementById('copilotMode'),
  model: document.getElementById('copilotModel'),
  endpoint: document.getElementById('copilotEndpoint'),
  apiKey: document.getElementById('copilotApiKey'),
  status: document.getElementById('copilotStatus'),
  resultJson: document.getElementById('copilotResultJson')
};
const COPILOT_API_KEY_STORAGE = 'html-presentation-generator-openai-api-key-v1';
const COPILOT_SETTINGS_STORAGE = 'html-presentation-generator-copilot-settings-v1';

let slides = [];
let activeIndex = -1;
let draftBlocks = { left: [], right: [] };
let draftTitleStyle = normalizeBlockStyle();
let draftTitleAnimation = normalizeAnimation();
let selectedBlock = { left: -1, right: -1 };
let selectedPreviewBlockRef = null;
let syncingPreviewFigures = false;
const AUTOSAVE_KEY = 'html-presentation-generator-autosave-v5';
const BLOCK_LIBRARY_KEY = 'html-presentation-generator-block-library-v1';
let autosaveTimer = null;
let autosaveDirtyCount = 0;
let blockLibrary = [];


function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.remove('show'), 1400);
}
function setAutosaveStatus(msg){
  const el = document.getElementById('autosaveStatus');
  if(el) el.textContent = msg;
}
function clone(obj){ return JSON.parse(JSON.stringify(obj)); }

function defaultReusableBlock(kind){
  const presets = {
    theorem: { mode:'panel', title:'Theorem', content:'\\begin{card}{Theorem}\\nState the theorem clearly here.\\n\\end{card}' },
    proof: { mode:'panel', title:'Proof', content:'\\begin{card}{Proof}\\nSketch the argument here.\\n\\end{card}' },
    recap: { mode:'panel', title:'Recap', content:'\\begin{card}{Recap}\\n\\begin{itemize}\\n\\item First takeaway\\n\\item Second takeaway\\n\\end{itemize}\\n\\end{card}' },
    algorithm: { mode:'pseudocode-latex', title:'Algorithm', content:'Input: \\(x\\)\\n\\nfor \\(t = 1\\) to \\(T\\) do\\n  step\\nend\\n\\nreturn output' },
    citation: { mode:'panel', title:'Citation', content:'\\begin{card}{Citation}\\nAuthor, Title, Venue, Year.\\n\\end{card}' },
    reminder: { mode:'panel', title:'Speaker reminder', content:'\\begin{card}{Speaker reminder}\\nMention the intuition before the formal statement.\\n\\end{card}' }
  };
  return clone(presets[kind] || presets.recap);
}
function builtinLibraryEntries(){
  return [
    {id:'builtin-theorem', name:'Theorem box', builtin:true, block:defaultReusableBlock('theorem')},
    {id:'builtin-proof', name:'Proof box', builtin:true, block:defaultReusableBlock('proof')},
    {id:'builtin-recap', name:'Recap box', builtin:true, block:defaultReusableBlock('recap')},
    {id:'builtin-algorithm', name:'Algorithm box', builtin:true, block:defaultReusableBlock('algorithm')},
    {id:'builtin-citation', name:'Citation box', builtin:true, block:defaultReusableBlock('citation')},
    {id:'builtin-reminder', name:'Speaker reminder box', builtin:true, block:defaultReusableBlock('reminder')}
  ];
}
function loadBlockLibrary(){
  try{
    const raw = localStorage.getItem(BLOCK_LIBRARY_KEY);
    const saved = raw ? JSON.parse(raw) : [];
    blockLibrary = builtinLibraryEntries().concat(Array.isArray(saved) ? saved : []);
  }catch(err){
    blockLibrary = builtinLibraryEntries();
  }
}
function persistBlockLibrary(){
  const custom = blockLibrary.filter(item => !item.builtin);
  localStorage.setItem(BLOCK_LIBRARY_KEY, JSON.stringify(custom));
}
function renderBlockLibrary(){
  if(!blockLibraryList) return;
  blockLibraryList.innerHTML = blockLibrary.map((item, idx)=>`<button class="library-item ${idx===renderBlockLibrary.selectedIndex?'active':''}" data-lib-index="${idx}">${escapeHtml(item.name || 'Reusable block')}<small>${escapeHtml(item.block?.mode || 'panel')}${item.builtin ? ' · built-in' : ''}</small></button>`).join('');
  blockLibraryList.querySelectorAll('[data-lib-index]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      renderBlockLibrary.selectedIndex = Number(btn.dataset.libIndex);
      renderBlockLibrary();
    });
  });
}
renderBlockLibrary.selectedIndex = 0;
function saveCurrentBlockToLibrary(){
  const block = currentBlockFromEditor();
  const suggested = block.title || 'Reusable block';
  const name = prompt('Save reusable block as', suggested);
  if(!name) return;
  blockLibrary.push({
    id:'saved-' + Date.now(),
    name,
    builtin:false,
    block: clone(block)
  });
  renderBlockLibrary.selectedIndex = blockLibrary.length - 1;
  persistBlockLibrary();
  renderBlockLibrary();
  showToast('Saved reusable block.');
}
function insertSelectedLibraryBlock(){
  const item = blockLibrary[renderBlockLibrary.selectedIndex];
  if(!item) return;
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  const insertAt = idx >= 0 ? idx + 1 : arr.length;
  arr.splice(insertAt, 0, clone(item.block));
  setSelectedIndex(name, insertAt);
  loadSelectedBlockIntoEditor();
  renderBlockList();
  buildPreview();
  scheduleAutosave('Autosaved after inserting reusable block.');
  showToast('Inserted reusable block.');
}
function deleteSelectedLibraryBlock(){
  const item = blockLibrary[renderBlockLibrary.selectedIndex];
  if(!item || item.builtin){
    showToast('Built-in reusable blocks cannot be deleted.');
    return;
  }
  blockLibrary.splice(renderBlockLibrary.selectedIndex, 1);
  renderBlockLibrary.selectedIndex = Math.max(0, Math.min(renderBlockLibrary.selectedIndex, blockLibrary.length - 1));
  persistBlockLibrary();
  renderBlockLibrary();
  showToast('Deleted saved reusable block.');
}

function escapeHtml(str){
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escapeAttr(str){ return escapeHtml(str).replace(/\n/g,'&#10;'); }
function preserveMathTokens(str){
  const tokens = [];
  let out = String(str ?? '');
  const patterns = [/\$\$[\s\S]+?\$\$/g,/\\\[[\s\S]+?\\\]/g,/\\\([\s\S]+?\\\)/g,/\$(?!\s)[^$\n]+?\$/g];
  patterns.forEach((pattern)=>{
    out = out.replace(pattern, (m)=>{
      const key = '@@MATH' + tokens.length + '@@';
      tokens.push(m);
      return key;
    });
  });
  return { out, tokens };
}
function restoreMathTokens(str, tokens){
  return String(str).replace(/@@MATH(\d+)@@/g, (_, i)=>tokens[Number(i)] ?? '');
}
function hexToRgb(hex){
  const clean = String(hex || '').trim().replace('#','');
  if(!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean;
  const num = parseInt(full, 16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}
function rgbaFromHex(hex, alpha){
  const rgb = hexToRgb(hex);
  if(!rgb) return 'rgba(0,0,0,' + alpha + ')';
  return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
}
function normalizeTheme(theme){
  const t = theme || {};
  return {
    name: t.name || 'Default theme',
    bgColor: t.bgColor || '#ffffff',
    fontColor: t.fontColor || '#111111',
    accentColor: t.accentColor || '#2f6fed',
    panelRadius: Number.isFinite(Number(t.panelRadius)) ? Number(t.panelRadius) : 22,
    titleScale: Number.isFinite(Number(t.titleScale)) ? Number(t.titleScale) : 1,
    beamerStyle: t.beamerStyle || 'classic',
    chromeColor: t.chromeColor || '#17365d',
    chromeTextColor: t.chromeTextColor || '#ffffff',
    sidebarWidth: Number.isFinite(Number(t.sidebarWidth)) ? Number(t.sidebarWidth) : 118,
    titleCaps: String(t.titleCaps || '0')
  };
}
function themeFieldValue(name, fallback=''){
  const el = themeFields[name];
  return el ? el.value : fallback;
}
function setThemeFieldValue(name, value){
  const el = themeFields[name];
  if(el) el.value = value;
}
function currentThemeFromFields(){
  return normalizeTheme({
    name: themeFieldValue('name', 'Default theme'),
    bgColor: themeFieldValue('bgColor', '#ffffff'),
    fontColor: themeFieldValue('fontColor', '#111111'),
    accentColor: themeFieldValue('accentColor', '#2f6fed'),
    panelRadius: themeFieldValue('panelRadius', '22'),
    titleScale: themeFieldValue('titleScale', '1'),
    beamerStyle: themeFieldValue('beamerStyle', 'classic'),
    chromeColor: themeFieldValue('chromeColor', '#17365d'),
    chromeTextColor: themeFieldValue('chromeTextColor', '#ffffff'),
    sidebarWidth: themeFieldValue('sidebarWidth', '118'),
    titleCaps: themeFieldValue('titleCaps', '0')
  });
}
function applyThemeToForm(theme){
  const t = normalizeTheme(theme);
  setThemeFieldValue('name', t.name);
  setThemeFieldValue('bgColor', t.bgColor);
  setThemeFieldValue('fontColor', t.fontColor);
  setThemeFieldValue('accentColor', t.accentColor);
  setThemeFieldValue('panelRadius', String(t.panelRadius));
  setThemeFieldValue('titleScale', String(t.titleScale));
  setThemeFieldValue('beamerStyle', t.beamerStyle);
  setThemeFieldValue('chromeColor', t.chromeColor);
  setThemeFieldValue('chromeTextColor', t.chromeTextColor);
  setThemeFieldValue('sidebarWidth', String(t.sidebarWidth));
  setThemeFieldValue('titleCaps', String(t.titleCaps));
}
function currentPresentationOptions(){
  const liveDrawEl = document.getElementById('enableLiveDrawExport');
  return {
    enableLiveDraw: !!(liveDrawEl && liveDrawEl.checked)
  };
}
function applyPresentationOptions(options){
  const liveDrawEl = document.getElementById('enableLiveDrawExport');
  if(liveDrawEl) liveDrawEl.checked = !!(options && options.enableLiveDraw);
}
function currentStyleClass(){
  const t = currentThemeFromFields();
  return 'style-' + String(t.beamerStyle || 'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();
}
function buildSlideStyle(slide){
  const theme = currentThemeFromFields();
  const useTheme = slide.inheritTheme !== false;
  const bg = useTheme ? theme.bgColor : (slide.bgColor || theme.bgColor);
  const font = useTheme ? theme.fontColor : (slide.fontColor || theme.fontColor);
  const muted = rgbaFromHex(font, 0.72);
  const line = rgbaFromHex(font, 0.14);
  const titleTransform = String(theme.titleCaps) === '1' ? 'uppercase' : 'none';
  const titleLetterSpacing = String(theme.titleCaps) === '1' ? '.04em' : 'normal';
  let extra = '';
  const styleId = String(theme.beamerStyle || 'classic').toLowerCase();
  if(styleId === 'berkeley'){
    extra += 'padding-left:calc(3.3rem + ' + theme.sidebarWidth + 'px);';
    extra += 'background-image:linear-gradient(90deg,' + theme.chromeColor + ' 0 ' + theme.sidebarWidth + 'px, transparent ' + theme.sidebarWidth + 'px 100%),linear-gradient(180deg,' + theme.accentColor + ' 0 18px, transparent 18px 100%);';
    extra += 'background-repeat:no-repeat;';
  } else if(styleId === 'madrid'){
    extra += 'padding-top:5rem;padding-bottom:5.2rem;';
    extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 58px, transparent 58px calc(100% - 24px),' + theme.accentColor + ' calc(100% - 24px) 100%);';
    extra += 'background-repeat:no-repeat;';
  } else if(styleId === 'annarbor'){
    extra += 'padding-top:4.8rem;padding-bottom:5rem;';
    extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 64px, transparent 64px calc(100% - 18px),' + theme.accentColor + ' calc(100% - 18px) 100%);';
    extra += 'background-repeat:no-repeat;';
  } else if(styleId === 'cambridgeus'){
    extra += 'padding-top:4.7rem;padding-bottom:5rem;';
    extra += 'background-image:linear-gradient(180deg,transparent 0 56px, transparent 56px calc(100% - 18px),' + theme.chromeColor + ' calc(100% - 18px) 100%),linear-gradient(90deg,' + theme.accentColor + ' 0 18px,' + theme.chromeColor + ' 18px 100%);';
    extra += 'background-size:100% 100%,100% 56px;background-repeat:no-repeat;';
  } else if(styleId === 'pittsburgh'){
    extra += 'padding-top:4.2rem;';
    extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 16px, transparent 16px 100%);';
    extra += 'background-repeat:no-repeat;';
  }
  return 'background-color:' + bg + ';color:' + font + ';--text:' + font + ';--muted:' + muted + ';--line:' + line + ';--accent:' + theme.accentColor + ';--radius:' + theme.panelRadius + 'px;--title-scale:' + theme.titleScale + ';--chrome-fill:' + theme.chromeColor + ';--chrome-text:' + theme.chromeTextColor + ';--sidebar-width:' + theme.sidebarWidth + 'px;--title-transform:' + titleTransform + ';--title-letter-spacing:' + titleLetterSpacing + ';' + extra;
}
function beamerPresetTheme(name){
  const id = String(name || 'classic').toLowerCase();
  const presets = {
    classic: {name:'Classic', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:22, titleScale:1, beamerStyle:'classic', chromeColor:'#17365d', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
    berkeley: {name:'Berkeley', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#d4a017', panelRadius:18, titleScale:1, beamerStyle:'berkeley', chromeColor:'#17365d', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
    madrid: {name:'Madrid', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:20, titleScale:1, beamerStyle:'madrid', chromeColor:'#1f4e79', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
    annarbor: {name:'AnnArbor', bgColor:'#fffaf0', fontColor:'#2f2410', accentColor:'#7a4f01', panelRadius:18, titleScale:1, beamerStyle:'annarbor', chromeColor:'#c99a06', chromeTextColor:'#111111', sidebarWidth:118, titleCaps:'0'},
    cambridgeus: {name:'CambridgeUS', bgColor:'#ffffff', fontColor:'#10233b', accentColor:'#c53030', panelRadius:16, titleScale:1, beamerStyle:'cambridgeus', chromeColor:'#0f4c81', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'1'},
    pittsburgh: {name:'Pittsburgh', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:22, titleScale:1.02, beamerStyle:'pittsburgh', chromeColor:'#2f6fed', chromeTextColor:'#ffffff', sidebarWidth:96, titleCaps:'0'}
  };
  return normalizeTheme(presets[id] || presets.classic);
}
function applyStylePreset(name){
  const merged = normalizeTheme({...currentThemeFromFields(), ...beamerPresetTheme(name)});
  applyThemeToForm(merged);
  buildPreview();
  renderDeckList();
  scheduleAutosave('Autosaved after style preset change.');
  showToast('Applied ' + merged.name + ' style.');
}
function randomHexColor(){
  const n = Math.floor(Math.random() * 0xffffff);
  return '#' + n.toString(16).padStart(6, '0');
}
function applyStyleBuilder(){
  const merged = currentThemeFromFields();
  applyThemeToForm(merged);
  buildPreview();
  renderDeckList();
  scheduleAutosave('Autosaved after style builder update.');
  showToast('Updated master style.');
}
function randomizeStyleBuilder(){
  const styles = ['classic','berkeley','madrid','annarbor','cambridgeus','pittsburgh'];
  setThemeFieldValue('beamerStyle', styles[Math.floor(Math.random() * styles.length)]);
  setThemeFieldValue('chromeColor', randomHexColor());
  setThemeFieldValue('accentColor', randomHexColor());
  setThemeFieldValue('titleCaps', Math.random() > 0.5 ? '1' : '0');
  buildPreview();
  renderDeckList();
  scheduleAutosave('Autosaved after generating style variant.');
  showToast('Generated style variant.');
}

function parseStructuredText(raw, meta){
  const text = String(raw ?? '').replace(/\r\n/g, '\n').trim();
  if(!text) return '';
  function safeWithMath(str){
    const p = preserveMathTokens(str);
    return restoreMathTokens(escapeHtml(p.out), p.tokens);
  }
  const lines = text.split('\n');
  const parts = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  function flushParagraph(){
    if(!paragraph.length) return;
    const joined = paragraph.join(' ').trim();
    if(joined) parts.push('<p>' + safeWithMath(joined) + '</p>');
    paragraph = [];
  }
  function flushList(){
    if(!listItems.length) return;
    const tag = listType === 'enumerate' ? 'ol' : 'ul';
    parts.push('<' + tag + '>' + listItems.map(item=>'<li>' + safeWithMath(item) + '</li>').join('') + '</' + tag + '>');
    listItems = [];
    listType = null;
  }
  function collectUntil(endPattern, startIndex){
    const chunk = [];
    let i = startIndex;
    while(i < lines.length && !endPattern.test(lines[i].trim())){
      chunk.push(lines[i]);
      i += 1;
    }
    return { body: chunk.join('\n').trim(), endIndex: i };
  }
  function simpleCardBody(body){
    const trimmed = body.trim();
    if(!trimmed) return '';
    return trimmed.split(/\n\s*\n/).map(block => '<p>' + safeWithMath(block.replace(/\s*\n\s*/g, ' ').trim()) + '</p>').join('');
  }

  for(let i = 0; i < lines.length; i += 1){
    const line = lines[i].trim();
    if(!line){ flushParagraph(); flushList(); continue; }
    const paragraphMatch = line.match(/^\\paragraph\{([\s\S]*)\}$/);
    if(paragraphMatch){ flushParagraph(); flushList(); parts.push('<p>' + safeWithMath(paragraphMatch[1].trim()) + '</p>'); continue; }
    if(/^\\begin\{itemize\}$/i.test(line)){
      flushParagraph(); flushList();
      const items = [];
      i += 1;
      while(i < lines.length && !/^\\end\{itemize\}$/i.test(lines[i].trim())){
        const itemLine = lines[i].trim();
        if(itemLine){
          const itemMatch = itemLine.match(/^\\item\s+([\s\S]*)$/);
          if(itemMatch) items.push(itemMatch[1].trim());
        }
        i += 1;
      }
      parts.push('<ul>' + items.map(item=>'<li>' + safeWithMath(item) + '</li>').join('') + '</ul>');
      continue;
    }
    if(/^\\begin\{enumerate\}$/i.test(line)){
      flushParagraph(); flushList();
      const items = [];
      i += 1;
      while(i < lines.length && !/^\\end\{enumerate\}$/i.test(lines[i].trim())){
        const itemLine = lines[i].trim();
        if(itemLine){
          const itemMatch = itemLine.match(/^\\item\s+([\s\S]*)$/);
          if(itemMatch) items.push(itemMatch[1].trim());
        }
        i += 1;
      }
      parts.push('<ol>' + items.map(item=>'<li>' + safeWithMath(item) + '</li>').join('') + '</ol>');
      continue;
    }
    if(/^\\begin\{equation\}$/i.test(line)){
      flushParagraph(); flushList();
      const collected = collectUntil(/^\\end\{equation\}$/i, i + 1);
      parts.push('<div class="display-math">\\[\\begin{aligned}' + escapeHtml(collected.body) + '\\end{aligned}\\]</div>');
      i = collected.endIndex;
      continue;
    }
    const cardBegin = line.match(/^\\begin\{card\}\{([\s\S]*)\}$/i);
    if(cardBegin){
      flushParagraph(); flushList();
      const collected = collectUntil(/^\\end\{card\}$/i, i + 1);
      parts.push('<div class="bullet-card"><b>' + safeWithMath(cardBegin[1].trim()) + '</b><div>' + simpleCardBody(collected.body) + '</div></div>');
      i = collected.endIndex;
      continue;
    }
    if(/^\\begin\{figurehtml\}$/i.test(line)){
      flushParagraph(); flushList();
      const collected = collectUntil(/^\\end\{figurehtml\}$/i, i + 1);
      const figAttrs = meta ? (' data-column="' + escapeAttr(meta.column || '') + '" data-block-index="' + meta.blockIndex + '" data-figure-index="' + (meta.figureIndex++) + '"') : ''; parts.push('<div class="figure-embed"' + figAttrs + '>' + collected.body + '</div>');
      i = collected.endIndex;
      continue;
    }
    if(/^UL:/i.test(line)){ flushParagraph(); if(listType && listType !== 'itemize') flushList(); listType = 'itemize'; listItems.push(line.replace(/^UL:/i, '').trim()); continue; }
    if(line.startsWith('- ')){ flushParagraph(); if(listType && listType !== 'itemize') flushList(); listType = 'itemize'; listItems.push(line.slice(2).trim()); continue; }
    flushList();
    if(line.startsWith('### ')){ flushParagraph(); parts.push('<h3>' + safeWithMath(line.slice(4).trim()) + '</h3>'); continue; }
    if(/^P:/i.test(line)){ flushParagraph(); parts.push('<p>' + safeWithMath(line.replace(/^P:/i, '').trim()) + '</p>'); continue; }
    if(/^EQ:/i.test(line)){ flushParagraph(); parts.push('<div class="display-math">' + safeWithMath(line.replace(/^EQ:/i, '').trim()) + '</div>'); continue; }
    if(/^CARD:/i.test(line)){
      flushParagraph();
      const payload = line.replace(/^CARD:/i, '').trim();
      const pieces = payload.split('|');
      const cardTitle = pieces.shift() || '';
      const cardBody = pieces.join('|');
      parts.push('<div class="bullet-card"><b>' + safeWithMath(cardTitle) + '</b><div><p>' + safeWithMath(cardBody) + '</p></div></div>');
      continue;
    }
    if((/^\\\(.+\\\)$/s).test(line)){ flushParagraph(); parts.push('<div class="display-math">\\[' + escapeHtml(line.replace(/^\\\(/, '').replace(/\\\)$/, '')) + '\\]</div>'); continue; }
    if((/^\\\[.+\\\]$/s).test(line) || (/^\$\$.+\$\$$/s).test(line)){ flushParagraph(); parts.push('<div class="display-math">' + safeWithMath(line) + '</div>'); continue; }
    paragraph.push(line);
  }
  flushParagraph(); flushList();
  return parts.join('\\n');
}

function diagramMarkup(){
  return '<div class="diag"><svg class="diagram" viewBox="0 0 760 430" role="img" aria-label="Tiny neural network diagram placeholder"><line x1="145" y1="145" x2="355" y2="125" class="edge"/><line x1="145" y1="145" x2="355" y2="295" class="edge"/><line x1="145" y1="285" x2="355" y2="125" class="edge"/><line x1="145" y1="285" x2="355" y2="295" class="edge"/><line x1="405" y1="125" x2="615" y2="215" class="edge"/><line x1="405" y1="295" x2="615" y2="215" class="edge"/><circle cx="115" cy="145" r="34" class="node"/><circle cx="115" cy="285" r="34" class="node"/><circle cx="375" cy="125" r="34" class="node"/><circle cx="375" cy="295" r="34" class="node"/><circle cx="645" cy="215" r="34" class="node"/><text x="88" y="153" class="label">x₁</text><text x="88" y="293" class="label">x₂</text><text x="350" y="133" class="label">h₁</text><text x="350" y="303" class="label">h₂</text><text x="632" y="223" class="label">ŷ</text></svg></div>';
}
function customFrameMarkup(raw){
  const html = String(raw || '').trim();
  if(!html) return '<div class="placeholder">Paste custom HTML here.</div>';
  return '<div class="custom-frame-wrap"><iframe class="custom-frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads" referrerpolicy="no-referrer" srcdoc="' + escapeAttr(html) + '"></iframe></div>';
}
function diagramStandaloneDocument(innerHtml){
  const body = String(innerHtml || '').trim() || diagramMarkup();
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Inter,Arial,sans-serif}*{box-sizing:border-box}.diag{display:grid;place-items:center;padding:.9rem}.diagram{width:100%;max-width:680px;height:auto}.diagram .edge{stroke:currentColor;stroke-opacity:.32;stroke-width:6;stroke-linecap:round}.diagram .node{fill:none;stroke:currentColor;stroke-width:6}.diagram .label{fill:currentColor;font:700 28px Inter,system-ui,sans-serif}</style></head><body>' + body + '</body></html>';
}
function expandDiagramBlocksForSnippet(slide){
  const s = normalizeSlide(slide);
  const convert = (block)=>{
    if((block.mode || 'panel') !== 'diagram') return clone(block);
    return {
      mode: 'custom',
      title: block.title || '',
      content: diagramStandaloneDocument(block.content || diagramMarkup())
    };
  };
  s.leftBlocks = (s.leftBlocks || []).map(convert);
  s.rightBlocks = (s.rightBlocks || []).map(convert);
  return s;
}
function slideForSnippet(slide){
  return expandDiagramSnippet && expandDiagramSnippet.checked ? expandDiagramBlocksForSnippet(slide) : normalizeSlide(slide);
}
function normalizeBlockStyle(style){
  const s = style || {};
  const fontScale = Number.isFinite(Number(s.fontScale)) ? Number(s.fontScale) : 1;
  return {
    fontScale: Math.max(0.6, Math.min(2.5, fontScale)),
    fontFamily: s.fontFamily || 'inherit',
    fontColor: s.fontColor || '#111111',
    bulletType: s.bulletType || 'disc'
  };
}
function normalizeAnimation(anim){
  const a = anim || {};
  const buildIn = ['none','appear','fade'].includes(a.buildIn) ? a.buildIn : 'none';
  const buildOut = ['none','disappear','fade'].includes(a.buildOut) ? a.buildOut : 'none';
  const stepMode = ['all','by-item'].includes(a.stepMode) ? a.stepMode : 'all';
  const order = Number.isFinite(Number(a.order)) ? Number(a.order) : 0;
  return { buildIn, buildOut, stepMode, order };
}
function animationDataAttrs(anim){
  const a = normalizeAnimation(anim);
  return ' data-build-in="' + escapeAttr(a.buildIn) + '" data-build-out="' + escapeAttr(a.buildOut) + '" data-step-mode="' + escapeAttr(a.stepMode) + '" data-anim-order="' + escapeAttr(String(a.order)) + '"';
}
function blockWrapperStyle(block){
  const s = normalizeBlockStyle((block && block.style) || {});
  return '--block-font-scale:' + s.fontScale + ';--block-font-family:' + escapeAttr(s.fontFamily) + ';--block-font-color:' + s.fontColor + ';--block-bullet-type:' + s.bulletType + ';';
}
function titleWrapperStyle(style, heading){
  const s = normalizeBlockStyle(style || {});
  const baseMap = { h1:'5.6rem', h2:'3.1rem', h3:'2.45rem', h4:'2.1rem', h5:'1.8rem', h6:'1.55rem' };
  return '--block-font-scale:' + s.fontScale + ';--block-font-family:' + escapeAttr(s.fontFamily) + ';--block-font-color:' + s.fontColor + ';--title-base-size:' + (baseMap[String(heading || 'h2').toLowerCase()] || '3.1rem') + ';';
}
function normalizeBlock(block){
  const mode = block.mode || 'panel';
  if(mode === 'diagram'){
    return {
      mode: 'custom',
      title: block.title || 'Legacy diagram',
      content: diagramStandaloneDocument(block.content || diagramMarkup()),
      style: normalizeBlockStyle(block.style),
      animation: normalizeAnimation(block.animation)
    };
  }
  return {
    mode: mode,
    title: block.title || '',
    content: block.content || '',
    style: normalizeBlockStyle(block.style),
    animation: normalizeAnimation(block.animation)
  };
}
function normalizeSlide(slide){
  const out = clone(slide || {});
  let leftBlocks = Array.isArray(out.leftBlocks) ? out.leftBlocks.map(normalizeBlock) : null;
  let rightBlocks = Array.isArray(out.rightBlocks) ? out.rightBlocks.map(normalizeBlock) : null;
  if(!leftBlocks){
    leftBlocks = [{ mode: out.leftMode || 'panel', title: '', content: out.leftHtml || '' }];
  }
  if(!rightBlocks){
    rightBlocks = out.slideType === 'two-col'
      ? [{ mode: out.rightMode || 'panel', title: '', content: out.rightHtml || '' }]
      : [];
  }
  out.leftBlocks = leftBlocks;
  out.rightBlocks = rightBlocks;
  out.titleStyle = normalizeBlockStyle(out.titleStyle);
  out.titleAnimation = normalizeAnimation(out.titleAnimation);
  return out;
}
function renderBlock(block, placeholderText, meta){
  const resolvedMode = block.mode || 'panel';
  const raw = block.content || '';
  let inner = '';
  if(resolvedMode === 'diagram') inner = diagramMarkup();
  else if(resolvedMode === 'custom') inner = customFrameMarkup(raw);
  else if(resolvedMode === 'placeholder') inner = '<div class="placeholder">' + escapeHtml(raw || placeholderText || 'Placeholder') + '</div>';
  else if(resolvedMode === 'pseudocode') inner = '<pre class="pseudo-block">' + escapeHtml(raw) + '</pre>';
  else if(resolvedMode === 'pseudocode-latex'){
    const p = preserveMathTokens(raw);
    inner = '<div class="pseudo-latex-block">' + restoreMathTokens(escapeHtml(p.out), p.tokens) + '</div>';
  } else {
    const richMeta = meta ? { column: meta.column, blockIndex: meta.blockIndex, figureIndex: 0 } : null;
    inner = '<div class="rich">' + parseStructuredText(raw, richMeta) + '</div>';
  }
  const attrs = meta ? ' data-column="' + escapeAttr(meta.column || 'left') + '" data-block-index="' + meta.blockIndex + '" data-block-mode="' + escapeAttr(resolvedMode) + '"' : '';
  return '<div class="preview-block"' + attrs + animationDataAttrs(block.animation) + ' style="' + blockWrapperStyle(block) + '">' + inner + '</div>';
}
function renderBlocks(blocks, placeholder, columnName){
  const list = blocks && blocks.length ? blocks : [{ mode:'placeholder', content: placeholder || 'Add a block' }];
  return '<div class="col-stack">' + list.map((block, idx) => renderBlock(block, placeholder, { column: columnName || 'left', blockIndex: idx })).join('') + '</div>';
}
function buildSlideInner(slide){
  const heading = slide.headingLevel || 'h2';
  const titleHtml = '<div class="preview-title" data-preview-role="title"' + animationDataAttrs(slide.titleAnimation) + ' style="' + titleWrapperStyle(slide.titleStyle, heading) + '"><' + heading + '>' + escapeHtml(slide.title || 'Untitled slide').replace(/\n/g,'<br>') + '</' + heading + '></div>';
  const kickerHtml = slide.kicker ? '<div class="kicker">' + escapeHtml(slide.kicker) + '</div>' : '';
  const ledeHtml = slide.lede ? '<div class="lede">' + escapeHtml(slide.lede) + '</div>' : '';
  const s = normalizeSlide(slide);
  if(s.slideType === 'title-center') return '<div class="title-center">' + titleHtml + kickerHtml + '</div>';
  if(s.slideType === 'two-col'){
    return titleHtml + kickerHtml + ledeHtml + '<div class="slide-body"><div class="col">' + renderBlocks(s.leftBlocks, 'Left column', 'left') + '</div><div class="col">' + renderBlocks(s.rightBlocks, 'Right column', 'right') + '</div></div>';
  }
  return titleHtml + kickerHtml + ledeHtml + '<div class="slide-body"><div class="col">' + renderBlocks(s.leftBlocks, 'Main content', 'left') + '</div></div>';
}
function buildSlideMarkup(slide){
  const cls = slide.slideType === 'title-center' ? 'slide title-center' : (slide.slideType === 'two-col' ? 'slide two-col' : 'slide single');
  return '<section class="' + cls + ' ' + currentStyleClass() + '" style="' + buildSlideStyle(slide) + '">' + buildSlideInner(slide).trim() + '</section>';
}

function blankBlock(mode='panel'){
  return { mode, title:'', content:'' };
}
function currentDraftSlide(){
  if(!syncingPreviewFigures) syncPreviewFiguresToDraft(false);
  const leftBlocks = clone(draftBlocks.left);
  const rightBlocks = clone(draftBlocks.right);
  const name = currentColumnName();
  const idx = selectedIndex(name);
  const edited = currentBlockFromEditor();
  const target = name === 'right' ? rightBlocks : leftBlocks;
  if(idx >= 0 && idx < target.length){
    target[idx] = edited;
  }
  return {
    slideType: fields.slideType.value,
    headingLevel: fields.headingLevel.value,
    bgColor: fields.bgColor.value,
    fontColor: fields.fontColor.value,
    inheritTheme: fields.inheritTheme.checked,
    title: fields.title.value,
    kicker: fields.kicker.value,
    lede: fields.lede.value,
    titleStyle: clone(draftTitleStyle),
    titleAnimation: clone(draftTitleAnimation),
    leftBlocks: leftBlocks,
    rightBlocks: fields.slideType.value === 'two-col' ? rightBlocks : [],
    notesTitle: fields.notesTitle.value,
    notesBody: fields.notesBody.value
  };
}
function applySlideToForm(slide){
  const s = normalizeSlide(slide);
  fields.slideType.value = s.slideType || 'single';
  fields.headingLevel.value = s.headingLevel || 'h2';
  fields.bgColor.value = s.bgColor || '#ffffff';
  fields.fontColor.value = s.fontColor || '#111111';
  fields.inheritTheme.checked = s.inheritTheme !== false;
  fields.title.value = s.title || '';
  fields.kicker.value = s.kicker || '';
  fields.lede.value = s.lede || '';
  fields.notesTitle.value = s.notesTitle || 'Speaker notes';
  fields.notesBody.value = s.notesBody || '';
  draftTitleStyle = normalizeBlockStyle(s.titleStyle);
  draftTitleAnimation = normalizeAnimation(s.titleAnimation);
  draftBlocks = { left: clone(s.leftBlocks || []), right: clone(s.rightBlocks || []) };
  selectedBlock = { left: draftBlocks.left.length ? 0 : -1, right: draftBlocks.right.length ? 0 : -1 };
  if(fields.slideType.value !== 'two-col') selectedBlock.right = -1;
  if(blockFields.column.value === 'right' && fields.slideType.value !== 'two-col') blockFields.column.value = 'left';
  syncFields();
  loadSelectedBlockIntoEditor();
}
function syncFields(){
  const twoCol = fields.slideType.value === 'two-col';
  columnModeBadge.textContent = twoCol ? 'Two-column slide' : 'Single-column slide';
  blockFields.column.querySelector('option[value="right"]').disabled = !twoCol;
  if(!twoCol && blockFields.column.value === 'right') blockFields.column.value = 'left';
  previewTitle.textContent = fields.title.value || 'Current slide';
}
function currentColumnName(){ return blockFields.column.value === 'right' ? 'right' : 'left'; }
function blockArray(name){ return name === 'right' ? draftBlocks.right : draftBlocks.left; }
function selectedIndex(name){ return selectedBlock[name]; }
function setSelectedIndex(name, idx){ selectedBlock[name] = idx; }
function loadSelectedBlockIntoEditor(){
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  const block = arr[idx];
  if(!block){
    blockFields.mode.value = 'panel';
    blockFields.title.value = '';
    blockFields.content.value = '';
  } else {
    blockFields.mode.value = block.mode || 'panel';
    blockFields.title.value = block.title || '';
    blockFields.content.value = block.content || '';
  }
  renderBlockList();
}
function getDraftBlock(columnName, idx){
  const arr = blockArray(columnName);
  return (idx >= 0 && idx < arr.length) ? arr[idx] : null;
}
function currentBlockFromEditor(){
  const existing = getDraftBlock(currentColumnName(), selectedIndex(currentColumnName()));
  return {
    mode: blockFields.mode.value,
    title: blockFields.title.value,
    content: blockFields.content.value,
    style: normalizeBlockStyle(existing && existing.style),
    animation: normalizeAnimation(existing && existing.animation)
  };
}
function syncPreviewFiguresToDraft(updateSnippet = true){
  if(syncingPreviewFigures) return;
  syncingPreviewFigures = true;
  try{
    Array.from((preview || document).querySelectorAll('.figure-embed[data-column]')).forEach(embed=>saveFigureEmbedToDraft(embed));
    if(updateSnippet){
      snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    }
  } finally {
    syncingPreviewFigures = false;
  }
}
function saveCurrentBlockToDraft(){
  if(!syncingPreviewFigures) syncPreviewFiguresToDraft(false);
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  if(idx >= 0 && idx < arr.length){
    arr[idx] = currentBlockFromEditor();
  }
}
function saveCurrentSlideToDeck(){
  if(!syncingPreviewFigures) syncPreviewFiguresToDraft(false);
  if(activeIndex >= 0 && activeIndex < slides.length){
    slides[activeIndex] = currentDraftSlide();
  }
}
function currentDeckData(){
  return {
    deckTitle: fields.deckTitle.value || 'My HTML Presentation',
    theme: currentThemeFromFields(),
    presentationOptions: currentPresentationOptions(),
    slides: slides.length ? slides.map(normalizeSlide) : [currentDraftSlide()]
  };
}
function persistAutosaveNow(reason='Autosaved.'){
  try{
    syncPreviewFiguresToDraft(false);
    saveCurrentBlockToDraft();
    saveCurrentSlideToDeck();
    const payload = {
      deckTitle: fields.deckTitle.value || 'My HTML Presentation',
      theme: currentThemeFromFields(),
      presentationOptions: currentPresentationOptions(),
      slides: slides.length ? slides.map(normalizeSlide) : [currentDraftSlide()],
      activeIndex,
      draftSlide: currentDraftSlide(),
      selectedBlock,
      blockColumn: blockFields.column.value,
      ts: Date.now()
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
    autosaveDirtyCount = 0;
    setAutosaveStatus(reason);
    if(!syncingPreviewFigures){
      snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    }
  }catch(err){
    console.error(err);
    setAutosaveStatus('Autosave failed.');
  }
}
function scheduleAutosave(reason='Autosaved.'){
  autosaveDirtyCount += 1;
  setAutosaveStatus('Unsaved changes…');
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(()=>persistAutosaveNow(reason), 1200);
}
function restoreAutosave(){
  try{
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if(!raw) return false;
    const payload = JSON.parse(raw);
    if(payload.deckTitle) fields.deckTitle.value = payload.deckTitle;
    if(payload.theme) applyThemeToForm(payload.theme);
    if(payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
    slides = Array.isArray(payload.slides) ? payload.slides.map(normalizeSlide) : [];
    activeIndex = typeof payload.activeIndex === 'number' ? payload.activeIndex : (slides.length ? 0 : -1);
    if(activeIndex >= 0 && activeIndex < slides.length){
      applySlideToForm(slides[activeIndex]);
    }else if(payload.draftSlide){
      applySlideToForm(normalizeSlide(payload.draftSlide));
      activeIndex = -1;
    }
    if(payload.selectedBlock && typeof payload.selectedBlock === 'object'){
      selectedBlock = { left: payload.selectedBlock.left ?? -1, right: payload.selectedBlock.right ?? -1 };
    }
    if(payload.blockColumn) blockFields.column.value = payload.blockColumn;
    renderDeckList();
    buildPreview();
    setAutosaveStatus('Restored autosave.');
    return true;
  }catch(err){
    console.error(err);
    setAutosaveStatus('Could not restore autosave.');
    return false;
  }
}
function renderBlockList(){
  const name = currentColumnName();
  const arr = blockArray(name);
  blockList.innerHTML = arr.map((block, idx)=>`
    <button class="block-item ${idx === selectedIndex(name) ? 'active' : ''}" data-index="${idx}">
      ${escapeHtml(block.title || ('Block ' + (idx + 1)))}
      <span class="meta">${idx + 1}. ${escapeHtml(block.mode || 'panel')}</span>
    </button>
  `).join('');
  if(!arr.length){
    blockList.innerHTML = '<div class="placeholder" style="min-height:110px">No blocks in this column yet.</div>';
  } else {
    blockList.querySelectorAll('.block-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        setSelectedIndex(name, Number(btn.dataset.index));
        loadSelectedBlockIntoEditor();
        buildPreview();
      });
    });
  }
}
function addBlock(){
  const name = currentColumnName();
  const arr = blockArray(name);
  arr.push(currentBlockFromEditor());
  setSelectedIndex(name, arr.length - 1);
  renderBlockList();
  buildPreview();
  showToast('Added block.');
  scheduleAutosave('Autosaved after block add.');
}
function updateBlock(){
  syncPreviewFiguresToDraft(false);
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  if(idx < 0 || idx >= arr.length){ showToast('Select a block first.'); return; }
  arr[idx] = currentBlockFromEditor();
  renderBlockList();
  buildPreview();
  persistAutosaveNow('Autosaved after block update.');
  showToast('Updated block.');
}
function duplicateBlock(){
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  if(idx < 0 || idx >= arr.length){ showToast('Select a block first.'); return; }
  arr.splice(idx + 1, 0, clone(arr[idx]));
  setSelectedIndex(name, idx + 1);
  renderBlockList();
  buildPreview();
  showToast('Duplicated block.');
  scheduleAutosave('Autosaved after block duplicate.');
}
function deleteBlock(){
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  if(idx < 0 || idx >= arr.length){ showToast('Select a block first.'); return; }
  arr.splice(idx, 1);
  setSelectedIndex(name, arr.length ? Math.min(idx, arr.length - 1) : -1);
  loadSelectedBlockIntoEditor();
  buildPreview();
  showToast('Deleted block.');
  scheduleAutosave('Autosaved after block delete.');
}
function moveBlock(dir){
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  const next = idx + dir;
  if(idx < 0 || idx >= arr.length || next < 0 || next >= arr.length) return;
  const tmp = arr[idx]; arr[idx] = arr[next]; arr[next] = tmp;
  setSelectedIndex(name, next);
  renderBlockList();
  buildPreview();
  scheduleAutosave('Autosaved after block move.');
}
function clearBlockEditor(){
  blockFields.mode.value = 'panel';
  blockFields.title.value = '';
  blockFields.content.value = '';
}

function insertTextAtCursor(textarea, snippet){
  const value = textarea.value || '';
  const start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : value.length;
  const end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : value.length;
  textarea.value = value.slice(0, start) + snippet + value.slice(end);
  const pos = start + snippet.length;
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = pos;
}
function currentFigureMode(){
  return blockFields.mode.value || 'panel';
}
function wrapFigureHtml(html){
  return '\n\\begin{figurehtml}\n' + html + '\n\\end{figurehtml}\n';
}
function insertFigureAsNewCustomBlock(html){
  const name = currentColumnName();
  const arr = blockArray(name);
  const idx = selectedIndex(name);
  const block = { mode:'plain', title:'Figure', content: wrapFigureHtml(String(html || '').trim()) };
  const insertAt = idx >= 0 ? idx + 1 : arr.length;
  arr.splice(insertAt, 0, block);
  setSelectedIndex(name, insertAt);
  loadSelectedBlockIntoEditor();
  buildPreview();
  persistAutosaveNow('Autosaved after inserting figure.');
  showToast('Added figure as a new block.');
}
function insertFigureHtml(html){
  const clean = String(html || '').trim();
  if(!clean) return;
  const mode = currentFigureMode();
  if(mode === 'custom'){
    insertTextAtCursor(blockFields.content, (blockFields.content.value && !blockFields.content.value.endsWith('\n') ? '\n' : '') + clean + '\n');
    saveCurrentBlockToDraft();
    buildPreview();
    persistAutosaveNow('Autosaved after inserting figure.');
    showToast('Inserted figure into custom HTML block.');
    return;
  }
  if(mode === 'panel' || mode === 'plain'){
    insertTextAtCursor(blockFields.content, wrapFigureHtml(clean));
    saveCurrentBlockToDraft();
    buildPreview();
    persistAutosaveNow('Autosaved after inserting figure.');
    showToast('Inserted figure into the current block.');
    return;
  }
  insertFigureAsNewCustomBlock(clean);
}
window.insertFigureHtmlFromEditor = insertFigureHtml;
function buildImageFigureHtml(src, alt){
  const safeSrc = escapeAttr(src || '');
  const safeAlt = escapeAttr(alt || '');
  return '<figure data-figure-kind="image" data-box-x="0" data-box-y="0" data-box-w="" data-box-h="" data-original-w="" data-original-h="" data-lock-aspect="1" data-user-moved="0" data-user-sized="0" data-crop="0" data-z-index="1" data-object-fit="contain"><img src="' + safeSrc + '" alt="' + safeAlt + '" /></figure>';
}
function openFigureModal(){
  figureImagePanel.style.display = '';
  figureEditorPanel.style.display = 'none';
  figureModal.hidden = false;
}
function closeFigureModal(){
  figureModal.hidden = true;
}
function openSimpleDiagramEditor(){
  const popup = window.open('', '_blank', 'width=1200,height=860');
  if(!popup){
    alert('Popup blocked. Please allow popups for this page.');
    return;
  }
  const editorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Simple diagram editor</title>
<style>
  :root{--bg:#0f1630;--panel:#121933;--text:#eef3ff;--line:rgba(255,255,255,.12);--sel:#2563eb;--sel2:#93c5fd}
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;font-family:Inter,Arial,sans-serif;background:#f5f7fb}
  body{display:grid;grid-template-rows:auto 1fr}
  .bar{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;padding:.9rem;background:#111827;color:#fff}
  .bar button,.bar select{font:inherit;padding:.55rem .75rem;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;cursor:pointer}
  .bar input[type="text"]{font:inherit;padding:.55rem .75rem;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:#fff;color:#111;min-width:180px}
  .canvas-wrap{padding:1rem;height:100%}
  svg{width:100%;height:100%;display:block;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:18px;touch-action:none}
  .hint{margin-left:auto;opacity:.8;font-size:.92rem}
  [data-selected="1"]{stroke:var(--sel) !important;stroke-dasharray:8 6 !important}
  text[data-selected="1"]{fill:#0b57d0 !important;paint-order:stroke;stroke:var(--sel2) !important;stroke-width:2 !important}
</style>
</head>
<body>
<div class="bar">
  <select id="tool">
    <option value="select">Select / move</option>
    <option value="pen">Pen</option>
    <option value="erase">Erase</option>
    <option value="line">Line / arrow</option>
    <option value="rect">Rectangle</option>
    <option value="ellipse">Ellipse</option>
    <option value="text">Text</option>
  </select>
  <select id="pointerSource">
    <option value="any" selected>Any pointer</option>
    <option value="pen">Stylus only</option>
    <option value="touch">Finger only</option>
    <option value="mouse">Mouse only</option>
  </select>
  <input id="textInput" type="text" placeholder="Text for text tool" value="Label" />
  <label style="display:flex;align-items:center;gap:.35rem">Color <input id="drawColor" type="color" value="#111111" style="padding:0;width:44px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:#fff;cursor:pointer" /></label>
  <button id="undoBtn">Undo</button>
  <button id="deleteBtn">Delete selected</button>
  <button id="clearBtn">Clear</button>
  <button id="insertBtn">Insert into slide</button>
  <span class="hint">Supports mouse, trackpad, finger, and Apple Pencil / stylus.</span>
</div>
<div class="canvas-wrap">
  <svg id="svg" viewBox="0 0 1000 700"></svg>
</div>
<script>
const svg = document.getElementById('svg');
const toolEl = document.getElementById('tool');
const pointerSourceEl = document.getElementById('pointerSource');
const textInput = document.getElementById('textInput');
const drawColorInput = document.getElementById('drawColor');
let drawing = null;
let selected = null;
let dragOffset = null;
const made = [];

function pt(evt){
  const r = svg.getBoundingClientRect();
  const x = (evt.clientX - r.left) * 1000 / r.width;
  const y = (evt.clientY - r.top) * 700 / r.height;
  return {x,y};
}
function allowedPointer(evt){
  const pref = pointerSourceEl.value;
  if(pref === 'any') return true;
  const type = evt.pointerType || 'mouse';
  return type === pref;
}
function currentDrawColor(){
  return (drawColorInput && drawColorInput.value) ? drawColorInput.value : '#111111';
}
function applyColorToSelected(){
  if(!selected) return;
  const tag = selected.tagName.toLowerCase();
  const color = currentDrawColor();
  if(tag === 'text') selected.setAttribute('fill', color);
  else selected.setAttribute('stroke', color);
}
function baseStyle(el, evt){
  const pressure = evt && typeof evt.pressure === 'number' && evt.pressure > 0 ? evt.pressure : 0.5;
  const width = evt && evt.pointerType === 'pen' ? (2 + pressure * 4).toFixed(2) : '3';
  el.setAttribute('stroke', currentDrawColor());
  el.setAttribute('stroke-width', width);
  el.setAttribute('fill', 'transparent');
  el.style.vectorEffect = 'non-scaling-stroke';
  const tag = (el.tagName || '').toLowerCase();
  if(tag === 'line' || tag === 'polyline') el.setAttribute('pointer-events', 'visibleStroke');
  else el.setAttribute('pointer-events', 'all');
}
function hitTarget(target){
  if(!target || target === svg) return null;
  return target.closest('rect,ellipse,line,polyline,text');
}
function add(el, shouldSelect){
  svg.appendChild(el);
  made.push(el);
  if(shouldSelect) selectElement(el);
}
function clearSelection(){
  if(selected) selected.removeAttribute('data-selected');
  selected = null;
}
function selectElement(el){
  clearSelection();
  if(el && el !== svg){
    selected = el;
    selected.setAttribute('data-selected', '1');
  }
}
function removeEl(el){
  if(!el || el === svg) return;
  if(selected === el) clearSelection();
  const idx = made.indexOf(el);
  if(idx >= 0) made.splice(idx, 1);
  el.remove();
}
function moveSelected(dx, dy){
  if(!selected) return;
  const tag = selected.tagName.toLowerCase();
  if(tag === 'rect'){
    selected.setAttribute('x', parseFloat(selected.getAttribute('x')) + dx);
    selected.setAttribute('y', parseFloat(selected.getAttribute('y')) + dy);
  } else if(tag === 'ellipse'){
    selected.setAttribute('cx', parseFloat(selected.getAttribute('cx')) + dx);
    selected.setAttribute('cy', parseFloat(selected.getAttribute('cy')) + dy);
  } else if(tag === 'line'){
    ['x1','x2'].forEach(k=>selected.setAttribute(k, parseFloat(selected.getAttribute(k)) + dx));
    ['y1','y2'].forEach(k=>selected.setAttribute(k, parseFloat(selected.getAttribute(k)) + dy));
  } else if(tag === 'polyline'){
    const pts = selected.getAttribute('points').trim().split(/\s+/).filter(Boolean).map(pair=>pair.split(',').map(Number));
    selected.setAttribute('points', pts.map(([x,y]) => (x+dx)+','+(y+dy)).join(' '));
  } else if(tag === 'text'){
    selected.setAttribute('x', parseFloat(selected.getAttribute('x')) + dx);
    selected.setAttribute('y', parseFloat(selected.getAttribute('y')) + dy);
  }
}

svg.addEventListener('pointerdown', (evt)=>{
  if(!allowedPointer(evt)) return;
  const tool = toolEl.value;
  const p = pt(evt);

  if(tool === 'select'){
    const hit = hitTarget(evt.target);
    if(hit){
      selectElement(hit);
      dragOffset = {x:p.x, y:p.y};
    } else {
      clearSelection();
    }
    svg.setPointerCapture(evt.pointerId);
    return;
  }

  if(tool === 'erase'){
    const hit = hitTarget(evt.target);
    if(hit){
      removeEl(hit);
    }
    svg.setPointerCapture(evt.pointerId);
    return;
  }

  clearSelection();

  if(tool === 'pen'){
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    baseStyle(poly, evt);
    poly.setAttribute('points', p.x + ',' + p.y);
    drawing = {tool, el: poly};
    add(poly, false);
  } else if(tool === 'line'){
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    baseStyle(line, evt);
    line.setAttribute('x1', p.x); line.setAttribute('y1', p.y); line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
    drawing = {tool, el: line, start: p};
    add(line, false);
  } else if(tool === 'rect'){
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    baseStyle(rect, evt);
    rect.setAttribute('x', p.x); rect.setAttribute('y', p.y); rect.setAttribute('width', 1); rect.setAttribute('height', 1);
    drawing = {tool, el: rect, start: p};
    add(rect, false);
  } else if(tool === 'ellipse'){
    const e = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    baseStyle(e, evt);
    e.setAttribute('cx', p.x); e.setAttribute('cy', p.y); e.setAttribute('rx', 1); e.setAttribute('ry', 1);
    drawing = {tool, el: e, start: p};
    add(e, false);
  } else if(tool === 'text'){
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', p.x);
    t.setAttribute('y', p.y);
    t.setAttribute('fill', currentDrawColor());
    t.setAttribute('font-size', '28');
    t.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    t.setAttribute('pointer-events', 'all');
    t.textContent = textInput.value || 'Text';
    add(t, false);
  }
  svg.setPointerCapture(evt.pointerId);
});

svg.addEventListener('pointermove', (evt)=>{
  if(!allowedPointer(evt)) return;
  const p = pt(evt);

  if(toolEl.value === 'erase' && (evt.buttons & 1)){
    const hit = hitTarget(evt.target);
    if(hit) removeEl(hit);
    return;
  }

  if(selected && dragOffset && toolEl.value === 'select'){
    const dx = p.x - dragOffset.x, dy = p.y - dragOffset.y;
    dragOffset = p;
    moveSelected(dx, dy);
    return;
  }

  if(!drawing) return;
  if(drawing.tool === 'pen'){
    const pts = drawing.el.getAttribute('points');
    drawing.el.setAttribute('points', pts + ' ' + p.x + ',' + p.y);
  } else if(drawing.tool === 'line'){
    drawing.el.setAttribute('x2', p.x); drawing.el.setAttribute('y2', p.y);
  } else if(drawing.tool === 'rect'){
    const x = Math.min(drawing.start.x, p.x), y = Math.min(drawing.start.y, p.y);
    const w = Math.abs(p.x - drawing.start.x), h = Math.abs(p.y - drawing.start.y);
    drawing.el.setAttribute('x', x); drawing.el.setAttribute('y', y); drawing.el.setAttribute('width', w); drawing.el.setAttribute('height', h);
  } else if(drawing.tool === 'ellipse'){
    drawing.el.setAttribute('cx', (drawing.start.x + p.x) / 2);
    drawing.el.setAttribute('cy', (drawing.start.y + p.y) / 2);
    drawing.el.setAttribute('rx', Math.abs(p.x - drawing.start.x) / 2);
    drawing.el.setAttribute('ry', Math.abs(p.y - drawing.start.y) / 2);
  }
});
function stopInteraction(){
  drawing = null;
  dragOffset = null;
  if(toolEl.value !== 'select') clearSelection();
}
svg.addEventListener('pointerup', stopInteraction);
svg.addEventListener('pointercancel', stopInteraction);

document.getElementById('undoBtn').addEventListener('click', ()=>{
  const el = made.pop();
  if(el){
    if(selected === el) clearSelection();
    el.remove();
  }
});
document.getElementById('deleteBtn').addEventListener('click', ()=> removeEl(selected));
document.getElementById('clearBtn').addEventListener('click', ()=>{
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  made.length = 0;
  clearSelection();
});
if(drawColorInput) drawColorInput.addEventListener('input', applyColorToSelected);
function trimmedSvgMarkup(){
  clearSelection();
  const clone = svg.cloneNode(true);
  Array.from(clone.querySelectorAll('[data-selected]')).forEach(el=>el.removeAttribute('data-selected'));
  const elems = made.filter(el => el && el.ownerSVGElement === svg);
  if(!elems.length) return clone.outerHTML;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  elems.forEach(el=>{
    try{
      const bb = el.getBBox();
      const sw = parseFloat(el.getAttribute('stroke-width') || 0) || 0;
      minX = Math.min(minX, bb.x - sw);
      minY = Math.min(minY, bb.y - sw);
      maxX = Math.max(maxX, bb.x + bb.width + sw);
      maxY = Math.max(maxY, bb.y + bb.height + sw);
    }catch(e){}
  });
  if(!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) return clone.outerHTML;
  const pad = 18;
  const vbX = Math.max(0, minX - pad);
  const vbY = Math.max(0, minY - pad);
  const vbW = Math.max(40, (maxX - minX) + 2 * pad);
  const vbH = Math.max(40, (maxY - minY) + 2 * pad);
  clone.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
  clone.setAttribute('width', vbW);
  clone.setAttribute('height', vbH);
  clone.removeAttribute('style');
  return clone.outerHTML;
}
document.getElementById('insertBtn').addEventListener('click', ()=>{
  const svgMarkup = trimmedSvgMarkup();
  if(window.opener && !window.opener.closed && typeof window.opener.insertFigureHtmlFromEditor === 'function'){
    window.opener.insertFigureHtmlFromEditor('<figure>' + svgMarkup + '</figure>');
    window.close();
  } else {
    alert('Could not send the diagram back to the generator.');
  }
});
window.addEventListener('keydown', (evt)=>{
  if((evt.key === 'Delete' || evt.key === 'Backspace') && selected){
    evt.preventDefault();
    removeEl(selected);
  }
});
<\/script>
</body>
</html>`;
  popup.document.open();
  popup.document.write(editorHtml);
  popup.document.close();
  closeFigureModal();
}

function updatePreviewScale(){
  const frame = document.getElementById('previewFrame');
  const scaleEl = document.getElementById('previewScale');
  if(!frame || !scaleEl) return;
  const baseW = 1600, baseH = 900;
  const scale = Math.min(frame.clientWidth / baseW, frame.clientHeight / baseH);
  const scaledW = baseW * scale;
  const scaledH = baseH * scale;
  const offsetX = Math.max(0, (frame.clientWidth - scaledW) / 2);
  const offsetY = Math.max(0, (frame.clientHeight - scaledH) / 2);
  scaleEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}
function fitFiguresInSlide(slideEl){
  if(!slideEl) return;
  const figures = Array.from(slideEl.querySelectorAll('.figure-embed'));
  if(!figures.length) return;

  // Reset only auto-managed figures. Manually moved/resized figures should keep their saved box geometry.
  figures.forEach(embed=>{
    if(isManualFigureEmbed(embed)) return;
    embed.style.maxHeight = '';
    embed.style.maxWidth = '';
    embed.style.height = '';
    embed.style.width = '';
    const media = embed.querySelector('img,svg,canvas,iframe');
    if(media){
      media.style.maxHeight = '';
      media.style.maxWidth = '';
      media.style.height = '';
      media.style.width = '';
    }
  });

  const slideRect = slideEl.getBoundingClientRect();
  const slideMaxHeight = slideEl.clientHeight || 900;
  const bottomPadding = 20;

  // First pass: cap only auto-managed figures by the actual remaining space below their top edge.
  figures.forEach(embed=>{
    if(isManualFigureEmbed(embed)) return;
    const media = embed.querySelector('img,svg,canvas,iframe');
    const rect = embed.getBoundingClientRect();
    const remaining = Math.max(70, slideRect.bottom - rect.top - bottomPadding);
    const embedCap = Math.max(80, Math.min(remaining, slideMaxHeight * 0.62));
    const remainingW = Math.max(120, slideRect.right - rect.left - bottomPadding);
    embed.style.maxHeight = embedCap + 'px';
    embed.style.maxWidth = remainingW + 'px';
    embed.style.width = 'fit-content';
    if(media){
      const mediaCap = Math.max(60, embedCap - 12);
      media.style.maxHeight = mediaCap + 'px';
      media.style.maxWidth = Math.max(100, remainingW - 12) + 'px';
      media.style.width = 'auto';
      media.style.height = 'auto';
      if(media.tagName === 'IFRAME'){
        media.style.height = mediaCap + 'px';
        media.style.width = Math.max(100, remainingW - 12) + 'px';
      }
    }
  });

  // Second pass: if the slide still overflows, shrink only auto-managed figures.
  let guard = 0;
  while(slideEl.scrollHeight > slideMaxHeight + 2 && guard < 24){
    const overflow = slideEl.scrollHeight - slideMaxHeight;
    const candidates = figures.map(embed=>{
      if(isManualFigureEmbed(embed)) return null;
      const media = embed.querySelector('img,svg,canvas,iframe');
      const rect = embed.getBoundingClientRect();
      return {embed, media, h: rect.height || 0};
    }).filter(x=>x && x.h > 50).sort((a,b)=>b.h-a.h);

    if(!candidates.length) break;
    const c = candidates[0];
    const current = parseFloat(c.embed.style.maxHeight || c.h);
    const reduce = Math.min(Math.max(overflow + 12, 28), current * 0.40);
    const next = Math.max(60, current - reduce);
    c.embed.style.maxHeight = next + 'px';
    if(c.media){
      const mediaNext = Math.max(48, next - 12);
      c.media.style.maxHeight = mediaNext + 'px';
      if(c.media.tagName === 'IFRAME') c.media.style.height = mediaNext + 'px';
    }
    guard += 1;
  }
}
function parseTranslate(transform){
  const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(transform || '');
  return { x: m ? parseFloat(m[1]) : 0, y: m ? parseFloat(m[2]) : 0 };
}
function replaceNthFigureHtml(blockContent, figIndex, newBody){
  let seen = -1;
  return String(blockContent || '').replace(/\\begin\{figurehtml\}[\r\n]*([\s\S]*?)[\r\n]*\\end\{figurehtml\}/g, (m, body)=>{
    seen += 1;
    if(seen !== figIndex) return m;
    return '\\begin{figurehtml}\n' + newBody + '\n\\end{figurehtml}';
  });
}
function getFigurePrimaryMedia(box){
  return box ? box.querySelector(':scope > img, :scope > svg, :scope > canvas, :scope > iframe, :scope > figure > img, :scope > figure > svg, :scope > figure > canvas, :scope > figure > iframe') : null;
}
function getSerializedImageFigure(box){
  if(!box) return null;
  const fig = box.querySelector(':scope > figure[data-figure-kind="image"]');
  if(fig && fig.querySelector('img')) return fig;
  const img = box.querySelector(':scope > img[data-figure-kind="image"]');
  return img || null;
}
function serializeFigureBox(box){
  const imageFigure = getSerializedImageFigure(box);
  if(imageFigure){
    const img = imageFigure.tagName.toLowerCase() === 'img' ? imageFigure : imageFigure.querySelector('img');
    if(img){
      const t = parseTranslate(box.style.transform);
      const w = parseFloat(box.style.width || '') || box.offsetWidth || img.naturalWidth || 220;
      const h = parseFloat(box.style.height || '') || box.offsetHeight || img.naturalHeight || 160;
      const ow = parseFloat(box.dataset.originalW || '') || img.naturalWidth || w;
      const oh = parseFloat(box.dataset.originalH || '') || img.naturalHeight || h;
      const lockAspect = box.dataset.lockAspect === '1' ? '1' : '0';
      const userMoved = box.dataset.userMoved === '1' || Math.abs(t.x) > 0.5 || Math.abs(t.y) > 0.5 ? '1' : '0';
      const userSized = box.dataset.userSized === '1' ? '1' : '0';
      const crop = box.dataset.crop === '1' ? '1' : '0';
      const z = String(box.style.zIndex || box.dataset.zIndex || '1');
      const objFit = escapeAttr((img.style.objectFit || imageFigure.dataset.objectFit || 'contain'));
      const safeSrc = escapeAttr(img.getAttribute('src') || '');
      const safeAlt = escapeAttr(img.getAttribute('alt') || '');
      return '<figure data-figure-kind="image" data-box-x="' + escapeAttr(String(Math.round(t.x))) + '" data-box-y="' + escapeAttr(String(Math.round(t.y))) + '" data-box-w="' + escapeAttr(String(Math.round(w))) + '" data-box-h="' + escapeAttr(String(Math.round(h))) + '" data-original-w="' + escapeAttr(String(Math.round(ow))) + '" data-original-h="' + escapeAttr(String(Math.round(oh))) + '" data-lock-aspect="' + lockAspect + '" data-user-moved="' + userMoved + '" data-user-sized="' + userSized + '" data-crop="' + crop + '" data-z-index="' + escapeAttr(z) + '" data-object-fit="' + objFit + '" data-build-in="' + escapeAttr(box.dataset.buildIn || 'none') + '" data-build-out="' + escapeAttr(box.dataset.buildOut || 'none') + '" data-step-mode="' + escapeAttr(box.dataset.stepMode || 'all') + '" data-anim-order="' + escapeAttr(box.dataset.animOrder || '0') + '"><img src="' + safeSrc + '" alt="' + safeAlt + '" /></figure>';
    }
  }
  const clean = box.cloneNode(true);
  clean.classList.remove('selected');
  clean.querySelectorAll('.figure-resize-handle').forEach(el=>el.remove());
  clean.style.touchAction = '';
  clean.style.cursor = '';
  clean.style.maxWidth = 'none';
  clean.style.maxHeight = 'none';
  return clean.outerHTML;
}
function applySerializedImageState(box){
  const fig = box ? box.querySelector(':scope > figure[data-figure-kind="image"]') : null;
  if(!fig) return false;
  const img = fig.querySelector('img');
  if(!img) return false;

  const x = parseFloat(fig.dataset.boxX || '0') || 0;
  const y = parseFloat(fig.dataset.boxY || '0') || 0;
  const w = parseFloat(fig.dataset.boxW || '') || 0;
  const h = parseFloat(fig.dataset.boxH || '') || 0;
  const ow = parseFloat(fig.dataset.originalW || '') || w || img.naturalWidth || 220;
  const oh = parseFloat(fig.dataset.originalH || '') || h || img.naturalHeight || 160;

  box.style.transform = 'translate(' + Math.round(x) + 'px, ' + Math.round(y) + 'px)';
  if(w > 0) box.style.width = Math.round(w) + 'px';
  if(h > 0) box.style.height = Math.round(h) + 'px';
  box.dataset.originalW = String(Math.round(ow));
  box.dataset.originalH = String(Math.round(oh));
  box.dataset.lockAspect = fig.dataset.lockAspect || '1';
  box.dataset.userMoved = fig.dataset.userMoved || (Math.abs(x) > 0.5 || Math.abs(y) > 0.5 ? '1' : '0');
  box.dataset.userSized = fig.dataset.userSized || (w > 0 && h > 0 ? '1' : '0');
  box.dataset.crop = fig.dataset.crop || '0';
  box.dataset.zIndex = fig.dataset.zIndex || '1';
  box.style.zIndex = box.dataset.zIndex;
  box.dataset.buildIn = fig.dataset.buildIn || 'none';
  box.dataset.buildOut = fig.dataset.buildOut || 'none';
  box.dataset.stepMode = fig.dataset.stepMode || 'all';
  box.dataset.animOrder = fig.dataset.animOrder || '0';
  box.style.overflow = box.dataset.crop === '1' ? 'hidden' : 'visible';
  img.style.objectFit = fig.dataset.objectFit || (box.dataset.crop === '1' ? 'cover' : 'contain');
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.maxWidth = 'none';
  img.style.maxHeight = 'none';
  return true;
}
function isManualFigureEmbed(embed){
  const box = embed ? embed.querySelector('.figure-box') : null;
  if(!box) return false;
  return box.dataset.userMoved === '1' || box.dataset.userSized === '1';
}
function saveFigureEmbedToDraft(embed){
  const column = embed.dataset.column || 'left';
  const blockIndex = Number(embed.dataset.blockIndex);
  const figureIndex = Number(embed.dataset.figureIndex);
  const arr = blockArray(column);
  if(!arr[blockIndex]) return;
  const box = embed.querySelector('.figure-box');
  if(!box) return;
  const serialized = serializeFigureBox(box);
  arr[blockIndex].content = replaceNthFigureHtml(arr[blockIndex].content, figureIndex, serialized);
  if(currentColumnName() === column && selectedIndex(column) === blockIndex){
    blockFields.content.value = arr[blockIndex].content;
  }
  if(!syncingPreviewFigures){
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
  }
}
function getSelectedFigureBoxes(root){
  return Array.from((root || preview).querySelectorAll('.figure-box.selected'));
}
function updatePreviewGuides(){
  if(previewGridOverlay) previewGridOverlay.classList.toggle('show', !!showGridToggle?.checked);
  if(previewMarginOverlay) previewMarginOverlay.classList.toggle('show', !!showMarginsToggle?.checked);
}
function refreshFigureToolState(){
  const boxes = getSelectedFigureBoxes();
  if(selectedFiguresStatus){
    selectedFiguresStatus.textContent = boxes.length ? (boxes.length + ' figure' + (boxes.length===1?'':'s') + ' selected.') : 'No figure selected.';
  }
  if(boxes.length === 1 && lockAspectToggle){
    lockAspectToggle.checked = boxes[0].dataset.lockAspect === '1';
  }
  updateAnimationControls();
}
function getSlideMetricsForBox(box){
  const slide = box.closest('.slide, .deck-slide, .print-slide');
  const slideRect = slide.getBoundingClientRect();
  const styles = getComputedStyle(slide);
  const padL = parseFloat(styles.paddingLeft || '0') || 0;
  const padR = parseFloat(styles.paddingRight || '0') || 0;
  const padT = parseFloat(styles.paddingTop || '0') || 0;
  const padB = parseFloat(styles.paddingBottom || '0') || 0;
  const scale = getInteractionScale(slide);
  return {
    slide,
    slideRect,
    scaleX: scale.x || 1,
    scaleY: scale.y || 1,
    contentLeft: padL,
    contentRight: (slide.clientWidth || slide.offsetWidth || 1600) - padR,
    contentTop: padT,
    contentBottom: (slide.clientHeight || slide.offsetHeight || 900) - padB,
    contentWidth: (slide.clientWidth || slide.offsetWidth || 1600) - padL - padR,
    contentHeight: (slide.clientHeight || slide.offsetHeight || 900) - padT - padB
  };
}
function moveBoxTo(box, targetLeft, targetTop){
  const m = getSlideMetricsForBox(box);
  const rect = box.getBoundingClientRect();
  const current = parseTranslate(box.style.transform);
  const leftNow = (rect.left - m.slideRect.left) / m.scaleX;
  const topNow = (rect.top - m.slideRect.top) / m.scaleY;
  const nextX = current.x + (targetLeft - leftNow);
  const nextY = current.y + (targetTop - topNow);
  box.style.transform = `translate(${Math.round(nextX)}px, ${Math.round(nextY)}px)`;
}
function normalizeFigureSelection(singleBox, additive){
  const scope = preview;
  if(!additive){
    scope.querySelectorAll('.figure-box.selected').forEach(el=>{ if(el !== singleBox) el.classList.remove('selected'); });
  }
  if(singleBox) singleBox.classList.add('selected');
  refreshFigureToolState();
}
function saveSelectedFigures(){
  getSelectedFigureBoxes().forEach(box=>{
    const embed = box.closest('.figure-embed[data-column]');
    if(embed) saveFigureEmbedToDraft(embed);
  });
  syncPreviewFiguresToDraft(false);
  saveCurrentBlockToDraft();
  saveCurrentSlideToDeck();
  persistAutosaveNow('Autosaved after figure edit.');
}
function snapValue(v, step=20){ return Math.round(v / step) * step; }
function applySnapToBox(box){
  const t = parseTranslate(box.style.transform);
  box.style.transform = `translate(${snapValue(t.x)}px, ${snapValue(t.y)}px)`;
}
function alignSelectedFigures(which){
  const boxes = getSelectedFigureBoxes();
  if(!boxes.length) return;
  boxes.forEach(box=>{
    const m = getSlideMetricsForBox(box);
    const rect = box.getBoundingClientRect();
    const w = rect.width / m.scaleX;
    const h = rect.height / m.scaleY;
    let left = (rect.left - m.slideRect.left) / m.scaleX;
    let top = (rect.top - m.slideRect.top) / m.scaleY;
    if(which === 'left') left = m.contentLeft;
    if(which === 'center') left = m.contentLeft + (m.contentWidth - w) / 2;
    if(which === 'right') left = m.contentRight - w;
    if(which === 'top') top = m.contentTop;
    if(which === 'middle') top = m.contentTop + (m.contentHeight - h) / 2;
    if(which === 'bottom') top = m.contentBottom - h;
    moveBoxTo(box, left, top);
  });
  saveSelectedFigures();
  buildPreview();
}
function distributeSelectedFigures(axis){
  const boxes = getSelectedFigureBoxes();
  if(boxes.length < 3) return;
  const items = boxes.map(box=>{
    const m = getSlideMetricsForBox(box);
    const rect = box.getBoundingClientRect();
    return {
      box, m,
      left: (rect.left - m.slideRect.left) / m.scaleX,
      top: (rect.top - m.slideRect.top) / m.scaleY,
      width: rect.width / m.scaleX,
      height: rect.height / m.scaleY
    };
  }).sort((a,b)=> axis==='x' ? a.left-b.left : a.top-b.top);
  const first = items[0], last = items[items.length-1];
  const total = items.slice(1,-1).reduce((s,it)=>s+(axis==='x'?it.width:it.height),0);
  const span = axis==='x' ? (last.left - (first.left + first.width)) : (last.top - (first.top + first.height));
  const gap = items.length > 2 ? (span - total) / (items.length - 1) : 0;
  let cursor = axis==='x' ? first.left + first.width + gap : first.top + first.height + gap;
  items.slice(1,-1).forEach(it=>{
    if(axis==='x') moveBoxTo(it.box, cursor, it.top);
    else moveBoxTo(it.box, it.left, cursor);
    cursor += (axis==='x' ? it.width : it.height) + gap;
  });
  saveSelectedFigures();
  buildPreview();
}
function bringSelectedFigures(delta){
  const boxes = getSelectedFigureBoxes();
  boxes.forEach(box=>{
    const z = parseInt(box.style.zIndex || '1', 10) || 1;
    box.style.zIndex = String(Math.max(1, z + delta));
  });
  saveSelectedFigures();
  buildPreview();
}
function toggleCropSelectedFigure(){
  const boxes = getSelectedFigureBoxes();
  boxes.forEach(box=>{
    const cropped = box.dataset.crop === '1';
    box.dataset.crop = cropped ? '0' : '1';
    box.style.overflow = cropped ? 'visible' : 'hidden';
    const media = box.querySelector(':scope > img, :scope > svg, :scope > canvas, :scope > iframe, :scope > figure > img, :scope > figure > svg, :scope > figure > canvas, :scope > figure > iframe');
    if(media){
      media.style.objectFit = cropped ? 'contain' : 'cover';
    }
  });
  saveSelectedFigures();
  buildPreview();
}
function duplicateSelectedFigure(){
  const boxes = getSelectedFigureBoxes();
  if(boxes.length !== 1) return;
  const embed = boxes[0].closest('.figure-embed[data-column]');
  if(!embed) return;
  const column = embed.dataset.column || 'left';
  const blockIndex = Number(embed.dataset.blockIndex);
  const figureIndex = Number(embed.dataset.figureIndex);
  const arr = blockArray(column);
  if(!arr[blockIndex]) return;
  arr[blockIndex].content = String(arr[blockIndex].content || '').replace(/\begin\{figurehtml\}[\r\n]*([\s\S]*?)[\r\n]*\end\{figurehtml\}/g, (m, body)=>{
    duplicateSelectedFigure._seen = (duplicateSelectedFigure._seen || 0) + 1;
    if(duplicateSelectedFigure._seen - 1 !== figureIndex) return m;
    return m + '\n\n\\begin{figurehtml}\n' + body + '\n\\end{figurehtml}';
  });
  duplicateSelectedFigure._seen = 0;
  if(currentColumnName() === column && selectedIndex(column) === blockIndex){
    blockFields.content.value = arr[blockIndex].content;
  }
  buildPreview();
  scheduleAutosave('Autosaved after figure duplicate.');
}
function resetSelectedFigure(){
  getSelectedFigureBoxes().forEach(box=>{
    box.style.transform = 'translate(0px, 0px)';
    box.style.zIndex = '1';
    box.dataset.zIndex = '1';
    box.dataset.crop = '0';
    box.dataset.userMoved = '0';
    box.dataset.userSized = '0';
    box.style.overflow = 'visible';
    const ow = parseFloat(box.dataset.originalW || '220') || 220;
    const oh = parseFloat(box.dataset.originalH || '160') || 160;
    box.style.width = ow + 'px';
    box.style.height = oh + 'px';
    const media = box.querySelector(':scope > img, :scope > svg, :scope > canvas, :scope > iframe, :scope > figure > img, :scope > figure > svg, :scope > figure > canvas, :scope > figure > iframe');
    if(media) media.style.objectFit = 'contain';
  });
  saveSelectedFigures();
  buildPreview();
}
function applyGuideSnapping(box){
  const t = parseTranslate(box.style.transform);
  let x = t.x, y = t.y;
  const m = getSlideMetricsForBox(box);
  const rect = box.getBoundingClientRect();
  const w = rect.width / m.scaleX, h = rect.height / m.scaleY;
  const currentLeft = (rect.left - m.slideRect.left) / m.scaleX;
  const currentTop = (rect.top - m.slideRect.top) / m.scaleY;
  const currentCenterX = currentLeft + w/2;
  const currentCenterY = currentTop + h/2;
  const guideTol = 10;
  const targetsX = [m.contentLeft, m.contentLeft + m.contentWidth/2 - w/2, m.contentRight - w];
  const targetsY = [m.contentTop, m.contentTop + m.contentHeight/2 - h/2, m.contentBottom - h];
  targetsX.forEach(tx=>{ if(Math.abs(currentLeft - tx) < guideTol) x += tx - currentLeft; });
  targetsY.forEach(ty=>{ if(Math.abs(currentTop - ty) < guideTol) y += ty - currentTop; });
  box.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

function getInteractionScale(el){
  const target = el.closest('.slide, .deck-slide, .print-slide') || el;
  const rect = target.getBoundingClientRect();
  const ow = target.offsetWidth || parseFloat(getComputedStyle(target).width) || rect.width || 1;
  const oh = target.offsetHeight || parseFloat(getComputedStyle(target).height) || rect.height || 1;
  const scaleX = rect.width / ow || 1;
  const scaleY = rect.height / oh || 1;
  return {
    x: scaleX > 0 ? scaleX : 1,
    y: scaleY > 0 ? scaleY : 1
  };
}
function ensureInteractiveFigureBox(embed){
  let box = embed.querySelector('.figure-box');
  if(!box){
    box = document.createElement('div');
    box.className = 'figure-box';
    while(embed.firstChild) box.appendChild(embed.firstChild);
    embed.appendChild(box);
    const restored = applySerializedImageState(box);
    if(!restored){
      const rect = box.getBoundingClientRect();
      const media = getFigurePrimaryMedia(box);
      const ow = Math.max(80, Math.round(rect.width || (media && media.naturalWidth) || 220));
      const oh = Math.max(60, Math.round(rect.height || (media && media.naturalHeight) || 160));
      box.style.width = ow + 'px';
      box.style.height = oh + 'px';
      box.dataset.originalW = String(ow);
      box.dataset.originalH = String(oh);
      box.style.transform = box.style.transform || 'translate(0px, 0px)';
      box.style.zIndex = box.style.zIndex || '1';
    }
    box.style.cursor = 'grab';
  }
  if(!box.querySelector('.figure-resize-handle')){
    const handle = document.createElement('div');
    handle.className = 'figure-resize-handle';
    box.appendChild(handle);
  }
  return box;
}
function initFigureInteractions(root){
  const scope = root || document;
  if(scope.__figureInitDone){
    refreshFigureToolState();
    return;
  }
  scope.__figureInitDone = true;
  let active = null;

  scope.addEventListener('pointerdown', (e)=>{
    const handle = e.target.closest('.figure-resize-handle');
    const box = e.target.closest('.figure-box');
    if(!box) return;
    const embed = box.closest('.figure-embed[data-column]');
    if(!embed) return;

    if(handle){
      normalizeFigureSelection(box, e.shiftKey || e.metaKey || e.ctrlKey);
      const rect = box.getBoundingClientRect();
      const slideEl = embed.closest('.slide, .deck-slide, .print-slide') || embed.closest('[data-preview-root]') || document.body;
      const slideRect = slideEl.getBoundingClientRect();
      const slideStyles = window.getComputedStyle(slideEl);
      const padX = (parseFloat(slideStyles.paddingLeft || '0') + parseFloat(slideStyles.paddingRight || '0')) || 0;
      const padY = (parseFloat(slideStyles.paddingTop || '0') + parseFloat(slideStyles.paddingBottom || '0')) || 0;
      const scale = getInteractionScale(slideEl);
      active = {
        mode: 'resize',
        box, embed,
        pointerId: e.pointerId,
        startX: e.clientX, startY: e.clientY,
        startW: box.offsetWidth || parseFloat(box.style.width) || rect.width,
        startH: box.offsetHeight || parseFloat(box.style.height) || rect.height,
        maxW: Math.max(120, (slideEl.clientWidth || slideEl.offsetWidth || slideRect.width) - padX - 24),
        maxH: Math.max(80, (slideEl.clientHeight || slideEl.offsetHeight || slideRect.height) - padY - 24),
        scaleX: scale.x, scaleY: scale.y,
        aspect: (box.offsetWidth || rect.width) / Math.max(1, (box.offsetHeight || rect.height))
      };
      handle.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
      refreshFigureToolState();
      return;
    }

    normalizeFigureSelection(box, e.shiftKey || e.metaKey || e.ctrlKey);
    const t = parseTranslate(box.style.transform);
    box.style.cursor = 'grabbing';
    const scale = getInteractionScale(box);
    active = {
      mode:'move',
      box, embed,
      pointerId:e.pointerId,
      startX:e.clientX, startY:e.clientY,
      startTX:t.x, startTY:t.y,
      scaleX:scale.x, scaleY:scale.y
    };
    box.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    refreshFigureToolState();
  });

  if(!window.__figureWindowHandlersBound){
    window.__figureWindowHandlersBound = true;
    window.addEventListener('pointermove', (e)=>{
      if(!active) return;
      e.preventDefault();
      if(active.mode === 'move'){
        let dx = (e.clientX - active.startX) / (active.scaleX || 1);
        let dy = (e.clientY - active.startY) / (active.scaleY || 1);
        let nextX = active.startTX + dx;
        let nextY = active.startTY + dy;
        if(showGridToggle?.checked || snapToGuidesToggle?.checked){
          nextX = snapValue(nextX);
          nextY = snapValue(nextY);
        }
        active.box.dataset.userMoved = '1';
        active.box.style.transform = `translate(${Math.round(nextX)}px, ${Math.round(nextY)}px)`;
        if(snapToGuidesToggle?.checked) applyGuideSnapping(active.box);
      }else if(active.mode === 'resize'){
        let dx = (e.clientX - active.startX) / (active.scaleX || 1);
        let dy = (e.clientY - active.startY) / (active.scaleY || 1);
        let w = Math.min(active.maxW || Infinity, Math.max(60, Math.round(active.startW + dx)));
        let h = Math.min(active.maxH || Infinity, Math.max(40, Math.round(active.startH + dy)));
        const lockAspect = lockAspectToggle?.checked || active.box.dataset.lockAspect === '1';
        if(lockAspect){
          if(Math.abs(dx) >= Math.abs(dy)) h = Math.max(40, Math.round(w / active.aspect));
          else w = Math.max(60, Math.round(h * active.aspect));
        }
        if(showGridToggle?.checked || snapToGuidesToggle?.checked){
          w = snapValue(w);
          h = snapValue(h);
        }
        active.box.dataset.userSized = '1';
        active.embed.style.maxWidth = 'none';
        active.embed.style.maxHeight = 'none';
        active.box.style.maxWidth = 'none';
        active.box.style.maxHeight = 'none';
        active.box.style.width = w + 'px';
        active.box.style.height = h + 'px';
        const direct = active.box.querySelector(':scope > img, :scope > svg, :scope > canvas, :scope > iframe, :scope > figure');
        active.embed.style.width = 'fit-content';
        if(direct){
          direct.style.maxWidth = 'none';
          direct.style.maxHeight = 'none';
          direct.style.width = '100%';
          direct.style.height = '100%';
          if(direct.tagName === 'FIGURE'){
            const inner = direct.querySelector('img,svg,canvas,iframe');
            if(inner){
              inner.style.maxWidth = 'none';
              inner.style.maxHeight = 'none';
              inner.style.width = '100%';
              inner.style.height = '100%';
            }
          }
        }
      }
    }, { passive:false });
    window.addEventListener('pointerup', ()=>{
      if(!active) return;
      if(active.box) active.box.style.cursor = 'grab';
      saveFigureEmbedToDraft(active.embed);
      syncPreviewFiguresToDraft(false);
      persistAutosaveNow('Autosaved after figure edit.');
      active = null;
    }, { passive:true });
    window.addEventListener('pointercancel', ()=>{
      if(!active) return;
      if(active.box) active.box.style.cursor = 'grab';
      saveFigureEmbedToDraft(active.embed);
      syncPreviewFiguresToDraft(false);
      persistAutosaveNow('Autosaved after figure edit.');
      active = null;
    }, { passive:true });
  }
  refreshFigureToolState();
}
function fitFiguresIn(root){
  const scope = root || document;
  scope.querySelectorAll('.figure-embed[data-column]').forEach(embed=>ensureInteractiveFigureBox(embed));
  scope.querySelectorAll('.slide, .deck-slide, .print-cell .slide').forEach(fitFiguresInSlide);
}
function selectedPreviewBlock(){
  if(!selectedPreviewBlockRef || selectedPreviewBlockRef.type === 'title') return null;
  return getDraftBlock(selectedPreviewBlockRef.column, selectedPreviewBlockRef.index);
}
function selectedPreviewTitleStyle(){
  return normalizeBlockStyle(draftTitleStyle);
}
function populatePreviewBlockStyleEditor(block){
  const style = normalizeBlockStyle(block && block.style);
  if(previewBlockFontScale) previewBlockFontScale.value = String(style.fontScale);
  if(previewBlockFontFamily) previewBlockFontFamily.value = style.fontFamily;
  if(previewBlockFontColor) previewBlockFontColor.value = style.fontColor;
  if(previewBlockBulletType) previewBlockBulletType.value = style.bulletType;
}
function populatePreviewTitleStyleEditor(){
  const style = selectedPreviewTitleStyle();
  if(previewBlockFontScale) previewBlockFontScale.value = String(style.fontScale);
  if(previewBlockFontFamily) previewBlockFontFamily.value = style.fontFamily;
  if(previewBlockFontColor) previewBlockFontColor.value = style.fontColor;
  if(previewBlockBulletType) previewBlockBulletType.value = style.bulletType || 'disc';
}
function updatePreviewBlockSelectionUI(){
  Array.from(preview.querySelectorAll('.preview-block')).forEach(el=>{
    const hit = selectedPreviewBlockRef &&
      selectedPreviewBlockRef.type !== 'title' &&
      el.dataset.column === selectedPreviewBlockRef.column &&
      Number(el.dataset.blockIndex) === selectedPreviewBlockRef.index;
    el.classList.toggle('selected', !!hit);
  });
  Array.from(preview.querySelectorAll('.preview-title')).forEach(el=>{
    const hit = selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title';
    el.classList.toggle('selected', !!hit);
  });
  const block = selectedPreviewBlock();
  if(previewBlockLabel){
    if(selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title'){
      previewBlockLabel.value = 'Slide title';
    } else if(block && selectedPreviewBlockRef){
      previewBlockLabel.value = (selectedPreviewBlockRef.column === 'right' ? 'Right' : 'Left') + ' block ' + (selectedPreviewBlockRef.index + 1) + ' · ' + (block.mode || 'panel');
    } else {
      previewBlockLabel.value = 'No block selected';
    }
  }
  if(selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title') populatePreviewTitleStyleEditor();
  else populatePreviewBlockStyleEditor(block);
  updateAnimationControls();
}
function selectPreviewBlock(column, index){
  const block = getDraftBlock(column, index);
  if(!block) return;
  getSelectedFigureBoxes().forEach(box=>box.classList.remove('selected'));
  selectedPreviewBlockRef = { type:'block', column, index };
  blockFields.column.value = column === 'right' ? 'right' : 'left';
  setSelectedIndex(column, index);
  loadSelectedBlockIntoEditor();
  refreshFigureToolState();
  updatePreviewBlockSelectionUI();
}
function selectPreviewTitle(){
  saveCurrentBlockToDraft();
  getSelectedFigureBoxes().forEach(box=>box.classList.remove('selected'));
  selectedPreviewBlockRef = { type:'title' };
  refreshFigureToolState();
  updatePreviewBlockSelectionUI();
}
function applySelectedPreviewBlockStyle(patch){
  if(!selectedPreviewBlockRef) return;
  saveCurrentBlockToDraft();
  if(selectedPreviewBlockRef.type === 'title'){
    draftTitleStyle = normalizeBlockStyle({ ...(draftTitleStyle || {}), ...(patch || {}) });
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    buildPreview();
    scheduleAutosave('Autosaved after title style change.');
    return;
  }
  const block = getDraftBlock(selectedPreviewBlockRef.column, selectedPreviewBlockRef.index);
  if(!block) return;
  block.style = normalizeBlockStyle({ ...(block.style || {}), ...(patch || {}) });
  snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
  buildPreview();
  scheduleAutosave('Autosaved after block style change.');
}
function resetSelectedPreviewBlockStyle(){
  if(!selectedPreviewBlockRef) return;
  applySelectedPreviewBlockStyle({ fontScale:1, fontFamily:'inherit', fontColor:'#111111', bulletType:'disc' });
}
function selectedAnimationTargetInfo(){
  const boxes = getSelectedFigureBoxes();
  if(boxes.length){
    const box = boxes[0];
    return { type:'figure', multi: boxes.length > 1, label: boxes.length > 1 ? (boxes.length + ' figures') : 'Selected figure', animation: normalizeAnimation({ buildIn: box.dataset.buildIn, buildOut: box.dataset.buildOut, stepMode: box.dataset.stepMode, order: box.dataset.animOrder }) };
  }
  if(selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title'){
    return { type:'title', label:'Slide title', animation: normalizeAnimation(draftTitleAnimation) };
  }
  const block = selectedPreviewBlock();
  if(block && selectedPreviewBlockRef){
    return { type:'block', label:(selectedPreviewBlockRef.column === 'right' ? 'Right' : 'Left') + ' block ' + (selectedPreviewBlockRef.index + 1), animation: normalizeAnimation(block.animation) };
  }
  return null;
}
function updateAnimationControls(){
  const info = selectedAnimationTargetInfo();
  if(animateTargetLabel) animateTargetLabel.value = info ? info.label : 'No object selected';
  const anim = info ? info.animation : normalizeAnimation();
  if(animateBuildIn) animateBuildIn.value = anim.buildIn;
  if(animateBuildOut) animateBuildOut.value = anim.buildOut;
  if(animateStepMode) animateStepMode.value = anim.stepMode;
  if(animateOrder) animateOrder.value = String(anim.order);
}
function applySelectedAnimation(){
  const patch = normalizeAnimation({
    buildIn: animateBuildIn ? animateBuildIn.value : 'none',
    buildOut: animateBuildOut ? animateBuildOut.value : 'none',
    stepMode: animateStepMode ? animateStepMode.value : 'all',
    order: animateOrder ? animateOrder.value : 0
  });
  const boxes = getSelectedFigureBoxes();
  if(boxes.length){
    boxes.forEach(box=>{
      box.dataset.buildIn = patch.buildIn;
      box.dataset.buildOut = patch.buildOut;
      box.dataset.stepMode = patch.stepMode;
      box.dataset.animOrder = String(patch.order);
    });
    saveSelectedFigures();
    buildPreview();
    scheduleAutosave('Autosaved after figure animation change.');
    return;
  }
  if(selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title'){
    draftTitleAnimation = patch;
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    buildPreview();
    scheduleAutosave('Autosaved after title animation change.');
    return;
  }
  const block = selectedPreviewBlock();
  if(block){
    block.animation = patch;
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    buildPreview();
    scheduleAutosave('Autosaved after block animation change.');
  }
}
function clearSelectedAnimation(){
  const patch = normalizeAnimation();
  const boxes = getSelectedFigureBoxes();
  if(boxes.length){
    boxes.forEach(box=>{
      box.dataset.buildIn = patch.buildIn;
      box.dataset.buildOut = patch.buildOut;
      box.dataset.stepMode = patch.stepMode;
      box.dataset.animOrder = String(patch.order);
    });
    saveSelectedFigures();
    buildPreview();
    scheduleAutosave('Autosaved after figure animation clear.');
    return;
  }
  if(selectedPreviewBlockRef && selectedPreviewBlockRef.type === 'title'){
    draftTitleAnimation = patch;
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    buildPreview();
    scheduleAutosave('Autosaved after title animation clear.');
    return;
  }
  const block = selectedPreviewBlock();
  if(block){
    block.animation = patch;
    snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    buildPreview();
    scheduleAutosave('Autosaved after block animation clear.');
  }
}
function initPreviewBlockSelection(){
  if(preview.__blockSelectionBound) return;
  preview.__blockSelectionBound = true;
  preview.addEventListener('click', (e)=>{
    if(e.target.closest('.figure-box') || e.target.closest('.figure-resize-handle')) return;
    const titleEl = e.target.closest('.preview-title');
    if(titleEl && preview.contains(titleEl)){
      selectPreviewTitle();
      return;
    }
    const blockEl = e.target.closest('.preview-block');
    if(!blockEl || !preview.contains(blockEl)) return;
    selectPreviewBlock(blockEl.dataset.column || 'left', Number(blockEl.dataset.blockIndex));
  });
}
function buildPreview(){
  preview.innerHTML = buildSlideMarkup(currentDraftSlide());
  snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
  initPreviewBlockSelection();
  updatePreviewScale();
  updatePreviewGuides();
  const finalizePreview = ()=>{ fitFiguresIn(preview); initFigureInteractions(preview); updatePreviewScale(); refreshFigureToolState(); updatePreviewBlockSelectionUI(); };
  if(window.MathJax && typeof window.MathJax.typesetPromise === 'function'){
    if(typeof window.MathJax.typesetClear === 'function') window.MathJax.typesetClear([preview]);
    window.MathJax.typesetPromise([preview]).then(finalizePreview).catch(finalizePreview);
  } else {
    finalizePreview();
  }
}

function setCopilotStatus(message, isError=false){
  if(copilotEls.status){
    copilotEls.status.textContent = message;
    copilotEls.status.style.color = isError ? '#ffb4b4' : '';
    copilotEls.status.style.borderColor = isError ? 'rgba(255,120,120,.35)' : '';
  }
}
function loadCopilotSettings(){
  try{
    const raw = localStorage.getItem(COPILOT_SETTINGS_STORAGE);
    const s = raw ? JSON.parse(raw) : {};
    if(copilotEls.model && s.model) copilotEls.model.value = s.model;
    if(copilotEls.endpoint && s.endpoint) copilotEls.endpoint.value = s.endpoint;
    if(copilotEls.tone && s.tone) copilotEls.tone.value = s.tone;
    const key = localStorage.getItem(COPILOT_API_KEY_STORAGE);
    if(copilotEls.apiKey && key) copilotEls.apiKey.value = key;
  }catch(err){ console.warn('Could not load Copilot settings', err); }
}
function saveCopilotSettings(saveKey=false){
  try{
    const s = {
      model: copilotEls.model?.value || 'gpt-4.1-mini',
      endpoint: copilotEls.endpoint?.value || 'https://api.openai.com/v1/responses',
      tone: copilotEls.tone?.value || 'clear and concise'
    };
    localStorage.setItem(COPILOT_SETTINGS_STORAGE, JSON.stringify(s));
    if(saveKey && copilotEls.apiKey){
      const key = copilotEls.apiKey.value.trim();
      if(key) localStorage.setItem(COPILOT_API_KEY_STORAGE, key);
      else localStorage.removeItem(COPILOT_API_KEY_STORAGE);
      showToast(key ? 'Saved Copilot key locally.' : 'Cleared saved Copilot key.');
    }
  }catch(err){ console.warn('Could not save Copilot settings', err); }
}
function copilotBlockSchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      mode:{ type:'string', enum:['panel','plain','pseudocode','pseudocode-latex','placeholder'] },
      title:{ type:'string', description:'Short editor-only label for the block.' },
      content:{ type:'string', description:'Slide content. For panel/plain, use generator syntax like \\paragraph{Heading}, \\begin{itemize}, \\item, \\end{itemize}, and \\begin{card}{Title}...\\end{card}.' }
    },
    required:['mode','title','content']
  };
}
function copilotSlideSchema(){
  const block = copilotBlockSchema();
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      slideType:{ type:'string', enum:['title-center','single','two-col'] },
      headingLevel:{ type:'string', enum:['h1','h2'] },
      bgColor:{ type:'string' },
      fontColor:{ type:'string' },
      inheritTheme:{ type:'boolean' },
      title:{ type:'string' },
      kicker:{ type:'string' },
      lede:{ type:'string' },
      leftBlocks:{ type:'array', items:block },
      rightBlocks:{ type:'array', items:block },
      notesTitle:{ type:'string' },
      notesBody:{ type:'string' }
    },
    required:['slideType','headingLevel','bgColor','fontColor','inheritTheme','title','kicker','lede','leftBlocks','rightBlocks','notesTitle','notesBody']
  };
}
function copilotDeckSchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      deckTitle:{ type:'string' },
      summary:{ type:'string' },
      slides:{ type:'array', items:copilotSlideSchema() }
    },
    required:['deckTitle','summary','slides']
  };
}
function copilotSystemPrompt(){
  return [
    'You are a presentation copilot embedded in an HTML slide generator.',
    'Return only JSON that matches the provided schema.',
    'Create editable slide objects that work in the generator.',
    'Use only slideType values title-center, single, or two-col.',
    'Use h1 for title slides and h2 for normal slides.',
    'Set inheritTheme to true unless the user explicitly asks for custom colors.',
    'For panel/plain blocks, use this lightweight syntax: \\paragraph{Heading}, \\begin{itemize}, \\item item text, \\end{itemize}, \\begin{card}{Title}content\\end{card}.',
    'Keep each slide focused, with 1-3 content blocks. Put speaker guidance in notesBody.',
    'Do not invent citations, URLs, or image files. Use placeholder blocks when a figure is needed.'
  ].join('\n');
}
function compactDeckForCopilot(){
  const deck = currentDeckData();
  return {
    deckTitle: deck.deckTitle,
    theme: deck.theme,
    slideCount: deck.slides.length,
    slides: deck.slides.slice(0, 20).map((s, idx)=>({
      index: idx + 1,
      slideType: s.slideType,
      title: s.title,
      kicker: s.kicker,
      lede: s.lede,
      leftBlocks: (s.leftBlocks || []).map(b=>({ mode:b.mode, title:b.title, content:String(b.content || '').slice(0, 700) })),
      rightBlocks: (s.rightBlocks || []).map(b=>({ mode:b.mode, title:b.title, content:String(b.content || '').slice(0, 700) }))
    }))
  };
}
function buildCopilotUserPrompt(kind){
  const prompt = (copilotEls.prompt?.value || '').trim();
  if(!prompt) throw new Error('Tell Copilot what to create first.');
  const count = Math.max(1, Math.min(30, Number(copilotEls.slideCount?.value || 1)));
  const tone = copilotEls.tone?.value || 'clear and concise';
  const mode = kind === 'deck' ? 'Create a complete deck.' : 'Create exactly one slide.';
  return [
    mode,
    'User request: ' + prompt,
    'Target slide count: ' + (kind === 'deck' ? count : 1),
    'Tone/style: ' + tone,
    'Current deck context JSON:',
    JSON.stringify(compactDeckForCopilot(), null, 2),
    'Important: output JSON with deckTitle, summary, and slides. For single-slide requests, slides must contain exactly one slide.'
  ].join('\n\n');
}
function extractResponsesOutputText(data){
  if(data && typeof data.output_text === 'string') return data.output_text;
  const parts = [];
  (data?.output || []).forEach(item=>{
    (item.content || []).forEach(c=>{
      if(typeof c.text === 'string') parts.push(c.text);
      else if(typeof c.output_text === 'string') parts.push(c.output_text);
    });
  });
  return parts.join('\n').trim();
}
async function callCopilot(kind){
  saveCopilotSettings(false);
  const endpoint = (copilotEls.endpoint?.value || '').trim() || 'https://api.openai.com/v1/responses';
  const apiKey = (copilotEls.apiKey?.value || '').trim();
  const model = (copilotEls.model?.value || '').trim() || 'gpt-4.1-mini';
  const headers = { 'Content-Type':'application/json' };
  if(apiKey) headers.Authorization = 'Bearer ' + apiKey;
  const body = {
    model,
    input:[
      { role:'system', content: copilotSystemPrompt() },
      { role:'user', content: buildCopilotUserPrompt(kind) }
    ],
    text:{ format:{ type:'json_schema', name:'presentation_deck', schema:copilotDeckSchema(), strict:true } },
    store:false
  };
  setCopilotStatus(kind === 'deck' ? 'Generating deck…' : 'Generating slide…');
  const res = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify(body) });
  const raw = await res.text();
  let data;
  try{ data = raw ? JSON.parse(raw) : {}; }catch(err){ data = { raw }; }
  if(!res.ok){
    const message = data?.error?.message || raw || ('Copilot request failed with status ' + res.status);
    throw new Error(message);
  }
  const output = extractResponsesOutputText(data);
  if(!output) throw new Error('Copilot returned an empty response.');
  let parsed;
  try{ parsed = JSON.parse(output); }
  catch(err){ throw new Error('Copilot returned text that was not valid JSON: ' + output.slice(0, 300)); }
  const normalized = normalizeCopilotDeck(parsed, kind);
  copilotEls.resultJson.value = JSON.stringify(normalized, null, 2);
  setCopilotStatus((normalized.summary || 'Copilot generated slides.') + ' Ready to apply.');
  return normalized;
}
function normalizeCopilotDeck(deck, kind='deck'){
  const rawSlides = Array.isArray(deck?.slides) ? deck.slides : [];
  if(!rawSlides.length) throw new Error('Copilot did not return any slides.');
  const normalizedSlides = rawSlides.map(normalizeCopilotSlide);
  return {
    deckTitle: String(deck?.deckTitle || fields.deckTitle.value || 'Generated presentation'),
    summary: String(deck?.summary || ''),
    slides: kind === 'slide' ? normalizedSlides.slice(0, 1) : normalizedSlides
  };
}
function normalizeCopilotSlide(slide){
  const s = normalizeSlide(slide || {});
  if(!['title-center','single','two-col'].includes(s.slideType)) s.slideType = 'single';
  s.headingLevel = ['h1','h2'].includes(s.headingLevel) ? s.headingLevel : (s.slideType === 'title-center' ? 'h1' : 'h2');
  s.bgColor = s.bgColor || '#ffffff';
  s.fontColor = s.fontColor || '#111111';
  s.inheritTheme = s.inheritTheme !== false;
  s.title = s.title || 'Untitled slide';
  s.kicker = s.kicker || '';
  s.lede = s.lede || '';
  s.leftBlocks = Array.isArray(s.leftBlocks) ? s.leftBlocks.map(normalizeBlock) : [];
  s.rightBlocks = s.slideType === 'two-col' && Array.isArray(s.rightBlocks) ? s.rightBlocks.map(normalizeBlock) : [];
  if(s.slideType === 'title-center'){
    s.leftBlocks = [];
    s.rightBlocks = [];
  }
  s.notesTitle = s.notesTitle || 'Speaker notes';
  s.notesBody = s.notesBody || '';
  return s;
}
function parseCopilotResult(){
  const raw = (copilotEls.resultJson?.value || '').trim();
  if(!raw) throw new Error('No Copilot result to apply yet.');
  return normalizeCopilotDeck(JSON.parse(raw), 'deck');
}
function applyCopilotFirstSlide(deck){
  const payload = deck || parseCopilotResult();
  const slide = payload.slides[0];
  if(!slide) throw new Error('No slide found in Copilot result.');
  applySlideToForm(slide);
  if(activeIndex >= 0 && activeIndex < slides.length){
    slides[activeIndex] = slide;
  }
  buildPreview();
  renderDeckList();
  scheduleAutosave('Autosaved after Copilot slide apply.');
  showToast('Applied Copilot slide.');
}
function appendCopilotSlides(deck){
  const payload = deck || parseCopilotResult();
  const newSlides = payload.slides.map(normalizeCopilotSlide);
  if(!newSlides.length) throw new Error('No slides found in Copilot result.');
  slides = (slides.length ? slides : []).concat(newSlides);
  activeIndex = slides.length - newSlides.length;
  applySlideToForm(slides[activeIndex]);
  buildPreview();
  renderDeckList();
  scheduleAutosave('Autosaved after appending Copilot slides.');
  showToast('Appended Copilot slides.');
}
function replaceDeckWithCopilot(deck){
  const payload = deck || parseCopilotResult();
  const newSlides = payload.slides.map(normalizeCopilotSlide);
  if(!newSlides.length) throw new Error('No slides found in Copilot result.');
  fields.deckTitle.value = payload.deckTitle || fields.deckTitle.value;
  slides = newSlides;
  activeIndex = 0;
  applySlideToForm(slides[0]);
  buildPreview();
  renderDeckList();
  persistAutosaveNow('Autosaved after replacing deck with Copilot result.');
  showToast('Replaced deck with Copilot result.');
}
async function generateCopilotSlide(applyMode){
  try{
    const deck = await callCopilot('slide');
    if(applyMode === 'append') appendCopilotSlides(deck);
    else applyCopilotFirstSlide(deck);
  }catch(err){
    console.error(err);
    setCopilotStatus(err.message || 'Copilot failed.', true);
    alert(err.message || 'Copilot failed.');
  }
}
async function generateCopilotDeck(){
  try{
    const deck = await callCopilot('deck');
    if((copilotEls.mode?.value || 'append') === 'replace') replaceDeckWithCopilot(deck);
    else appendCopilotSlides(deck);
  }catch(err){
    console.error(err);
    setCopilotStatus(err.message || 'Copilot failed.', true);
    alert(err.message || 'Copilot failed.');
  }
}

function parseSnippetSlide(){
  const raw = snippetOutput.value.trim();
  if(!raw) throw new Error('The snippet box is empty.');
  const parsed = JSON.parse(raw);
  return normalizeSlide(parsed);
}
function loadSnippetIntoEditor(){
  const slide = parseSnippetSlide();
  applySlideToForm(slide);
  buildPreview();
  showToast('Loaded snippet into editor.');
  scheduleAutosave('Autosaved after loading snippet.');
}
function replaceSelectedSlideFromSnippet(){
  if(activeIndex < 0 || activeIndex >= slides.length){
    throw new Error('Select a slide first.');
  }
  slides[activeIndex] = parseSnippetSlide();
  applySlideToForm(slides[activeIndex]);
  buildPreview();
  renderDeckList();
  showToast('Replaced selected slide from snippet.');
  scheduleAutosave('Autosaved after replacing slide from snippet.');
}
function addSlideFromSnippet(){
  const slide = parseSnippetSlide();
  slides.push(slide);
  activeIndex = slides.length - 1;
  applySlideToForm(slide);
  buildPreview();
  renderDeckList();
  showToast('Added slide from snippet.');
  scheduleAutosave('Autosaved after adding slide from snippet.');
}
function formatSnippet(){
  const slide = parseSnippetSlide();
  snippetOutput.value = JSON.stringify(slideForSnippet(slide), null, 2);
  showToast('Formatted snippet.');
}
function renderDeckList(){
  deckCount.textContent = slides.length + ' slide' + (slides.length === 1 ? '' : 's');
  deckList.innerHTML = slides.map((slide, idx)=>`
    <button class="deck-item ${idx === activeIndex ? 'active' : ''}" data-index="${idx}">
      ${escapeHtml(slide.title || ('Untitled slide ' + (idx + 1)))}
      <span class="meta">${idx + 1}. ${escapeHtml(slide.slideType || 'single')} · ${normalizeSlide(slide).leftBlocks.length} left block(s)${slide.slideType === 'two-col' ? ' · ' + normalizeSlide(slide).rightBlocks.length + ' right block(s)' : ''}</span>
    </button>
  `).join('');
  deckList.querySelectorAll('.deck-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      saveCurrentBlockToDraft();
      saveCurrentSlideToDeck();
      activeIndex = Number(btn.dataset.index);
      applySlideToForm(slides[activeIndex]);
      buildPreview();
      renderDeckList();
      scheduleAutosave('Autosaved after slide switch.');
    });
  });
}
function addSlide(){
  slides.push(currentDraftSlide());
  activeIndex = slides.length - 1;
  renderDeckList();
  showToast('Added slide.');
  scheduleAutosave('Autosaved after slide add.');
}
function updateSlide(){
  if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
  slides[activeIndex] = currentDraftSlide();
  renderDeckList();
  showToast('Updated slide.');
  scheduleAutosave('Autosaved after slide update.');
}
function duplicateSlide(){
  if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
  slides.splice(activeIndex + 1, 0, clone(slides[activeIndex]));
  activeIndex += 1;
  renderDeckList();
  showToast('Duplicated slide.');
  scheduleAutosave('Autosaved after slide duplicate.');
}
function deleteSlide(){
  if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
  slides.splice(activeIndex, 1);
  if(activeIndex >= slides.length) activeIndex = slides.length - 1;
  if(activeIndex >= 0) applySlideToForm(slides[activeIndex]); else clearForm(false);
  buildPreview();
  renderDeckList();
  showToast('Deleted slide.');
  scheduleAutosave('Autosaved after slide delete.');
}
function moveSlide(dir){
  if(activeIndex < 0 || activeIndex >= slides.length) return;
  const next = activeIndex + dir;
  if(next < 0 || next >= slides.length) return;
  const tmp = slides[activeIndex];
  slides[activeIndex] = slides[next];
  slides[next] = tmp;
  activeIndex = next;
  renderDeckList();
  scheduleAutosave('Autosaved after slide move.');
}
function clearForm(resetPreview = true){
  applySlideToForm({
    slideType:'single',
    headingLevel:'h2',
    bgColor:'#ffffff',
    fontColor:'#111111',
    title:'',
    kicker:'',
    lede:'',
    leftBlocks:[],
    rightBlocks:[],
    notesTitle:'Speaker notes',
    notesBody:''
  });
  if(resetPreview) buildPreview();
}
async function copyText(text, success){
  await navigator.clipboard.writeText(text);
  showToast(success);
}
function copyCurrentSnippet(){ copyText(snippetOutput.value, 'Copied snippet.'); }
function copyMathJaxHelper(){
  copyText(String.raw`Inline: \( a^t = \sigma(u^t) \)
Display:
\[
\nabla_{W[t]} \ell = \delta^t (z^{t-1})^\top
\]`, 'Copied MathJax helper.');
}

function buildStandaloneViewer(payload){
  const deckJson = JSON.stringify(payload).replace(/<\/script>/gi, '<\\/script>');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(payload.deckTitle || 'HTML Presentation')}</title>
<script id="deck-source" type="application/json">${deckJson}<\/script>
<style>
:root{--deck-bg:#060a16;--deck-panel:rgba(10,16,32,.82);--deck-text:#eef3ff}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:radial-gradient(circle at top left,#17214a 0%,var(--deck-bg) 45%,#070b17 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
body{color:var(--deck-text);overflow:hidden}
.deck{position:relative;width:100vw;height:100svh}
.deck-slide{display:none;position:absolute;inset:0;overflow:auto;padding:3.2rem 3.5rem 5rem;background:#fff;color:#111}
.deck-slide.active{display:block}
.deck-slide h1,.deck-slide h2{margin:0;line-height:1.05}
.deck-slide h1{font-size:calc(3.4rem * var(--title-scale,1));max-width:15ch}.deck-slide h2{font-size:calc(2.3rem * var(--title-scale,1));}
.kicker{margin-top:.8rem;color:rgba(17,17,17,.72);font-size:1.05rem;line-height:1.45;max-width:70ch}
.lede{margin-top:.9rem;color:rgba(17,17,17,.72);font-size:1.18rem;line-height:1.5;max-width:70ch}
.slide-body{margin-top:1.35rem}.deck-slide.single .slide-body{display:block}.deck-slide.two-col .slide-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.35rem;align-items:start}
.col{min-width:0}.col-stack{display:grid;gap:1rem}
.rich{display:grid;gap:1rem}
.rich p,.rich ul,.rich ol,.rich h3,.display-math,.bullet-card,.placeholder,.diag,.pseudo-block,.pseudo-latex-block,.custom-frame-wrap{margin:0;border:1px solid rgba(17,17,17,.12);border-radius:var(--radius,22px);background:rgba(127,127,127,.045);box-shadow:0 8px 24px rgba(0,0,0,.04)}
.rich p{color:rgba(17,17,17,.85);font-size:1.26rem;line-height:1.62;padding:1rem 1.15rem}
.rich ul,.rich ol{color:rgba(17,17,17,.85);font-size:1.22rem;line-height:1.58;padding:1rem 1.2rem 1rem 2.3rem}
.rich li{margin:.5rem 0;color:rgba(17,17,17,.85);font-size:1.22rem;line-height:1.58}
.rich h3{font-size:1.3rem;color:inherit;padding:.95rem 1.15rem}
.display-math{font-size:1.2rem;padding:1rem 1.15rem;overflow-x:auto}
.pseudo-block,.pseudo-latex-block{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;font-size:1.08rem;line-height:1.62;white-space:pre-wrap;tab-size:2;padding:1rem 1.15rem;overflow-x:auto;color:rgba(17,17,17,.9)}
.pseudo-latex-block mjx-container{font-size:100% !important}
.bullet-card{padding:1rem 1.15rem;background:rgba(127,127,127,.045)}.bullet-card b{display:block;margin-bottom:.35rem;font-size:1.12rem}.preview-block{position:relative;border-radius:18px;--block-font-scale:1;--block-font-family:inherit;--block-font-color:inherit;--block-bullet-type:disc}.preview-block .rich p,.preview-block .rich ul,.preview-block .rich ol,.preview-block .rich li,.preview-block .rich h3,.preview-block .display-math,.preview-block .pseudo-block,.preview-block .pseudo-latex-block,.preview-block .bullet-card,.preview-block .placeholder{font-family:var(--block-font-family,inherit);color:var(--block-font-color,inherit)}.preview-block .rich p{font-size:calc(1.26rem * var(--block-font-scale,1))}.preview-block .rich ul,.preview-block .rich ol,.preview-block .rich li{font-size:calc(1.22rem * var(--block-font-scale,1))}.preview-block .rich h3{font-size:calc(1.3rem * var(--block-font-scale,1))}.preview-block .display-math,.preview-block .pseudo-block,.preview-block .pseudo-latex-block,.preview-block .bullet-card{font-size:calc(1.08rem * var(--block-font-scale,1))}.preview-block .rich ul{list-style-type:var(--block-bullet-type,disc)}.preview-block .rich ol{list-style-type:var(--block-bullet-type,decimal)}.preview-title{position:relative;border-radius:18px;--block-font-scale:1;--block-font-family:inherit;--block-font-color:inherit}.preview-title > h1,.preview-title > h2,.preview-title > h3,.preview-title > h4,.preview-title > h5,.preview-title > h6{font-family:var(--block-font-family,inherit);color:var(--block-font-color,inherit);font-size:calc(var(--title-base-size,1em) * var(--block-font-scale,1))}
.placeholder{min-height:220px;display:grid;place-items:center;color:rgba(17,17,17,.72);padding:1rem 1.15rem;text-align:center}
.deck-slide .figure-embed{padding:0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;overflow:visible !important;display:block;min-height:0;position:relative;width:fit-content;max-width:100%;margin:.2rem auto}
.deck-slide .figure-embed figure{margin:0;width:auto;height:auto;display:inline-flex;align-items:center;justify-content:center;overflow:visible;max-width:100%}
.deck-slide .figure-embed img,.deck-slide .figure-embed svg,.deck-slide .figure-embed canvas,.deck-slide .figure-embed iframe{display:block;max-width:100%;max-height:100%;width:auto;height:auto;margin:0 auto;object-fit:contain;pointer-events:none}
.deck-slide .figure-embed svg{overflow:visible}
.deck-slide .figure-embed svg *,.deck-slide .figure-embed figure *{pointer-events:none}
.deck-slide .figure-box{position:relative;display:inline-block;overflow:visible;padding:10px;background:#fff;border:1px solid rgba(17,17,17,.18);border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.08);touch-action:none;cursor:grab}
.deck-slide .figure-box.selected{outline:2px solid #61b4ff;outline-offset:2px}
.deck-slide .figure-box > img,.deck-slide .figure-box > svg,.deck-slide .figure-box > canvas,.deck-slide .figure-box > iframe,.deck-slide .figure-box > figure{display:block;width:100%;height:100%;max-width:100%;max-height:100%;pointer-events:none}
.deck-slide .figure-resize-handle{position:absolute;right:-8px;bottom:-8px;width:18px;height:18px;border-radius:50%;background:#61b4ff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.18);cursor:nwse-resize;pointer-events:auto}
.custom-frame-wrap{overflow:hidden;background:#fff}.custom-frame{width:100%;height:720px;border:0;display:block;background:#fff}
.diag{display:grid;place-items:center;padding:.9rem}.diagram{width:100%;max-width:680px;height:auto}.diagram .edge{stroke:currentColor;stroke-opacity:.32;stroke-width:6;stroke-linecap:round}.diagram .node{fill:none;stroke:currentColor;stroke-width:6}.diagram .label{fill:currentColor;font:700 28px Inter,system-ui,sans-serif}
.layout-two-callouts .col-stack > *:first-child,.layout-figure-explanation .col-stack > *:first-child,.layout-image-left-text-right .col-stack > *:first-child,.layout-comparison .col-stack > *:first-child{border-left:8px solid var(--accent,#2f6fed)}.theorem-proof-wrap,.algorithm-wrap,.full-figure-wrap{display:grid;gap:1rem}.named-box{border:1px solid var(--line,rgba(17,17,17,.12));border-radius:var(--radius,22px);background:rgba(127,127,127,.045);box-shadow:0 8px 24px rgba(0,0,0,.04);overflow:hidden}.named-box .named-box-head{padding:.8rem 1rem;font-weight:800;border-bottom:1px solid var(--line,rgba(17,17,17,.12));background:color-mix(in srgb, var(--accent,#2f6fed) 12%, white)}.named-box .named-box-body{padding:1rem 1.1rem}.section-divider-wrap{min-height:720px;display:grid;place-items:center;text-align:center}.section-divider-wrap .divider-kicker{color:var(--accent,#2f6fed);font-weight:800;letter-spacing:.18em;text-transform:uppercase;margin-bottom:1rem}.section-divider-wrap .divider-line{width:220px;height:6px;background:var(--accent,#2f6fed);border-radius:999px;margin:1.2rem auto}.section-divider-wrap .divider-lede{max-width:24ch;color:var(--muted);font-size:1.2rem;line-height:1.5}.comparison-head{font-size:1.2rem;font-weight:800;margin:0 0 .6rem 0;color:var(--accent,#2f6fed)}.figure-caption{font-size:1rem;color:var(--muted);text-align:center}.title-center{min-height:720px;display:grid;place-items:center;text-align:center;padding:3rem}.title-center h1,.title-center h2{font-size:clamp(3.2rem,8vw,5.6rem);max-width:16ch}
.slide h1,.slide h2,.deck-slide h1,.deck-slide h2{text-transform:var(--title-transform,none);letter-spacing:var(--title-letter-spacing,normal)}
.slide.style-berkeley,.deck-slide.style-berkeley{padding-left:calc(3.3rem + var(--sidebar-width,118px))}.slide.style-berkeley::before,.deck-slide.style-berkeley::before{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--sidebar-width,118px);background:var(--chrome-fill,#17365d)}.slide.style-berkeley::after,.deck-slide.style-berkeley::after{content:'';position:absolute;left:var(--sidebar-width,118px);top:0;right:0;height:18px;background:var(--accent,#d4a017)}.slide.style-berkeley h1,.slide.style-berkeley h2,.deck-slide.style-berkeley h1,.deck-slide.style-berkeley h2{color:var(--chrome-fill,#17365d)}
.slide.style-madrid,.deck-slide.style-madrid{padding-top:5rem;padding-bottom:5.2rem}.slide.style-madrid::before,.deck-slide.style-madrid::before{content:'';position:absolute;left:0;top:0;right:0;height:58px;background:var(--chrome-fill,#1f4e79)}.slide.style-madrid::after,.deck-slide.style-madrid::after{content:'';position:absolute;left:0;right:0;bottom:0;height:24px;background:var(--accent,#2f6fed)}.slide.style-madrid h1,.slide.style-madrid h2,.deck-slide.style-madrid h1,.deck-slide.style-madrid h2{color:var(--chrome-fill,#1f4e79)}
.slide.style-annarbor,.deck-slide.style-annarbor{padding-top:4.8rem;padding-bottom:5rem}.slide.style-annarbor::before,.deck-slide.style-annarbor::before{content:'';position:absolute;left:0;top:0;right:0;height:64px;background:var(--chrome-fill,#c99a06)}.slide.style-annarbor::after,.deck-slide.style-annarbor::after{content:'';position:absolute;left:0;right:0;bottom:0;height:18px;background:var(--accent,#7a4f01)}.slide.style-annarbor h1,.slide.style-annarbor h2,.deck-slide.style-annarbor h1,.deck-slide.style-annarbor h2{color:#5b3c00}
.slide.style-cambridgeus,.deck-slide.style-cambridgeus{padding-top:4.7rem;padding-bottom:5rem}.slide.style-cambridgeus::before,.deck-slide.style-cambridgeus::before{content:'';position:absolute;left:0;top:0;right:0;height:56px;background:linear-gradient(90deg,var(--accent,#c53030) 0 18px,var(--chrome-fill,#0f4c81) 18px 100%)}.slide.style-cambridgeus::after,.deck-slide.style-cambridgeus::after{content:'';position:absolute;left:0;right:0;bottom:0;height:18px;background:var(--chrome-fill,#0f4c81)}.slide.style-cambridgeus h1,.slide.style-cambridgeus h2,.deck-slide.style-cambridgeus h1,.deck-slide.style-cambridgeus h2{color:var(--chrome-fill,#0f4c81)}
.slide.style-pittsburgh,.deck-slide.style-pittsburgh{padding-top:4.2rem}.slide.style-pittsburgh::before,.deck-slide.style-pittsburgh::before{content:'';position:absolute;left:0;top:0;right:0;height:16px;background:var(--chrome-fill,#2f6fed)}.slide.style-pittsburgh h1,.slide.style-pittsburgh h2,.deck-slide.style-pittsburgh h1,.deck-slide.style-pittsburgh h2{color:var(--chrome-fill,#2f6fed)}
.anim-frag{transition:opacity .35s ease,transform .35s ease,visibility .35s ease}.anim-hidden{opacity:0 !important;visibility:hidden !important;transform:translateY(8px)}
.slide-actions{position:absolute;top:1.2rem;right:1.2rem;display:flex;gap:.55rem;z-index:10;flex-wrap:wrap;justify-content:flex-end}
.slides-button,.draw-button,.export-annotated-button,.pdf-button{border:1px solid rgba(17,17,17,.18);background:rgba(255,255,255,.88);color:#111;border-radius:999px;padding:.55rem .95rem;font:inherit;font-weight:700;cursor:pointer;backdrop-filter:blur(10px)}
.slide-number{position:absolute;bottom:1.15rem;right:1.4rem;font-size:1rem;color:rgba(17,17,17,.62)}
.pdf-modal[hidden]{display:none !important}
.pdf-modal{position:fixed;inset:0;background:rgba(7,11,23,.46);display:grid;place-items:center;z-index:58;padding:1rem}
.pdf-dialog{width:min(420px,92vw);background:#fff;color:#111;border-radius:18px;border:1px solid rgba(17,17,17,.14);box-shadow:0 24px 70px rgba(0,0,0,.28);padding:1rem;display:grid;gap:.85rem}
.pdf-dialog h3{margin:0;font-size:1.2rem;color:#111}
.pdf-dialog p{margin:0;color:rgba(17,17,17,.72);font-size:.95rem;line-height:1.45}
.pdf-dialog select{font:inherit;padding:.55rem .7rem;border-radius:10px;border:1px solid rgba(17,17,17,.18);background:#fff}
.pdf-dialog .row{display:flex;gap:.6rem;justify-content:flex-end}
.pdf-dialog button{border:1px solid rgba(17,17,17,.16);background:#fff;color:#111;border-radius:10px;padding:.58rem .85rem;font:inherit;font-weight:700;cursor:pointer}
.pdf-dialog button.primary{background:#17365d;color:#fff;border-color:#17365d}
.pdf-status{min-height:1.2rem;font-size:.9rem;color:rgba(17,17,17,.7)}
.slide-annotation-layer{position:absolute;inset:0;pointer-events:none;z-index:9}
.slide-draw-surface{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;touch-action:none}
.slide-draw-surface.active{pointer-events:auto;cursor:crosshair}
.slide-draw-surface [data-draw-shape]{vector-effect:non-scaling-stroke}
.draw-session-toolbar[hidden]{display:none !important}
.draw-session-toolbar{position:fixed;top:1rem;right:1rem;display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;padding:.75rem .9rem;background:rgba(255,255,255,.96);color:#111;border:1px solid rgba(17,17,17,.16);border-radius:16px;box-shadow:0 18px 45px rgba(0,0,0,.18);z-index:55;backdrop-filter:blur(12px)}
.draw-session-toolbar label{display:flex;align-items:center;gap:.35rem;font-weight:600}
.draw-session-toolbar input,.draw-session-toolbar select,.draw-session-toolbar button{font:inherit}
.draw-session-toolbar button{border:1px solid rgba(17,17,17,.16);background:#fff;border-radius:10px;padding:.48rem .7rem;cursor:pointer}
.draw-session-toolbar .primary{background:#17365d;color:#fff;border-color:#17365d}
.laser-pointer{position:fixed;left:0;top:0;width:26px;height:26px;margin-left:-13px;margin-top:-13px;border-radius:999px;pointer-events:none;z-index:70;display:none;
  background:radial-gradient(circle, #ffffff 0 12%, #ff3b30 13% 34%, rgba(255,59,48,.95) 35% 50%, rgba(255,59,48,.38) 51% 72%, rgba(255,59,48,0) 73% 100%);
  border:1px solid rgba(120,0,0,.55);
  box-shadow:0 0 0 2px rgba(255,255,255,.92), 0 0 8px rgba(120,0,0,.45), 0 0 18px rgba(255,0,0,.42), 0 0 34px rgba(255,0,0,.22);
}

.deck-slide.laser-active{cursor:none}
.deck-toolbar{position:fixed;left:1rem;top:1rem;display:flex;gap:.65rem;z-index:30}
.deck-toolbar button,.slide-map button,.nav-btn{border:1px solid rgba(255,255,255,.14);background:rgba(10,16,32,.82);color:#eef3ff;border-radius:14px;padding:.78rem .95rem;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 18px 45px rgba(0,0,0,.25)}
.slide-map{position:fixed;top:0;right:0;height:100svh;width:min(420px,92vw);background:rgba(7,11,23,.96);border-left:1px solid rgba(255,255,255,.10);padding:1rem;display:none;z-index:35;overflow:auto}
.slide-map.open{display:block}.slide-map h3{margin:.2rem 0 1rem 0;font-size:1.2rem}.slide-map-list{display:grid;gap:.6rem}.slide-map-item{display:flex;gap:.6rem;align-items:flex-start;text-align:left}.slide-map-item span:first-child{opacity:.7;min-width:2.2rem}
@media (max-width:900px){.deck-slide{padding:1.5rem 1.2rem 4.2rem}.deck-slide.two-col .slide-body{grid-template-columns:1fr}.deck-slide h1{font-size:2.3rem}.deck-slide h2{font-size:1.9rem}}
</style>
<script>
window.MathJax={tex:{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']]},svg:{fontCache:'global'}};
<\/script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"><\/script>
<script defer src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<script defer src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"><\/script>
</head>
<body>
<div class="deck-toolbar"><button class="nav-btn" id="prevBtn">◀</button><button class="nav-btn" id="nextBtn">▶</button></div>
<div class="slide-map" id="slideMap"><button id="closeMapBtn" style="float:right;">Close</button><h3 id="deckTitle"></h3><div class="slide-map-list" id="slideMapList"></div></div>
<div class="draw-session-toolbar" id="drawSessionToolbar" hidden>
  <label>Tool
    <select id="drawTool">
      <option value="pen">Pen</option>
      <option value="line">Line</option>
      <option value="rect">Rectangle</option>
      <option value="ellipse">Ellipse</option>
      <option value="erase">Erase</option>
    </select>
  </label>
  <label>Color <input id="drawColor" type="color" value="#111111" /></label>
  <label>Width <input id="drawWidth" type="range" min="1" max="16" value="3" /></label>
  <button type="button" id="drawClearBtn">Clear slide</button>
  <button type="button" class="primary" id="drawExitBtn">Exit drawing</button>
</div>
<div class="pdf-modal" id="pdfModal" hidden>
  <div class="pdf-dialog">
    <h3>Generate PDF</h3>
    <p>Choose how many slides to place on each page. Slides containing custom HTML blocks will be skipped.</p>
    <label>
      <div style="font-weight:700;margin-bottom:.35rem">Slides per page</div>
      <select id="pdfSlidesPerPage">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4" selected>4</option>
        <option value="6">6</option>
      </select>
    </label>
    <div class="pdf-status" id="pdfStatus">Ready.</div>
    <div class="row">
      <button type="button" id="pdfCancelBtn">Cancel</button>
      <button type="button" class="primary" id="pdfGenerateBtn">Generate PDF</button>
    </div>
  </div>
</div>
<div class="laser-pointer" id="laserPointer" aria-hidden="true"></div>
<div class="deck" id="deck"></div>
<script>
const deckPayload=JSON.parse(document.getElementById('deck-source').textContent);
const liveDrawEnabled=!!(deckPayload.presentationOptions&&deckPayload.presentationOptions.enableLiveDraw);
const annotationStorageKey='liveDrawInk:' + encodeURIComponent((deckPayload.deckTitle||'deck') + '|' + (Array.isArray(deckPayload.slides)?deckPayload.slides.length:0));
let liveDrawAnnotations=loadLiveDrawAnnotations();
function loadLiveDrawAnnotations(){
  try{
    const raw=localStorage.getItem(annotationStorageKey);
    if(raw) return JSON.parse(raw);
  }catch(err){console.error(err);}
  const seed=(deckPayload.presentationOptions&&deckPayload.presentationOptions.seedAnnotations)||{};
  return JSON.parse(JSON.stringify(seed||{}));
}
function persistLiveDrawAnnotations(){try{localStorage.setItem(annotationStorageKey, JSON.stringify(liveDrawAnnotations));}catch(err){console.error(err);}}
function escapeHtml(str){return String(str??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function escapeAttr(str){return escapeHtml(str).replace(/\\n/g,'&#10;');}
function preserveMathTokens(str){const tokens=[];let out=String(str??'');const patterns=[/\\$\\$[\\s\\S]+?\\$\\$/g,/\\\\\\[[\\s\\S]+?\\\\\\]/g,/\\\\\\([\\s\\S]+?\\\\\\)/g,/\\$(?!\\s)[^$\\n]+?\\$/g];patterns.forEach(pattern=>{out=out.replace(pattern,m=>{const key='@@MATH'+tokens.length+'@@';tokens.push(m);return key;});});return {out,tokens};}
function restoreMathTokens(str,tokens){return String(str).replace(/@@MATH(\\d+)@@/g,(_,i)=>tokens[Number(i)]??'');}
function hexToRgb(hex){const clean=String(hex||'').trim().replace('#','');if(!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;const full=clean.length===3?clean.split('').map(c=>c+c).join(''):clean;const num=parseInt(full,16);return {r:(num>>16)&255,g:(num>>8)&255,b:num&255};}
function rgbaFromHex(hex,alpha){const rgb=hexToRgb(hex);if(!rgb) return 'rgba(0,0,0,'+alpha+')';return 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+alpha+')';}
function normalizeTheme(theme){const t=theme||{};return {name:t.name||'Default theme',bgColor:t.bgColor||'#ffffff',fontColor:t.fontColor||'#111111',accentColor:t.accentColor||'#2f6fed',panelRadius:Number.isFinite(Number(t.panelRadius))?Number(t.panelRadius):22,titleScale:Number.isFinite(Number(t.titleScale))?Number(t.titleScale):1,beamerStyle:t.beamerStyle||'classic',chromeColor:t.chromeColor||'#17365d',chromeTextColor:t.chromeTextColor||'#ffffff',sidebarWidth:Number.isFinite(Number(t.sidebarWidth))?Number(t.sidebarWidth):118,titleCaps:String(t.titleCaps||'0')};}function isTwoColType(type){return ['two-col','title-two-callouts','title-figure-explanation','comparison','image-left-text-right'].includes(type);}function buildSlideStyle(slide,theme=deckPayload.theme){const t=normalizeTheme(theme);const useTheme=slide.inheritTheme!==false;const bg=useTheme?t.bgColor:(slide.bgColor||t.bgColor);const font=useTheme?t.fontColor:(slide.fontColor||t.fontColor);const muted=rgbaFromHex(font,0.72);const line=rgbaFromHex(font,0.14);const titleTransform=String(t.titleCaps)==='1'?'uppercase':'none';const titleLetterSpacing=String(t.titleCaps)==='1'?'.04em':'normal';let extra='';const styleId=String(t.beamerStyle||'classic').toLowerCase();if(styleId==='berkeley'){extra+='padding-left:calc(3.3rem + '+t.sidebarWidth+'px);';extra+='background-image:linear-gradient(90deg,'+t.chromeColor+' 0 '+t.sidebarWidth+'px, transparent '+t.sidebarWidth+'px 100%),linear-gradient(180deg,'+t.accentColor+' 0 18px, transparent 18px 100%);background-repeat:no-repeat;';}else if(styleId==='madrid'){extra+='padding-top:5rem;padding-bottom:5.2rem;';extra+='background-image:linear-gradient(180deg,'+t.chromeColor+' 0 58px, transparent 58px calc(100% - 24px),'+t.accentColor+' calc(100% - 24px) 100%);background-repeat:no-repeat;';}else if(styleId==='annarbor'){extra+='padding-top:4.8rem;padding-bottom:5rem;';extra+='background-image:linear-gradient(180deg,'+t.chromeColor+' 0 64px, transparent 64px calc(100% - 18px),'+t.accentColor+' calc(100% - 18px) 100%);background-repeat:no-repeat;';}else if(styleId==='cambridgeus'){extra+='padding-top:4.7rem;padding-bottom:5rem;';extra+='background-image:linear-gradient(180deg,transparent 0 56px, transparent 56px calc(100% - 18px),'+t.chromeColor+' calc(100% - 18px) 100%),linear-gradient(90deg,'+t.accentColor+' 0 18px,'+t.chromeColor+' 18px 100%);background-size:100% 100%,100% 56px;background-repeat:no-repeat;';}else if(styleId==='pittsburgh'){extra+='padding-top:4.2rem;';extra+='background-image:linear-gradient(180deg,'+t.chromeColor+' 0 16px, transparent 16px 100%);background-repeat:no-repeat;';}return 'background-color:'+bg+';color:'+font+';--text:'+font+';--muted:'+muted+';--line:'+line+';--accent:'+t.accentColor+';--radius:'+t.panelRadius+'px;--title-scale:'+t.titleScale+';--chrome-fill:'+t.chromeColor+';--chrome-text:'+t.chromeTextColor+';--sidebar-width:'+t.sidebarWidth+'px;--title-transform:'+titleTransform+';--title-letter-spacing:'+titleLetterSpacing+';'+extra;}
function parseStructuredText(raw){const text=String(raw??'').replace(/\\r\\n/g,'\\n').trim();if(!text)return '';function safeWithMath(str){const p=preserveMathTokens(str);return restoreMathTokens(escapeHtml(p.out),p.tokens);}const lines=text.split('\\n');const parts=[];let paragraph=[];let listType=null;let listItems=[];function flushParagraph(){if(!paragraph.length)return;const joined=paragraph.join(' ').trim();if(joined)parts.push('<p>'+safeWithMath(joined)+'</p>');paragraph=[];}function flushList(){if(!listItems.length)return;const tag=listType==='enumerate'?'ol':'ul';parts.push('<'+tag+'>'+listItems.map(item=>'<li>'+safeWithMath(item)+'</li>').join('')+'</'+tag+'>');listItems=[];listType=null;}function collectUntil(endPattern,startIndex){const chunk=[];let i=startIndex;while(i<lines.length&&!endPattern.test(lines[i].trim())){chunk.push(lines[i]);i+=1;}return {body:chunk.join('\\n').trim(),endIndex:i};}function simpleCardBody(body){const trimmed=body.trim();if(!trimmed)return '';return trimmed.split(/\\n\\s*\\n/).map(block=>'<p>'+safeWithMath(block.replace(/\\s*\\n\\s*/g,' ').trim())+'</p>').join('');}
for(let i=0;i<lines.length;i+=1){const line=lines[i].trim();if(!line){flushParagraph();flushList();continue;}const paragraphMatch=line.match(/^\\\\paragraph\\{([\\s\\S]*)\\}$/);if(paragraphMatch){flushParagraph();flushList();parts.push('<p>'+safeWithMath(paragraphMatch[1].trim())+'</p>');continue;}if(/^\\\\begin\\{itemize\\}$/i.test(line)){flushParagraph();flushList();const items=[];i+=1;while(i<lines.length&&!/^\\\\end\\{itemize\\}$/i.test(lines[i].trim())){const itemLine=lines[i].trim();if(itemLine){const itemMatch=itemLine.match(/^\\\\item\\s+([\\s\\S]*)$/);if(itemMatch)items.push(itemMatch[1].trim());}i+=1;}parts.push('<ul>'+items.map(item=>'<li>'+safeWithMath(item)+'</li>').join('')+'</ul>');continue;}if(/^\\\\begin\\{enumerate\\}$/i.test(line)){flushParagraph();flushList();const items=[];i+=1;while(i<lines.length&&!/^\\\\end\\{enumerate\\}$/i.test(lines[i].trim())){const itemLine=lines[i].trim();if(itemLine){const itemMatch=itemLine.match(/^\\\\item\\s+([\\s\\S]*)$/);if(itemMatch)items.push(itemMatch[1].trim());}i+=1;}parts.push('<ol>'+items.map(item=>'<li>'+safeWithMath(item)+'</li>').join('')+'</ol>');continue;}if(/^\\\\begin\\{equation\\}$/i.test(line)){flushParagraph();flushList();const collected=collectUntil(/^\\\\end\\{equation\\}$/i,i+1);parts.push('<div class="display-math">\\\\[\\\\begin{aligned}'+escapeHtml(collected.body)+'\\\\end{aligned}\\\\]</div>');i=collected.endIndex;continue;}const cardBegin=line.match(/^\\\\begin\\{card\\}\\{([\\s\\S]*)\\}$/i);if(cardBegin){flushParagraph();flushList();const collected=collectUntil(/^\\\\end\\{card\\}$/i,i+1);parts.push('<div class="bullet-card"><b>'+safeWithMath(cardBegin[1].trim())+'</b><div>'+simpleCardBody(collected.body)+'</div></div>');i=collected.endIndex;continue;}if(/^\\\\begin\\{figurehtml\\}$/i.test(line)){flushParagraph();flushList();const collected=collectUntil(/^\\\\end\\{figurehtml\\}$/i,i+1);parts.push('<div class="figure-embed">'+collected.body+'</div>');i=collected.endIndex;continue;}if(/^UL:/i.test(line)){flushParagraph();if(listType&&listType!=='itemize')flushList();listType='itemize';listItems.push(line.replace(/^UL:/i,'').trim());continue;}if(line.startsWith('- ')){flushParagraph();if(listType&&listType!=='itemize')flushList();listType='itemize';listItems.push(line.slice(2).trim());continue;}flushList();if(line.startsWith('### ')){flushParagraph();parts.push('<h3>'+safeWithMath(line.slice(4).trim())+'</h3>');continue;}if(/^P:/i.test(line)){flushParagraph();parts.push('<p>'+safeWithMath(line.replace(/^P:/i,'').trim())+'</p>');continue;}if(/^EQ:/i.test(line)){flushParagraph();parts.push('<div class="display-math">'+safeWithMath(line.replace(/^EQ:/i,'').trim())+'</div>');continue;}if(/^CARD:/i.test(line)){flushParagraph();const payload=line.replace(/^CARD:/i,'').trim();const pieces=payload.split('|');const cardTitle=pieces.shift()||'';const cardBody=pieces.join('|');parts.push('<div class="bullet-card"><b>'+safeWithMath(cardTitle)+'</b><div><p>'+safeWithMath(cardBody)+'</p></div></div>');continue;}paragraph.push(line);}flushParagraph();flushList();return parts.join('\\n');}
function diagramMarkup(){return '<div class="diag"><svg class="diagram" viewBox="0 0 760 430" role="img" aria-label="Tiny neural network diagram placeholder"><line x1="145" y1="145" x2="355" y2="125" class="edge"/><line x1="145" y1="145" x2="355" y2="295" class="edge"/><line x1="145" y1="285" x2="355" y2="125" class="edge"/><line x1="145" y1="285" x2="355" y2="295" class="edge"/><line x1="405" y1="125" x2="615" y2="215" class="edge"/><line x1="405" y1="295" x2="615" y2="215" class="edge"/><circle cx="115" cy="145" r="34" class="node"/><circle cx="115" cy="285" r="34" class="node"/><circle cx="375" cy="125" r="34" class="node"/><circle cx="375" cy="295" r="34" class="node"/><circle cx="645" cy="215" r="34" class="node"/><text x="88" y="153" class="label">x₁</text><text x="88" y="293" class="label">x₂</text><text x="350" y="133" class="label">h₁</text><text x="350" y="303" class="label">h₂</text><text x="632" y="223" class="label">ŷ</text></svg></div>';}
function customFrameMarkup(raw){const html=String(raw||'').trim();if(!html)return '<div class="placeholder">Paste custom HTML here.</div>';return '<div class="custom-frame-wrap"><iframe class="custom-frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads" referrerpolicy="no-referrer" srcdoc="'+escapeAttr(html)+'"></iframe></div>';}
function normalizeBlockStyle(style){const s=style||{};const fontScale=Number.isFinite(Number(s.fontScale))?Number(s.fontScale):1;return {fontScale:Math.max(.6,Math.min(2.5,fontScale)),fontFamily:s.fontFamily||'inherit',fontColor:s.fontColor||'#111111',bulletType:s.bulletType||'disc'};}function normalizeAnimation(anim){const a=anim||{};const buildIn=['none','appear','fade'].includes(a.buildIn)?a.buildIn:'none';const buildOut=['none','disappear','fade'].includes(a.buildOut)?a.buildOut:'none';const stepMode=['all','by-item'].includes(a.stepMode)?a.stepMode:'all';const order=Number.isFinite(Number(a.order))?Number(a.order):0;return {buildIn,buildOut,stepMode,order};}function animationDataAttrs(anim){const a=normalizeAnimation(anim);return ' data-build-in="'+escapeAttr(a.buildIn)+'" data-build-out="'+escapeAttr(a.buildOut)+'" data-step-mode="'+escapeAttr(a.stepMode)+'" data-anim-order="'+escapeAttr(String(a.order))+'"';}function blockWrapperStyle(block){const s=normalizeBlockStyle((block&&block.style)||{});return '--block-font-scale:'+s.fontScale+';--block-font-family:'+escapeAttr(s.fontFamily)+';--block-font-color:'+s.fontColor+';--block-bullet-type:'+s.bulletType+';';}function titleWrapperStyle(style,heading){const s=normalizeBlockStyle(style||{});const baseMap={h1:'5.6rem',h2:'3.1rem',h3:'2.45rem',h4:'2.1rem',h5:'1.8rem',h6:'1.55rem'};return '--block-font-scale:'+s.fontScale+';--block-font-family:'+escapeAttr(s.fontFamily)+';--block-font-color:'+s.fontColor+';--title-base-size:'+(baseMap[String(heading||'h2').toLowerCase()]||'3.1rem')+';';}function normalizeBlock(block){const mode=block.mode||'panel';if(mode==='diagram'){return {mode:'custom',title:block.title||'Legacy diagram',content:'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Inter,Arial,sans-serif}*{box-sizing:border-box}.diag{display:grid;place-items:center;padding:.9rem}.diagram{width:100%;max-width:680px;height:auto}.diagram .edge{stroke:currentColor;stroke-opacity:.32;stroke-width:6;stroke-linecap:round}.diagram .node{fill:none;stroke:currentColor;stroke-width:6}.diagram .label{fill:currentColor;font:700 28px Inter,system-ui,sans-serif}</style></head><body>'+(block.content||diagramMarkup())+'</body></html>',style:normalizeBlockStyle(block.style),animation:normalizeAnimation(block.animation)};}return {mode:mode,title:block.title||'',content:block.content||'',style:normalizeBlockStyle(block.style),animation:normalizeAnimation(block.animation)};}
function normalizeSlide(slide){const out=JSON.parse(JSON.stringify(slide||{}));let leftBlocks=Array.isArray(out.leftBlocks)?out.leftBlocks.map(normalizeBlock):null;let rightBlocks=Array.isArray(out.rightBlocks)?out.rightBlocks.map(normalizeBlock):null;if(!leftBlocks){leftBlocks=[{mode:out.leftMode||'panel',title:'',content:out.leftHtml||''}];}if(!rightBlocks){rightBlocks=isTwoColType(out.slideType)?[{mode:out.rightMode||'panel',title:'',content:out.rightHtml||''}]:[];}out.leftBlocks=leftBlocks;out.rightBlocks=rightBlocks;out.titleStyle=normalizeBlockStyle(out.titleStyle);out.titleAnimation=normalizeAnimation(out.titleAnimation);out.inheritTheme=out.inheritTheme!==false;return out;}
function renderBlock(block,placeholderText){const resolvedMode=block.mode||'panel';const raw=block.content||'';let inner='';if(resolvedMode==='diagram')inner=diagramMarkup();else if(resolvedMode==='custom')inner=customFrameMarkup(raw);else if(resolvedMode==='placeholder')inner='<div class="placeholder">'+escapeHtml(raw||placeholderText||'Placeholder')+'</div>';else if(resolvedMode==='pseudocode')inner='<pre class="pseudo-block">'+escapeHtml(raw)+'</pre>';else if(resolvedMode==='pseudocode-latex'){const p=preserveMathTokens(raw);inner='<div class="pseudo-latex-block">'+restoreMathTokens(escapeHtml(p.out),p.tokens)+'</div>';}else inner='<div class="rich">'+parseStructuredText(raw)+'</div>';return '<div class="preview-block"'+animationDataAttrs(block.animation)+' style="'+blockWrapperStyle(block)+'">'+inner+'</div>';}
function renderBlocks(blocks,placeholder){const list=blocks&&blocks.length?blocks:[{mode:'placeholder',content:placeholder||'Add a block'}];return '<div class="col-stack">'+list.map(block=>renderBlock(block,placeholder)).join('')+'</div>';}
function buildSlideInner(slide){const heading=slide.headingLevel||'h2';const titleHtml='<div class="preview-title" data-preview-role="title"'+animationDataAttrs(slide.titleAnimation)+' style="'+titleWrapperStyle(slide.titleStyle,heading)+'"><'+heading+'>'+escapeHtml(slide.title||'Untitled slide').replace(/\\n/g,'<br>')+'</'+heading+'></div>';const kickerHtml=slide.kicker?'<div class="kicker">'+escapeHtml(slide.kicker)+'</div>':'';const ledeHtml=slide.lede?'<div class="lede">'+escapeHtml(slide.lede)+'</div>':'';const s=normalizeSlide(slide);if(s.slideType==='title-center')return '<div class="title-center">'+titleHtml+kickerHtml+'</div>';if(s.slideType==='section-divider')return '<div class="section-divider-wrap"><div><div class="divider-kicker">'+escapeHtml(s.kicker||'Section')+'</div>'+titleHtml+'<div class="divider-line"></div><div class="divider-lede">'+escapeHtml(s.lede||'')+'</div></div></div>';if(['two-col','title-two-callouts','title-figure-explanation','comparison','image-left-text-right'].includes(s.slideType)){const layoutClass={ 'two-col':'layout-two-col','title-two-callouts':'layout-two-callouts','title-figure-explanation':'layout-figure-explanation','comparison':'layout-comparison','image-left-text-right':'layout-image-left-text-right'}[s.slideType]||'layout-two-col';const leftHead=s.slideType==='comparison'?'<div class="comparison-head">'+escapeHtml((s.leftBlocks[0]&&s.leftBlocks[0].title)||'Left')+'</div>':'';const rightHead=s.slideType==='comparison'?'<div class="comparison-head">'+escapeHtml((s.rightBlocks[0]&&s.rightBlocks[0].title)||'Right')+'</div>':'';return titleHtml+kickerHtml+ledeHtml+'<div class="slide-body '+layoutClass+'"><div class="col">'+leftHead+renderBlocks(s.leftBlocks,'Left column')+'</div><div class="col">'+rightHead+renderBlocks(s.rightBlocks,'Right column')+'</div></div>';}if(s.slideType==='theorem-proof'){const theorem=s.leftBlocks[0]||{mode:'panel',content:'\\paragraph{Theorem} State the result here.'};const proof=s.leftBlocks[1]||{mode:'panel',content:'\\paragraph{Proof sketch} Add the argument here.'};return titleHtml+kickerHtml+ledeHtml+'<div class="slide-body"><div class="col theorem-proof-wrap"><div class="named-box"><div class="named-box-head">'+escapeHtml(theorem.title||'Theorem')+'</div><div class="named-box-body">'+renderBlock({...theorem,title:''},'Theorem')+'</div></div><div class="named-box"><div class="named-box-head">'+escapeHtml(proof.title||'Proof')+'</div><div class="named-box-body">'+renderBlock({...proof,title:''},'Proof')+'</div></div></div></div>';}if(s.slideType==='algorithm-layout'){const algo=s.leftBlocks[0]||{mode:'pseudocode',content:'Algorithm goes here'};const notes=s.leftBlocks.slice(1);return titleHtml+kickerHtml+ledeHtml+'<div class="slide-body"><div class="col algorithm-wrap">'+renderBlock(algo,'Algorithm')+(notes.length?renderBlocks(notes,'Notes'):'')+'</div></div>';}if(s.slideType==='full-width-figure-caption'){const fig=s.leftBlocks[0]||{mode:'placeholder',content:'Add a figure block'};const captionBlocks=s.leftBlocks.slice(1);return titleHtml+kickerHtml+ledeHtml+'<div class="slide-body"><div class="col full-figure-wrap">'+renderBlock(fig,'Figure')+(captionBlocks.length?'<div class="figure-caption">'+renderBlocks(captionBlocks,'Caption')+'</div>':'')+'</div></div>';}return titleHtml+kickerHtml+ledeHtml+'<div class="slide-body"><div class="col">'+renderBlocks(s.leftBlocks,'Main content')+'</div></div>';}
const deck=document.getElementById('deck');const slideMap=document.getElementById('slideMap');const slideMapList=document.getElementById('slideMapList');const laserPointer=document.getElementById('laserPointer');document.getElementById('deckTitle').textContent=deckPayload.deckTitle||'Slides';
deck.innerHTML=deckPayload.slides.map((slide,idx)=>{const cls=slide.slideType==='title-center'?'deck-slide title-center':(slide.slideType==='two-col'?'deck-slide two-col':'deck-slide single');const styleCls=' style-'+String((deckPayload.theme&&deckPayload.theme.beamerStyle)||'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();const actionHtml='<div class="slide-actions"><button class="slides-button" type="button">Slides</button>'+(liveDrawEnabled?'<button class="draw-button" type="button">Draw</button><button class="export-annotated-button" type="button">Export annotated slides</button>':'')+'<button class="pdf-button" type="button">Generate PDF</button></div>';return '<section class="'+cls+styleCls+'" data-index="'+idx+'" style="'+buildSlideStyle(slide)+'">'+actionHtml+'<div class="slide-number">'+(idx+1)+' / '+deckPayload.slides.length+'</div>'+buildSlideInner(slide).trim()+'<div class="slide-annotation-layer" data-annotation-layer="'+idx+'"><svg class="slide-draw-surface" data-draw-surface="'+idx+'" viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-label="Slide annotation layer"></svg></div></section>';}).join('\\n');
slideMapList.innerHTML=deckPayload.slides.map((slide,idx)=>'<button type="button" class="slide-map-item" data-go="'+idx+'"><span>'+(idx+1)+'.</span><span>'+escapeHtml(slide.title||('Slide '+(idx+1)))+'</span></button>').join('\\n');
let active=0;
let drawingMode=false;
let drawingSlideIndex=-1;
let drawingState={tool:'pen',drawing:false,start:null,el:null};
const slideEls=Array.from(document.querySelectorAll('.deck-slide'));
const drawSessionToolbar=document.getElementById('drawSessionToolbar');
const drawTool=document.getElementById('drawTool');
const drawColor=document.getElementById('drawColor');
const drawWidth=document.getElementById('drawWidth');
const drawClearBtn=document.getElementById('drawClearBtn');
const drawExitBtn=document.getElementById('drawExitBtn');
const pdfModal=document.getElementById('pdfModal');
const pdfSlidesPerPage=document.getElementById('pdfSlidesPerPage');
const pdfCancelBtn=document.getElementById('pdfCancelBtn');
const pdfGenerateBtn=document.getElementById('pdfGenerateBtn');
const pdfStatus=document.getElementById('pdfStatus');
function fitFiguresInSlide(slideEl){if(!slideEl)return;const figures=Array.from(slideEl.querySelectorAll('.figure-embed'));if(!figures.length)return;const isManual=embed=>{const box=embed&&embed.querySelector('.figure-box');return !!(box&&(box.dataset.userMoved==='1'||box.dataset.userSized==='1'));};figures.forEach(embed=>{if(isManual(embed))return;embed.style.maxHeight='';embed.style.maxWidth='';embed.style.height='';embed.style.width='';const media=embed.querySelector('img,svg,canvas,iframe');if(media){media.style.maxHeight='';media.style.maxWidth='';media.style.height='';media.style.width='';}});const maxHeight=slideEl.clientHeight||window.innerHeight||900;let guard=0;while(slideEl.scrollHeight>maxHeight+2&&guard<16){const overflow=slideEl.scrollHeight-maxHeight;const candidates=figures.map(embed=>{if(isManual(embed))return null;const media=embed.querySelector('img,svg,canvas,iframe');const rect=(media||embed).getBoundingClientRect();return {embed,media,h:rect.height||0};}).filter(x=>x&&x.h>40).sort((a,b)=>b.h-a.h);if(!candidates.length)break;const c=candidates[0];const current=parseFloat((c.media&&c.media.style.maxHeight)||c.h);const reduce=Math.min(Math.max(overflow+8,24),current*0.35);const next=Math.max(70,current-reduce);c.embed.style.maxHeight=(next+12)+'px';if(c.media)c.media.style.maxHeight=next+'px';guard+=1;}}
function fitFiguresIn(root){(root||document).querySelectorAll('.deck-slide.active,.print-cell .slide,.slide').forEach(fitFiguresInSlide);}
function getDrawSurface(slideIndex){return document.querySelector('.slide-draw-surface[data-draw-surface="'+slideIndex+'"]');}
function renderLiveDrawAnnotations(){slideEls.forEach((slideEl,idx)=>{const svg=getDrawSurface(idx);if(!svg)return;svg.innerHTML=String(liveDrawAnnotations[idx]||'');svg.classList.toggle('active', drawingMode && drawingSlideIndex===idx);});}
function saveSurface(slideIndex){const svg=getDrawSurface(slideIndex);if(!svg)return;liveDrawAnnotations[slideIndex]=svg.innerHTML||'';persistLiveDrawAnnotations();}function collectAnimationFragments(target, stepMode){
  if(stepMode!=='by-item') return [target];
  const items=Array.from(target.querySelectorAll('.rich li, .rich p, .rich h3, .bullet-card, .display-math, .pseudo-block, .pseudo-latex-block, .placeholder'));
  return items.length ? items : [target];
}
function setAnimHidden(el, hidden){
  if(!el) return;
  el.classList.add('anim-frag');
  el.classList.toggle('anim-hidden', !!hidden);
}
function initializeSlideAnimations(slideEl){
  if(!slideEl) return;
  const targets=Array.from(slideEl.querySelectorAll('.preview-title, .preview-block, .figure-box, .figure-embed figure[data-figure-kind="image"]')).filter(el=>{
    const buildIn=el.dataset.buildIn || 'none';
    const buildOut=el.dataset.buildOut || 'none';
    const stepMode=el.dataset.stepMode || 'all';
    return buildIn !== 'none' || buildOut !== 'none' || stepMode === 'by-item';
  });
  const steps=[];
  targets.forEach((target, idx)=>{
    const buildIn=target.dataset.buildIn || 'none';
    const buildOut=target.dataset.buildOut || 'none';
    const stepMode=target.dataset.stepMode || 'all';
    const order=Number(target.dataset.animOrder || '0') || 0;
    const fragments=collectAnimationFragments(target, stepMode);
    if(stepMode==='by-item' || buildIn !== 'none'){
      fragments.forEach(f=>setAnimHidden(f, true));
      fragments.forEach((fragment, fragIdx)=>{
        steps.push({phase:'in', order, dom:idx, frag:fragIdx, target, fragment, kind:buildIn || 'appear'});
      });
    } else {
      fragments.forEach(f=>setAnimHidden(f, false));
    }
    if(buildOut !== 'none'){
      steps.push({phase:'out', order, dom:idx, frag:9999, target, kind:buildOut});
    }
  });
  steps.sort((a,b)=> (a.order-b.order) || ((a.phase==='in'?0:1)-(b.phase==='in'?0:1)) || (a.dom-b.dom) || (a.frag-b.frag));
  slideEl.__animSteps=steps;
  slideEl.__animIndex=0;
}
function advanceSlideAnimation(slideEl){
  if(!slideEl || !Array.isArray(slideEl.__animSteps)) return false;
  if(slideEl.__animIndex >= slideEl.__animSteps.length) return false;
  const step=slideEl.__animSteps[slideEl.__animIndex++];
  if(step.phase==='in'){
    setAnimHidden(step.fragment, false);
  }else if(step.phase==='out'){
    const frags=collectAnimationFragments(step.target, step.target.dataset.stepMode || 'all');
    frags.forEach(f=>setAnimHidden(f, true));
  }
  return true;
}
function activeSlideHasPendingAnimations(){
  const slide=slideEls[active];
  return !!(slide && Array.isArray(slide.__animSteps) && slide.__animIndex < slide.__animSteps.length);
}

function slidePoint(evt, svg){const pt=svg.createSVGPoint();pt.x=evt.clientX;pt.y=evt.clientY;const m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):{x:0,y:0};}
function beginShape(evt){if(!drawingMode || drawingSlideIndex!==active) return;const svg=getDrawSurface(active); if(!svg) return;const tool=drawTool.value;if(tool==='erase'){const hit=evt.target.closest('[data-draw-shape]');if(hit && svg.contains(hit)){ hit.remove(); saveSurface(active); }return;}evt.preventDefault();const p=slidePoint(evt, svg);drawingState.tool=tool; drawingState.drawing=true; drawingState.start=p; drawingState.el=null;let el=null;if(tool==='pen'){el=document.createElementNS('http://www.w3.org/2000/svg','polyline');el.setAttribute('fill','none');el.setAttribute('stroke',drawColor.value);el.setAttribute('stroke-width',drawWidth.value);el.setAttribute('stroke-linecap','round');el.setAttribute('stroke-linejoin','round');el.setAttribute('points',p.x+','+p.y);}else if(tool==='line'){el=document.createElementNS('http://www.w3.org/2000/svg','line');el.setAttribute('x1',p.x);el.setAttribute('y1',p.y);el.setAttribute('x2',p.x);el.setAttribute('y2',p.y);el.setAttribute('stroke',drawColor.value);el.setAttribute('stroke-width',drawWidth.value);el.setAttribute('stroke-linecap','round');}else if(tool==='rect'){el=document.createElementNS('http://www.w3.org/2000/svg','rect');el.setAttribute('x',p.x);el.setAttribute('y',p.y);el.setAttribute('width',1);el.setAttribute('height',1);el.setAttribute('fill','none');el.setAttribute('stroke',drawColor.value);el.setAttribute('stroke-width',drawWidth.value);}else if(tool==='ellipse'){el=document.createElementNS('http://www.w3.org/2000/svg','ellipse');el.setAttribute('cx',p.x);el.setAttribute('cy',p.y);el.setAttribute('rx',1);el.setAttribute('ry',1);el.setAttribute('fill','none');el.setAttribute('stroke',drawColor.value);el.setAttribute('stroke-width',drawWidth.value);}if(!el) return;el.setAttribute('data-draw-shape','1');svg.appendChild(el);drawingState.el=el;}
function updateShape(evt){if(!drawingState.drawing || drawingSlideIndex!==active) return;const svg=getDrawSurface(active); if(!svg || !drawingState.el) return;const p=slidePoint(evt, svg);const el=drawingState.el;if(drawingState.tool==='pen'){el.setAttribute('points',(el.getAttribute('points')||'')+' '+p.x+','+p.y);}else if(drawingState.tool==='line'){el.setAttribute('x2',p.x);el.setAttribute('y2',p.y);}else if(drawingState.tool==='rect'){const x=Math.min(drawingState.start.x,p.x),y=Math.min(drawingState.start.y,p.y),w=Math.abs(p.x-drawingState.start.x),h=Math.abs(p.y-drawingState.start.y);el.setAttribute('x',x);el.setAttribute('y',y);el.setAttribute('width',w);el.setAttribute('height',h);}else if(drawingState.tool==='ellipse'){el.setAttribute('cx',(drawingState.start.x+p.x)/2);el.setAttribute('cy',(drawingState.start.y+p.y)/2);el.setAttribute('rx',Math.abs(p.x-drawingState.start.x)/2);el.setAttribute('ry',Math.abs(p.y-drawingState.start.y)/2);}saveSurface(active);}
function endShape(){if(!drawingState.drawing) return; drawingState.drawing=false; drawingState.start=null; drawingState.el=null; saveSurface(active);}
function enterDrawingMode(slideIndex){if(!liveDrawEnabled) return; drawingMode=true; drawingSlideIndex=slideIndex; if(drawSessionToolbar) drawSessionToolbar.hidden=false; render(); hideLaserPointer();}
function exitDrawingMode(){drawingMode=false; drawingSlideIndex=-1; drawingState.drawing=false; drawingState.start=null; drawingState.el=null; if(drawSessionToolbar) drawSessionToolbar.hidden=true; render();}

function slideHasCustomHtml(slide){
  const s = normalizeSlide(slide);
  const all = [].concat(s.leftBlocks || [], s.rightBlocks || []);
  return all.some(block => String((block && block.mode) || 'panel') === 'custom');
}
function getEligiblePdfSlideIndices(){
  return (deckPayload.slides || []).map((slide, idx) => slideHasCustomHtml(slide) ? null : idx).filter(idx => idx !== null);
}
function getPdfLayout(slidesPerPage){
  const n = Number(slidesPerPage) || 1;
  if(n === 2) return { rows: 1, cols: 2 };
  if(n === 4) return { rows: 2, cols: 2 };
  if(n === 6) return { rows: 2, cols: 3 };
  return { rows: 1, cols: 1 };
}
function setPdfStatus(msg){ if(pdfStatus) pdfStatus.textContent = msg; }
function openPdfModal(){ if(pdfModal){ setPdfStatus('Ready.'); pdfModal.hidden = false; } }
function closePdfModal(){ if(pdfModal){ pdfModal.hidden = true; setPdfStatus('Ready.'); } }
async function ensurePdfLibraries(){
  const start = Date.now();
  while(Date.now() - start < 8000){
    if(window.html2canvas && window.jspdf && window.jspdf.jsPDF) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  return false;
}
async function generatePdfFromSlides(slidesPerPage){
  if(drawingMode) exitDrawingMode();
  closePdfModal();
  const ok = await ensurePdfLibraries();
  if(!ok){ alert('PDF libraries did not load. Check your internet connection and try again.'); return; }

  const eligible = getEligiblePdfSlideIndices();
  if(!eligible.length){ alert('No slides are eligible for PDF export. Slides with custom HTML blocks are skipped.'); return; }

  renderLiveDrawAnnotations();
  if(window.MathJax && typeof window.MathJax.typesetPromise === 'function'){
    try{
      if(typeof window.MathJax.typesetClear === 'function') window.MathJax.typesetClear(slideEls);
      await window.MathJax.typesetPromise(slideEls);
    }catch(err){ console.error(err); }
  }

  const stage = document.createElement('div');
  stage.style.position = 'fixed';
  stage.style.left = '-20000px';
  stage.style.top = '0';
  stage.style.width = '1600px';
  stage.style.pointerEvents = 'none';
  stage.style.zIndex = '-1';
  document.body.appendChild(stage);

  const canvases = [];
  try{
    for(let i = 0; i < eligible.length; i += 1){
      const slideIndex = eligible[i];
      setPdfStatus('Rendering slide ' + (i + 1) + ' of ' + eligible.length + '…');
      const clone = slideEls[slideIndex].cloneNode(true);
      clone.classList.add('active');
      clone.style.display = 'block';
      clone.style.position = 'relative';
      clone.style.inset = 'auto';
      clone.style.width = '1600px';
      clone.style.height = '900px';
      clone.style.minHeight = '900px';
      clone.style.overflow = 'hidden';
      clone.querySelectorAll('.slide-actions,.slide-map,.deck-toolbar,.laser-pointer,.draw-session-toolbar,.pdf-modal').forEach(el => el.remove());
      clone.querySelectorAll('.slide-draw-surface').forEach(el => el.classList.remove('active'));
      stage.innerHTML = '';
      stage.appendChild(clone);
      if(window.MathJax && typeof window.MathJax.typesetPromise === 'function'){
        try{
          if(typeof window.MathJax.typesetClear === 'function') window.MathJax.typesetClear([clone]);
          await window.MathJax.typesetPromise([clone]);
        }catch(err){ console.error(err); }
      }
      const canvas = await window.html2canvas(clone, {backgroundColor:'#ffffff', scale:2, useCORS:true});
      canvases.push(canvas);
    }
  } finally {
    stage.remove();
  }

  setPdfStatus('Building PDF…');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'landscape', unit:'pt', format:'letter', compress:true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const gap = 12;
  const layout = getPdfLayout(slidesPerPage);
  const cellW = (pageW - 2 * margin - (layout.cols - 1) * gap) / layout.cols;
  const cellH = (pageH - 2 * margin - (layout.rows - 1) * gap) / layout.rows;

  canvases.forEach((canvas, idx) => {
    if(idx > 0 && idx % (Number(slidesPerPage) || 1) === 0) doc.addPage('letter', 'landscape');
    const slot = idx % (Number(slidesPerPage) || 1);
    const row = Math.floor(slot / layout.cols);
    const col = slot % layout.cols;
    let drawW = cellW;
    let drawH = drawW * 9 / 16;
    if(drawH > cellH){
      drawH = cellH;
      drawW = drawH * 16 / 9;
    }
    const x = margin + col * (cellW + gap) + (cellW - drawW) / 2;
    const y = margin + row * (cellH + gap) + (cellH - drawH) / 2;
    doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, drawW, drawH, undefined, 'FAST');
  });

  const filename = ((deckPayload.deckTitle || 'presentation').replace(/[^\w\-]+/g,'_') || 'presentation') + '_' + String(slidesPerPage || 1) + 'up.pdf';
  doc.save(filename);
}
async function downloadAnnotatedSlides(){
  const payload=JSON.parse(document.getElementById('deck-source').textContent);
  payload.presentationOptions=payload.presentationOptions||{};
  payload.presentationOptions.enableLiveDraw=liveDrawEnabled;
  payload.presentationOptions.seedAnnotations=JSON.parse(JSON.stringify(liveDrawAnnotations||{}));

  const escapedJson=JSON.stringify(payload).replace(/<\\/script>/gi,'<\\/script>');

  const clone=document.documentElement.cloneNode(true);
  const sourceNode=clone.querySelector('#deck-source');
  if(sourceNode) sourceNode.textContent=escapedJson;

  const liveToolbar=clone.querySelector('#drawSessionToolbar');
  if(liveToolbar) liveToolbar.hidden=true;

  clone.querySelectorAll('.slide-draw-surface').forEach((svg, idx)=>{
    const key=String(idx);
    const markup=(liveDrawAnnotations && (liveDrawAnnotations[key] ?? liveDrawAnnotations[idx])) || '';
    svg.innerHTML=String(markup || '');
    svg.classList.remove('active');
  });

  const text='<!DOCTYPE html>\\n'+clone.outerHTML;
  const blob=new Blob([text],{type:'text/html;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=((payload.deckTitle||'annotated_presentation').replace(/[^\w\-]+/g,'_')||'annotated_presentation')+'_annotated.html';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function hideLaserPointer(){if(laserPointer)laserPointer.style.display='none';slideEls.forEach(el=>el.classList.remove('laser-active'));}
function updateLaserPointer(evt){if(!laserPointer || !slideEls[active]) return;const slide = slideEls[active];const mapOpen = !!(slideMap && slideMap.classList.contains('open'));if(drawingMode || mapOpen){ hideLaserPointer(); return; }const r = slide.getBoundingClientRect();const inside = evt.clientX >= r.left && evt.clientX <= r.right && evt.clientY >= r.top && evt.clientY <= r.bottom;if(!inside){ hideLaserPointer(); return; }slide.classList.add('laser-active');laserPointer.style.display='block';laserPointer.style.transform='translate('+evt.clientX+'px,'+evt.clientY+'px)';}
function render(){slideEls.forEach((el,i)=>{el.classList.toggle('active',i===active);if(i!==active) el.classList.remove('laser-active');});renderLiveDrawAnnotations();const initActive=()=>{initializeSlideAnimations(slideEls[active]);hideLaserPointer();fitFiguresIn(document);};if(window.MathJax&&typeof window.MathJax.typesetPromise==='function'){if(typeof window.MathJax.typesetClear==='function')window.MathJax.typesetClear(slideEls);window.MathJax.typesetPromise(slideEls.filter(el=>el.classList.contains('active'))).then(initActive).catch(initActive);}else{initActive();}}
function go(i){if(i<0||i>=slideEls.length)return;active=i;if(drawingMode) drawingSlideIndex=active;render();slideMap.classList.remove('open');}
function advanceOrGoNext(){ if(activeSlideHasPendingAnimations()){ advanceSlideAnimation(slideEls[active]); return; } go(active+1); }
document.getElementById('prevBtn').addEventListener('click',()=>go(active-1));
document.getElementById('nextBtn').addEventListener('click',()=>advanceOrGoNext());
document.getElementById('closeMapBtn').addEventListener('click',()=>slideMap.classList.remove('open'));
document.querySelectorAll('.slides-button').forEach(btn=>btn.addEventListener('click',()=>slideMap.classList.add('open')));
if(liveDrawEnabled){
  document.querySelectorAll('.draw-button').forEach((btn,idx)=>btn.addEventListener('click',()=>{ if(drawingMode && drawingSlideIndex===idx) exitDrawingMode(); else { active=idx; enterDrawingMode(idx); } }));
  document.querySelectorAll('.export-annotated-button').forEach(btn=>btn.addEventListener('click',downloadAnnotatedSlides));
}
document.querySelectorAll('.pdf-button').forEach(btn=>btn.addEventListener('click',openPdfModal));
if(pdfCancelBtn) pdfCancelBtn.addEventListener('click',closePdfModal);
if(pdfGenerateBtn) pdfGenerateBtn.addEventListener('click',()=>generatePdfFromSlides(Number(pdfSlidesPerPage && pdfSlidesPerPage.value || 4)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>go(Number(btn.dataset.go))));
if(drawClearBtn) drawClearBtn.addEventListener('click',()=>{ const svg=getDrawSurface(active); if(svg){ svg.innerHTML=''; saveSurface(active); } });
if(drawExitBtn) drawExitBtn.addEventListener('click',()=>exitDrawingMode());
deck.addEventListener('pointerdown',evt=>{
  if(pdfModal && !pdfModal.hidden && evt.target===pdfModal) closePdfModal();
  if(drawingMode){
    const svg=getDrawSurface(active);
    if(!svg) return;
    const hitShape=evt.target.closest('[data-draw-shape]');
    if(drawTool.value==='erase' && hitShape){ beginShape(evt); return; }
    if(evt.target===svg) beginShape(evt);
    return;
  }
  if(slideMap.classList.contains('open')) return;
  if(evt.target.closest('.slide-actions') || evt.target.closest('.deck-toolbar') || evt.target.closest('.pdf-modal')) return;
  const activeSlide=slideEls[active];
  if(activeSlide && activeSlide.contains(evt.target)){ advanceOrGoNext(); }
});
window.addEventListener('pointermove',evt=>{ if(drawingMode && drawingState.drawing){ updateShape(evt); return; } updateLaserPointer(evt); });
window.addEventListener('pointerup',()=>endShape());
window.addEventListener('pointercancel',()=>endShape());
window.addEventListener('mousemove', updateLaserPointer);
window.addEventListener('mouseleave', hideLaserPointer);
window.addEventListener('blur', ()=>{ endShape(); hideLaserPointer(); });
slideMap.addEventListener('mouseenter', hideLaserPointer);
document.querySelectorAll('.deck-slide').forEach(slide=>slide.addEventListener('mouseleave', ()=>{ if(!drawingMode) hideLaserPointer(); }));
window.addEventListener('keydown',e=>{if(e.key==='Escape' && drawingMode){ e.preventDefault(); exitDrawingMode(); return; }if(e.key==='Escape' && pdfModal && !pdfModal.hidden){ e.preventDefault(); closePdfModal(); return; }if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();advanceOrGoNext();}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(active-1);}if(e.key==='Escape') slideMap.classList.remove('open');});render();
<\/script>
</body>
</html>`;
}

function downloadTextFile(filename, text){
  const blob = new Blob([text], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
async function saveBlobWithDialog(defaultName, blob){
  if(window.showSaveFilePicker){
    const parts = String(defaultName || 'file.txt').split('.');
    const ext = parts.length > 1 ? parts.pop() : 'txt';
    const handle = await window.showSaveFilePicker({
      suggestedName: defaultName || ('file.' + ext),
      types: [{
        description: ext.toUpperCase() + ' file',
        accept: {
          [blob.type && blob.type !== 'application/octet-stream' ? blob.type : 'application/octet-stream']: ['.' + ext]
        }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }
  const suggested = defaultName || 'file.txt';
  const filename = prompt('Save as', suggested) || suggested;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
async function saveTextFileAs(defaultName, text, mime='text/plain;charset=utf-8'){
  const blob = new Blob([text], {type:mime});
  await saveBlobWithDialog(defaultName, blob);
}

function currentPayload(){
  return {
    deckTitle: fields.deckTitle.value || 'My HTML Presentation',
    theme: currentThemeFromFields(),
    presentationOptions: currentPresentationOptions(),
    slides: slides.length ? slides : [currentDraftSlide()]
  };
}

function sanitizeBlockForPdf(block){
  const b = clone(block || {});
  if((b.mode || 'panel') === 'custom'){
    return {
      mode: 'panel',
      title: b.title || 'Custom HTML',
      content: '\\begin{card}{Custom HTML block}\\nHad custom HTML\\n\\end{card}'
    };
  }
  return b;
}

function sanitizeSlideForPdf(slide){
  const s = normalizeSlide(clone(slide || {}));
  s.leftBlocks = (s.leftBlocks || []).map(sanitizeBlockForPdf);
  s.rightBlocks = (s.rightBlocks || []).map(sanitizeBlockForPdf);
  return s;
}

function getPrintLayout(slidesPerPage){
  const n = Number(slidesPerPage) || 1;
  if(n === 2) return { rows: 2, cols: 1, className: 'layout-2' };
  if(n === 4) return { rows: 2, cols: 2, className: 'layout-4' };
  if(n === 6) return { rows: 3, cols: 2, className: 'layout-6' };
  return { rows: 1, cols: 1, className: 'layout-1' };
}



function buildPrintableViewer(payload, slidesPerPage){
  const layout = getPrintLayout(slidesPerPage);
  const slidesNormalized = (payload.slides || []).map(normalizeSlide);
  const perPage = Number(slidesPerPage) || 1;
  const pages = [];
  for(let i = 0; i < slidesNormalized.length; i += perPage){
    const chunk = slidesNormalized.slice(i, i + perPage);
    const cells = chunk.map(slide => {
      const cls = slide.slideType === 'title-center' ? 'slide title-center' : (slide.slideType === 'two-col' ? 'slide two-col' : 'slide single');
      const styleCls = ' style-' + String(currentThemeFromFields().beamerStyle || 'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();
      return '<div class="print-cell"><div class="print-shell"><section class="' + cls + styleCls + '" style="' + buildSlideStyle(slide) + '">' + buildSlideInner(slide).trim() + '</section></div></div>';
    });
    while(cells.length < perPage) cells.push('<div class="print-cell empty"></div>');
    pages.push('<section class="print-page ' + layout.className + '" style="--cols:' + layout.cols + ';--rows:' + layout.rows + '">' + cells.join('') + '</section>');
  }
  const pagesHtml = pages.join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(payload.deckTitle || 'Printable presentation')}</title>
<style>
  :root{
    --paper-w:11in;
    --paper-h:8.5in;
    --margin:0.35in;
    --gap:0.18in;
    --usable-w:calc(var(--paper-w) - 2 * var(--margin));
    --usable-h:calc(var(--paper-h) - 2 * var(--margin));
    --sheet:#ececec;
    --ink:#111111;
  }
  *{box-sizing:border-box}
  html,body{
    margin:0;padding:0;background:var(--sheet);color:var(--ink);
    font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif
  }
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .print-toolbar{
    position:sticky;top:0;z-index:20;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);
    border-bottom:1px solid rgba(17,17,17,.10);padding:.75rem 1rem;display:flex;justify-content:space-between;gap:1rem;align-items:center
  }
  .print-toolbar button{
    border:1px solid rgba(17,17,17,.16);background:#fff;color:#111;border-radius:12px;padding:.7rem .95rem;font:inherit;font-weight:700;cursor:pointer
  }
  .print-deck{display:grid;justify-content:center;gap:.22in;padding:.22in 0}
  .print-page{
    width:var(--usable-w);
    height:var(--usable-h);
    display:grid;
    grid-template-columns:repeat(var(--cols), minmax(0,1fr));
    grid-template-rows:repeat(var(--rows), minmax(0,1fr));
    gap:var(--gap);
    overflow:hidden;
    page-break-after:always;
    break-after:page;
    break-inside:avoid;
  }
  .print-page:last-child{page-break-after:auto;break-after:auto}
  .print-cell{
    min-width:0;min-height:0;width:100%;height:100%;
    overflow:hidden;position:relative;
    break-inside:avoid;
  }
  .print-cell.empty{visibility:hidden}
  .print-shell{
    position:relative;
    width:100%;
    height:100%;
    overflow:hidden;
  }
  .slide{
    position:absolute;
    left:0; top:0;
    width:1600px;
    height:900px;
    min-height:900px;
    border:1px solid rgba(17,17,17,.12);
    border-radius:28px;
    padding:3rem 3.3rem 4.8rem;
    background:#fff;
    color:#111;
    overflow:hidden;
    transform-origin:top left;
  }
  .slide h1,.slide h2{margin:0;line-height:1.05}
  .slide h1{font-size:3.4rem;max-width:15ch}
  .slide h2{font-size:2.3rem}
  .kicker{margin-top:.8rem;color:rgba(17,17,17,.72);font-size:1.05rem;line-height:1.45;max-width:70ch}
  .lede{margin-top:.9rem;color:rgba(17,17,17,.72);font-size:1.18rem;line-height:1.5;max-width:70ch}
  .slide-body{margin-top:1.35rem}
  .slide.single .slide-body{display:block}
  .slide.two-col .slide-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.35rem;align-items:start}
  .col{min-width:0}
  .col-stack{display:grid;gap:1rem}
  .rich{display:grid;gap:1rem}
  .rich p,.rich ul,.rich ol,.rich h3,.display-math,.bullet-card,.placeholder,.diag,.pseudo-block,.pseudo-latex-block,.custom-frame-wrap,.figure-embed{
    margin:0;border:1px solid rgba(17,17,17,.12);border-radius:var(--radius,22px);background:rgba(127,127,127,.045);box-shadow:0 8px 24px rgba(0,0,0,.04)
  }
  .rich p{color:rgba(17,17,17,.85);font-size:1.26rem;line-height:1.62;padding:1rem 1.15rem}
  .rich ul,.rich ol{color:rgba(17,17,17,.85);font-size:1.22rem;line-height:1.58;padding:1rem 1.2rem 1rem 2.3rem}
  .rich li{margin:.5rem 0;color:rgba(17,17,17,.85);font-size:1.22rem;line-height:1.58}
  .rich h3{font-size:1.3rem;color:inherit;padding:.95rem 1.15rem}
  .display-math{font-size:1.18rem;padding:1rem 1.15rem;overflow:hidden}
  .pseudo-block,.pseudo-latex-block{
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    font-size:1.08rem;line-height:1.62;white-space:pre-wrap;tab-size:2;padding:1rem 1.15rem;overflow:hidden;color:rgba(17,17,17,.92)
  }
  .pseudo-latex-block mjx-container{font-size:100% !important}
  .bullet-card{padding:1rem 1.15rem;background:rgba(127,127,127,.045)}
  .bullet-card b{display:block;margin-bottom:.35rem;font-size:1.12rem}
  .placeholder{min-height:220px;display:grid;place-items:center;color:rgba(17,17,17,.72);padding:1rem 1.15rem;text-align:center}
  .custom-frame-wrap{overflow:hidden;background:#fff}
  .custom-frame{width:100%;height:100%;min-height:260px;border:0;display:block;background:#fff}
  .diag{display:grid;place-items:center;padding:.9rem}
  .diagram{width:100%;max-width:680px;height:auto}
  .diagram .edge{stroke:currentColor;stroke-opacity:.32;stroke-width:6;stroke-linecap:round}
  .diagram .node{fill:none;stroke:currentColor;stroke-width:6}
  .diagram .label{fill:currentColor;font:700 28px Inter,system-ui,sans-serif}
  .title-center{width:1600px;height:900px;min-height:900px;display:grid;place-items:center;text-align:center;padding:3rem}
  .title-center h1,.title-center h2{font-size:clamp(3.2rem,8vw,5.6rem);max-width:16ch}
  @page{size:11in 8.5in landscape;margin:0.35in}
  @media print{
    html,body{background:#fff}
    .print-toolbar{display:none}
    .print-deck{padding:0;gap:0}
    .print-page{page-break-after:always;break-after:page}
  }
</style>
<script>
window.MathJax={tex:{inlineMath:[['$','$'],['\\(','\\)']],displayMath:[['$$','$$'],['\\[','\\]']]},svg:{fontCache:'global'}};
<\/script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"><\/script>
</head>
<body>
<div class="print-toolbar">
  <div><strong>${escapeHtml(payload.deckTitle || 'Printable presentation')}</strong> · ${Number(slidesPerPage) || 1} slide(s) per page</div>
  <button id="printNowBtn">Print / Save as PDF</button>
</div>
<div class="print-deck">${pagesHtml}</div>
<script>
function fitPrintSlides(){
  document.querySelectorAll('.print-shell').forEach(shell=>{
    const slide=shell.querySelector('.slide');
    if(!slide) return;
    const scale=Math.min(shell.clientWidth / 1600, shell.clientHeight / 900);
    const w=1600*scale;
    const h=900*scale;
    const x=Math.max(0,(shell.clientWidth-w)/2);
    const y=Math.max(0,(shell.clientHeight-h)/2);
    slide.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
  });
}
function doPrint(){
  fitPrintSlides();
  setTimeout(()=>window.print(), 350);
}
window.addEventListener('load', ()=>{
  if(window.MathJax && typeof window.MathJax.typesetPromise==='function'){
    window.MathJax.typesetPromise().then(()=>requestAnimationFrame(()=>requestAnimationFrame(doPrint))).catch(doPrint);
  }else{
    requestAnimationFrame(()=>requestAnimationFrame(doPrint));
  }
});
window.addEventListener('resize', fitPrintSlides);
document.getElementById('printNowBtn').addEventListener('click', ()=>{fitPrintSlides(); window.print();});
<\/script>
</body>
</html>`;
}


function parseSlideSelection(selectionText, total){
  const raw = String(selectionText || '').trim();
  if(!raw || raw.toLowerCase() === 'all') return Array.from({length: total}, (_, i) => i);
  const picks = new Set();
  raw.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if(m){
      let a = Number(m[1]), b = Number(m[2]);
      if(!Number.isFinite(a) || !Number.isFinite(b)) return;
      if(a > b){ const t = a; a = b; b = t; }
      for(let i = a; i <= b; i += 1){
        if(i >= 1 && i <= total) picks.add(i - 1);
      }
      return;
    }
    if(/^\d+$/.test(part)){
      const i = Number(part);
      if(i >= 1 && i <= total) picks.add(i - 1);
    }
  });
  return Array.from(picks).sort((a,b) => a - b);
}

function waitFrames(count=2){
  return new Promise(resolve=>{
    function step(n){
      if(n<=0) resolve();
      else requestAnimationFrame(()=>step(n-1));
    }
    step(count);
  });
}

function makeFallbackSlideImage(slide, width=1600, height=900, message='Slide could not be rasterized in-browser'){
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(17,17,17,.14)';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, width - 48, height - 48);
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 52px Arial, Helvetica, sans-serif';
  const title = String((slide && slide.title) || 'Untitled slide');
  wrapCanvasText(ctx, title, 64, 120, width - 128, 64);
  ctx.fillStyle = '#555555';
  ctx.font = '28px Arial, Helvetica, sans-serif';
  wrapCanvasText(ctx, message, 64, 230, width - 128, 38);
  ctx.fillStyle = '#777777';
  ctx.font = '24px Arial, Helvetica, sans-serif';
  wrapCanvasText(ctx, 'Tip: save the presentation HTML and upload it here if you need exact server-side PDF output.', 64, 310, width - 128, 34);
  return canvas.toDataURL('image/jpeg', 0.88);
}
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight){
  const words = String(text || '').split(/\s+/);
  let line = '';
  let yy = y;
  for(const word of words){
    const test = line ? line + ' ' + word : word;
    if(ctx.measureText(test).width > maxWidth && line){
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if(line) ctx.fillText(line, x, yy);
}
function withTimeout(promise, ms, label){
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label || 'Timed out')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}
async function renderSlideForPdf(slide, rasterScale){
  const root = document.createElement('div');
  root.className = 'pdf-render-root';
  const cls = slide.slideType === 'title-center' ? 'slide title-center' : (slide.slideType === 'two-col' ? 'slide two-col' : 'slide single');
  const styleCls = ' style-' + String(currentThemeFromFields().beamerStyle || 'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();
  root.innerHTML = `<section class="${cls}${styleCls}" style="${buildSlideStyle(slide)}">${buildSlideInner(slide).trim()}</section>`;
  document.body.appendChild(root);
  try{
    const raw = JSON.stringify(slide || {});
    const hasMath = /\\\(|\\\[|\$/.test(raw);
    if(hasMath && window.MathJax && typeof window.MathJax.typesetPromise === 'function'){
      await withTimeout(window.MathJax.typesetPromise([root]).catch(()=>{}), 2500, 'Math rendering timed out');
    }
    if(typeof fitFiguresIn === 'function') fitFiguresIn(root);

    // Replace heavy embedded blocks with lightweight placeholders for PDF rendering.
    root.querySelectorAll('iframe').forEach((frame)=>{
      const ph = document.createElement('div');
      ph.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:180px;border:1px solid rgba(17,17,17,.14);border-radius:14px;background:#fff;color:#555;font:600 18px Inter,Arial,sans-serif;';
      ph.textContent = 'Embedded HTML block';
      frame.replaceWith(ph);
    });
    root.querySelectorAll('.figure-resize-handle').forEach(el => el.remove());
    root.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    root.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
      if(el.tagName === 'VIDEO') {
        const ph = document.createElement('div');
        ph.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:180px;border:1px solid rgba(17,17,17,.14);border-radius:14px;background:#fff;color:#555;font:600 18px Inter,Arial,sans-serif;';
        ph.textContent = 'Video block';
        el.replaceWith(ph);
      }
    });

    await waitFrames(1);
    const slideEl = root.firstElementChild;
    const canvas = await withTimeout(window.html2canvas(slideEl, {
      backgroundColor: '#ffffff',
      scale: rasterScale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 600,
      width: 1600,
      height: 900,
      windowWidth: 1600,
      windowHeight: 900,
      scrollX: 0,
      scrollY: 0
    }), 5000, 'Slide rasterization timed out');
    const data = canvas.toDataURL('image/jpeg', 0.86);
    canvas.width = 1;
    canvas.height = 1;
    return data;
  } catch(err){
    console.warn('PDF fallback for slide:', slide && slide.title, err);
    return makeFallbackSlideImage(slide, 1600, 900, err && err.message ? err.message : 'Slide could not be rasterized in-browser');
  } finally {
    root.remove();
  }
}

async function openPrintablePdf(){
  const payload = currentPayload();
  const perPage = Number(document.getElementById('printSlidesPerPage').value || '1');
  const selectionText = (document.getElementById('printSlideSelection') || {}).value || 'all';
  const selected = parseSlideSelection(selectionText, payload.slides.length);
  if(!selected.length){
    alert('No slides matched the selected range. Use all or a range like 1-3,5,8-10.');
    return;
  }
  if(!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF){
    alert('PDF libraries are still loading. Please wait a moment and try again.');
    return;
  }

  const win = window.open('', '_blank');
  if(!win){
    alert('Please allow pop-ups to open the generated PDF.');
    return;
  }
  win.document.open();
  win.document.write('<!DOCTYPE html><html><head><title>Generating PDF…</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:2rem;color:#111} .muted{color:#555}</style></head><body><h2>Generating PDF…</h2><p class="muted">Rendering slide images and packing them into a PDF.</p></body></html>');
  win.document.close();

  const filteredSlides = selected.map(i => sanitizeSlideForPdf(payload.slides[i]));
  const layout = getPrintLayout(perPage);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation:'landscape', unit:'pt', format:'letter', compress:true });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const gap = 12;
  const usableW = pageW - 2 * margin;
  const usableH = pageH - 2 * margin;
  const cellW = (usableW - gap * (layout.cols - 1)) / layout.cols;
  const cellH = (usableH - gap * (layout.rows - 1)) / layout.rows;

  // Lower rasterization for multi-up handouts to keep it fast on iPad/Safari.
  const rasterScale =
    perPage === 1 ? 0.72 :
    perPage === 2 ? 0.58 :
    perPage === 4 ? 0.46 : 0.38;

  const origBtn = document.getElementById('printPdfBtn');
  const oldLabel = origBtn ? origBtn.textContent : '';
  if(origBtn) origBtn.textContent = 'Generating PDF…';
  showToast('Generating PDF…');

  try{
    for(let idx = 0; idx < filteredSlides.length; idx += 1){
      if(idx > 0 && idx % perPage === 0) pdf.addPage();

      const slide = filteredSlides[idx];
      const img = await renderSlideForPdf(slide, rasterScale);

      const slot = idx % perPage;
      const row = Math.floor(slot / layout.cols);
      const col = slot % layout.cols;

      const fit = Math.min(cellW / 1600, cellH / 900);
      const drawW = 1600 * fit;
      const drawH = 900 * fit;
      const x = margin + col * (cellW + gap) + (cellW - drawW) / 2;
      const y = margin + row * (cellH + gap) + (cellH - drawH) / 2;

      pdf.addImage(img, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');

      if(win && win.document && win.document.body){
        win.document.body.innerHTML =
          '<h2>Generating PDF…</h2><p class="muted">Rendered ' +
          (idx + 1) + ' of ' + filteredSlides.length +
          ' slides.</p>';
      }

      await waitFrames(1);
    }

    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    win.location.href = url;
    showToast('Opened PDF in a new tab.');
  } catch(err){
    console.error(err);
    if(win && win.document && win.document.body){
      win.document.body.innerHTML =
        '<h2>Could not generate PDF</h2><pre style="white-space:pre-wrap;color:#900;">' +
        escapeHtml(err && (err.stack || err.message) || String(err)) +
        '</pre>';
    }
    alert('Could not generate the PDF. ' + (err && err.message ? err.message : ''));
  } finally {
    if(origBtn) origBtn.textContent = oldLabel || 'Direct PDF (image-first)';
  }
}

async function exportPdfReadyHtml(){
  const payload = currentPayload();
  const perPage = Number(document.getElementById('printSlidesPerPage').value || '1');
  const selectionText = (document.getElementById('printSlideSelection') || {}).value || 'all';
  const selected = parseSlideSelection(selectionText, payload.slides.length);
  if(!selected.length){
    alert('No slides matched the selected range. Use all or a range like 1-3,5,8-10.');
    return;
  }
  const filteredPayload = {
    deckTitle: (payload.deckTitle || 'Printable presentation') + ' handout',
    slides: selected.map(i => sanitizeSlideForPdf(payload.slides[i]))
  };
  const html = buildPrintableViewer(filteredPayload, perPage);
  const base = (payload.deckTitle || 'presentation').replace(/[^\w\-]+/g,'_') || 'presentation';
  await saveTextFileAs(base + '_'+ perPage + 'up_handout.html', html, 'text/html;charset=utf-8');
  showToast('Saved PDF-ready HTML.');
}

async function downloadStandalone(){

  const slide = currentDraftSlide();
  const payload = { deckTitle: slide.title || 'Standalone slide', slides:[slide] };
  await saveTextFileAs(((slide.title || 'slide').replace(/[^\w\-]+/g,'_') || 'slide') + '.html', buildStandaloneViewer(payload), 'text/html;charset=utf-8');
  showToast('Saved current slide.');
}
async function downloadDeck(){
  const payload = currentPayload();
  await saveTextFileAs(((payload.deckTitle || 'presentation').replace(/[^\w\-]+/g,'_') || 'presentation') + '.html', buildStandaloneViewer(payload), 'text/html;charset=utf-8');
  showToast('Saved full presentation.');
}
async function saveCurrentSlideJson(){
  const slide = slideForSnippet(currentDraftSlide());
  await saveTextFileAs(((slide.title || 'slide').replace(/[^\w\-]+/g,'_') || 'slide') + '.json', JSON.stringify(slide, null, 2), 'application/json;charset=utf-8');
  showToast('Saved current slide JSON.');
}
async function savePresentationJson(){
  const payload = currentPayload();
  await saveTextFileAs(((payload.deckTitle || 'presentation').replace(/[^\w\-]+/g,'_') || 'presentation') + '.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  showToast('Saved presentation JSON.');
}

function importModeValue(){
  return (document.getElementById('importModeSelect')?.value || 'append') === 'replace' ? 'replace' : 'append';
}
function buildImportedContent(paragraphs=[], bullets=[], ordered=[]){
  const parts = [];
  (paragraphs || []).map(x=>String(x||'').trim()).filter(Boolean).forEach(p=>parts.push('P: ' + p));
  const ul = (bullets || []).map(x=>String(x||'').trim()).filter(Boolean);
  if(ul.length){
    parts.push('\\begin{itemize}');
    ul.forEach(b=>parts.push('\\item ' + b));
    parts.push('\\end{itemize}');
  }
  const ol = (ordered || []).map(x=>String(x||'').trim()).filter(Boolean);
  if(ol.length){
    parts.push('\\begin{enumerate}');
    ol.forEach(b=>parts.push('\\item ' + b));
    parts.push('\\end{enumerate}');
  }
  return parts.join('\n');
}
function makeImportedSlide(title, paragraphs=[], bullets=[], ordered=[]){
  const content = buildImportedContent(paragraphs, bullets, ordered);
  return normalizeSlide({
    slideType:'single',
    headingLevel:'h2',
    bgColor:'#ffffff',
    fontColor:'#111111',
    title: String(title || 'Imported slide').trim() || 'Imported slide',
    kicker:'',
    lede:'',
    leftBlocks: content ? [{ mode:'panel', title:'', content }] : [],
    rightBlocks: [],
    notesTitle:'Speaker notes',
    notesBody:''
  });
}
function makeReferenceImageSlide(src, name){
  const fig = '\\begin{figurehtml}\n' + buildImageFigureHtml(src, name || 'Imported image') + '\n\\end{figurehtml}';
  return normalizeSlide({
    slideType:'full-width-figure-caption',
    headingLevel:'h2',
    bgColor:'#ffffff',
    fontColor:'#111111',
    title: String(name || 'Imported image'),
    kicker:'Reference asset',
    lede:'',
    leftBlocks:[{ mode:'panel', title:'', content: fig }, { mode:'panel', title:'', content:'P: Imported reference image' }],
    rightBlocks:[],
    notesTitle:'Speaker notes',
    notesBody:''
  });
}
function makeReferencePdfSlide(dataUrl, name){
  const pdfHtml = '<div style="width:100%;height:100%;min-height:680px;background:#fff"><iframe src="' + escapeAttr(dataUrl) + '" style="width:100%;height:680px;border:0;background:#fff"></iframe></div>';
  return normalizeSlide({
    slideType:'single',
    headingLevel:'h2',
    bgColor:'#ffffff',
    fontColor:'#111111',
    title: String(name || 'Imported PDF'),
    kicker:'Reference asset',
    lede:'',
    leftBlocks:[{ mode:'custom', title:'', content: pdfHtml }],
    rightBlocks:[],
    notesTitle:'Speaker notes',
    notesBody:''
  });
}
function applyImportedSlides(importedSlides, opts={}){
  const incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
  if(!incoming.length) throw new Error('No slides were imported.');
  syncPreviewFiguresToDraft(false);
  saveCurrentBlockToDraft();
  saveCurrentSlideToDeck();
  const mode = opts.mode === 'replace' ? 'replace' : 'append';
  if(mode === 'replace'){
    slides = incoming;
    activeIndex = 0;
    if(opts.deckTitle) fields.deckTitle.value = opts.deckTitle;
  } else {
    const base = slides.length ? clone(slides) : [];
    slides = base.concat(incoming);
    activeIndex = base.length;
    if(opts.deckTitle && !fields.deckTitle.value) fields.deckTitle.value = opts.deckTitle;
  }
  applySlideToForm(slides[activeIndex]);
  renderDeckList();
  buildPreview();
  scheduleAutosave('Autosaved after import.');
  showToast('Imported ' + incoming.length + ' slide' + (incoming.length === 1 ? '' : 's') + '.');
}
function parseMarkdownToSlides(raw){
  const text = String(raw || '').replace(/\r\n/g,'\n');
  const lines = text.split('\n');
  const slidesOut = [];
  let current = null;
  function flush(){
    if(!current) return;
    slidesOut.push(makeImportedSlide(current.title, current.paragraphs, current.bullets, current.ordered));
    current = null;
  }
  function ensure(title='Imported slide'){
    if(!current) current = { title, paragraphs:[], bullets:[], ordered:[] };
  }
  for(const lineRaw of lines){
    const line = lineRaw.trim();
    if(!line) continue;
    const h = line.match(/^#{1,2}\s+(.+)$/);
    if(h){
      flush();
      current = { title: h[1].trim(), paragraphs:[], bullets:[], ordered:[] };
      continue;
    }
    if(/^---+$/.test(line)){ flush(); continue; }
    ensure();
    const bullet = line.match(/^[-*+]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if(bullet) current.bullets.push(bullet[1].trim());
    else if(ordered) current.ordered.push(ordered[1].trim());
    else current.paragraphs.push(line);
  }
  flush();
  return slidesOut;
}
function parseBeamerToSlides(raw){
  const text = String(raw || '');
  const slidesOut = [];
  const frameRe = /\\begin\{frame\}(?:\[[^\]]*\])?(?:\{([^}]*)\})?([\s\S]*?)\\end\{frame\}/g;
  let m;
  while((m = frameRe.exec(text))){
    const body = String(m[2] || '').trim();
    const titleMatch = body.match(/\\frametitle\{([^}]*)\}/);
    const kickerMatch = body.match(/\\framesubtitle\{([^}]*)\}/);
    const title = (m[1] || (titleMatch && titleMatch[1]) || 'Imported frame').trim();
    const cleaned = body
      .replace(/\\frametitle\{[^}]*\}/g,'')
      .replace(/\\framesubtitle\{[^}]*\}/g,'')
      .trim();
    slidesOut.push(normalizeSlide({
      slideType:'single',
      headingLevel:'h2',
      bgColor:'#ffffff',
      fontColor:'#111111',
      title,
      kicker: kickerMatch ? kickerMatch[1].trim() : '',
      lede:'',
      leftBlocks: cleaned ? [{ mode:'panel', title:'', content: cleaned }] : [],
      rightBlocks:[],
      notesTitle:'Speaker notes',
      notesBody:''
    }));
  }
  if(slidesOut.length) return slidesOut;
  return parseMarkdownToSlides(text
    .replace(/\\section\{([^}]*)\}/g, '# $1\n')
    .replace(/\\subsection\{([^}]*)\}/g, '## $1\n')
    .replace(/\\item\s+/g, '- ')
    .replace(/\\begin\{itemize\}|\\end\{itemize\}|\\begin\{enumerate\}|\\end\{enumerate\}/g,''));
}
function jsonItemToSlide(item){
  if(typeof item === 'string') return makeImportedSlide(item, [], []);
  if(!item || typeof item !== 'object') return null;
  if(Array.isArray(item.slides)) return null;
  if(item.leftBlocks || item.rightBlocks || item.slideType) return normalizeSlide(item);
  const title = item.title || item.heading || item.name || 'Imported slide';
  const paragraphs = Array.isArray(item.paragraphs) ? item.paragraphs : (item.text ? [item.text] : []);
  const bullets = Array.isArray(item.bullets) ? item.bullets : [];
  const ordered = Array.isArray(item.ordered) ? item.ordered : [];
  return makeImportedSlide(title, paragraphs, bullets, ordered);
}
function parseJsonOutlineToSlides(raw){
  const data = JSON.parse(String(raw || ''));
  if(data && Array.isArray(data.slides)){
    return data.slides.map(normalizeSlide);
  }
  if(Array.isArray(data)){
    return data.map(jsonItemToSlide).filter(Boolean);
  }
  if(data && Array.isArray(data.sections)){
    const out = [];
    data.sections.forEach(sec=>{
      if(sec && sec.title){
        out.push(normalizeSlide({
          slideType:'section-divider',
          headingLevel:'h2',
          bgColor:'#ffffff',
          fontColor:'#111111',
          title: sec.title,
          kicker: sec.kicker || 'Section',
          lede: sec.lede || '',
          leftBlocks:[],
          rightBlocks:[]
        }));
      }
      (Array.isArray(sec?.slides) ? sec.slides : []).forEach(sl=>{ const s = jsonItemToSlide(sl); if(s) out.push(s); });
    });
    return out;
  }
  if(data && typeof data === 'object'){
    const s = jsonItemToSlide(data);
    return s ? [s] : [];
  }
  return [];
}
function parsePowerPointTextToSlides(raw){
  const text = String(raw || '').replace(/\r\n/g,'\n').trim();
  if(!text) return [];
  const blocks = text.split(/\n\s*\n+/);
  const out = [];
  blocks.forEach(block=>{
    const lines = block.split('\n').map(x=>x.trim()).filter(Boolean);
    if(!lines.length) return;
    const title = lines[0];
    const bullets = [];
    const paragraphs = [];
    lines.slice(1).forEach(line=>{
      const bullet = line.match(/^[-*+]\s+(.+)$/);
      const ordered = line.match(/^\d+[.)]\s+(.+)$/);
      if(bullet) bullets.push(bullet[1].trim());
      else if(ordered) bullets.push(ordered[1].trim());
      else paragraphs.push(line);
    });
    out.push(makeImportedSlide(title, paragraphs, bullets, []));
  });
  return out;
}
async function importSelectedFiles(fileList){
  const files = Array.from(fileList || []);
  if(!files.length) throw new Error('Choose one or more files first.');
  const imported = [];
  let deckTitle = '';
  for(const file of files){
    const lower = String(file.name || '').toLowerCase();
    if(!deckTitle) deckTitle = file.name.replace(/\.[^.]+$/,'');
    if(file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(lower)){
      const dataUrl = await new Promise((resolve,reject)=>{ const r = new FileReader(); r.onerror = ()=>reject(new Error('Could not read image file.')); r.onload = ()=>resolve(String(r.result || '')); r.readAsDataURL(file); });
      imported.push(makeReferenceImageSlide(dataUrl, file.name));
    } else if(file.type === 'application/pdf' || /\.pdf$/i.test(lower)){
      const dataUrl = await new Promise((resolve,reject)=>{ const r = new FileReader(); r.onerror = ()=>reject(new Error('Could not read PDF file.')); r.onload = ()=>resolve(String(r.result || '')); r.readAsDataURL(file); });
      imported.push(makeReferencePdfSlide(dataUrl, file.name));
    } else {
      const text = await file.text();
      if(/\.(md|markdown)$/i.test(lower)) imported.push(...parseMarkdownToSlides(text));
      else if(/\.(tex|ltx)$/i.test(lower)) imported.push(...parseBeamerToSlides(text));
      else if(/\.json$/i.test(lower)) imported.push(...parseJsonOutlineToSlides(text));
      else imported.push(...parsePowerPointTextToSlides(text));
    }
  }
  applyImportedSlides(imported, { mode: importModeValue(), deckTitle });
}
async function loadDeckFromFile(file){
  const text = await file.text();
  let payload;
  if(/\.json$/i.test(file.name) || String(text).trim().startsWith('{')){
    payload = JSON.parse(text);
  }else{
    const match = text.match(/<script id=["']deck-source["'][^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i);
    if(!match) throw new Error('This file does not contain an editable deck-source block.');
    payload = JSON.parse(match[1]);
  }
  if(!payload || !Array.isArray(payload.slides)) throw new Error('Could not parse slides from this HTML file.');
  fields.deckTitle.value = payload.deckTitle || 'My HTML Presentation';
  if(payload.theme) applyThemeToForm(payload.theme);
  if(payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
  slides = payload.slides.map(normalizeSlide);
  activeIndex = slides.length ? 0 : -1;
  if(activeIndex >= 0) applySlideToForm(slides[0]); else clearForm(false);
  buildPreview();
  renderDeckList();
}
async function loadPresentationJsonFromFile(file){
  const text = await file.text();
  const payload = JSON.parse(text);
  if(!payload || !Array.isArray(payload.slides)) throw new Error('This JSON file does not contain a presentation with a slides array.');
  fields.deckTitle.value = payload.deckTitle || 'My HTML Presentation';
  if(payload.theme) applyThemeToForm(payload.theme);
  if(payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
  slides = payload.slides.map(normalizeSlide);
  activeIndex = slides.length ? 0 : -1;
  if(activeIndex >= 0) applySlideToForm(slides[0]); else clearForm(false);
  buildPreview();
  renderDeckList();
}

const presets = {
  title: {
    slideType:'title-center', headingLevel:'h1', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Lecture title', kicker:'Course / subtitle', lede:'', leftBlocks:[], rightBlocks:[],
    notesTitle:'Speaker notes', notesBody:''
  },
  concept: {
    slideType:'single', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Concept slide', kicker:'', lede:'Introduce the main idea in one short sentence.',
    leftBlocks:[{mode:'panel', title:'Main points', content:'\\paragraph{Core idea}\n\n\\begin{itemize}\n\\item First point\n\\item Second point\n\\item Third point\n\\end{itemize}'}],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  twocol: {
    slideType:'two-col', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Two-column slide', kicker:'', lede:'',
    leftBlocks:[{mode:'panel', title:'Left column', content:'\\paragraph{Left column}\n\n\\begin{itemize}\n\\item Point A\n\\item Point B\n\\end{itemize}'}],
    rightBlocks:[{mode:'panel', title:'Right column', content:'\\paragraph{Right column}\n\n\\begin{itemize}\n\\item Detail 1\n\\item Detail 2\n\\end{itemize}'}],
    notesTitle:'Speaker notes', notesBody:''
  },
  callouts: {
    slideType:'title-two-callouts', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Title + two callout boxes', kicker:'', lede:'',
    leftBlocks:[{mode:'panel', title:'Callout A', content:'\\paragraph{Key insight}\n\nShort, emphasized idea.'}],
    rightBlocks:[{mode:'panel', title:'Callout B', content:'\\paragraph{Second insight}\n\nAnother emphasized point.'}],
    notesTitle:'Speaker notes', notesBody:''
  },
  figureExplain: {
    slideType:'title-figure-explanation', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Figure + explanation', kicker:'', lede:'',
    leftBlocks:[{mode:'placeholder', title:'Figure', content:'Add a figure or image block'}],
    rightBlocks:[{mode:'panel', title:'Explanation', content:'\\paragraph{Explain the figure}\\n\\begin{itemize}\\n\\item What the audience should notice\\n\\item Why it matters\\n\\end{itemize}'}],
    notesTitle:'Speaker notes', notesBody:''
  },
  theoremProof: {
    slideType:'theorem-proof', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Theorem / proof', kicker:'', lede:'',
    leftBlocks:[
      {mode:'panel', title:'Theorem', content:'\\paragraph{Theorem} State the theorem precisely.'},
      {mode:'panel', title:'Proof', content:'\\paragraph{Proof sketch} Give the main argument in a few steps.'}
    ],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  algorithmLayout: {
    slideType:'algorithm-layout', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Algorithm', kicker:'', lede:'',
    leftBlocks:[
      {mode:'pseudocode-latex', title:'Algorithm', content:'Input: \\(x\\)\\n\\nfor \\(t=1\\) to \\(T\\) do\\n  \\(u^t \\leftarrow W[t]z^{t-1}+b^t\\)\\n  \\(z^t \\leftarrow \\sigma(u^t)\\)\\nend\\n\\nreturn \\(\\hat y\\)'},
      {mode:'panel', title:'Notes', content:'\\paragraph{Key notes}\\n\\begin{itemize}\\n\\item Mention initialization\\n\\item Mention stopping rule\\n\\end{itemize}'}
    ],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  sectionDivider: {
    slideType:'section-divider', headingLevel:'h1', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Section title', kicker:'Part II', lede:'One sentence about the next section.', leftBlocks:[], rightBlocks:[],
    notesTitle:'Speaker notes', notesBody:''
  },
  comparison: {
    slideType:'comparison', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Comparison slide', kicker:'', lede:'',
    leftBlocks:[{mode:'panel', title:'Method A', content:'\\begin{itemize}\\n\\item Strength 1\\n\\item Strength 2\\n\\end{itemize}'}],
    rightBlocks:[{mode:'panel', title:'Method B', content:'\\begin{itemize}\\n\\item Strength 1\\n\\item Strength 2\\n\\end{itemize}'}],
    notesTitle:'Speaker notes', notesBody:''
  },
  imageText: {
    slideType:'image-left-text-right', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Image-left text-right', kicker:'', lede:'',
    leftBlocks:[{mode:'placeholder', title:'Image', content:'Add an image or figure block'}],
    rightBlocks:[{mode:'panel', title:'Text', content:'\\paragraph{Walkthrough}\\n\\begin{itemize}\\n\\item Describe the image\\n\\item Highlight the takeaway\\n\\end{itemize}'}],
    notesTitle:'Speaker notes', notesBody:''
  },
  fullFigureCaption: {
    slideType:'full-width-figure-caption', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Full-width figure', kicker:'', lede:'',
    leftBlocks:[
      {mode:'placeholder', title:'Figure', content:'Add a large figure or image block'},
      {mode:'panel', title:'Caption', content:'\\paragraph{Caption} Add a concise interpretation or citation.'}
    ],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  appendix: {
    slideType:'single', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Summary / appendix', kicker:'', lede:'',
    leftBlocks:[{mode:'panel', title:'Summary', content:'\\begin{enumerate}\\n\\item First takeaway\\n\\item Second takeaway\\n\\item Third takeaway\\n\\end{enumerate}'}],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  pseudocode: {
    slideType:'single', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Pseudocode', kicker:'', lede:'',
    leftBlocks:[{mode:'pseudocode', title:'Algorithm', content:'Input: x\\n\\nfor t = 1 to T do\\n  u^t <- W[t] z^(t-1) + b^t\\n  z^t <- sigma(u^t)\\nend\\n\\nreturn yhat'}],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  },
  pseudocodeLatex: {
    slideType:'single', headingLevel:'h2', bgColor:'#ffffff', fontColor:'#111111', inheritTheme:true,
    title:'Pseudocode with LaTeX', kicker:'', lede:'',
    leftBlocks:[{mode:'pseudocode-latex', title:'Algorithm', content:'Input: \\(x\\)\\n\\n\\(z^0 \\leftarrow x\\)\\nfor \\(t = 1\\) to \\(T\\) do\\n  \\(u^t \\leftarrow W[t] z^{t-1} + b^t\\)\\n  \\(z^t \\leftarrow \\sigma(u^t)\\)\\nend\\n\\nreturn \\(\\hat y\\)'}],
    rightBlocks:[], notesTitle:'Speaker notes', notesBody:''
  }
};
function applyPreset(name){
  applySlideToForm(presets[name]);
  buildPreview();
}

Object.values(fields).forEach(el=>{
  el.addEventListener('input', ()=>{ syncFields(); buildPreview(); scheduleAutosave(); });
  el.addEventListener('change', ()=>{ syncFields(); buildPreview(); scheduleAutosave(); });
});
blockFields.column.addEventListener('change', ()=>{
  saveCurrentBlockToDraft();
  loadSelectedBlockIntoEditor();
  buildPreview();
  scheduleAutosave('Autosaved after block switch.');
});
blockFields.mode.addEventListener('change', ()=>{ saveCurrentBlockToDraft(); buildPreview(); scheduleAutosave(); });
blockFields.title.addEventListener('input', ()=>{ saveCurrentBlockToDraft(); buildPreview(); scheduleAutosave(); });
blockFields.content.addEventListener('input', ()=>{ saveCurrentBlockToDraft(); buildPreview(); scheduleAutosave(); });

document.getElementById('addBlockBtn').addEventListener('click', addBlock);
document.getElementById('updateBlockBtn').addEventListener('click', updateBlock);
document.getElementById('duplicateBlockBtn').addEventListener('click', duplicateBlock);
document.getElementById('deleteBlockBtn').addEventListener('click', deleteBlock);
document.getElementById('clearBlockBtn').addEventListener('click', clearBlockEditor);
document.getElementById('addFigureBtn').addEventListener('click', openFigureModal);
const toolsAddFigureBtn = document.getElementById('toolsAddFigureBtn');
if(toolsAddFigureBtn) toolsAddFigureBtn.addEventListener('click', openFigureModal);
const toolsOpenDiagramEditorBtn = document.getElementById('toolsOpenDiagramEditorBtn');
if(toolsOpenDiagramEditorBtn) toolsOpenDiagramEditorBtn.addEventListener('click', ()=>{ openSimpleDiagramEditor(); });
document.getElementById('closeFigureModalBtn').addEventListener('click', closeFigureModal);
document.getElementById('figureSourceImageBtn').addEventListener('click', ()=>{
  figureImagePanel.style.display = '';
  figureEditorPanel.style.display = 'none';
});
document.getElementById('figureSourceEditorBtn').addEventListener('click', ()=>{
  figureImagePanel.style.display = 'none';
  figureEditorPanel.style.display = '';
  openSimpleDiagramEditor();
});
document.getElementById('insertFigureUrlBtn').addEventListener('click', ()=>{
  const src = (figureUrlInput.value || '').trim();
  if(!src){ alert('Enter an image URL first.'); return; }
  insertFigureHtml(buildImageFigureHtml(src, (figureAltInput.value || '').trim()));
  closeFigureModal();
});
document.getElementById('insertFigureFileBtn').addEventListener('click', ()=>{
  const file = figureFileInput.files && figureFileInput.files[0];
  if(!file){ alert('Choose an image file first.'); return; }
  const reader = new FileReader();
  reader.onload = ()=>{
    const img = new Image();
    img.onload = ()=>{
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      const embedded = c.toDataURL('image/jpeg', 0.92);
      insertFigureHtml(buildImageFigureHtml(String(embedded || ''), (figureAltInput.value || file.name || '').trim()));
      closeFigureModal();
      figureFileInput.value = '';
    };
    img.src = String(reader.result || '');
  };
  reader.readAsDataURL(file);
});
figureModal.addEventListener('click', (e)=>{
  if(e.target === figureModal) closeFigureModal();
});
document.getElementById('moveBlockUpBtn').addEventListener('click', ()=>moveBlock(-1));
document.getElementById('moveBlockDownBtn').addEventListener('click', ()=>moveBlock(1));

document.getElementById('addSlideBtn').addEventListener('click', addSlide);
document.getElementById('updateSlideBtn').addEventListener('click', updateSlide);
document.getElementById('duplicateSlideBtn').addEventListener('click', duplicateSlide);
document.getElementById('deleteSlideBtn').addEventListener('click', deleteSlide);
document.getElementById('moveUpBtn').addEventListener('click', ()=>moveSlide(-1));
document.getElementById('moveDownBtn').addEventListener('click', ()=>moveSlide(1));
document.getElementById('clearFormBtn').addEventListener('click', clearForm);
document.getElementById('applyThemeToCurrentBtn').addEventListener('click', ()=>{
  fields.inheritTheme.checked = true;
  buildPreview();
  scheduleAutosave('Autosaved after applying theme to current slide.');
});
document.getElementById('applyThemeToAllBtn').addEventListener('click', ()=>{
  slides = (slides.length ? slides : [currentDraftSlide()]).map(s=>({ ...normalizeSlide(s), inheritTheme:true }));
  fields.inheritTheme.checked = true;
  renderDeckList();
  buildPreview();
  scheduleAutosave('Autosaved after applying theme to all slides.');
});
Object.values(themeFields).forEach(el=>{
  el.addEventListener('input', ()=>{ buildPreview(); renderDeckList(); scheduleAutosave(); });
  el.addEventListener('change', ()=>{ buildPreview(); renderDeckList(); scheduleAutosave(); });
});
document.getElementById('copySnippetBtn').addEventListener('click', copyCurrentSnippet);
document.getElementById('copyMathJaxBtn').addEventListener('click', copyMathJaxHelper);
document.getElementById('downloadStandaloneBtn').addEventListener('click', ()=>downloadStandalone().catch(err=>alert(err.message || 'Could not save current slide.')));
document.getElementById('downloadDeckBtn').addEventListener('click', ()=>downloadDeck().catch(err=>alert(err.message || 'Could not save presentation.')));
document.getElementById('saveCurrentSlideJsonBtn').addEventListener('click', ()=>saveCurrentSlideJson().catch(err=>alert(err.message || 'Could not save current slide JSON.')));
document.getElementById('savePresentationJsonBtn').addEventListener('click', ()=>savePresentationJson().catch(err=>alert(err.message || 'Could not save presentation JSON.')));
document.getElementById('loadSnippetToEditorBtn').addEventListener('click', ()=>{
  try{ loadSnippetIntoEditor(); }catch(err){ alert(err.message || 'Could not load snippet.'); }
});
document.getElementById('replaceSlideFromSnippetBtn').addEventListener('click', ()=>{
  try{ replaceSelectedSlideFromSnippet(); }catch(err){ alert(err.message || 'Could not replace slide from snippet.'); }
});
document.getElementById('addSlideFromSnippetBtn').addEventListener('click', ()=>{
  try{ addSlideFromSnippet(); }catch(err){ alert(err.message || 'Could not add slide from snippet.'); }
});
document.getElementById('formatSnippetBtn').addEventListener('click', ()=>{
  try{ formatSnippet(); }catch(err){ alert(err.message || 'Could not format snippet.'); }
});
const exportPdfReadyHtmlBtn=document.getElementById('exportPdfReadyHtmlBtn');
if(exportPdfReadyHtmlBtn) exportPdfReadyHtmlBtn.addEventListener('click', ()=>exportPdfReadyHtml().catch(err=>alert(err.message || 'Could not save PDF-ready HTML.')));
const printPdfBtn=document.getElementById('printPdfBtn');
if(printPdfBtn) printPdfBtn.addEventListener('click', openPrintablePdf);
document.getElementById('loadDeckBtn').addEventListener('click', ()=>document.getElementById('loadDeckInput').click());
document.getElementById('loadDeckInput').addEventListener('change', async (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  try{
    await loadDeckFromFile(file);
    showToast('Loaded editable presentation.');
  }catch(err){
    alert(err.message || 'Could not load this HTML file.');
  }finally{
    e.target.value = '';
  }
});
const loadPresentationJsonBtn = document.getElementById('loadPresentationJsonBtn');
const loadPresentationJsonInput = document.getElementById('loadPresentationJsonInput');
if(loadPresentationJsonBtn && loadPresentationJsonInput){
  loadPresentationJsonBtn.addEventListener('click', ()=>loadPresentationJsonInput.click());
  loadPresentationJsonInput.addEventListener('change', async (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    try{
      await loadPresentationJsonFromFile(file);
      showToast('Loaded presentation JSON.');
    }catch(err){
      alert(err.message || 'Could not load this presentation JSON file.');
    }finally{
      e.target.value = '';
    }
  });
}

document.getElementById('importMarkdownBtn')?.addEventListener('click', ()=>{
  try{
    const slidesIn = parseMarkdownToSlides(document.getElementById('importMarkdownText')?.value || '');
    applyImportedSlides(slidesIn, { mode: importModeValue() });
  }catch(err){
    alert(err.message || 'Could not import markdown outline.');
  }
});
document.getElementById('importBeamerBtn')?.addEventListener('click', ()=>{
  try{
    const slidesIn = parseBeamerToSlides(document.getElementById('importBeamerText')?.value || '');
    applyImportedSlides(slidesIn, { mode: importModeValue() });
  }catch(err){
    alert(err.message || 'Could not import LaTeX / Beamer outline.');
  }
});
document.getElementById('importJsonBtn')?.addEventListener('click', ()=>{
  try{
    const slidesIn = parseJsonOutlineToSlides(document.getElementById('importJsonText')?.value || '');
    applyImportedSlides(slidesIn, { mode: importModeValue() });
  }catch(err){
    alert(err.message || 'Could not import JSON outline.');
  }
});
document.getElementById('importPptBtn')?.addEventListener('click', ()=>{
  try{
    const slidesIn = parsePowerPointTextToSlides(document.getElementById('importPptText')?.value || '');
    applyImportedSlides(slidesIn, { mode: importModeValue() });
  }catch(err){
    alert(err.message || 'Could not import PowerPoint-style text.');
  }
});
document.getElementById('importFilesBtn')?.addEventListener('click', async ()=>{
  try{
    await importSelectedFiles(document.getElementById('importFilesInput')?.files || []);
  }catch(err){
    alert(err.message || 'Could not import selected files.');
  }
});

function initUiCleanupLayout(){
  const railShell=document.getElementById('slideRailShell');
  const railMount=document.getElementById('slideRailMount');
  const deckPanel=document.getElementById('deckList')?.closest('.panel');
  if(railMount && deckPanel && !railMount.contains(deckPanel)){
    railMount.appendChild(deckPanel);
  }
  const toggleBtn=document.getElementById('toggleSlideRailBtn');
  if(toggleBtn && railShell && !toggleBtn.dataset.bound){
    toggleBtn.dataset.bound='1';
    toggleBtn.addEventListener('click', ()=>{
      railShell.classList.toggle('collapsed');
      toggleBtn.textContent = railShell.classList.contains('collapsed') ? 'Show rail' : 'Hide rail';
    });
  }
}
document.querySelectorAll('[data-left-tab]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const tab = btn.dataset.leftTab;
    document.querySelectorAll('[data-left-tab]').forEach(el=>el.classList.toggle('active', el === btn));
    document.querySelectorAll('[data-left-pane]').forEach(el=>el.classList.toggle('active', el.dataset.leftPane === tab));
  });
});

document.querySelectorAll('[data-subtab]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const name = btn.dataset.subtab;
    const group = name.split(':')[0];
    document.querySelectorAll('[data-subtab]').forEach(el=>{
      if((el.dataset.subtab || '').startsWith(group + ':')) el.classList.toggle('active', el === btn);
    });
    document.querySelectorAll('[data-subpane]').forEach(el=>{
      if((el.dataset.subpane || '').startsWith(group + ':')) el.classList.toggle('active', el.dataset.subpane === name);
    });
  });
});

document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click', ()=>applyPreset(btn.dataset.preset)));
document.querySelectorAll('[data-style-preset]').forEach(btn=>btn.addEventListener('click', ()=>applyStylePreset(btn.dataset.stylePreset)));
document.getElementById('applyStyleBuilderBtn')?.addEventListener('click', applyStyleBuilder);
document.getElementById('randomizeStyleBtn')?.addEventListener('click', randomizeStyleBuilder);
previewBlockFontScale?.addEventListener('input', ()=>applySelectedPreviewBlockStyle({ fontScale: Number(previewBlockFontScale.value || 1) }));
previewBlockFontFamily?.addEventListener('change', ()=>applySelectedPreviewBlockStyle({ fontFamily: previewBlockFontFamily.value || 'inherit' }));
previewBlockFontColor?.addEventListener('input', ()=>applySelectedPreviewBlockStyle({ fontColor: previewBlockFontColor.value || '#111111' }));
previewBlockBulletType?.addEventListener('change', ()=>applySelectedPreviewBlockStyle({ bulletType: previewBlockBulletType.value || 'disc' }));
document.getElementById('resetPreviewBlockStyleBtn')?.addEventListener('click', resetSelectedPreviewBlockStyle);
document.getElementById('applyAnimationBtn')?.addEventListener('click', applySelectedAnimation);
document.getElementById('clearAnimationBtn')?.addEventListener('click', clearSelectedAnimation);
document.querySelectorAll('[data-block-template]').forEach(btn=>btn.addEventListener('click', ()=>{
  const kind = btn.dataset.blockTemplate;
  const block = defaultReusableBlock(kind);
  blockFields.mode.value = block.mode;
  blockFields.title.value = block.title || '';
  blockFields.content.value = block.content || '';
  buildPreview();
}));
document.getElementById('saveCurrentBlockToLibraryBtn').addEventListener('click', saveCurrentBlockToLibrary);
document.getElementById('insertLibraryBlockBtn').addEventListener('click', insertSelectedLibraryBlock);
document.getElementById('deleteLibraryBlockBtn').addEventListener('click', deleteSelectedLibraryBlock);
showGridToggle.addEventListener('change', updatePreviewGuides);
showMarginsToggle.addEventListener('change', updatePreviewGuides);
lockAspectToggle.addEventListener('change', ()=>{
  getSelectedFigureBoxes().forEach(box=>{ box.dataset.lockAspect = lockAspectToggle.checked ? '1' : '0'; });
  saveSelectedFigures();
});
document.getElementById('alignFigureLeftBtn').addEventListener('click', ()=>alignSelectedFigures('left'));
document.getElementById('alignFigureCenterBtn').addEventListener('click', ()=>alignSelectedFigures('center'));
document.getElementById('alignFigureRightBtn').addEventListener('click', ()=>alignSelectedFigures('right'));
document.getElementById('alignFigureTopBtn').addEventListener('click', ()=>alignSelectedFigures('top'));
document.getElementById('alignFigureMiddleBtn').addEventListener('click', ()=>alignSelectedFigures('middle'));
document.getElementById('alignFigureBottomBtn').addEventListener('click', ()=>alignSelectedFigures('bottom'));
document.getElementById('distributeFigureHorizBtn').addEventListener('click', ()=>distributeSelectedFigures('x'));
document.getElementById('distributeFigureVertBtn').addEventListener('click', ()=>distributeSelectedFigures('y'));
document.getElementById('snapFigureBtn').addEventListener('click', ()=>{ getSelectedFigureBoxes().forEach(applySnapToBox); saveSelectedFigures(); buildPreview(); });
document.getElementById('bringForwardBtn').addEventListener('click', ()=>bringSelectedFigures(1));
document.getElementById('sendBackwardBtn').addEventListener('click', ()=>bringSelectedFigures(-1));
document.getElementById('cropFigureBtn').addEventListener('click', toggleCropSelectedFigure);
document.getElementById('duplicateFigureBtn').addEventListener('click', duplicateSelectedFigure);
document.getElementById('resetFigureBtn').addEventListener('click', resetSelectedFigure);
loadCopilotSettings();
document.getElementById('saveCopilotKeyBtn')?.addEventListener('click', ()=>saveCopilotSettings(true));
copilotEls.model?.addEventListener('change', ()=>saveCopilotSettings(false));
copilotEls.endpoint?.addEventListener('change', ()=>saveCopilotSettings(false));
copilotEls.tone?.addEventListener('change', ()=>saveCopilotSettings(false));
document.getElementById('copilotDraftSlideBtn')?.addEventListener('click', ()=>generateCopilotSlide('replace'));
document.getElementById('copilotAddSlideBtn')?.addEventListener('click', ()=>generateCopilotSlide('append'));
document.getElementById('copilotGenerateDeckBtn')?.addEventListener('click', generateCopilotDeck);
document.getElementById('copilotApplyFirstSlideBtn')?.addEventListener('click', ()=>{ try{ applyCopilotFirstSlide(); }catch(err){ alert(err.message || 'Could not apply Copilot slide.'); } });
document.getElementById('copilotAppendResultBtn')?.addEventListener('click', ()=>{ try{ appendCopilotSlides(); }catch(err){ alert(err.message || 'Could not append Copilot slides.'); } });
document.getElementById('copilotReplaceDeckBtn')?.addEventListener('click', ()=>{ try{ replaceDeckWithCopilot(); }catch(err){ alert(err.message || 'Could not replace deck.'); } });
loadBlockLibrary();
renderBlockLibrary();
if(expandDiagramSnippet){ expandDiagramSnippet.addEventListener('change', buildPreview); }

if(!restoreAutosave()){
  applyThemeToForm(normalizeTheme({}));
  applyPreset('concept');
  buildPreview();
  renderDeckList();
}
initUiCleanupLayout();
window.addEventListener('beforeunload', ()=>{ try{ persistAutosaveNow('Autosaved.'); }catch(e){} });
window.addEventListener('resize', ()=>updatePreviewScale());

