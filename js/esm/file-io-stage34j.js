/* Stage 41Z: browser-compatible ES module file/import workflow helpers with AI preserve-and-merge import.
   Adds backend extraction plus optional AI Copilot cleanup for PDF/PPTX/PPT imports. */

export function createApi(deps) {
  deps = deps || {};
  var clone = deps.clone;
  var normalizeSlide = deps.normalizeSlide;
  var fields = deps.fields;
  var getDocument = deps.getDocument;
  var getSlides = deps.getSlides;
  var setSlides = deps.setSlides;
  var getActiveIndex = deps.getActiveIndex;
  var setActiveIndex = deps.setActiveIndex;
  var makeReferenceImageSlide = deps.makeReferenceImageSlide;
  var makeReferencePdfSlide = deps.makeReferencePdfSlide;
  var parseMarkdownToSlides = deps.parseMarkdownToSlides;
  var parseBeamerToSlides = deps.parseBeamerToSlides;
  var parseJsonOutlineToSlides = deps.parseJsonOutlineToSlides;
  var parsePowerPointTextToSlides = deps.parsePowerPointTextToSlides;
  var syncPreviewFiguresToDraft = deps.syncPreviewFiguresToDraft;
  var saveCurrentBlockToDraft = deps.saveCurrentBlockToDraft;
  var saveCurrentSlideToDeck = deps.saveCurrentSlideToDeck;
  var applySlideToForm = deps.applySlideToForm;
  var clearForm = deps.clearForm;
  var buildPreview = deps.buildPreview;
  var renderDeckList = deps.renderDeckList;
  var scheduleAutosave = deps.scheduleAutosave;
  var showToast = deps.showToast;
  var applyThemeToForm = deps.applyThemeToForm;
  var applyPresentationOptions = deps.applyPresentationOptions;

  var required = { clone:clone, normalizeSlide:normalizeSlide, fields:fields, getSlides:getSlides, setSlides:setSlides, getActiveIndex:getActiveIndex, setActiveIndex:setActiveIndex, makeReferenceImageSlide:makeReferenceImageSlide, makeReferencePdfSlide:makeReferencePdfSlide, parseMarkdownToSlides:parseMarkdownToSlides, parseBeamerToSlides:parseBeamerToSlides, parseJsonOutlineToSlides:parseJsonOutlineToSlides, parsePowerPointTextToSlides:parsePowerPointTextToSlides, syncPreviewFiguresToDraft:syncPreviewFiguresToDraft, saveCurrentBlockToDraft:saveCurrentBlockToDraft, saveCurrentSlideToDeck:saveCurrentSlideToDeck, applySlideToForm:applySlideToForm, clearForm:clearForm, buildPreview:buildPreview, renderDeckList:renderDeckList, scheduleAutosave:scheduleAutosave, showToast:showToast, applyThemeToForm:applyThemeToForm, applyPresentationOptions:applyPresentationOptions };
  Object.keys(required).forEach(function (name) {
    if (typeof required[name] === 'undefined' || required[name] === null) throw new Error('LuminaFileIo missing dependency: ' + name);
  });

  var STORAGE_ENDPOINT = 'luminaExtractionEndpoint';
  var STORAGE_TOKEN = 'luminaExtractionToken';
  var STORAGE_ENABLED = 'luminaExtractionEnabled';
  var STORAGE_ENGINE = 'luminaExtractionEngine';
  var STORAGE_AI_ENABLED = 'luminaImportAiReviewEnabled';
  var STORAGE_AI_ENDPOINT = 'luminaImportAiEndpoint';
  var STORAGE_AI_TOKEN = 'luminaImportAiToken';
  var STORAGE_AI_PROVIDER = 'luminaImportAiProvider';
  var STORAGE_AI_MODEL = 'luminaImportAiModel';
  var DEFAULT_MAX_IMPORT_PAGES = 80;
  var DEFAULT_MAX_IMPORT_SLIDES = 160;

  function doc() { return typeof getDocument === 'function' ? getDocument() : globalThis.document; }
  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Could not read file: ' + (file && file.name ? file.name : 'unknown file'))); };
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.readAsDataURL(file);
    });
  }
  function storageGet(key, fallback) {
    try { return globalThis.localStorage ? (globalThis.localStorage.getItem(key) || fallback || '') : (fallback || ''); }
    catch (_err) { return fallback || ''; }
  }
  function storageSet(key, value) {
    try { if (globalThis.localStorage) globalThis.localStorage.setItem(key, String(value || '')); }
    catch (_err) {}
  }
  function deriveAiEndpointFromExtractionEndpoint(endpoint) {
    var value = String(endpoint || '').trim();
    if (!value) return '/api/lumina/ai';
    if (/\/api\/lumina\/extract\/?$/i.test(value)) return value.replace(/\/api\/lumina\/extract\/?$/i, '/api/lumina/ai');
    return '/api/lumina/ai';
  }
  function initExtractionFields() {
    var d = doc();
    var endpoint = d.getElementById('extractionEndpointInput');
    var token = d.getElementById('extractionTokenInput');
    var enabled = d.getElementById('useExtractionBackendCheckbox');
    var aiEnabled = d.getElementById('aiReviewAfterImportCheckbox');
    var engine = d.getElementById('extractionEngineSelect');
    var aiEndpoint = d.getElementById('importAiEndpointInput');
    var aiToken = d.getElementById('importAiTokenInput');
    var aiProvider = d.getElementById('importAiProviderSelect');
    var aiModel = d.getElementById('importAiModelInput');
    if (endpoint && !endpoint.value) endpoint.value = storageGet(STORAGE_ENDPOINT, '/api/lumina/extract');
    if (token && !token.value) token.value = storageGet(STORAGE_TOKEN, '');
    if (enabled && !enabled.__luminaExtractionInit) {
      var saved = storageGet(STORAGE_ENABLED, 'true');
      enabled.checked = saved !== 'false';
      enabled.__luminaExtractionInit = true;
    }
    if (engine && !engine.__luminaExtractionEngineInit) {
      engine.value = storageGet(STORAGE_ENGINE, engine.value || 'hybrid') || 'hybrid';
      engine.__luminaExtractionEngineInit = true;
    }
    if (aiEnabled && !aiEnabled.__luminaAiReviewInit) {
      aiEnabled.checked = storageGet(STORAGE_AI_ENABLED, 'true') !== 'false';
      aiEnabled.__luminaAiReviewInit = true;
    }
    var derivedAiEndpoint = deriveAiEndpointFromExtractionEndpoint(endpoint && endpoint.value ? endpoint.value : storageGet(STORAGE_ENDPOINT, '/api/lumina/extract'));
    if (aiEndpoint) {
      var savedAiEndpoint = storageGet(STORAGE_AI_ENDPOINT, '');
      var currentAiEndpoint = String(aiEndpoint.value || '').trim();
      if (!currentAiEndpoint || (currentAiEndpoint === '/api/lumina/ai' && derivedAiEndpoint !== '/api/lumina/ai')) {
        aiEndpoint.value = (savedAiEndpoint && !(savedAiEndpoint === '/api/lumina/ai' && derivedAiEndpoint !== '/api/lumina/ai')) ? savedAiEndpoint : derivedAiEndpoint;
      }
    }
    if (aiToken && !aiToken.value) aiToken.value = storageGet(STORAGE_AI_TOKEN, token && token.value ? token.value : storageGet(STORAGE_TOKEN, ''));
    if (aiProvider && !aiProvider.__luminaAiProviderInit) {
      aiProvider.value = storageGet(STORAGE_AI_PROVIDER, aiProvider.value || 'openai') || 'openai';
      aiProvider.__luminaAiProviderInit = true;
    }
    if (aiModel && !aiModel.value) aiModel.value = storageGet(STORAGE_AI_MODEL, 'gpt-4.1-mini');
  }
  function importModeValue() {
    var el = doc().getElementById('importModeSelect');
    return ((el && el.value) || 'append') === 'replace' ? 'replace' : 'append';
  }
  function extractionBackendEnabled() {
    initExtractionFields();
    var el = doc().getElementById('useExtractionBackendCheckbox');
    if (!el) return true;
    storageSet(STORAGE_ENABLED, el.checked ? 'true' : 'false');
    return !!el.checked;
  }
  function extractionEngineValue() {
    initExtractionFields();
    var el = doc().getElementById('extractionEngineSelect');
    var value = String((el && el.value) || storageGet(STORAGE_ENGINE, 'hybrid') || 'hybrid').trim().toLowerCase();
    if(['pymupdf','marker','hybrid'].indexOf(value) < 0) value = 'hybrid';
    storageSet(STORAGE_ENGINE, value);
    return value;
  }
  function extractionEndpointValue() {
    initExtractionFields();
    var el = doc().getElementById('extractionEndpointInput');
    var value = String((el && el.value) || storageGet(STORAGE_ENDPOINT, '/api/lumina/extract') || '').trim();
    if (value) storageSet(STORAGE_ENDPOINT, value);
    return value;
  }
  function extractionTokenValue() {
    initExtractionFields();
    var el = doc().getElementById('extractionTokenInput');
    var value = String((el && el.value) || storageGet(STORAGE_TOKEN, '') || '').trim();
    storageSet(STORAGE_TOKEN, value);
    return value;
  }
  function aiReviewAfterImportEnabled(){
    initExtractionFields();
    const el = doc().getElementById('aiReviewAfterImportCheckbox');
    if(!el) return false;
    storageSet(STORAGE_AI_ENABLED, el.checked ? 'true' : 'false');
    return !!el.checked;
  }
  function isDirectProviderAiEndpoint(endpoint){
    return /(?:^|\/)api\.openai\.com\/v1\/(?:responses|chat\/completions)|api\.anthropic\.com\/v1\/messages|generativelanguage\.googleapis\.com/i.test(String(endpoint || ''));
  }
  function looksLikeExtractionEndpoint(endpoint){
    return /\/api\/lumina\/extract\/?$/i.test(String(endpoint || '').trim());
  }
  function isRelativeEndpoint(endpoint){
    return /^\//.test(String(endpoint || '').trim());
  }
  function isHostedOnStaticGithubPages(){
    try{ return /(^|\.)github\.io$/i.test(global.location && global.location.hostname || ''); }catch(_err){ return false; }
  }
  function normalizeAiReviewEndpoint(raw, fallback){
    let value = String(raw || '').trim();
    const fb = String(fallback || '').trim();
    if(!value) value = fb;
    // Stage 41O: users sometimes paste the OpenAI endpoint here. Browser calls to
    // OpenAI/Anthropic/Gemini are blocked by CORS and would expose keys. This field
    // must point to the Lumina Cloud Run proxy instead.
    if(isDirectProviderAiEndpoint(value) || looksLikeExtractionEndpoint(value)) value = fb;
    return value;
  }
  function validateAiReviewEndpointForBrowser(endpoint){
    const value = String(endpoint || '').trim();
    if(!value) throw new Error('Set an AI review endpoint first. Use your Lumina backend URL ending in /api/lumina/ai.');
    if(isDirectProviderAiEndpoint(value)){
      throw new Error('AI review endpoint is set to a direct provider API. Use your Lumina backend endpoint instead, for example https://lumina-backend-y4piylmfja-ue.a.run.app/api/lumina/ai. Do not use https://api.openai.com/v1/responses in the browser.');
    }
    if(looksLikeExtractionEndpoint(value)){
      throw new Error('AI review endpoint is pointing at the extraction endpoint. Change the ending from /api/lumina/extract to /api/lumina/ai.');
    }
    if(isHostedOnStaticGithubPages() && isRelativeEndpoint(value)){
      throw new Error('AI review endpoint is relative (' + value + ') while the app is hosted on GitHub Pages. Use the full Cloud Run URL ending in /api/lumina/ai.');
    }
    if(!/\/api\/lumina\/ai\/?$/i.test(value)){
      throw new Error('AI review endpoint should be your Lumina backend URL ending in /api/lumina/ai. Current value: ' + value);
    }
    return value;
  }
  function aiReviewEndpointValue(){
    initExtractionFields();
    const el = doc().getElementById('importAiEndpointInput');
    const fallback = deriveAiEndpointFromExtractionEndpoint(extractionEndpointValue());
    const stored = storageGet(STORAGE_AI_ENDPOINT, fallback);
    const value = normalizeAiReviewEndpoint((el && el.value) || stored || fallback, fallback);
    if(el && el.value !== value) el.value = value;
    if(value) storageSet(STORAGE_AI_ENDPOINT, value);
    return value;
  }
  function aiReviewTokenValue(){
    initExtractionFields();
    const el = doc().getElementById('importAiTokenInput');
    const fallback = extractionTokenValue();
    const value = String((el && el.value) || storageGet(STORAGE_AI_TOKEN, fallback) || fallback || '').trim();
    storageSet(STORAGE_AI_TOKEN, value);
    return value;
  }
  function aiReviewProviderValue(){
    initExtractionFields();
    const el = doc().getElementById('importAiProviderSelect');
    const value = String((el && el.value) || storageGet(STORAGE_AI_PROVIDER, 'openai') || 'openai').trim().toLowerCase();
    storageSet(STORAGE_AI_PROVIDER, value);
    return value;
  }
  function aiReviewModelValue(){
    initExtractionFields();
    const el = doc().getElementById('importAiModelInput');
    const value = String((el && el.value) || storageGet(STORAGE_AI_MODEL, 'gpt-4.1-mini') || 'gpt-4.1-mini').trim();
    storageSet(STORAGE_AI_MODEL, value);
    return value;
  }
  function stripHugeInlineAssets(text){
    return String(text || '')
      .replace(/data:image\/[^\s"')>]+/gi, '[embedded-image-omitted]')
      .replace(/<img\b[^>]*>/gi, '[image omitted]')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '[svg/custom figure omitted]');
  }
  function stripHtmlForAi(text){
    return String(text || '')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function trunc(text, n){
    const st = String(text || '');
    return st.length > n ? st.slice(0, n) + '…' : st;
  }
  function blockLooksLikeFigure(block){
    const b = block || {};
    const mode = String(b.mode || '').toLowerCase();
    const content = String(b.content || '');
    return /image|figure|diagram|custom/.test(mode) || /<img\b|<svg\b|data:image\//i.test(content) || /\\begin\{figurehtml\}/i.test(content);
  }
  function blockLooksLikeMath(block){
    const b = block || {};
    const content = stripHugeInlineAssets(String(b.content || '')) + ' ' + String(b.title || '');
    const styleFamily = String((b.style && b.style.fontFamily) || '');
    if(/CMR|CMMI|CMSY|CMBX|MSBM|CMEX|Latin Modern|KaTeX|MathJax/i.test(styleFamily)) return true;
    if(/\\\(|\\\[|\$[^$]+\$|\\mathbb|\\operatorname|\\frac|\\sum|\\sigma|\\alpha|\\beta|\\gamma|\\top|\\times|softmax|LayerNorm|W_Q|W_K|W_V|QK|f_w|w_\{|\bR\^|ℝ|∑|σ|α|β|γ|μ|⇥|\b2\s*R\b|(^|[^A-Za-z])imes\b|(^|[^A-Za-z])ext\{|\^\s*op\b|<\/latexit>/i.test(content)) return true;
    if(Array.isArray(b.importRuns) && b.importRuns.some(r => /CMR|CMMI|CMSY|CMBX|MSBM|CMEX/i.test(String(r && r.fontFamily || '')))) return true;
    return false;
  }
  function compactBlockForAi(block){
    const b = block || {};
    const raw = String(b.content || '');
    const isFigure = blockLooksLikeFigure(b);
    const isMath = blockLooksLikeMath(b);
    const stripped = stripHugeInlineAssets(raw);
    const readable = stripHtmlForAi(stripped) || stripped;
    const repaired = isMath ? repairGarbledMathText(readable) : readable;
    const layout = b.layout || b.importSourceLayout || null;
    return {
      mode: String(b.mode || 'panel'),
      title: String(b.title || ''),
      content: trunc(repaired, isFigure ? 650 : 1200),
      isFigure,
      isMath,
      hasLayout: !!layout,
      layout: layout ? { x:layout.x, y:layout.y, w:layout.w, h:layout.h } : null,
      role: b.importRole || '',
      fontSize: b.style && b.style.fontSize || '',
      fontColor: b.style && b.style.fontColor || ''
    };
  }
  function slideSourceTextForAi(blocks){
    const parts = [];
    (blocks || []).forEach(block => {
      if(blockLooksLikeFigure(block)) return;
      const raw = stripHugeInlineAssets(block && block.content || '');
      const readable = stripHtmlForAi(raw) || raw;
      if(readable) parts.push(repairGarbledMathText(readable));
    });
    return trunc(parts.join('\n'), 3600);
  }
  function compactSlidesForAi(slides){
    return (slides || []).map((slide, idx)=>{
      const left = Array.isArray(slide.leftBlocks) ? slide.leftBlocks : [];
      const right = Array.isArray(slide.rightBlocks) ? slide.rightBlocks : [];
      const allBlocks = left.concat(right);
      const compactBlocks = allBlocks.slice(0, 24).map(compactBlockForAi);
      const mathCandidates = allBlocks.filter(blockLooksLikeMath).slice(0, 12).map((b, i)=>({
        index:i + 1,
        title:String(b.title || ''),
        suggested:trunc(repairGarbledMathText(stripHtmlForAi(stripHugeInlineAssets(b.content || '')) || stripHugeInlineAssets(b.content || '')), 900),
        raw:trunc(stripHtmlForAi(stripHugeInlineAssets(b.content || '')) || stripHugeInlineAssets(b.content || ''), 700)
      })).filter(x => x.suggested || x.raw);
      const figureCandidates = allBlocks.filter(blockLooksLikeFigure).slice(0, 8).map((b, i)=>({
        index:i + 1,
        mode:String(b.mode || ''),
        title:String(b.title || ''),
        contentHint:trunc(stripHtmlForAi(stripHugeInlineAssets(b.content || '')) || '[visual/figure content omitted; reconstruct as clean SVG/HTML if useful]', 700),
        layout:b.layout ? { x:b.layout.x, y:b.layout.y, w:b.layout.w, h:b.layout.h } : null
      }));
      return {
        index: idx + 1,
        slideType: slide.slideType || 'single',
        title: String(slide.title || ''),
        kicker: String(slide.kicker || ''),
        lede: trunc(slide.lede || '', 700),
        sourceText: slideSourceTextForAi(allBlocks),
        originalBlockCount: allBlocks.length,
        mathCandidateCount: mathCandidates.length,
        figureCandidateCount: figureCandidates.length,
        mathCandidates,
        figureCandidates,
        blocks: compactBlocks,
        notes: trunc((slide.notesTitle ? slide.notesTitle + ': ' : '') + (slide.notesBody || ''), 700)
      };
    });
  }
  const AI_IMPORT_REVIEW_PROMPT_PATH = 'prompt/ai_import_review_prompt.txt';
    const AI_IMPORT_REPAIR_PROMPT_PATH = 'prompt/ai_import_repair_prompt.txt';
    const DEFAULT_AI_IMPORT_REVIEW_PROMPT = String.raw`You are repairing a raw Lumina Presentation Maker deck that was already extracted from a PDF/PPT/PPTX by the backend.

IMPORTANT: This is a conservative repair pass, not a redesign pass.
Do not summarize the deck. Do not create a new lecture outline. Do not remove slides. Do not drop figures/images. Do not add decorative animations.

Input:
- A source Lumina deck with one source slide per imported slide.
- Each slide has blocks with stable __aiSourceBlockId values.
- Some block content has PDF/OCR math corruption.
- Some blocks/images may need small layout or sizing adjustments.

Output:
- Return ONLY valid JSON.
- Do not wrap in markdown.
- Return a complete Lumina deck object with deckTitle, theme, presentationOptions, and slides.
- Preserve the number and order of slides unless the input is impossible to parse.
- Preserve block order and __aiSourceBlockId values whenever possible.

Your task for each slide:
1. Go over each block one by one.
2. If a text/math block contains possible math, repair the math.
3. Put math into clear containers:
   - Inline math must use: $ math goes here $
   - Displayed equations must use: \[ math goes here \]
   - Do not leave math as broken plain text.
4. Fix common extraction/OCR math errors:
   - " imes" or "⇥" -> "\\times"
   - " ext{" -> "\\text{"
   - " op" used as transpose -> "\\top"
   - "2 R" or "2 ℝ" used as membership -> "\\in \\mathbb{R}"
   - "QK^ op" -> "QK^\\top"
   - "ﬁ" -> "fi"
   - remove "</latexit>" fragments and base64/LaTeX debris
5. Preserve figures and images:
   - Do not remove image/figure blocks.
   - Do not replace image src/data with placeholders.
   - You may adjust layout x/y/w/h or figure data-box-w/data-box-h only when it clearly improves similarity to the source slide.
   - Keep images sized proportionally; do not stretch them.
6. Preserve layout:
   - Keep freeform imported slide placement when available.
   - Make only small placement/resizing repairs to avoid overlaps, clipped equations, or tiny images.
   - Prefer preserving original layout/importSourceLayout over creating a new stacked layout.
7. Preserve all custom fields used by the app when you can: layout, importSourceLayout, importMeta, importRuns, style, animation, __aiSourceBlockId.

Return the repaired Lumina JSON deck only.`;
    const DEFAULT_AI_IMPORT_REPAIR_PROMPT = String.raw`Your previous Lumina import repair JSON had these problems:
{{PROBLEMS}}

Repair the JSON only. Do not redesign the deck. Preserve source slide count, source block ids, images, and layout.
Return ONLY valid JSON. Do not wrap in markdown.
Use inline math as $ math goes here $ and displayed equations as \[ math goes here \].
Ensure every LaTeX backslash is JSON-escaped: use "\\times", "\\text{}", "\\top", "\\operatorname{}" inside JSON strings.

Source context:
{{SOURCE_CONTEXT}}

Previous output to repair:
{{PREVIOUS_OUTPUT}}`;
    const editableAiPromptCache = Object.create(null);
    function editablePromptUrl(path){
      const raw = String(path || '');
      try{ return new URL(raw, (globalThis && globalThis.location && globalThis.location.href) || (document && document.baseURI) || '').toString(); }
      catch(_err){ return raw; }
    }
    async function loadEditableAiPrompt(path, fallback){
      const key = String(path || '');
      const fallbackText = String(fallback || '');
      if(!key || typeof fetch !== 'function') return editableAiPromptCache[key] || fallbackText;
      try{
        const sep = key.indexOf('?') >= 0 ? '&' : '?';
        const url = editablePromptUrl(key + sep + 'stage=stage42d-displaymath-brackets-import-repair-20260510-1&promptCacheBust=' + Date.now());
        const res = await fetch(url, { cache:'no-store' });
        if(!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        if(String(text || '').trim()){
          editableAiPromptCache[key] = text;
          try{ globalThis.__LUMINA_STAGE41Q_LAST_PROMPT_LOAD = Object.assign(globalThis.__LUMINA_STAGE41Q_LAST_PROMPT_LOAD || {}, { [key]: { ok:true, url, length:text.length, at:new Date().toISOString() } }); }catch(_err){}
          return text;
        }
      }catch(err){
        try{ globalThis.__LUMINA_STAGE41Q_LAST_PROMPT_LOAD = Object.assign(globalThis.__LUMINA_STAGE41Q_LAST_PROMPT_LOAD || {}, { [key]: { ok:false, error:err && err.message ? err.message : String(err), fallback:true, at:new Date().toISOString() } }); }catch(_err){}
      }
      return editableAiPromptCache[key] || fallbackText;
    }
    async function aiDeckSystemPrompt(){
      return loadEditableAiPrompt(AI_IMPORT_REVIEW_PROMPT_PATH, DEFAULT_AI_IMPORT_REVIEW_PROMPT);
    }
  function sourceExpectationsForAi(slides){
    const compactSlides = compactSlidesForAi(slides);
    const conceptKeywords = /attention|transformer|self-attention|token|embed|embedding|pool|convolution|convnet|residual|normalization|layernorm|feed-forward|multi-head/i;
    return {
      sourceSlideCount: compactSlides.length,
      slidesWithMath: compactSlides.filter(sl => sl.mathCandidateCount > 0).length,
      slidesWithFigures: compactSlides.filter(sl => sl.figureCandidateCount > 0).length,
      totalMathCandidates: compactSlides.reduce((n, sl) => n + (sl.mathCandidateCount || 0), 0),
      totalFigureCandidates: compactSlides.reduce((n, sl) => n + (sl.figureCandidateCount || 0), 0),
      conceptSlides: compactSlides.filter(sl => conceptKeywords.test([sl.title, sl.sourceText].join(' '))).length
    };
  }
  function aiDeckUserPrompt(deckTitle, slides){
    addAiSourceIdsToSourceSlides(slides || []);
    const payload = simpleAiRepairSourceDeckForAi(deckTitle, slides || []);
    return [
      'Repair this imported Lumina deck conservatively. Do not redesign it.',
      'For each slide and each block, fix garbled math, use the requested math delimiters, preserve image assets, and make only small layout/size repairs.',
      'Return ONLY the complete repaired Lumina deck JSON. Preserve __aiSourceBlockId on blocks so the app can restore original image assets and layout metadata.',
      JSON.stringify(payload, null, 2)
    ].join('\n\n');
  }

  function deterministicAiSourceBlockId(slideIndex, column, blockIndex){
    return 's' + (slideIndex + 1) + '-' + String(column || 'left') + '-' + (blockIndex + 1);
  }
  function cloneJsonSafe(value){
    try{ return clone ? clone(value) : JSON.parse(JSON.stringify(value || null)); }
    catch(_err){ return value && typeof value === 'object' ? Object.assign({}, value) : value; }
  }
  function aiRepairBlockPayload(block, slideIndex, column, blockIndex){
    const b = block || {};
    const id = String(b.__aiSourceBlockId || deterministicAiSourceBlockId(slideIndex, column, blockIndex));
    const isFigure = blockLooksLikeFigure(b);
    let content = String(b.content || '');
    if(isFigure){
      content = stripHugeInlineAssets(content);
      if(!content || /\[large inline image omitted\]/i.test(content)){
        content = '[source image/figure preserved by app; do not replace or delete; adjust layout only if needed]';
      }
    } else {
      content = repairGarbledMathText(stripHtmlForAi(stripHugeInlineAssets(content)) || stripHugeInlineAssets(content));
    }
    return {
      __aiSourceBlockId:id,
      sourceColumn:column,
      sourceBlockIndex:blockIndex,
      mode:String(b.mode || 'panel'),
      title:String(b.title || ''),
      content:content,
      layout:b.layout || null,
      importSourceLayout:b.importSourceLayout || null,
      importRole:b.importRole || '',
      style:b.style || {},
      animation:b.animation || {},
      preserveOriginalAsset:!!isFigure,
      repairInstruction:isFigure
        ? 'Preserve this source image/figure asset. You may adjust layout or sizing metadata only.'
        : 'Repair OCR/PDF math corruption if present; keep placement similar to source.'
    };
  }
  function simpleAiRepairSourceDeckForAi(deckTitle, slides){
    const sourceSlides = Array.isArray(slides) ? slides : [];
    return {
      task:'simple-import-repair',
      deckTitle:deckTitle || 'Imported deck',
      sourceSlideCount:sourceSlides.length,
      rules:{
        preserveSlideCount:true,
        preserveBlockIds:true,
        preserveImages:true,
        conservativeLayoutRepair:true,
        inlineMathDelimiter:'$ math goes here $',
        displayedEquationDelimiter:'\\[ math goes here \\]'
      },
      slides:sourceSlides.map(function(slide, slideIndex){
        const left = Array.isArray(slide && slide.leftBlocks) ? slide.leftBlocks : [];
        const right = Array.isArray(slide && slide.rightBlocks) ? slide.rightBlocks : [];
        return {
          __aiSourceSlideIndex:slideIndex,
          slideNumber:slideIndex + 1,
          slideType:String(slide && slide.slideType || 'single'),
          title:String(slide && slide.title || ''),
          kicker:String(slide && slide.kicker || ''),
          lede:String(slide && slide.lede || ''),
          importMeta:(slide && slide.importMeta) || null,
          sourceWidth:slide && slide.importMeta && slide.importMeta.sourceWidth || null,
          sourceHeight:slide && slide.importMeta && slide.importMeta.sourceHeight || null,
          leftBlocks:left.map(function(block, blockIndex){ return aiRepairBlockPayload(block, slideIndex, 'left', blockIndex); }),
          rightBlocks:right.map(function(block, blockIndex){ return aiRepairBlockPayload(block, slideIndex, 'right', blockIndex); })
        };
      })
    };
  }
  function addAiSourceIdsToSourceSlides(slides){
    (Array.isArray(slides) ? slides : []).forEach(function(slide, slideIndex){
      ['leftBlocks','rightBlocks'].forEach(function(key){
        const arr = Array.isArray(slide && slide[key]) ? slide[key] : [];
        const col = key === 'rightBlocks' ? 'right' : 'left';
        arr.forEach(function(block, blockIndex){
          if(block && !block.__aiSourceBlockId) block.__aiSourceBlockId = deterministicAiSourceBlockId(slideIndex, col, blockIndex);
        });
      });
    });
    return slides;
  }
  function sourceBlockMapForSimpleRepair(sourceSlides){
    const map = Object.create(null);
    (Array.isArray(sourceSlides) ? sourceSlides : []).forEach(function(slide, slideIndex){
      ['leftBlocks','rightBlocks'].forEach(function(key){
        const arr = Array.isArray(slide && slide[key]) ? slide[key] : [];
        const col = key === 'rightBlocks' ? 'right' : 'left';
        arr.forEach(function(block, blockIndex){
          const id = String(block && block.__aiSourceBlockId || deterministicAiSourceBlockId(slideIndex, col, blockIndex));
          map[id] = { slideIndex, column:col, blockIndex, block:block || {} };
        });
      });
    });
    return map;
  }
  function blockHasRealImageAsset(content){
    return /<img\b[^>]*\bsrc=["']data:image\//i.test(String(content || '')) || /data:image\/(png|jpeg|jpg|webp);base64,/i.test(String(content || ''));
  }
  function repairSimpleMathContainerText(content){
    let s = repairGarbledMathText(content);
    // Keep existing good delimiters. This is deliberately conservative; the AI
    // prompt does the semantic container choice, this pass only fixes obvious EQ: lines.
    if(/^(EQ|Equation)\s*:/i.test(s)){
      let body = s.replace(/^(EQ|Equation)\s*:\s*/i, '').trim();
      if(body && !/^\$.*\$$/.test(body) && !/^\\\(.*\\\)$/.test(body) && !/^\\\[.*\\\]$/.test(body)){
        s = '\\(' + body + '\\)';
      }
    }
    return s;
  }
  function mergeSimpleAiRepairWithSource(deck, sourceSlides){
    if(!deck || !Array.isArray(deck.slides) || !Array.isArray(sourceSlides)) return deck;
    addAiSourceIdsToSourceSlides(sourceSlides);
    const sourceMap = sourceBlockMapForSimpleRepair(sourceSlides);
    const stats = { stage:'stage42d-displaymath-brackets-import-repair-20260510-1', sourceSlides:sourceSlides.length, outputSlides:deck.slides.length, imageAssetsRestored:0, layoutsPreserved:0, blocksRestored:0, slidesRestored:0, mathFieldsRepaired:0, at:new Date().toISOString() };
    const outputSlides = [];
    const maxSlides = Math.max(sourceSlides.length, deck.slides.length);
    for(let si = 0; si < maxSlides; si++){
      const sourceSlide = sourceSlides[si] || null;
      let outSlide = deck.slides[si] || null;
      if(!outSlide && sourceSlide){
        outSlide = cloneJsonSafe(sourceSlide);
        stats.slidesRestored += 1;
      }
      if(!outSlide) continue;
      if(sourceSlide){
        outSlide.slideType = outSlide.slideType || sourceSlide.slideType || 'single';
        outSlide.headingLevel = outSlide.headingLevel || sourceSlide.headingLevel || 'h2';
        outSlide.importMeta = outSlide.importMeta || cloneJsonSafe(sourceSlide.importMeta || null);
        outSlide.bgColor = outSlide.bgColor || sourceSlide.bgColor || '#ffffff';
        outSlide.fontColor = outSlide.fontColor || sourceSlide.fontColor || '#111111';
      }
      const used = Object.create(null);
      function mergeColumn(key){
        const arr = Array.isArray(outSlide[key]) ? outSlide[key] : [];
        const col = key === 'rightBlocks' ? 'right' : 'left';
        const merged = arr.map(function(aiBlock, bi){
          aiBlock = aiBlock || {};
          const id = String(aiBlock.__aiSourceBlockId || aiBlock.sourceBlockId || deterministicAiSourceBlockId(si, col, bi));
          const srcInfo = sourceMap[id];
          if(srcInfo) used[id] = true;
          if(!srcInfo){
            if(typeof aiBlock.content === 'string' && !blockLooksLikeFigure(aiBlock)){
              const before = aiBlock.content;
              aiBlock.content = repairSimpleMathContainerText(before);
              if(before !== aiBlock.content) stats.mathFieldsRepaired += 1;
            }
            return aiBlock;
          }
          const srcBlock = srcInfo.block || {};
          const out = Object.assign({}, aiBlock);
          out.__aiSourceBlockId = id;
          out.style = Object.assign({}, srcBlock.style || {}, aiBlock.style || {});
          out.animation = Object.assign({}, srcBlock.animation || {}, aiBlock.animation || {});
          out.layout = aiBlock.layout || cloneJsonSafe(srcBlock.layout || null);
          out.importSourceLayout = aiBlock.importSourceLayout || cloneJsonSafe(srcBlock.importSourceLayout || null);
          if(!aiBlock.layout && srcBlock.layout) stats.layoutsPreserved += 1;
          if(blockLooksLikeFigure(srcBlock)){
            const aiContent = String(aiBlock.content || '');
            out.mode = srcBlock.mode || aiBlock.mode || 'import-image';
            out.content = blockHasRealImageAsset(aiContent) ? aiContent : String(srcBlock.content || '');
            out.title = String(aiBlock.title || srcBlock.title || 'Figure');
            out.importRole = srcBlock.importRole || aiBlock.importRole || 'source-figure';
            if(out.content === String(srcBlock.content || '')) stats.imageAssetsRestored += 1;
          } else {
            out.mode = String(aiBlock.mode || srcBlock.mode || 'panel');
            out.title = String(aiBlock.title || srcBlock.title || '');
            const before = String(aiBlock.content || srcBlock.content || '');
            out.content = repairSimpleMathContainerText(before);
            if(before !== out.content) stats.mathFieldsRepaired += 1;
          }
          return out;
        });
        if(sourceSlide){
          const sourceArr = Array.isArray(sourceSlide[key]) ? sourceSlide[key] : [];
          sourceArr.forEach(function(srcBlock, bi){
            const id = String(srcBlock && srcBlock.__aiSourceBlockId || deterministicAiSourceBlockId(si, col, bi));
            if(used[id]) return;
            const restored = cloneJsonSafe(srcBlock);
            restored.__aiSourceBlockId = id;
            if(!blockLooksLikeFigure(restored) && typeof restored.content === 'string') restored.content = repairSimpleMathContainerText(restored.content);
            restored.__stage42cRestoredMissingSourceBlock = true;
            merged.push(restored);
            used[id] = true;
            stats.blocksRestored += 1;
          });
        }
        outSlide[key] = merged;
      }
      mergeColumn('leftBlocks');
      mergeColumn('rightBlocks');
      if(sourceSlide && sourceSlide.importChoiceMode === 'image'){
        try{ outSlide = normalizeSlide(stripImportReviewInternals(cloneJsonSafe(sourceSlide))); stats.slidesRestored += 1; }catch(_err){}
      }
      outputSlides.push(outSlide);
    }
    deck.slides = outputSlides;
    repairAiImportDeckMath(deck);
    try{ globalThis.__LUMINA_STAGE42C_SIMPLE_AI_IMPORT_REPAIR = stats; }catch(_err){}
    return deck;
  }

  function extractJsonText(text){
    let s = String(text || '').trim();
    const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if(fence) s = fence[1].trim();
    const first = s.indexOf('{');
    const last = s.lastIndexOf('}');
    if(first >= 0 && last > first) s = s.slice(first, last + 1);
    return s;
  }
  function wrapCustomHtmlIfNeeded(content){
    const raw = String(content || '').trim();
    if(!raw) return '<!doctype html><html><body></body></html>';
    if(/<!doctype/i.test(raw) || /<html[\s>]/i.test(raw)) return raw;
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Inter,Arial,sans-serif}*{box-sizing:border-box}</style></head><body>' + raw + '</body></html>';
  }
  function normalizeAiReviewDeck(parsed, fallbackTitle){
    const deck = parsed && Array.isArray(parsed.slides) ? parsed : (parsed && parsed.deck && Array.isArray(parsed.deck.slides) ? parsed.deck : parsed);
    if(!deck || !Array.isArray(deck.slides) || !deck.slides.length) throw new Error('AI did not return a deck with a slides array.');
    const cleanSlides = deck.slides.map((slide, i)=>{
      const s = Object.assign({}, slide || {});
      s.slideType = ['title-center','single','two-col'].includes(String(s.slideType || '')) ? s.slideType : 'two-col';
      s.headingLevel = s.headingLevel || (s.slideType === 'title-center' ? 'h1' : 'h2');
      s.title = String(s.title || ('Slide ' + (i + 1)));
      s.kicker = String(s.kicker || '');
      s.lede = String(s.lede || '');
      function cleanBlock(block){
        const b = Object.assign({}, block || {});
        b.mode = String(b.mode || 'panel');
        if(b.mode === 'html') b.mode = 'custom';
        b.title = String(b.title || '');
        b.content = String(b.content || '');
        if(b.mode === 'custom') b.content = wrapCustomHtmlIfNeeded(b.content);
        b.style = Object.assign({ fontScale:1, fontSize:'', fontFamily:'inherit', fontColor:'#111111', bulletType:'disc' }, b.style || {});
        b.animation = Object.assign({ buildIn:'none', buildOut:'none', stepMode:'all', order:0 }, b.animation || {});
        return b;
      }
      s.leftBlocks = Array.isArray(s.leftBlocks) ? s.leftBlocks.map(cleanBlock) : [];
      s.rightBlocks = s.slideType === 'two-col' && Array.isArray(s.rightBlocks) ? s.rightBlocks.map(cleanBlock) : [];
      if(!s.leftBlocks.length) s.leftBlocks = [{ mode:'panel', title:'Main idea', content:s.lede || s.title }].map(cleanBlock);
      s.bgColor = s.bgColor || '#ffffff';
      s.fontColor = s.fontColor || '#111111';
      s.inheritTheme = s.inheritTheme !== false;
      return s;
    });
    return {
      deckTitle: String(deck.deckTitle || fallbackTitle || 'AI-cleaned imported deck'),
      theme: deck.theme || null,
      presentationOptions: deck.presentationOptions || null,
      summary: String(deck.summary || 'AI cleaned the imported deck.'),
      slides: cleanSlides
    };
  }
  function repairGarbledMathText(value){
    let s = String(value == null ? '' : value);
    if(!s) return s;
    // Repair the most common PDF/OCR + JSON-escape failures that turn LaTeX into visible garbage.
    // These are deliberately conservative and are applied only to deck text fields, not raw HTML/CSS.
    s = s.replace(/[A-Za-z0-9+/]{18,}<\/latexit>/gi, '');
    s = s.replace(/<\/latexit>/gi, '');
    s = s.replace(/\uFB01/g, 'fi').replace(/ﬁ/g, 'fi');
    s = s.replace(/⇥/g, '\\times');
    s = s.replace(/\t+imes\b/g, '\\times');
    s = s.replace(/\t+ext\s*\{/g, '\\text{');
    s = s.replace(/\t+op\b/g, '\\top');
    s = s.replace(/\t+operatorname\s*\{/g, '\\operatorname{');
    s = s.replace(/\t+mathbb\s*\{/g, '\\mathbb{');
    s = s.replace(/(^|[^A-Za-z])imes\b/g, '$1\\times');
    s = s.replace(/(^|[^A-Za-z])ext\s*\{/g, '$1\\text{');
    s = s.replace(/\^\s*op\b/g, '^\\top');
    s = s.replace(/\bQK\^\s*op\b/g, 'QK^\\top');
    s = s.replace(/(^|[^A-Za-z])operatorname\s*\{/g, '$1\\operatorname{');
    s = s.replace(/(^|[^A-Za-z])mathbb\s*\{/g, '$1\\mathbb{');
    s = s.replace(/(^|[^A-Za-z])frac\s*\{/g, '$1\\frac{');
    s = s.replace(/\b2\s*\{/g, '\\in \\{');
    s = s.replace(/\b2\s*R\s*(\d+|[nmdkr])\s*(?:\\times|×|x)\s*(\d+|[nmdkr])\b/g, '\\in \\mathbb{R}^{$1 \\times $2}');
    s = s.replace(/\b2\s*R\s*\^\s*\{?\s*([^}\s]+)\s*\}?/g, '\\in \\mathbb{R}^{$1}');
    s = s.replace(/\b2\s*R\s*(\d+|[nmdkr])\b/g, '\\in \\mathbb{R}^$1');
    s = s.replace(/\b2\s*R\b/g, '\\in \\mathbb{R}');
    s = s.replace(/(^|[\s({=,\[])(?:R|ℝ)\s*(\d+|[nmdkr])\s*(?:\\times|×|x)\s*(\d+|[nmdkr])\b/g, '$1\\mathbb{R}^{$2 \\times $3}');
    s = s.replace(/(^|[\s({=,\[])(?:R|ℝ)\s*\^\s*\{?\s*(\d+|[nmdkr])\s*(?:\\times|×|x)\s*(\d+|[nmdkr])\s*\}?/g, '$1\\mathbb{R}^{$2 \\times $3}');
    s = s.replace(/(^|[\s({=,\[])(?:R|ℝ)\s*\^\s*\{?\s*([^}\s]+)\s*\}?/g, '$1\\mathbb{R}^{$2}');
    s = s.replace(/(^|[\s({=,\[])(?:R|ℝ)\s*(\d+|[nmdkr])\b/g, '$1\\mathbb{R}^$2');
    s = s.replace(/\bfw\(([^)]*)\)/g, 'f_w($1)');
    s = s.replace(/\bf\s*~\s*w/g, 'f_{\\tilde w}');
    s = s.replace(/~\s*w/g, '\\tilde{w}');
    s = s.replace(/wfilter/g, 'w_{\\text{filter}}');
    s = s.replace(/w\s*filter/g, 'w_{\\text{filter}}');
    s = s.replace(/filter\s+2\s+R/g, 'filter \\in \\mathbb{R}');
    s = s.replace(/\bpositive\s*,\s*negative\b/g, '\\text{positive}, \\text{negative}');
    s = s.replace(/\s{2,}/g, ' ');
    return s.trim();
  }
  function repairCustomHtmlSizing(content){
    let s = String(content == null ? '' : content);
    if(!s) return s;
    // Keep iframe animations responsive. Do not rewrite pedagogical labels inside SVG/HTML.
    s = s.replace(/body\s*\{([^}]*)min-height\s*:\s*720px\s*;?/gi, 'body {$1height:100%;');
    s = s.replace(/\.stage\s*\{([^}]*)height\s*:\s*720px\s*;?/gi, '.stage {$1height:100%;');
    s = s.replace(/\.custom-frame\s*\{([^}]*)height\s*:\s*720px\s*;?/gi, '.custom-frame {$1height:100%;');
    if(/<style[\s\S]*?>/i.test(s) && !/html\s*,\s*body\s*\{[^}]*height\s*:\s*100%/i.test(s)){
      s = s.replace(/<style([\s\S]*?)>/i, '<style$1>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#fff;}');
    }
    if(/<svg\b/i.test(s) && !/svg\s*\{[^}]*max-height\s*:\s*100%/i.test(s)){
      s = s.replace(/<style([\s\S]*?)>/i, '<style$1>svg{width:100%;height:100%;max-width:100%;max-height:100%;}');
    }
    return s;
  }
  function repairAiImportDeckMath(deck){
    if(!deck || !Array.isArray(deck.slides)) return deck;
    let repairedCount = 0;
    function repairField(obj, key){
      if(!obj || typeof obj[key] !== 'string') return;
      const before = obj[key];
      const after = repairGarbledMathText(before);
      if(after !== before){ obj[key] = after; repairedCount += 1; }
    }
    deck.deckTitle = repairGarbledMathText(deck.deckTitle || 'AI-cleaned imported deck');
    deck.slides.forEach(slide=>{
      repairField(slide, 'title'); repairField(slide, 'kicker'); repairField(slide, 'lede'); repairField(slide, 'notesTitle'); repairField(slide, 'notesBody');
      const blocks = [].concat(Array.isArray(slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide.rightBlocks) ? slide.rightBlocks : []);
      blocks.forEach(block=>{
        repairField(block, 'title');
        if(blockLooksLikeFigure(block)){
          if(String(block && block.mode || '') === 'custom'){
            const before = String(block.content || '');
            const after = repairCustomHtmlSizing(before);
            if(after !== before){ block.content = after; repairedCount += 1; }
          }
          return;
        }
        if(String(block && block.mode || '') === 'custom'){
          const before = String(block.content || '');
          const after = repairCustomHtmlSizing(before);
          if(after !== before){ block.content = after; repairedCount += 1; }
        } else {
          repairField(block, 'content');
        }
      });
    });
    try{ globalThis.__LUMINA_STAGE41R_LAST_MATH_REPAIR = { repairedCount, at:new Date().toISOString() }; }catch(_err){}
    return deck;
  }
  const AI_IMPORT_BAD_PATTERNS = [
    { label:'literal </latexit> fragment', re:/<\/latexit>/i },
    { label:'broken LaTeX \\times rendered as imes', re:/(^|[^a-zA-Z])imes\b/ },
    { label:'broken LaTeX \\text rendered as ext{...}', re:/(^|[^a-zA-Z])ext\{/ },
    { label:'broken LaTeX \\top rendered as op', re:/(^|[^a-zA-Z])op\b/ },
    { label:'bad multiplication glyph ⇥', re:/⇥/ },
    { label:'fi ligature ﬁ', re:/ﬁ/ },
    { label:'huge base64 image still present', re:/data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]{80000,}/i }
  ];
  function collectAiDeckText(deck){
    const parts = [];
    try{
      if(deck && deck.deckTitle) parts.push(deck.deckTitle);
      const slides = deck && Array.isArray(deck.slides) ? deck.slides : [];
      slides.forEach(slide=>{
        ['title','kicker','lede','notesTitle','notesBody'].forEach(k=>{ if(slide && slide[k]) parts.push(slide[k]); });
        const blocks = [].concat(Array.isArray(slide && slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide && slide.rightBlocks) ? slide.rightBlocks : []);
        blocks.forEach(block=>{
          if(block && block.title) parts.push(block.title);
          const content = String(block && block.content || '');
          parts.push(blockLooksLikeFigure(block) ? stripHugeInlineAssets(content) : content);
        });
      });
      return parts.join('\n');
    }catch(_err){ return stripHugeInlineAssets(String(deck || '')); }
  }
  function findAiImportDeckProblems(deck, rawText){
    const text = String(rawText || '') + '\n' + collectAiDeckText(deck);
    const found = [];
    AI_IMPORT_BAD_PATTERNS.forEach(item=>{ if(item.re.test(text)) found.push(item.label); });
    const slides = deck && Array.isArray(deck.slides) ? deck.slides : [];
    slides.forEach((slide, slideIndex)=>{
      const blocks = [].concat(Array.isArray(slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide.rightBlocks) ? slide.rightBlocks : []);
      blocks.forEach((block, blockIndex)=>{
        if(String(block && block.mode || '') !== 'custom') return;
        const content = String(block.content || '');
        if(/<script\b/i.test(content)) found.push('custom block has <script> on slide ' + (slideIndex + 1));
        if(/<iframe\b/i.test(content)) found.push('custom block contains nested iframe on slide ' + (slideIndex + 1));
        if(/https?:\/\//i.test(content)) found.push('custom block uses external URL on slide ' + (slideIndex + 1));
        if(/min-height\s*:\s*720px/i.test(content)) found.push('custom block uses body/stage min-height:720px on slide ' + (slideIndex + 1));
        if(/\.stage\s*\{[^}]*height\s*:\s*720px/i.test(content) && String(slide.slideType) === 'two-col') found.push('two-column custom animation uses fixed 720px stage height on slide ' + (slideIndex + 1));
        if(!/(<svg\b|aria-label=)/i.test(content)) found.push('custom block should include an aria-labeled SVG/diagram on slide ' + (slideIndex + 1) + ', block ' + (blockIndex + 1));
      });
    });
    return Array.from(new Set(found)).slice(0, 30);
  }
  function deckBlockLooksLikeMath(block){
    return blockLooksLikeMath(block) || /\\\(|\\\[|\\mathbb|\\times|\\top|\\operatorname|\\frac|\\sum|\$[^$]+\$|EQ:/i.test(String(block && block.content || ''));
  }
  function deckBlockLooksLikeVisual(block){
    const mode = String(block && block.mode || '').toLowerCase();
    const content = String(block && block.content || '');
    return mode === 'custom' || mode === 'diagram' || /figure|image/.test(mode) || /<svg\b|<img\b|\\begin\{figurehtml\}/i.test(content);
  }
  function deckFeatureSummary(deck){
    const slides = deck && Array.isArray(deck.slides) ? deck.slides : [];
    let mathBlockCount = 0;
    let visualBlockCount = 0;
    let customBlockCount = 0;
    const slidesWithMath = new Set();
    const slidesWithVisuals = new Set();
    slides.forEach((slide, si)=>{
      const blocks = [].concat(Array.isArray(slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide.rightBlocks) ? slide.rightBlocks : []);
      blocks.forEach(block=>{
        if(deckBlockLooksLikeMath(block)){ mathBlockCount += 1; slidesWithMath.add(si); }
        if(deckBlockLooksLikeVisual(block)){ visualBlockCount += 1; slidesWithVisuals.add(si); }
        if(String(block && block.mode || '').toLowerCase() === 'custom') customBlockCount += 1;
      });
    });
    return { slideCount:slides.length, mathBlockCount, visualBlockCount, customBlockCount, slidesWithMath:slidesWithMath.size, slidesWithVisuals:slidesWithVisuals.size };
  }
  function findAiImportMissingSourceProblems(deck, sourceSlides){
    const expectations = sourceExpectationsForAi(sourceSlides || []);
    const features = deckFeatureSummary(deck);
    const problems = [];
    if(expectations.totalMathCandidates >= 2 && features.mathBlockCount < Math.min(4, expectations.slidesWithMath)){
      problems.push('source deck had ' + expectations.totalMathCandidates + ' math candidates across ' + expectations.slidesWithMath + ' slides, but cleaned deck has only ' + features.mathBlockCount + ' math/equation blocks; preserve or reconstruct the equations');
    }
    if(expectations.totalFigureCandidates >= 1 && features.visualBlockCount < Math.min(3, expectations.slidesWithFigures)){
      problems.push('source deck had ' + expectations.totalFigureCandidates + ' figure/image candidates, but cleaned deck has only ' + features.visualBlockCount + ' visual/custom blocks; reconstruct figures as clean SVG/HTML diagrams or animations');
    }
    if(expectations.conceptSlides >= 4 && features.customBlockCount < 3 && features.visualBlockCount < 3){
      problems.push('source deck contains multiple visual ML concepts, but cleaned deck has fewer than 3 custom SVG/HTML animations or recovered visual blocks; add pedagogically correct animations for key concepts such as embedding, pooling/convolution, attention, or transformer blocks');
    }
    return problems;
  }
function normalizePreservedBlock(block, fallbackTitle){
  const src = block || {};
  const out = clone ? clone(src) : JSON.parse(JSON.stringify(src || {}));
  out.mode = String(out.mode || 'panel');
  out.title = String(out.title || fallbackTitle || 'Recovered source content');
  out.content = String(out.content || '');
  if(out.mode === 'custom') out.content = wrapCustomHtmlIfNeeded(repairCustomHtmlSizing(out.content));
  else if(blockLooksLikeFigure(out)){
    // Keep source figurehtml/import-image blocks intact. These often contain the only
    // available visual information from the PDF/PPT extraction.
    out.content = String(out.content || '');
  } else {
    out.mode = out.mode === 'import-text' ? 'panel' : out.mode;
    out.content = repairGarbledMathText(out.content);
  }
  out.style = Object.assign({ fontScale:1, fontSize:'', fontFamily:'inherit', fontColor:'#111111', bulletType:'disc' }, out.style || {});
  out.animation = Object.assign({ buildIn:'fade', buildOut:'none', stepMode:'all', order:0 }, out.animation || {});
  out.__stage41vPreservedFromSource = true;
  return out;
}
function sourceBlocksForPreservation(slide){
  const blocks = [].concat(Array.isArray(slide && slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide && slide.rightBlocks) ? slide.rightBlocks : []);
  const mathTexts = [];
  const mathBlocks = [];
  const figureBlocks = [];
  const seenMath = Object.create(null);
  blocks.forEach(block=>{
    if(blockLooksLikeFigure(block)){
      figureBlocks.push(normalizePreservedBlock(block, 'Recovered source figure'));
      return;
    }
    if(blockLooksLikeMath(block)){
      const raw = stripHtmlForAi(stripHugeInlineAssets(block && block.content || '')) || stripHugeInlineAssets(block && block.content || '');
      const repaired = repairGarbledMathText(raw).replace(/^P:\s*/i, '').trim();
      if(!repaired || seenMath[repaired]) return;
      seenMath[repaired] = true;
      mathTexts.push(repaired);
    }
  });
  if(mathTexts.length){
    const capped = mathTexts.slice(0, 10).map(t => t.length > 360 ? t.slice(0, 357) + '…' : t);
    const content = ['\\paragraph{Recovered source equations}', '\\begin{itemize}']
      .concat(capped.map(t => '\\item ' + t))
      .concat(['\\end{itemize}'])
      .join('\n');
    mathBlocks.push(normalizePreservedBlock({ mode:'panel', title:'Recovered source equations', content, style:{ fontScale:0.92, fontColor:'#111111' }, animation:{ buildIn:'fade', buildOut:'none', stepMode:'by-item', order:90 } }, 'Recovered source equations'));
  }
  return { mathBlocks, figureBlocks };
}
function hasMathOnSlide(slide){
  const blocks = [].concat(Array.isArray(slide && slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide && slide.rightBlocks) ? slide.rightBlocks : []);
  return blocks.some(deckBlockLooksLikeMath);
}
function hasVisualOnSlide(slide){
  const blocks = [].concat(Array.isArray(slide && slide.leftBlocks) ? slide.leftBlocks : [], Array.isArray(slide && slide.rightBlocks) ? slide.rightBlocks : []);
  return blocks.some(deckBlockLooksLikeVisual);
}
function appendBlocksToCleanSlide(cleanSlide, blocks, preferRight){
  if(!cleanSlide || !Array.isArray(blocks) || !blocks.length) return 0;
  cleanSlide.leftBlocks = Array.isArray(cleanSlide.leftBlocks) ? cleanSlide.leftBlocks : [];
  cleanSlide.rightBlocks = Array.isArray(cleanSlide.rightBlocks) ? cleanSlide.rightBlocks : [];
  if(preferRight){
    if(cleanSlide.slideType !== 'two-col' && cleanSlide.leftBlocks.length){
      cleanSlide.slideType = 'two-col';
    }
    const target = cleanSlide.slideType === 'two-col' ? cleanSlide.rightBlocks : cleanSlide.leftBlocks;
    blocks.forEach(b => target.push(b));
  } else {
    blocks.forEach(b => cleanSlide.leftBlocks.push(b));
  }
  return blocks.length;
}
function mergeSourcePreservationIntoAiDeck(deck, sourceSlides, originalProblems){
  if(!deck || !Array.isArray(deck.slides) || !Array.isArray(sourceSlides)) return deck;
  const stats = { slidesChecked:sourceSlides.length, rawSlidesAdded:0, mathBlocksAdded:0, figureBlocksAdded:0, touchedSlides:0, originalProblems:originalProblems || [], at:new Date().toISOString() };
  // If the AI over-summarized the deck, append the missing source slides first.
  // This is intentionally conservative: a rough recovered slide is better than
  // silently losing a lecture section with equations/figures.
  while(deck.slides.length < sourceSlides.length){
    const sourceSlide = sourceSlides[deck.slides.length];
    let recovered;
    try{ recovered = normalizeSlide(clone ? clone(sourceSlide) : JSON.parse(JSON.stringify(sourceSlide || {}))); }
    catch(_err){ recovered = Object.assign({ title:'Recovered source slide', slideType:'single', leftBlocks:[], rightBlocks:[] }, sourceSlide || {}); }
    recovered.title = String(recovered.title || ('Recovered source slide ' + (deck.slides.length + 1)));
    recovered.notesBody = String(recovered.notesBody || '') + (recovered.notesBody ? '\n\n' : '') + 'Stage 41Z appended this source slide because AI cleanup returned too few slides.';
    recovered.__stage41vRecoveredSourceSlide = true;
    deck.slides.push(recovered);
    stats.rawSlidesAdded += 1;
  }
  sourceSlides.forEach((sourceSlide, i)=>{
    const cleanSlide = deck.slides[Math.min(i, Math.max(deck.slides.length - 1, 0))];
    if(!cleanSlide) return;
    const preserve = sourceBlocksForPreservation(sourceSlide);
    let touched = false;
    if(preserve.mathBlocks.length && !hasMathOnSlide(cleanSlide)){
      stats.mathBlocksAdded += appendBlocksToCleanSlide(cleanSlide, preserve.mathBlocks, false);
      touched = true;
    }
    if(preserve.figureBlocks.length && !hasVisualOnSlide(cleanSlide)){
      // Keep at most two original images per slide to prevent a single messy PDF page
      // from flooding the cleaned deck, while still preserving the visual content that
      // the AI dropped. Users can delete extra recovered figures manually.
      const figureBlocks = preserve.figureBlocks.slice(0, 2);
      stats.figureBlocksAdded += appendBlocksToCleanSlide(cleanSlide, figureBlocks, true);
      touched = true;
    }
    if(touched){
      stats.touchedSlides += 1;
      cleanSlide.notesBody = String(cleanSlide.notesBody || '') + (cleanSlide.notesBody ? '\n\n' : '') + 'Stage 41Z restored source math/figure content that AI cleanup dropped.';
    }
  });
  // Stage 41Z: preserve user-selected image alternatives exactly, even after AI cleanup.
  sourceSlides.forEach(function(sourceSlide, i){
    if(sourceSlide && sourceSlide.importChoiceMode === 'image' && deck.slides[i]){
      try{ deck.slides[i] = normalizeSlide(stripImportReviewInternals(clone ? clone(sourceSlide) : JSON.parse(JSON.stringify(sourceSlide)))); stats.touchedSlides += 1; }catch(_err){}
    }
  });
  repairAiImportDeckMath(deck);
  try{ globalThis.__LUMINA_STAGE41V_LAST_PRESERVE_MERGE = stats; globalThis.__LUMINA_STAGE41W_LAST_PRESERVE_MERGE = stats; }catch(_err){}
  return deck;
}
  function applyEditablePromptTemplate(template, values){
      let out = String(template || '');
      Object.keys(values || {}).forEach(function(key){
        out = out.split('{{' + key + '}}').join(String(values[key] || ''));
      });
      return out;
    }
    async function aiDeckRepairPrompt(previousText, problems, sourceContext){
    const prior = String(previousText || '').slice(0, 180000);
    const problemText = (problems || []).map(p => '- ' + p).join('\n');
    const template = await loadEditableAiPrompt(AI_IMPORT_REPAIR_PROMPT_PATH, DEFAULT_AI_IMPORT_REPAIR_PROMPT);
    return applyEditablePromptTemplate(template, {
      PROBLEMS: problemText,
      SOURCE_CONTEXT: String(sourceContext || '').slice(0, 90000),
      PREVIOUS_OUTPUT: prior
    });
  }
  async function requestAiReviewText(endpoint, token, provider, model, system, input, temperature, maxOutputTokens){
    const headers = { 'Content-Type':'application/json' };
    if(token) headers.Authorization = 'Bearer ' + token;
    let body;
    const isProxy = /\/api\/lumina\/ai\/?$/i.test(endpoint);
    if(isProxy){
      body = {
        provider,
        model,
        task:'import-review-cleanup',
        payload:{ instructions:system, input, temperature, maxOutputTokens }
      };
    } else {
      body = {
        model,
        input:[{ role:'system', content:system }, { role:'user', content:[{ type:'input_text', text:input }] }],
        temperature,
        max_output_tokens:maxOutputTokens,
        store:false
      };
    }
    validateAiReviewEndpointForBrowser(endpoint);
    let res;
    try{
      res = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify(body) });
    }catch(err){
      const hint = isDirectProviderAiEndpoint(endpoint)
        ? 'The AI review endpoint appears to be a direct provider API. Use your Lumina backend /api/lumina/ai endpoint instead.'
        : 'The browser could not reach the AI review endpoint. Check that it is the full Cloud Run URL ending in /api/lumina/ai, that the service is public, and that ALLOWED_ORIGINS includes https://karthik-sridharan.github.io.';
      try{ global.__LUMINA_STAGE41O_LAST_AI_FETCH_ERROR = { endpoint, provider, model, error:err && err.message ? err.message : String(err), hint, at:new Date().toISOString() }; }catch(_err){}
      throw new Error(hint + ' Browser error: ' + (err && err.message ? err.message : String(err)));
    }
    const raw = await res.text();
    let data = null;
    try{ data = raw ? JSON.parse(raw) : null; }catch(_err){ data = { raw }; }
    if(!res.ok || (data && data.ok === false)){
      const msg = data && data.error && data.error.message ? data.error.message : raw || ('AI review failed with HTTP ' + res.status + '.');
      throw new Error(msg);
    }
    let text = '';
    if(isProxy) text = String(data && data.text || '');
    else if(data && typeof data.output_text === 'string') text = data.output_text;
    else if(data && Array.isArray(data.output)){
      const parts = [];
      data.output.forEach(item => (item.content || []).forEach(c => { if(c && typeof c.text === 'string') parts.push(c.text); else if(c && typeof c.output_text === 'string') parts.push(c.output_text); }));
      text = parts.join('\n').trim();
    }
    if(!text) throw new Error('AI review returned an empty response.');
    return text;
  }
  function parseAiReviewResponseText(text, fallbackTitle){
    const jsonText = extractJsonText(text);
    let parsed;
    try{ parsed = JSON.parse(jsonText); }
    catch(err){ throw new Error('AI returned text that was not valid deck JSON: ' + String(text || '').slice(0, 300)); }
    return repairAiImportDeckMath(normalizeAiReviewDeck(parsed, fallbackTitle));
  }
  async function callImportAiReview(deckTitle, slides){
    const endpoint = aiReviewEndpointValue();
    if(!endpoint) throw new Error('Set an AI review endpoint first. For your Cloud Run backend use the same URL as extraction, ending in /api/lumina/ai.');
    const token = aiReviewTokenValue();
    const provider = aiReviewProviderValue();
    const model = aiReviewModelValue();
    addAiSourceIdsToSourceSlides(slides || []);
    const system = await aiDeckSystemPrompt();
    const input = aiDeckUserPrompt(deckTitle, slides);
    let text = await requestAiReviewText(endpoint, token, provider, model, system, input, 0.05, 42000);
    let deck;
    let problems = [];
    try{
      deck = parseAiReviewResponseText(text, deckTitle);
      deck = mergeSimpleAiRepairWithSource(deck, slides || []);
      problems = findAiImportDeckProblems(deck, '');
    }catch(err){
      problems = ['AI returned invalid JSON: ' + (err && err.message ? err.message : String(err))];
    }
    if(problems.length){
      showToast('AI import repair needs one JSON/math repair pass…');
      text = await requestAiReviewText(endpoint, token, provider, model, system, await aiDeckRepairPrompt(text, problems, input), 0.02, 42000);
      deck = parseAiReviewResponseText(text, deckTitle);
      deck = mergeSimpleAiRepairWithSource(deck, slides || []);
      problems = findAiImportDeckProblems(deck, '');
      if(problems.length){
        throw new Error('AI import repair still failed validation: ' + problems.join('; '));
      }
    }
    try{
      globalThis.__LUMINA_STAGE42C_LAST_AI_IMPORT_REPAIR = {
        ok:true,
        endpoint, provider, model,
        inputSlides:(slides||[]).length,
        outputSlides:deck.slides.length,
        simpleRepair:true,
        merge:globalThis.__LUMINA_STAGE42C_SIMPLE_AI_IMPORT_REPAIR || null,
        at:new Date().toISOString()
      };
      globalThis.__LUMINA_STAGE41V_LAST_AI_IMPORT_REVIEW = globalThis.__LUMINA_STAGE42C_LAST_AI_IMPORT_REPAIR;
      globalThis.__LUMINA_STAGE41R_LAST_AI_IMPORT_REVIEW = globalThis.__LUMINA_STAGE42C_LAST_AI_IMPORT_REPAIR;
    }catch(_err){}
    return deck;
  }
  async function maybeReviewImportedDeckWithAi(importedSlides, deckTitle){
    if(!aiReviewAfterImportEnabled()) return { deckTitle, slides:importedSlides, theme:null, presentationOptions:null, aiReviewed:false };
    showToast('Asking AI Copilot to repair math/layout in the imported deck…');
    try{
      const deck = await callImportAiReview(deckTitle, importedSlides);
      showToast('AI repaired import: ' + deck.slides.length + ' slide' + (deck.slides.length === 1 ? '' : 's') + ' ready.');
      return Object.assign({ aiReviewed:true }, deck);
    }catch(err){
      const message = err && err.message ? err.message : String(err);
      // Stage 41Z: do not leave the user with no slides when the AI review path
      // is too strict or the model drops equations/figures. Preserve the backend
      // extraction output and report the AI validation failure for diagnostics.
      const fallbackSlides = Array.isArray(importedSlides) ? importedSlides : [];
      try{
        globalThis.__LUMINA_STAGE41V_LAST_AI_IMPORT_FALLBACK = {
          ok:false,
          loadedRawExtractedDeck:true,
          reason:message,
          inputSlides:fallbackSlides.length,
          sourceFeatures:sourceExpectationsForAi(fallbackSlides),
          at:new Date().toISOString()
        };
        globalThis.__LUMINA_STAGE41R_LAST_AI_IMPORT_REVIEW = Object.assign({}, globalThis.__LUMINA_STAGE41V_LAST_AI_IMPORT_FALLBACK);
      }catch(_err){}
      showToast('AI cleanup failed validation; loaded the source-extracted slides instead.');
      return {
        deckTitle,
        slides:fallbackSlides,
        theme:null,
        presentationOptions:null,
        aiReviewed:false,
        aiReviewFailed:true,
        aiReviewError:message
      };
    }
  }
  function hasImportReviewAlternates(slides){
    return (slides || []).some(function(slide){ return !!(slide && slide.importAlternates && slide.importAlternates.imageSlide); });
  }
  function stripImportReviewInternals(slide){
    var out;
    try { out = clone ? clone(slide) : JSON.parse(JSON.stringify(slide || {})); }
    catch(_err){ out = Object.assign({}, slide || {}); }
    if(out){ delete out.importAlternates; }
    return out;
  }
  function renderImportChoicePreview(slide, label){
    var d = doc();
    var html = '';
    try{
      var api = globalThis.LuminaRendererApi || globalThis.LuminaRenderer || null;
      var normalized = normalizeSlide(stripImportReviewInternals(slide));
      if(api && typeof api.buildSlideMarkup === 'function') html = api.buildSlideMarkup(normalized, { index:0, active:true });
    }catch(_err){ html = ''; }
    if(!html){
      var title = String(slide && slide.title || label || 'Slide');
      html = '<section class="slide single"><h2>' + title.replace(/[&<>]/g, function(ch){ return ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]); }) + '</h2></section>';
    }
    return '<div class="stage41w-choice-preview-frame"><div class="stage41w-choice-preview-scale">' + html + '</div></div>';
  }
  function ensureImportReviewStyles(){
    var d = doc();
    if(d.getElementById('stage41w-import-review-styles')) return;
    var style = d.createElement('style');
    style.id = 'stage41w-import-review-styles';
    style.textContent = '.stage41w-import-review-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.66);z-index:99998;display:grid;place-items:center;padding:18px}.stage41w-import-review-modal{width:min(1180px,96vw);max-height:92vh;background:#fff;color:#111827;border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}.stage41w-import-review-head{padding:14px 18px;border-bottom:1px solid rgba(15,23,42,.12);display:flex;justify-content:space-between;gap:12px;align-items:center}.stage41w-import-review-head h2{font-size:1.05rem;margin:0}.stage41w-import-review-body{padding:14px 18px;overflow:auto}.stage41w-import-review-slide{border:1px solid rgba(15,23,42,.14);border-radius:16px;margin-bottom:14px;background:#f8fafc;overflow:hidden}.stage41w-import-review-slide-title{padding:10px 12px;font-weight:700;color:#10233b;border-bottom:1px solid rgba(15,23,42,.10);display:flex;justify-content:space-between;gap:12px}.stage41w-import-review-choices{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px}.stage41w-import-choice{border:2px solid rgba(15,23,42,.15);border-radius:14px;background:#fff;padding:10px;cursor:pointer;min-width:0}.stage41w-import-choice input{margin-right:.45rem}.stage41w-import-choice.stage41w-selected{border-color:#2f6fed;box-shadow:0 0 0 4px rgba(47,111,237,.12)}.stage41w-choice-preview-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:10px;background:#e5e7eb;overflow:hidden;margin-top:8px;border:1px solid rgba(15,23,42,.10)}.stage41w-choice-preview-scale{position:absolute;left:0;top:0;width:1600px;height:900px;transform-origin:top left;transform:scale(.26);pointer-events:none}.stage41w-choice-preview-scale .slide{width:1600px!important;height:900px!important;box-sizing:border-box}.stage41w-import-review-foot{padding:12px 18px;border-top:1px solid rgba(15,23,42,.12);display:flex;justify-content:flex-end;gap:10px}.stage41w-import-review-foot button{border-radius:999px;border:1px solid rgba(15,23,42,.18);background:#fff;color:#10233b;padding:.55rem .9rem;font-weight:700}.stage41w-import-review-foot button.primary{background:#17365d;color:#fff}@media (max-width:800px){.stage41w-import-review-choices{grid-template-columns:1fr}.stage41w-import-review-modal{width:98vw;max-height:94vh}}';
    d.head.appendChild(style);
  }
  function reviewExtractedSlidesWithAlternates(slides, deckTitle){
    slides = slides || [];
    if(!hasImportReviewAlternates(slides)) return Promise.resolve(slides.map(stripImportReviewInternals));
    ensureImportReviewStyles();
    return new Promise(function(resolve){
      var d = doc();
      var choices = slides.map(function(slide){ return slide && slide.importAlternates && slide.importAlternates.imageSlide ? 'semantic' : 'semantic'; });
      var backdrop = d.createElement('div');
      backdrop.className = 'stage41w-import-review-backdrop';
      var body = slides.map(function(slide, i){
        var imageSlide = slide && slide.importAlternates && slide.importAlternates.imageSlide;
        var title = String(slide && slide.title || ('Slide ' + (i + 1))).replace(/[&<>]/g, function(ch){ return ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]); });
        if(!imageSlide){
          return '<div class="stage41w-import-review-slide" data-slide-index="'+i+'"><div class="stage41w-import-review-slide-title"><span>'+(i+1)+'. '+title+'</span><span>No rendered alternative</span></div><div class="stage41w-import-review-choices"><label class="stage41w-import-choice stage41w-selected"><input type="radio" checked disabled> Editable extraction'+renderImportChoicePreview(slide, 'Editable extraction')+'</label></div></div>';
        }
        return '<div class="stage41w-import-review-slide" data-slide-index="'+i+'"><div class="stage41w-import-review-slide-title"><span>'+(i+1)+'. '+title+'</span><span>Choose version</span></div><div class="stage41w-import-review-choices"><label class="stage41w-import-choice stage41w-selected" data-choice="semantic"><input name="stage41w-choice-'+i+'" type="radio" value="semantic" checked> Editable semantic extraction'+renderImportChoicePreview(slide, 'Editable extraction')+'</label><label class="stage41w-import-choice" data-choice="image"><input name="stage41w-choice-'+i+'" type="radio" value="image"> Rendered image/background'+renderImportChoicePreview(imageSlide, 'Rendered image')+'</label></div></div>';
      }).join('');
      backdrop.innerHTML = '<div class="stage41w-import-review-modal" role="dialog" aria-modal="true" aria-label="Review imported slide choices"><div class="stage41w-import-review-head"><div><h2>Review PDF import choices</h2><div class="help">Left is editable extraction; right is exact rendered page image. Editable is selected by default.</div></div><button type="button" data-stage41w-close>×</button></div><div class="stage41w-import-review-body">'+body+'</div><div class="stage41w-import-review-foot"><button type="button" data-stage41w-all-semantic>Use editable for all</button><button type="button" data-stage41w-all-image>Use image for all</button><button type="button" class="primary" data-stage41w-continue>Continue import</button></div></div>';
      function refresh(){
        Array.from(backdrop.querySelectorAll('.stage41w-import-review-slide')).forEach(function(row){
          Array.from(row.querySelectorAll('.stage41w-import-choice')).forEach(function(choice){
            var input = choice.querySelector('input[type="radio"]');
            choice.classList.toggle('stage41w-selected', !!(input && input.checked));
          });
        });
      }
      backdrop.addEventListener('change', function(ev){
        var input = ev.target && ev.target.matches && ev.target.matches('input[type="radio"]') ? ev.target : null;
        if(input){
          var m = String(input.name || '').match(/stage41w-choice-(\d+)/);
          if(m) choices[Number(m[1])] = input.value === 'image' ? 'image' : 'semantic';
          refresh();
        }
      });
      backdrop.addEventListener('click', function(ev){
        var close = ev.target && ev.target.closest && ev.target.closest('[data-stage41w-close]');
        if(close){ backdrop.remove(); resolve(slides.map(stripImportReviewInternals)); return; }
        if(ev.target && ev.target.closest && ev.target.closest('[data-stage41w-all-semantic]')){
          choices = choices.map(function(){ return 'semantic'; });
          Array.from(backdrop.querySelectorAll('input[value="semantic"]')).forEach(function(input){ input.checked = true; }); refresh(); return;
        }
        if(ev.target && ev.target.closest && ev.target.closest('[data-stage41w-all-image]')){
          choices = choices.map(function(choice, i){ return slides[i] && slides[i].importAlternates && slides[i].importAlternates.imageSlide ? 'image' : 'semantic'; });
          Array.from(backdrop.querySelectorAll('.stage41w-import-review-slide')).forEach(function(row){
            var idx = Number(row.getAttribute('data-slide-index') || 0);
            var input = row.querySelector('input[value="' + choices[idx] + '"]');
            if(input) input.checked = true;
          }); refresh(); return;
        }
        if(ev.target && ev.target.closest && ev.target.closest('[data-stage41w-continue]')){
          var selected = slides.map(function(slide, i){
            var imageSlide = slide && slide.importAlternates && slide.importAlternates.imageSlide;
            var chosen = choices[i] === 'image' && imageSlide ? imageSlide : slide;
            var out = stripImportReviewInternals(chosen);
            out.importChoiceMode = choices[i] === 'image' && imageSlide ? 'image' : 'semantic';
            out.importChoiceSourceIndex = i;
            return out;
          });
          try{ globalThis.__LUMINA_STAGE41W_IMPORT_REVIEW_CHOICES = { deckTitle:deckTitle || '', slideCount:selected.length, choices:choices.slice(), at:new Date().toISOString() }; }catch(_err){}
          backdrop.remove(); resolve(selected);
        }
      });
      d.body.appendChild(backdrop);
      refresh();
    });
  }

  function isExtractablePresentationFile(file) {
    var name = String(file && file.name || '').toLowerCase();
    return /\.(pdf|pptx|ppt)$/i.test(name) || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file.type === 'application/vnd.ms-powerpoint';
  }
  function fileKind(file) {
    var name = String(file && file.name || '').toLowerCase();
    if (/\.pdf$/i.test(name) || file.type === 'application/pdf') return 'pdf';
    if (/\.pptx$/i.test(name)) return 'pptx';
    if (/\.ppt$/i.test(name)) return 'ppt';
    return '';
  }
  function extractionHealthEndpoint(endpoint) {
    var raw = String(endpoint || '').trim();
    if (!raw) return '';
    try {
      var url = new URL(raw, globalThis.location && globalThis.location.href || undefined);
      url.pathname = url.pathname.replace(/\/api\/lumina\/extract\/?$/, '/health');
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch (_err) { return ''; }
  }
  function describeExtractionFetchFailure(endpoint, err) {
    var msg = err && err.message ? String(err.message) : String(err || 'Load failed');
    var health = extractionHealthEndpoint(endpoint);
    var hint = 'The browser could not complete the upload request.';
    function finish(extra) {
      var out = msg + ' — ' + hint + (extra || '');
      if (/Load failed|Failed to fetch|NetworkError/i.test(msg)) {
        out += ' Check that the extraction endpoint is the full Cloud Run URL ending in /api/lumina/extract, that ALLOWED_ORIGINS includes https://karthik-sridharan.github.io, and that the PDF is below Cloud Run/browser upload limits, and that the extraction JSON response was not too large. Stage 41Z uses compact review images; if this persists, temporarily reduce Max PDF pages or set Include review alternates off.';
      }
      return out;
    }
    if (!health || typeof fetch !== 'function') return Promise.resolve(finish(''));
    return fetch(health, { method:'GET', cache:'no-store', mode:'cors' }).then(function (res) {
      return res.text().then(function (text) {
        var extra = ' Backend /health is reachable (HTTP ' + res.status + ').';
        if (text && /stage41w|stage41v|stage41q|stage40d/i.test(text)) extra += ' Health looks like an older backend/frontend stage may still be deployed.';
        return finish(extra);
      });
    }).catch(function () {
      return finish(' The browser also could not reach ' + health + ', which usually means the endpoint URL is wrong, Cloud Run is not public, CORS is blocked, or the service is down.');
    });
  }

  function extractPresentationFile(file) {
    if (typeof fetch !== 'function' || typeof FormData !== 'function') return Promise.reject(new Error('This browser does not support fetch/FormData upload.'));
    var endpoint = extractionEndpointValue();
    if (!endpoint) return Promise.reject(new Error('Set an extraction backend endpoint first.'));
    var form = new FormData();
    form.append('file', file, file.name || 'presentation');
    var kind = fileKind(file);
    if (kind) form.append('kind', kind);
    // Stage 41J: explicitly request all pages/slides so a stale Cloud Run env
    // such as LUMINA_EXTRACT_MAX_PDF_PAGES=1 cannot silently limit imports.
    form.append('maxPdfPages', String(DEFAULT_MAX_IMPORT_PAGES));
    form.append('maxPptxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
    form.append('maxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
    // Stage 41J: import PDF images as individual image blocks; do not include a full-page
    // background bitmap unless explicitly added later.
    form.append('includePdfBackground', '0');
    form.append('includePdfReviewAlternates', '1');
    form.append('extractEngine', extractionEngineValue());
    // Stage 41Z: keep rendered review alternatives small enough for Safari/Cloud Run.
    form.append('reviewRenderZoom', '0.45');
    form.append('reviewJpegQuality', '48');
    form.append('vectorRenderZoom', '0.95');
    form.append('vectorJpegQuality', '58');
    var headers = {};
    var token = extractionTokenValue();
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(endpoint, { method:'POST', headers:headers, body:form, cache:'no-store', mode:'cors' }).catch(function (fetchErr) {
      return describeExtractionFetchFailure(endpoint, fetchErr).then(function (message) { throw new Error(message); });
    }).then(function (res) {
      return res.text().then(function (text) {
        var payload = null;
        try { payload = text ? JSON.parse(text) : null; }
        catch (_err) { payload = { ok:false, error:{ message:text ? text.slice(0, 500) : 'Empty response from extraction backend.' } }; }
        if (!res.ok || !payload || payload.ok === false) {
          var msg = payload && payload.error && payload.error.message ? payload.error.message : ('Extraction backend failed with HTTP ' + res.status + '.');
          throw new Error(msg);
        }
        if (!Array.isArray(payload.slides) || !payload.slides.length) throw new Error('Extraction backend returned no slides.');
        try { globalThis.__LUMINA_STAGE41M_LAST_EXTRACTION = { ok:true, slideCount:payload.slides.length, source:payload.source || null, meta:payload.meta || null, warnings:payload.warnings || [], endpoint:endpoint, filename:file && file.name || '' }; } catch (_err) {}
        return payload;
      });
    });
  }
  function applyImportedSlides(importedSlides, opts) {
    opts = opts || {};
    var incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
    try { globalThis.__LUMINA_STAGE41M_LAST_IMPORT = { requestedSlides:(importedSlides||[]).length, normalizedSlides:incoming.length, mode:opts && opts.mode || 'append', at:new Date().toISOString() }; } catch (_err) {}
    if (!incoming.length) throw new Error('No slides were imported.');
    syncPreviewFiguresToDraft(false);
    saveCurrentBlockToDraft();
    saveCurrentSlideToDeck();
    if (opts.theme) applyThemeToForm(opts.theme);
    if (opts.presentationOptions) applyPresentationOptions(opts.presentationOptions);
    var mode = opts.mode === 'replace' ? 'replace' : 'append';
    if (mode === 'replace') {
      setSlides(incoming);
      setActiveIndex(0);
      if (opts.deckTitle) fields.deckTitle.value = opts.deckTitle;
    } else {
      var current = getSlides();
      var base = current.length ? clone(current) : [];
      var next = base.concat(incoming);
      setSlides(next);
      setActiveIndex(base.length);
      if (opts.deckTitle && !fields.deckTitle.value) fields.deckTitle.value = opts.deckTitle;
    }
    var slides = getSlides();
    var activeIndex = getActiveIndex();
    applySlideToForm(slides[activeIndex]);
    renderDeckList();
    buildPreview();
    scheduleAutosave('Autosaved after import.');
    showToast('Imported ' + incoming.length + ' slide' + (incoming.length === 1 ? '' : 's') + '.');
  }
  function importSelectedFiles(fileList) {
    initExtractionFields();
    var files = Array.from(fileList || []);
    if (!files.length) return Promise.reject(new Error('Choose one or more files first.'));
    var imported = [];
    var deckTitle = '';
    var warnings = [];
    var usedExtractionBackend = false;
    var chain = Promise.resolve();
    files.forEach(function (file) {
      chain = chain.then(function () {
        var lower = String(file.name || '').toLowerCase();
        if (!deckTitle) deckTitle = String(file.name || 'Imported deck').replace(/\.[^.]+$/, '');

        if (isExtractablePresentationFile(file)) {
          if (extractionBackendEnabled()) {
            return extractPresentationFile(file).then(function (payload) {
              usedExtractionBackend = true;
              if (payload.deckTitle && !deckTitle) deckTitle = payload.deckTitle;
              var payloadSlides = Array.isArray(payload.slides) ? payload.slides : [];
              imported.push.apply(imported, payloadSlides);
              var expectedCount = payload && payload.source ? Number(payload.source.pageCount || payload.source.slideCount || 0) : 0;
              if (expectedCount && payloadSlides.length < expectedCount) {
                const msg = 'Extraction backend returned only ' + payloadSlides.length + ' of ' + expectedCount + ' pages/slides. This usually means the frontend is still pointing to an old backend revision or the extraction response was too large. Check /health and redeploy Stage 41J or newer.';
                if(payloadSlides.length <= 1 && expectedCount > 1) throw new Error(msg);
                warnings.push(msg);
              }
              if (Array.isArray(payload.warnings)) warnings.push.apply(warnings, payload.warnings);
            }).catch(function (err) {
              throw new Error('Could not extract ' + (file.name || 'presentation') + ' with the Lumina extraction backend. ' + (err && err.message ? err.message : ''));
            });
          }
          if (/\.pdf$/i.test(lower) || file.type === 'application/pdf') {
            return readFileAsDataUrl(file).then(function (dataUrl) { imported.push(makeReferencePdfSlide(dataUrl, file.name)); });
          }
          return Promise.reject(new Error('PPT/PPTX import requires the extraction backend. Enable it and set the backend endpoint.'));
        }

        if ((file.type && file.type.indexOf('image/') === 0) || /\.(png|jpe?g|gif|webp|svg)$/i.test(lower)) {
          return readFileAsDataUrl(file).then(function (dataUrl) { imported.push(makeReferenceImageSlide(dataUrl, file.name)); });
        }
        return file.text().then(function (text) {
          if (/(\.md|\.markdown)$/i.test(lower)) imported.push.apply(imported, parseMarkdownToSlides(text));
          else if (/(\.tex|\.ltx)$/i.test(lower)) imported.push.apply(imported, parseBeamerToSlides(text));
          else if (/\.json$/i.test(lower)) imported.push.apply(imported, parseJsonOutlineToSlides(text));
          else imported.push.apply(imported, parsePowerPointTextToSlides(text));
        });
      });
    });
    return chain.then(function () {
      var importDeck = { deckTitle:deckTitle, slides:imported, theme:null, presentationOptions:null, aiReviewed:false };
      if (!usedExtractionBackend) return importDeck;
      return reviewExtractedSlidesWithAlternates(imported, deckTitle).then(function(reviewedSlides){
        imported = reviewedSlides;
        return maybeReviewImportedDeckWithAi(reviewedSlides, deckTitle);
      });
    }).then(function (importDeck) {
      imported = importDeck.slides || imported;
      deckTitle = importDeck.deckTitle || deckTitle;
      applyImportedSlides(imported, { mode:importModeValue(), deckTitle:deckTitle, theme:importDeck.theme, presentationOptions:importDeck.presentationOptions });
      if (warnings.length) showToast(warnings[0]);
    });
  }
  function loadDeckFromFile(file) {
    return file.text().then(function (text) {
      var payload;
      if (/\.json$/i.test(file.name) || String(text).trim().charAt(0) === '{') payload = JSON.parse(text);
      else {
        var match = text.match(/<script id=["']deck-source["'][^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i);
        if (!match) throw new Error('This file does not contain an editable deck-source block.');
        payload = JSON.parse(match[1]);
      }
      if (!payload || !Array.isArray(payload.slides)) throw new Error('Could not parse slides from this HTML file.');
      fields.deckTitle.value = payload.deckTitle || 'My HTML Presentation';
      if (payload.theme) applyThemeToForm(payload.theme);
      if (payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
      var nextSlides = payload.slides.map(normalizeSlide);
      setSlides(nextSlides);
      setActiveIndex(nextSlides.length ? 0 : -1);
      if (getActiveIndex() >= 0) applySlideToForm(getSlides()[0]); else clearForm(false);
      buildPreview();
      renderDeckList();
    });
  }
  function loadPresentationJsonFromFile(file) {
    return file.text().then(function (text) {
      var payload = JSON.parse(text);
      if (!payload || !Array.isArray(payload.slides)) throw new Error('This JSON file does not contain a presentation with a slides array.');
      fields.deckTitle.value = payload.deckTitle || 'My HTML Presentation';
      if (payload.theme) applyThemeToForm(payload.theme);
      if (payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
      var nextSlides = payload.slides.map(normalizeSlide);
      setSlides(nextSlides);
      setActiveIndex(nextSlides.length ? 0 : -1);
      if (getActiveIndex() >= 0) applySlideToForm(getSlides()[0]); else clearForm(false);
      buildPreview();
      renderDeckList();
    });
  }
  setTimeout(initExtractionFields, 0);
  var api = { importModeValue:importModeValue, applyImportedSlides:applyImportedSlides, importSelectedFiles:importSelectedFiles, loadDeckFromFile:loadDeckFromFile, loadPresentationJsonFromFile:loadPresentationJsonFromFile, extractPresentationFile:extractPresentationFile, maybeReviewImportedDeckWithAi:maybeReviewImportedDeckWithAi };
  try {
    global.__LUMINA_FILE_IO_API = api;
    global.__LUMINA_STAGE41T_FILE_IO_API = api;
    global.__LUMINA_STAGE41V_FILE_IO_API = api;
    global.LuminaStage41TFileIoApi = api;
    global.LuminaStage41VFileIoApi = api;
    global.__LUMINA_STAGE41V_FILE_IO_READY = { stage:'stage42d-displaymath-brackets-import-repair-20260510-1', ready:true, at:new Date().toISOString(), apiKeys:Object.keys(api) };
    global.__LUMINA_STAGE41T_FILE_IO_READY = global.__LUMINA_STAGE41V_FILE_IO_READY; global.__LUMINA_STAGE41S_FILE_IO_READY = global.__LUMINA_STAGE41V_FILE_IO_READY;
  } catch (_err) {}
  return api;
}

export default { createApi:createApi };
