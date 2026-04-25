/* Stage 17 migration note:
   Shared helpers live in js/utils.js.
   Reusable block library logic lives in js/block-library.js.
   Theme/style-builder logic lives in js/theme.js.
   Slide presets live in js/presets.js.
   Structured text parsing lives in js/parser.js.
   Block/title style and animation helpers live in js/block-style.js.
   Import parsers live in js/import.js.
   Autosave/state persistence helpers live in js/state.js.
   Export and save/PDF helpers live in js/export.js.
   Rendering/slide normalization helpers live in js/renderer.js.
   Deck list, slide CRUD, snippets, and clipboard helpers live in js/deck.js.
   Import/file-loading workflow lives in js/file-io.js.
   UI shell helpers live in js/ui.js.
   Figure insertion helpers live in js/figure-insert.js.
   Simple diagram editor popup lives in js/diagram-editor.js.
   legacy-app.js intentionally remains a classic script while we migrate gradually.
*/
const LuminaUtils = window.LuminaUtils;
if(!LuminaUtils){
  throw new Error('LuminaUtils failed to load. Check that js/utils.js is included before js/legacy-app.js.');
}
const {
  clone,
  escapeHtml,
  escapeAttr,
  preserveMathTokens,
  restoreMathTokens,
  hexToRgb,
  rgbaFromHex,
  normalizeTheme
} = LuminaUtils;

const LuminaBlockStyle = window.LuminaBlockStyle;
if(!LuminaBlockStyle){
  throw new Error('LuminaBlockStyle failed to load. Check that js/block-style.js is included before js/legacy-app.js.');
}
const blockStyleApi = LuminaBlockStyle.createApi({ escapeAttr });
const {
  normalizeBlockStyle,
  normalizeAnimation,
  animationDataAttrs,
  blockWrapperStyle,
  titleWrapperStyle
} = blockStyleApi;

const LuminaFigureInsert = window.LuminaFigureInsert;
if(!LuminaFigureInsert){
  throw new Error('LuminaFigureInsert failed to load. Check that js/figure-insert.js is included before js/legacy-app.js.');
}
const figureInsertApi = LuminaFigureInsert.createApi({
  escapeAttr,
  getBlockFields: () => blockFields,
  currentColumnName: () => currentColumnName(),
  blockArray: name => blockArray(name),
  selectedIndex: name => selectedIndex(name),
  setSelectedIndex: (name, idx) => setSelectedIndex(name, idx),
  loadSelectedBlockIntoEditor: () => loadSelectedBlockIntoEditor(),
  buildPreview: () => buildPreview(),
  persistAutosaveNow: reason => persistAutosaveNow(reason),
  saveCurrentBlockToDraft: () => saveCurrentBlockToDraft(),
  showToast,
  getFigureModal: () => figureModal,
  getFigureImagePanel: () => figureImagePanel,
  getFigureEditorPanel: () => figureEditorPanel
});
const {
  insertTextAtCursor,
  currentFigureMode,
  wrapFigureHtml,
  insertFigureAsNewCustomBlock,
  insertFigureHtml,
  buildImageFigureHtml,
  openFigureModal,
  closeFigureModal
} = figureInsertApi;
window.insertFigureHtmlFromEditor = insertFigureHtml;

const LuminaImport = window.LuminaImport;
if(!LuminaImport){
  throw new Error('LuminaImport failed to load. Check that js/import.js is included before js/legacy-app.js.');
}
const LuminaState = window.LuminaState;
if(!LuminaState){
  throw new Error('LuminaState failed to load. Check that js/state.js is included before js/legacy-app.js.');
}
const importApi = LuminaImport.createApi({ normalizeSlide, escapeAttr, buildImageFigureHtml });
const {
  buildImportedContent,
  makeImportedSlide,
  makeReferenceImageSlide,
  makeReferencePdfSlide,
  parseMarkdownToSlides,
  parseBeamerToSlides,
  jsonItemToSlide,
  parseJsonOutlineToSlides,
  parsePowerPointTextToSlides
} = importApi;

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
const LuminaBlockLibrary = window.LuminaBlockLibrary;
if(!LuminaBlockLibrary){
  throw new Error('LuminaBlockLibrary failed to load. Check that js/block-library.js is included before js/legacy-app.js.');
}
const blockLibraryApi = LuminaBlockLibrary.createApi({
  clone,
  escapeHtml,
  showToast,
  getBlockLibrary: () => blockLibrary,
  setBlockLibrary: value => { blockLibrary = value; },
  getBlockLibraryList: () => blockLibraryList,
  getBlockLibraryKey: () => BLOCK_LIBRARY_KEY,
  currentBlockFromEditor: () => currentBlockFromEditor(),
  currentColumnName: () => currentColumnName(),
  blockArray: name => blockArray(name),
  selectedIndex: name => selectedIndex(name),
  setSelectedIndex: (name, idx) => setSelectedIndex(name, idx),
  loadSelectedBlockIntoEditor: () => loadSelectedBlockIntoEditor(),
  renderBlockList: () => renderBlockList(),
  buildPreview: () => buildPreview(),
  scheduleAutosave: reason => scheduleAutosave(reason)
});
const {
  defaultReusableBlock,
  builtinLibraryEntries,
  loadBlockLibrary,
  persistBlockLibrary,
  renderBlockLibrary,
  saveCurrentBlockToLibrary,
  insertSelectedLibraryBlock,
  deleteSelectedLibraryBlock
} = blockLibraryApi;

