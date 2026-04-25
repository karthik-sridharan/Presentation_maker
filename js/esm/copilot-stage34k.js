/* Stage 34N: Copilot core with deck-only dev prompt, reference-link web search, and stronger figure directives.
   Stage 34K filename retained for cache-compatible loader continuity.

   It receives a narrow dependency bridge from legacy-app-stage24c.js and keeps
   the main editor protected by the Stage 24C/34K guarded binder. */
function safeString(value){ return String(value == null ? '' : value); }
function noop(){ }
function createApi(deps){
  deps = deps || {};
  const classicCore = deps.classicCore || null;
  const classicCompat = !!deps.__classicCompat && !!classicCore;
  function maybeClassic(method, fallback){
    return function(){
      if(classicCompat && classicCore && typeof classicCore[method] === 'function'){
        return classicCore[method].apply(classicCore, arguments);
      }
      return fallback.apply(null, arguments);
    };
  }
  const copilotEls = deps.copilotEls || {};
  const COPILOT_API_KEY_STORAGE = deps.apiKeyStorage || 'html-presentation-generator-openai-api-key-v1';
  const COPILOT_SETTINGS_STORAGE = deps.settingsStorage || 'html-presentation-generator-copilot-settings-v1';
  const COPILOT_DEFAULT_ENDPOINT = deps.defaultEndpoint || 'https://api.openai.com/v1/responses';
  const COPILOT_DEV_PROMPT_FILE = deps.devPromptFile || 'prompts/dev.txt';
  const COPILOT_DECK_PROMPT_FILE = deps.deckPromptFile || 'prompts/deck.txt';
  const COPILOT_DEFAULT_DECK_PROMPT_PREFIX = [
    'Deck-level generation instructions:',
    'Treat these as deck-only developer instructions.',
    'Create a coherent complete presentation, not a loose collection of slides.',
    'Use a strong narrative arc: title/context, motivation, key ideas, details/examples, synthesis, and closing recap.',
    'Make slide titles specific and informative.',
    'When the user provides reference lecture notes, pasted excerpts, or URLs, follow that source structure closely instead of giving a generic topic overview.',
    'When the request or these instructions ask for figures, include explicit placeholder figure blocks with concrete figure descriptions, even if no image file is available.',
    'Use speaker notes to explain transitions, emphasis, and teaching guidance.',
    'Keep the deck editable: prefer normal text/panel blocks and avoid embedding large custom HTML unless explicitly requested.'
  ].join('\n');
  let deckPromptPrefixCache = null;
  const store = deps.localStorage || (typeof globalThis !== 'undefined' ? globalThis.localStorage : null);
  const fetchImpl = deps.fetch || (typeof globalThis !== 'undefined' ? globalThis.fetch : null);
  const showToast = typeof deps.showToast === 'function' ? deps.showToast : noop;
  const alertFn = typeof deps.alert === 'function' ? deps.alert : function(message){ if(typeof globalThis !== 'undefined' && globalThis.alert) globalThis.alert(message); };
  const fields = deps.fields || {};
  const normalizeSlide = typeof deps.normalizeSlide === 'function' ? deps.normalizeSlide : function(slide){ return Object.assign({ leftBlocks:[], rightBlocks:[] }, slide || {}); };
  const normalizeBlock = typeof deps.normalizeBlock === 'function' ? deps.normalizeBlock : function(block){ return Object.assign({ mode:'panel', title:'Block', content:'' }, block || {}); };
  const runtimeStatus = deps.copilotRuntimeStatus || { stage:'stage34n-20260425-1' };

  function updateCopilotRuntime(patch){
    if(typeof deps.updateRuntime === 'function') return deps.updateRuntime(Object.assign({ runtimeSource:'esm:js/esm/copilot-stage34k.js' }, patch || {}));
    Object.assign(runtimeStatus, { runtimeSource:'esm:js/esm/copilot-stage34k.js' }, patch || {});
    return runtimeStatus;
  }
  updateCopilotRuntime({ stage:'stage34n-20260425-1', lastRuntimeLoadedAt:new Date().toISOString(), devPromptFile:COPILOT_DEV_PROMPT_FILE, deckPromptFile:COPILOT_DECK_PROMPT_FILE, deckPromptAppliesTo:'deck-only' });

  function setCopilotStatus(message, isError=false){
    updateCopilotRuntime({ lastStatus: safeString(message), lastError: isError ? safeString(message) : runtimeStatus.lastError });
    if(copilotEls.status){
      copilotEls.status.textContent = message;
      copilotEls.status.style.color = isError ? '#ffb4b4' : '';
      copilotEls.status.style.borderColor = isError ? 'rgba(255,120,120,.35)' : '';
    }
  }
  function getStorageItem(key){ try{ return store ? store.getItem(key) : null; }catch(_){ return null; } }
  function setStorageItem(key, value){ try{ if(store) store.setItem(key, value); }catch(_){ } }
  function removeStorageItem(key){ try{ if(store) store.removeItem(key); }catch(_){ } }

  function isDefaultOpenAiEndpoint(endpoint){
    try{
      const host = new URL(endpoint || COPILOT_DEFAULT_ENDPOINT, deps.locationHref || (typeof location !== 'undefined' ? location.href : 'https://example.invalid/')).hostname;
      return /(^|\.)api\.openai\.com$/i.test(host);
    }catch(_){
      return false;
    }
  }
  function visibleKeyPrefix(key){
    const k = safeString(key).trim();
    if(!k) return '';
    return k.slice(0, Math.min(10, k.length)) + (k.length > 10 ? '…' : '');
  }
  function validateCopilotApiKey(key, endpoint, options={}){
    const k = safeString(key).trim();
    const usingOpenAI = isDefaultOpenAiEndpoint(endpoint);
    if(k && /^https?:\/\//i.test(k)){
      throw new Error('The API key field contains a URL. Paste the secret key value itself, usually starting with sk-proj- or sk-, not the API keys page link.');
    }
    if(usingOpenAI && options.requireKey && !k){
      throw new Error('Enter an OpenAI API key, or change the endpoint to your own backend proxy that injects credentials server-side.');
    }
    if(usingOpenAI && k && !/^sk-/i.test(k)){
      throw new Error('This does not look like an OpenAI API key. OpenAI keys usually start with sk-proj- or sk-. Current value begins with: ' + visibleKeyPrefix(k));
    }
    if(!usingOpenAI && k && /^sk-/i.test(k)){
      return 'You are using a custom endpoint with a key that looks like a direct OpenAI key. For production, prefer keeping the key only on your backend.';
    }
    if(usingOpenAI && k){
      return 'Looks like an OpenAI key. For public deployment, move requests through a backend proxy instead of storing the key in the browser.';
    }
    return '';
  }
  function updateCopilotKeyWarning(){
    const endpoint = (copilotEls.endpoint?.value || '').trim() || COPILOT_DEFAULT_ENDPOINT;
    const key = (copilotEls.apiKey?.value || '').trim();
    let warning = '';
    let isError = false;
    try{ warning = validateCopilotApiKey(key, endpoint, { requireKey:false }) || ''; }
    catch(err){ warning = err.message || String(err); isError = true; }
    updateCopilotRuntime({ lastValidationWarning: warning });
    if(copilotEls.keyWarning){
      copilotEls.keyWarning.textContent = warning;
      copilotEls.keyWarning.style.display = warning ? '' : 'none';
      copilotEls.keyWarning.style.color = isError ? '#ffb4b4' : '#ffd6a0';
      copilotEls.keyWarning.style.borderLeftColor = isError ? 'rgba(255,120,120,.8)' : 'rgba(255,214,160,.8)';
    }
    return !isError;
  }
  function friendlyCopilotHttpError(status, message){
    const raw = safeString(message).trim();
    if(status === 401) return 'OpenAI rejected the API key. Check that you pasted the secret key value itself, not the API keys page URL, and that the key has not been revoked. Details: ' + raw;
    if(status === 403) return 'The request was forbidden. Check project permissions, model access, endpoint, and whether your key is allowed to use this API. Details: ' + raw;
    if(status === 404) return 'The endpoint or model was not found. Check the endpoint URL and model name. Details: ' + raw;
    if(status === 429) return 'OpenAI returned a rate limit/quota error. Check billing, project limits, or wait and retry. Details: ' + raw;
    if(status >= 500) return 'The API service returned a server error. Retry later or check the endpoint/backend logs. Details: ' + raw;
    return raw || ('Copilot request failed with status ' + status);
  }
  function recordCopilotError(err){
    const msg = (err && err.message) || safeString(err || 'Copilot failed.');
    updateCopilotRuntime({ lastError: msg, lastErrorAt: new Date().toISOString(), requestInFlight:false });
    return msg;
  }
  function recordCopilotSuccess(summary){
    updateCopilotRuntime({ lastSuccessAt: new Date().toISOString(), lastStatus: summary || 'success', lastError:'', requestInFlight:false });
  }

  function loadCopilotSettings(){
    try{
      const raw = getStorageItem(COPILOT_SETTINGS_STORAGE);
      const s = raw ? JSON.parse(raw) : {};
      if(copilotEls.model && s.model) copilotEls.model.value = s.model;
      if(copilotEls.endpoint && s.endpoint) copilotEls.endpoint.value = s.endpoint;
      if(copilotEls.tone && s.tone) copilotEls.tone.value = s.tone;
      if(copilotEls.webSearch && typeof s.webSearch === 'boolean') copilotEls.webSearch.checked = s.webSearch;
      const key = getStorageItem(COPILOT_API_KEY_STORAGE);
      if(copilotEls.apiKey && key) copilotEls.apiKey.value = key;
      updateCopilotKeyWarning();
    }catch(err){ console.warn('Could not load Copilot settings', err); updateCopilotKeyWarning(); }
  }
  function saveCopilotSettings(saveKey=false){
    try{
      const s = {
        model: copilotEls.model?.value || 'gpt-4.1-mini',
        endpoint: copilotEls.endpoint?.value || COPILOT_DEFAULT_ENDPOINT,
        tone: copilotEls.tone?.value || 'clear and concise'
      };
      const key = (copilotEls.apiKey?.value || '').trim();
      validateCopilotApiKey(key, s.endpoint, { requireKey:false });
      setStorageItem(COPILOT_SETTINGS_STORAGE, JSON.stringify(s));
      if(saveKey && copilotEls.apiKey){
        if(key) setStorageItem(COPILOT_API_KEY_STORAGE, key);
        else removeStorageItem(COPILOT_API_KEY_STORAGE);
        showToast(key ? 'Saved Copilot key locally.' : 'Cleared saved Copilot key.');
      }
      updateCopilotKeyWarning();
      return true;
    }catch(err){
      const msg = recordCopilotError(err);
      console.warn('Could not save Copilot settings', err);
      setCopilotStatus(msg, true);
      updateCopilotKeyWarning();
      showToast('Copilot settings need attention.');
      return false;
    }
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
      'Do not invent citations, URLs, or image files. Use placeholder blocks when a figure is needed.',
      'If the user asks to follow lecture notes or a reference link, do not answer as a generic topic summary; organize the deck around the referenced material and say in the summary when reference content could not be accessed.',
      'If the instructions mention figures, diagrams, plots, pictures, or visuals, include placeholder blocks titled Figure or Diagram with concrete descriptions of what should be drawn.'
    ].join('\n');
  }
  function compactDeckForCopilot(){
    const deck = typeof deps.currentDeckData === 'function' ? deps.currentDeckData() : {};
    const slides = Array.isArray(deck.slides) ? deck.slides : [];
    return {
      deckTitle: deck.deckTitle,
      theme: deck.theme,
      slideCount: slides.length,
      slides: slides.slice(0, 20).map((s, idx)=>({
        index: idx + 1,
        slideType: s.slideType,
        title: s.title,
        kicker: s.kicker,
        lede: s.lede,
        leftBlocks: (s.leftBlocks || []).map(b=>({ mode:b.mode, title:b.title, content:safeString(b.content).slice(0, 700) })),
        rightBlocks: (s.rightBlocks || []).map(b=>({ mode:b.mode, title:b.title, content:safeString(b.content).slice(0, 700) }))
      }))
    };
  }
  function cacheBustedPromptUrl(fileName){
    const base = safeString(fileName || '').trim();
    const version = safeString(deps.stage || runtimeStatus.stage || 'stage34n-20260425-1');
    if(!base || /^data:/i.test(base)) return base;
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'v=' + encodeURIComponent(version);
  }
  async function fetchPromptFile(fileName){
    const name = safeString(fileName || '').trim();
    if(!name || typeof fetchImpl !== 'function') return { text:'', source:name, status: typeof fetchImpl === 'function' ? 'empty-file-name' : 'fetch-unavailable' };
    try{
      const res = await fetchImpl(cacheBustedPromptUrl(name), { cache:'no-store' });
      if(res && res.ok){
        const text = safeString(await res.text()).trim();
        return { text, source:name, status: text ? 'loaded-file' : 'blank-file' };
      }
      return { text:'', source:name, status: res ? ('file-http-' + res.status) : 'file-no-response' };
    }catch(err){
      return { text:'', source:name, status:'file-load-error', error:(err && err.message) || safeString(err) };
    }
  }
  async function loadDeckPromptPrefix(){
    if(deckPromptPrefixCache !== null) return deckPromptPrefixCache;
    const attempts = [];
    const dev = await fetchPromptFile(COPILOT_DEV_PROMPT_FILE);
    attempts.push(dev);
    let chosen = dev;
    if(!chosen.text){
      const deck = await fetchPromptFile(COPILOT_DECK_PROMPT_FILE);
      attempts.push(deck);
      if(deck.text) chosen = deck;
    }
    const lastError = attempts.map(a=>a.error).filter(Boolean).join('\n');
    if(lastError) updateCopilotRuntime({ deckPromptLastError:lastError });
    deckPromptPrefixCache = chosen.text || COPILOT_DEFAULT_DECK_PROMPT_PREFIX;
    const status = chosen.text ? chosen.status : attempts.map(a=>a.source + ':' + a.status).join(';') + ';used-builtin-default';
    const source = chosen.text ? chosen.source : 'builtin-default';
    updateCopilotRuntime({
      devPromptFile: COPILOT_DEV_PROMPT_FILE,
      deckPromptFile: COPILOT_DECK_PROMPT_FILE,
      deckPromptSource: source,
      deckPromptStatus: status,
      deckPromptAttempts: attempts.map(a=>({ source:a.source, status:a.status })),
      deckPromptAppliesTo: 'deck-only',
      deckPromptLoadedAt: new Date().toISOString()
    });
    return deckPromptPrefixCache;
  }
  function textHasUrl(text){ return /https?:\/\/\S+/i.test(safeString(text)); }
  function shouldUseOpenAiWebSearch(kind, endpoint, promptText, deckPromptPrefix){
    const enabled = !!(copilotEls.webSearch && copilotEls.webSearch.checked);
    if(kind !== 'deck') return { use:false, status:'deck-only' };
    if(!enabled) return { use:false, status:'disabled' };
    if(!isDefaultOpenAiEndpoint(endpoint)) return { use:false, status:'custom-endpoint-disabled' };
    if(!textHasUrl(promptText + '\n' + deckPromptPrefix)) return { use:false, status:'no-url-detected' };
    return { use:true, status:'enabled-url-detected' };
  }
  async function buildCopilotUserPrompt(kind){
    const prompt = (copilotEls.prompt?.value || '').trim();
    if(!prompt) throw new Error('Tell Copilot what to create first.');
    const count = Math.max(1, Math.min(30, Number(copilotEls.slideCount?.value || 1)));
    const tone = copilotEls.tone?.value || 'clear and concise';
    const mode = kind === 'deck' ? 'Create a complete deck.' : 'Create exactly one slide.';
    const parts = [mode];
    parts.push(
      'User request: ' + prompt,
      'Target slide count: ' + (kind === 'deck' ? count : 1),
      'Tone/style: ' + tone,
      'Current deck context JSON:',
      JSON.stringify(compactDeckForCopilot(), null, 2),
      'Important: output JSON with deckTitle, summary, and slides. For single-slide requests, slides must contain exactly one slide.'
    );
    return parts.join('\n\n');
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
    if(typeof fetchImpl !== 'function') throw new Error('Fetch is not available in this browser, so Copilot cannot call the API endpoint.');
    saveCopilotSettings(false);
    const endpoint = (copilotEls.endpoint?.value || '').trim() || COPILOT_DEFAULT_ENDPOINT;
    const apiKey = (copilotEls.apiKey?.value || '').trim();
    const model = (copilotEls.model?.value || '').trim() || 'gpt-4.1-mini';
    validateCopilotApiKey(apiKey, endpoint, { requireKey: isDefaultOpenAiEndpoint(endpoint) });
    updateCopilotKeyWarning();
    const headers = { 'Content-Type':'application/json' };
    if(apiKey) headers.Authorization = 'Bearer ' + apiKey;
    const deckPromptPrefix = kind === 'deck' ? await loadDeckPromptPrefix() : '';
    const userPrompt = await buildCopilotUserPrompt(kind);
    let systemContent = copilotSystemPrompt();
    if(kind === 'deck' && deckPromptPrefix){
      systemContent += '\n\nDeck-only developer instructions from ' + (runtimeStatus.deckPromptSource || COPILOT_DEV_PROMPT_FILE || COPILOT_DECK_PROMPT_FILE) + ':\n' + deckPromptPrefix;
    }
    const webSearch = shouldUseOpenAiWebSearch(kind, endpoint, userPrompt, deckPromptPrefix);
    const body = {
      model,
      input:[
        { role:'system', content: systemContent },
        { role:'user', content: userPrompt }
      ],
      text:{ format:{ type:'json_schema', name:'presentation_deck', schema:copilotDeckSchema(), strict:true } },
      store:false
    };
    if(webSearch.use){
      body.tools = [{ type:'web_search' }];
      body.tool_choice = 'auto';
    }
    updateCopilotRuntime({ webSearchEnabled: !!webSearch.use, webSearchStatus: webSearch.status });
    setCopilotStatus(kind === 'deck' ? 'Generating deck…' : 'Generating slide…');
    updateCopilotRuntime({ requestInFlight:true, requestCount: Number(runtimeStatus.requestCount || 0) + 1, lastError:'' });
    const res = await fetchImpl(endpoint, { method:'POST', headers, body:JSON.stringify(body) });
    const raw = await res.text();
    let data;
    try{ data = raw ? JSON.parse(raw) : {}; }catch(err){ data = { raw }; }
    if(!res.ok){
      const message = data?.error?.message || raw || ('Copilot request failed with status ' + res.status);
      throw new Error(friendlyCopilotHttpError(res.status, message));
    }
    const output = extractResponsesOutputText(data);
    if(!output) throw new Error('Copilot returned an empty response.');
    let parsed;
    try{ parsed = JSON.parse(output); }
    catch(err){ throw new Error('Copilot returned text that was not valid JSON: ' + output.slice(0, 300)); }
    const normalized = normalizeCopilotDeck(parsed, kind);
    if(copilotEls.resultJson) copilotEls.resultJson.value = JSON.stringify(normalized, null, 2);
    const successMessage = (normalized.summary || 'Copilot generated slides.') + ' Ready to apply.';
    setCopilotStatus(successMessage);
    recordCopilotSuccess(successMessage);
    return normalized;
  }
  function normalizeCopilotDeck(deck, kind='deck'){
    const rawSlides = Array.isArray(deck?.slides) ? deck.slides : [];
    if(!rawSlides.length) throw new Error('Copilot did not return any slides.');
    const normalizedSlides = rawSlides.map(normalizeCopilotSlide);
    return {
      deckTitle: safeString(deck?.deckTitle || fields.deckTitle?.value || 'Generated presentation'),
      summary: safeString(deck?.summary || ''),
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
  function getSlides(){ return typeof deps.getSlides === 'function' ? deps.getSlides() : []; }
  function setSlides(value){ if(typeof deps.setSlides === 'function') deps.setSlides(value); }
  function getActiveIndex(){ return typeof deps.getActiveIndex === 'function' ? deps.getActiveIndex() : -1; }
  function setActiveIndex(value){ if(typeof deps.setActiveIndex === 'function') deps.setActiveIndex(value); }
  function applyCopilotFirstSlide(deck){
    const payload = deck || parseCopilotResult();
    const slide = payload.slides[0];
    if(!slide) throw new Error('No slide found in Copilot result.');
    if(typeof deps.applySlideToForm === 'function') deps.applySlideToForm(slide);
    const currentSlides = getSlides().slice();
    const idx = getActiveIndex();
    if(idx >= 0 && idx < currentSlides.length){
      currentSlides[idx] = slide;
      setSlides(currentSlides);
    }
    if(typeof deps.buildPreview === 'function') deps.buildPreview();
    if(typeof deps.renderDeckList === 'function') deps.renderDeckList();
    if(typeof deps.scheduleAutosave === 'function') deps.scheduleAutosave('Autosaved after Copilot slide apply.');
    showToast('Applied Copilot slide.');
  }
  function appendCopilotSlides(deck){
    const payload = deck || parseCopilotResult();
    const newSlides = payload.slides.map(normalizeCopilotSlide);
    if(!newSlides.length) throw new Error('No slides found in Copilot result.');
    const combined = (getSlides().length ? getSlides().slice() : []).concat(newSlides);
    setSlides(combined);
    setActiveIndex(combined.length - newSlides.length);
    if(typeof deps.applySlideToForm === 'function') deps.applySlideToForm(combined[getActiveIndex()]);
    if(typeof deps.buildPreview === 'function') deps.buildPreview();
    if(typeof deps.renderDeckList === 'function') deps.renderDeckList();
    if(typeof deps.scheduleAutosave === 'function') deps.scheduleAutosave('Autosaved after appending Copilot slides.');
    showToast('Appended Copilot slides.');
  }
  function replaceDeckWithCopilot(deck){
    const payload = deck || parseCopilotResult();
    const newSlides = payload.slides.map(normalizeCopilotSlide);
    if(!newSlides.length) throw new Error('No slides found in Copilot result.');
    if(fields.deckTitle) fields.deckTitle.value = payload.deckTitle || fields.deckTitle.value;
    setSlides(newSlides);
    setActiveIndex(0);
    if(typeof deps.applySlideToForm === 'function') deps.applySlideToForm(newSlides[0]);
    if(typeof deps.buildPreview === 'function') deps.buildPreview();
    if(typeof deps.renderDeckList === 'function') deps.renderDeckList();
    if(typeof deps.persistAutosaveNow === 'function') deps.persistAutosaveNow('Autosaved after replacing deck with Copilot result.');
    showToast('Replaced deck with Copilot result.');
  }
  async function generateCopilotSlide(applyMode){
    try{
      const deck = await callCopilot('slide');
      if(applyMode === 'append') appendCopilotSlides(deck);
      else applyCopilotFirstSlide(deck);
    }catch(err){
      console.error(err);
      const msg = recordCopilotError(err);
      setCopilotStatus(msg, true);
      alertFn(msg);
    }
  }
  async function generateCopilotDeck(){
    try{
      const deck = await callCopilot('deck');
      if((copilotEls.mode?.value || 'append') === 'replace') replaceDeckWithCopilot(deck);
      else appendCopilotSlides(deck);
    }catch(err){
      console.error(err);
      const msg = recordCopilotError(err);
      setCopilotStatus(msg, true);
      alertFn(msg);
    }
  }

  return Object.freeze({
    __stage:'stage34n-20260425-1',
    __source:'esm:js/esm/copilot-stage34k.js',
    __classicCompat: classicCompat,
    setCopilotStatus: maybeClassic('setCopilotStatus', setCopilotStatus),
    loadCopilotSettings: maybeClassic('loadCopilotSettings', loadCopilotSettings),
    saveCopilotSettings: maybeClassic('saveCopilotSettings', saveCopilotSettings),
    validateCopilotApiKey: maybeClassic('validateCopilotApiKey', validateCopilotApiKey),
    updateCopilotKeyWarning: maybeClassic('updateCopilotKeyWarning', updateCopilotKeyWarning),
    friendlyCopilotHttpError: maybeClassic('friendlyCopilotHttpError', friendlyCopilotHttpError),
    recordCopilotError: maybeClassic('recordCopilotError', recordCopilotError),
    recordCopilotSuccess: maybeClassic('recordCopilotSuccess', recordCopilotSuccess),
    copilotRuntimeStatus: runtimeStatus,
    copilotBlockSchema: maybeClassic('copilotBlockSchema', copilotBlockSchema),
    copilotSlideSchema: maybeClassic('copilotSlideSchema', copilotSlideSchema),
    copilotDeckSchema: maybeClassic('copilotDeckSchema', copilotDeckSchema),
    copilotSystemPrompt: maybeClassic('copilotSystemPrompt', copilotSystemPrompt),
    compactDeckForCopilot: maybeClassic('compactDeckForCopilot', compactDeckForCopilot),
    buildCopilotUserPrompt: maybeClassic('buildCopilotUserPrompt', buildCopilotUserPrompt),
    loadDeckPromptPrefix: maybeClassic('loadDeckPromptPrefix', loadDeckPromptPrefix),
    shouldUseOpenAiWebSearch: maybeClassic('shouldUseOpenAiWebSearch', shouldUseOpenAiWebSearch),
    extractResponsesOutputText: maybeClassic('extractResponsesOutputText', extractResponsesOutputText),
    callCopilot: maybeClassic('callCopilot', callCopilot),
    normalizeCopilotDeck: maybeClassic('normalizeCopilotDeck', normalizeCopilotDeck),
    normalizeCopilotSlide: maybeClassic('normalizeCopilotSlide', normalizeCopilotSlide),
    parseCopilotResult: maybeClassic('parseCopilotResult', parseCopilotResult),
    applyCopilotFirstSlide: maybeClassic('applyCopilotFirstSlide', applyCopilotFirstSlide),
    appendCopilotSlides: maybeClassic('appendCopilotSlides', appendCopilotSlides),
    replaceDeckWithCopilot: maybeClassic('replaceDeckWithCopilot', replaceDeckWithCopilot),
    generateCopilotSlide: maybeClassic('generateCopilotSlide', generateCopilotSlide),
    generateCopilotDeck: maybeClassic('generateCopilotDeck', generateCopilotDeck)
  });
}

export { createApi };
export default { createApi };
