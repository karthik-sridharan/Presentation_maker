/* Stage 21 migration note:
   Copilot/OpenAI helper logic lives here.
   This is intentionally a classic browser script, not an ES module yet.
*/
(function(){
  function createApi(deps){
    const copilotEls = deps.copilotEls;
    const COPILOT_API_KEY_STORAGE = deps.apiKeyStorage || 'html-presentation-generator-openai-api-key-v1';
    const COPILOT_SETTINGS_STORAGE = deps.settingsStorage || 'html-presentation-generator-copilot-settings-v1';
    const showToast = deps.showToast;
    const fields = deps.fields;
    const normalizeSlide = deps.normalizeSlide;
    const normalizeBlock = deps.normalizeBlock;

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
      const deck = deps.currentDeckData();
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
      deps.applySlideToForm(slide);
      const currentSlides = deps.getSlides();
      const idx = deps.getActiveIndex();
      if(idx >= 0 && idx < currentSlides.length){
        currentSlides[idx] = slide;
        deps.setSlides(currentSlides);
      }
      deps.buildPreview();
      deps.renderDeckList();
      deps.scheduleAutosave('Autosaved after Copilot slide apply.');
      showToast('Applied Copilot slide.');
    }
    function appendCopilotSlides(deck){
      const payload = deck || parseCopilotResult();
      const newSlides = payload.slides.map(normalizeCopilotSlide);
      if(!newSlides.length) throw new Error('No slides found in Copilot result.');
      const combined = (deps.getSlides().length ? deps.getSlides() : []).concat(newSlides);
      deps.setSlides(combined);
      deps.setActiveIndex(combined.length - newSlides.length);
      deps.applySlideToForm(combined[deps.getActiveIndex()]);
      deps.buildPreview();
      deps.renderDeckList();
      deps.scheduleAutosave('Autosaved after appending Copilot slides.');
      showToast('Appended Copilot slides.');
    }
    function replaceDeckWithCopilot(deck){
      const payload = deck || parseCopilotResult();
      const newSlides = payload.slides.map(normalizeCopilotSlide);
      if(!newSlides.length) throw new Error('No slides found in Copilot result.');
      fields.deckTitle.value = payload.deckTitle || fields.deckTitle.value;
      deps.setSlides(newSlides);
      deps.setActiveIndex(0);
      deps.applySlideToForm(newSlides[0]);
      deps.buildPreview();
      deps.renderDeckList();
      deps.persistAutosaveNow('Autosaved after replacing deck with Copilot result.');
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
    return {
      setCopilotStatus,
      loadCopilotSettings,
      saveCopilotSettings,
      copilotBlockSchema,
      copilotSlideSchema,
      copilotDeckSchema,
      copilotSystemPrompt,
      compactDeckForCopilot,
      buildCopilotUserPrompt,
      extractResponsesOutputText,
      normalizeCopilotDeck,
      normalizeCopilotSlide,
      parseCopilotResult,
      applyCopilotFirstSlide,
      appendCopilotSlides,
      replaceDeckWithCopilot,
      generateCopilotSlide,
      generateCopilotDeck
    };
  }
  window.LuminaCopilot = { createApi };
})();