const LuminaTheme = window.LuminaTheme;
if(!LuminaTheme){
  throw new Error('LuminaTheme failed to load. Check that js/theme.js is included before js/legacy-app.js.');
}
const themeApi = LuminaTheme.createApi({
  themeFields,
  normalizeTheme,
  rgbaFromHex,
  showToast,
  getDocument: () => document,
  buildPreview: () => buildPreview(),
  renderDeckList: () => renderDeckList(),
  scheduleAutosave: reason => scheduleAutosave(reason)
});
const {
  themeFieldValue,
  setThemeFieldValue,
  currentThemeFromFields,
  applyThemeToForm,
  currentPresentationOptions,
  applyPresentationOptions,
  currentStyleClass,
  buildSlideStyle,
  beamerPresetTheme,
  applyStylePreset,
  randomHexColor,
  applyStyleBuilder,
  randomizeStyleBuilder
} = themeApi;

const autosaveApi = LuminaState.createAutosaveApi({
  key: AUTOSAVE_KEY,
  setStatus: setAutosaveStatus,
  onError: err => console.error(err),
  beforePersist: () => {
    syncPreviewFiguresToDraft(false);
    saveCurrentBlockToDraft();
    saveCurrentSlideToDeck();
  },
  buildPayload: () => ({
    deckTitle: fields.deckTitle.value || 'My HTML Presentation',
    theme: currentThemeFromFields(),
    presentationOptions: currentPresentationOptions(),
    slides: slides.length ? slides.map(normalizeSlide) : [currentDraftSlide()],
    activeIndex,
    draftSlide: currentDraftSlide(),
    selectedBlock,
    blockColumn: blockFields.column.value,
    ts: Date.now()
  }),
  afterPersist: () => {
    if(!syncingPreviewFigures){
      snippetOutput.value = JSON.stringify(slideForSnippet(currentDraftSlide()), null, 2);
    }
  },
  applyPayload: payload => {
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
    return true;
  }
});

const LuminaParser = window.LuminaParser;
if(!LuminaParser){
  throw new Error('LuminaParser failed to load. Check that js/parser.js is included before js/legacy-app.js.');
}
const parserApi = LuminaParser.createApi({
  preserveMathTokens,
  restoreMathTokens,
  escapeHtml,
  escapeAttr
});
const { parseStructuredText } = parserApi;
/* moved to js/renderer-stage12.js: slide rendering and normalization helpers */

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
  return autosaveApi.persistAutosaveNow(reason);
}
function scheduleAutosave(reason='Autosaved.'){
  return autosaveApi.scheduleAutosave(reason);
}
function restoreAutosave(){
  return autosaveApi.restoreAutosave();
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

// Stage 17: figure insertion/modal helpers moved to js/figure-insert-stage16.js.
const LuminaDiagramEditor = window.LuminaDiagramEditor;
if(!LuminaDiagramEditor){
  throw new Error('LuminaDiagramEditor failed to load. Check that js/diagram-editor.js is included before js/legacy-app.js.');
}
const diagramEditorApi = LuminaDiagramEditor.createApi({
  closeFigureModal: () => closeFigureModal()
});
const { openSimpleDiagramEditor } = diagramEditorApi;

// Stage 17: simple diagram editor popup moved to js/diagram-editor-stage17.js.

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

const LuminaDeck = window.LuminaDeck;
if(!LuminaDeck){
  throw new Error('LuminaDeck failed to load. Check that js/deck.js is included before js/legacy-app.js.');
}
const deckApi = LuminaDeck.createApi({
  clone,
  escapeHtml,
  normalizeSlide,
  slideForSnippet,
  snippetOutput,
  deckCount,
  deckList,
  fields,
  getSlides: () => slides,
  setSlides: value => { slides = value; },
  getActiveIndex: () => activeIndex,
  setActiveIndex: value => { activeIndex = value; },
  saveCurrentBlockToDraft: () => saveCurrentBlockToDraft(),
  saveCurrentSlideToDeck: () => saveCurrentSlideToDeck(),
  applySlideToForm: slide => applySlideToForm(slide),
  buildPreview: () => buildPreview(),
  scheduleAutosave: reason => scheduleAutosave(reason),
  showToast: message => showToast(message),
  currentDraftSlide: () => currentDraftSlide()
});
const {
  parseSnippetSlide,
  loadSnippetIntoEditor,
  replaceSelectedSlideFromSnippet,
  addSlideFromSnippet,
  formatSnippet,
  renderDeckList,
  addSlide,
  updateSlide,
  duplicateSlide,
  deleteSlide,
  moveSlide,
  clearForm,
  copyText,
  copyCurrentSnippet,
  copyMathJaxHelper
} = deckApi;

const LuminaExport = window.LuminaExport;
if(!LuminaExport){
  throw new Error('LuminaExport failed to load. Check that js/export.js is included before js/legacy-app.js.');
}
const exportApi = LuminaExport.createApi({
  escapeHtml,
  clone,
  normalizeSlide,
  fields,
  getSlides: () => slides,
  currentThemeFromFields: () => currentThemeFromFields(),
  currentPresentationOptions: () => currentPresentationOptions(),
  currentDraftSlide: () => currentDraftSlide(),
  buildSlideStyle: (slide, theme) => buildSlideStyle(slide, theme),
  buildSlideInner: slide => buildSlideInner(slide),
  fitFiguresIn: root => fitFiguresIn(root),
  showToast: message => showToast(message),
  slideForSnippet: slide => slideForSnippet(slide)
});
const {
  buildStandaloneViewer,
  downloadTextFile,
  saveBlobWithDialog,
  saveTextFileAs,
  currentPayload,
  sanitizeBlockForPdf,
  sanitizeSlideForPdf,
  getPrintLayout,
  buildPrintableViewer,
  parseSlideSelection,
  waitFrames,
  makeFallbackSlideImage,
  wrapCanvasText,
  withTimeout,
  renderSlideForPdf,
  openPrintablePdf,
  exportPdfReadyHtml,
  downloadStandalone,
  downloadDeck,
  saveCurrentSlideJson,
  savePresentationJson
} = exportApi;

const LuminaFileIo = window.LuminaFileIo;
if(!LuminaFileIo){
  throw new Error('LuminaFileIo failed to load. Check that js/file-io.js is included before js/legacy-app.js.');
}
const fileIoApi = LuminaFileIo.createApi({
  clone,
  normalizeSlide,
  fields,
  getDocument: () => document,
  getSlides: () => slides,
  setSlides: value => { slides = value; },
  getActiveIndex: () => activeIndex,
  setActiveIndex: value => { activeIndex = value; },
  makeReferenceImageSlide,
  makeReferencePdfSlide,
  parseMarkdownToSlides,
  parseBeamerToSlides,
  parseJsonOutlineToSlides,
  parsePowerPointTextToSlides,
  syncPreviewFiguresToDraft: updateSnippet => syncPreviewFiguresToDraft(updateSnippet),
  saveCurrentBlockToDraft: () => saveCurrentBlockToDraft(),
  saveCurrentSlideToDeck: () => saveCurrentSlideToDeck(),
  applySlideToForm: slide => applySlideToForm(slide),
  clearForm: preserve => clearForm(preserve),
  buildPreview: () => buildPreview(),
  renderDeckList: () => renderDeckList(),
  scheduleAutosave: reason => scheduleAutosave(reason),
  showToast: message => showToast(message),
  applyThemeToForm: theme => applyThemeToForm(theme),
  applyPresentationOptions: options => applyPresentationOptions(options)
});
const {
  importModeValue,
  applyImportedSlides,
  importSelectedFiles,
  loadDeckFromFile,
  loadPresentationJsonFromFile
} = fileIoApi;

const LuminaPresets = window.LuminaPresets || {};
const presets = LuminaPresets.presets || {};

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

// Stage 15: UI layout and tab helpers moved to js/ui-stage15.js.

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
initPanelTabs();
initUiCleanupLayout();
window.addEventListener('beforeunload', ()=>{ try{ persistAutosaveNow('Autosaved.'); }catch(e){} });
window.addEventListener('resize', ()=>updatePreviewScale());

