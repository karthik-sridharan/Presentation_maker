/* Stage 41N file/import workflow helpers.
   Classic browser script; exposes window.LuminaFileIo.
   Adds backend extraction plus optional AI Copilot cleanup for PDF/PPTX/PPT imports.
*/
(function(global){
  'use strict';

  function createApi(deps){
    deps = deps || {};
    const {
      clone,
      normalizeSlide,
      fields,
      getDocument,
      getSlides,
      setSlides,
      getActiveIndex,
      setActiveIndex,
      makeReferenceImageSlide,
      makeReferencePdfSlide,
      parseMarkdownToSlides,
      parseBeamerToSlides,
      parseJsonOutlineToSlides,
      parsePowerPointTextToSlides,
      syncPreviewFiguresToDraft,
      saveCurrentBlockToDraft,
      saveCurrentSlideToDeck,
      applySlideToForm,
      clearForm,
      buildPreview,
      renderDeckList,
      scheduleAutosave,
      showToast,
      applyThemeToForm,
      applyPresentationOptions
    } = deps;

    const required = {
      clone,
      normalizeSlide,
      fields,
      getSlides,
      setSlides,
      getActiveIndex,
      setActiveIndex,
      makeReferenceImageSlide,
      makeReferencePdfSlide,
      parseMarkdownToSlides,
      parseBeamerToSlides,
      parseJsonOutlineToSlides,
      parsePowerPointTextToSlides,
      syncPreviewFiguresToDraft,
      saveCurrentBlockToDraft,
      saveCurrentSlideToDeck,
      applySlideToForm,
      clearForm,
      buildPreview,
      renderDeckList,
      scheduleAutosave,
      showToast,
      applyThemeToForm,
      applyPresentationOptions
    };
    Object.keys(required).forEach(name=>{
      if(typeof required[name] === 'undefined' || required[name] === null){
        throw new Error('LuminaFileIo missing dependency: ' + name);
      }
    });

    const STORAGE_ENDPOINT = 'luminaExtractionEndpoint';
    const STORAGE_TOKEN = 'luminaExtractionToken';
    const STORAGE_ENABLED = 'luminaExtractionEnabled';
    const STORAGE_AI_ENABLED = 'luminaImportAiReviewEnabled';
    const STORAGE_AI_ENDPOINT = 'luminaImportAiEndpoint';
    const STORAGE_AI_TOKEN = 'luminaImportAiToken';
    const STORAGE_AI_PROVIDER = 'luminaImportAiProvider';
    const STORAGE_AI_MODEL = 'luminaImportAiModel';
    const DEFAULT_MAX_IMPORT_PAGES = 80;
    const DEFAULT_MAX_IMPORT_SLIDES = 160;

    function doc(){ return typeof getDocument === 'function' ? getDocument() : global.document; }
    function readFileAsDataUrl(file){
      return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read file: ' + (file && file.name ? file.name : 'unknown file')));
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(file);
      });
    }
    function storageGet(key, fallback=''){
      try{ return global.localStorage ? (global.localStorage.getItem(key) || fallback || '') : (fallback || ''); }
      catch(_err){ return fallback || ''; }
    }
    function storageSet(key, value){
      try{ if(global.localStorage) global.localStorage.setItem(key, String(value || '')); }
      catch(_err){}
    }
    function deriveAiEndpointFromExtractionEndpoint(endpoint){
      const value = String(endpoint || '').trim();
      if(!value) return '/api/lumina/ai';
      if(/\/api\/lumina\/extract\/?$/i.test(value)) return value.replace(/\/api\/lumina\/extract\/?$/i, '/api/lumina/ai');
      return '/api/lumina/ai';
    }
    function initExtractionFields(){
      const d = doc();
      const endpoint = d.getElementById('extractionEndpointInput');
      const token = d.getElementById('extractionTokenInput');
      const enabled = d.getElementById('useExtractionBackendCheckbox');
      const aiEnabled = d.getElementById('aiReviewAfterImportCheckbox');
      const aiEndpoint = d.getElementById('importAiEndpointInput');
      const aiToken = d.getElementById('importAiTokenInput');
      const aiProvider = d.getElementById('importAiProviderSelect');
      const aiModel = d.getElementById('importAiModelInput');
      if(endpoint && !endpoint.value) endpoint.value = storageGet(STORAGE_ENDPOINT, '/api/lumina/extract');
      if(token && !token.value) token.value = storageGet(STORAGE_TOKEN, '');
      if(enabled && !enabled.__luminaExtractionInit){
        enabled.checked = storageGet(STORAGE_ENABLED, 'true') !== 'false';
        enabled.__luminaExtractionInit = true;
      }
      if(aiEnabled && !aiEnabled.__luminaAiReviewInit){
        aiEnabled.checked = storageGet(STORAGE_AI_ENABLED, 'true') !== 'false';
        aiEnabled.__luminaAiReviewInit = true;
      }
      const derivedAiEndpoint = deriveAiEndpointFromExtractionEndpoint(endpoint && endpoint.value ? endpoint.value : storageGet(STORAGE_ENDPOINT, '/api/lumina/extract'));
      if(aiEndpoint){
        const savedAiEndpoint = storageGet(STORAGE_AI_ENDPOINT, '');
        const currentAiEndpoint = String(aiEndpoint.value || '').trim();
        if(!currentAiEndpoint || (currentAiEndpoint === '/api/lumina/ai' && derivedAiEndpoint !== '/api/lumina/ai')){
          aiEndpoint.value = (savedAiEndpoint && !(savedAiEndpoint === '/api/lumina/ai' && derivedAiEndpoint !== '/api/lumina/ai')) ? savedAiEndpoint : derivedAiEndpoint;
        }
      }
      if(aiToken && !aiToken.value) aiToken.value = storageGet(STORAGE_AI_TOKEN, token && token.value ? token.value : storageGet(STORAGE_TOKEN, ''));
      if(aiProvider && !aiProvider.__luminaAiProviderInit){
        aiProvider.value = storageGet(STORAGE_AI_PROVIDER, aiProvider.value || 'openai') || 'openai';
        aiProvider.__luminaAiProviderInit = true;
      }
      if(aiModel && !aiModel.value) aiModel.value = storageGet(STORAGE_AI_MODEL, 'gpt-4.1-mini');
    }
    function importModeValue(){
      return (doc().getElementById('importModeSelect')?.value || 'append') === 'replace' ? 'replace' : 'append';
    }
    function extractionBackendEnabled(){
      initExtractionFields();
      const el = doc().getElementById('useExtractionBackendCheckbox');
      if(!el) return true;
      storageSet(STORAGE_ENABLED, el.checked ? 'true' : 'false');
      return !!el.checked;
    }
    function extractionEndpointValue(){
      initExtractionFields();
      const el = doc().getElementById('extractionEndpointInput');
      const value = String((el && el.value) || storageGet(STORAGE_ENDPOINT, '/api/lumina/extract') || '').trim();
      if(value) storageSet(STORAGE_ENDPOINT, value);
      return value;
    }
    function extractionTokenValue(){
      initExtractionFields();
      const el = doc().getElementById('extractionTokenInput');
      const value = String((el && el.value) || storageGet(STORAGE_TOKEN, '') || '').trim();
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
    function aiReviewEndpointValue(){
      initExtractionFields();
      const el = doc().getElementById('importAiEndpointInput');
      const fallback = deriveAiEndpointFromExtractionEndpoint(extractionEndpointValue());
      const value = String((el && el.value) || storageGet(STORAGE_AI_ENDPOINT, fallback) || fallback || '').trim();
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
    function trunc(text, n){
      const s = String(text || '');
      return s.length > n ? s.slice(0, n) + '…' : s;
    }
    function compactBlockForAi(block){
      const b = block || {};
      const raw = stripHugeInlineAssets(b.content || '');
      return {
        mode: String(b.mode || 'panel'),
        title: String(b.title || ''),
        content: trunc(raw, 900),
        hasLayout: !!b.layout,
        role: b.importRole || '',
        fontSize: b.style && b.style.fontSize || '',
        fontColor: b.style && b.style.fontColor || ''
      };
    }
    function compactSlidesForAi(slides){
      return (slides || []).map((slide, idx)=>{
        const left = Array.isArray(slide.leftBlocks) ? slide.leftBlocks : [];
        const right = Array.isArray(slide.rightBlocks) ? slide.rightBlocks : [];
        const blocks = left.concat(right).slice(0, 18).map(compactBlockForAi);
        return {
          index: idx + 1,
          slideType: slide.slideType || 'single',
          title: String(slide.title || ''),
          kicker: String(slide.kicker || ''),
          lede: trunc(slide.lede || '', 500),
          blocks,
          notes: trunc((slide.notesTitle ? slide.notesTitle + ': ' : '') + (slide.notesBody || ''), 500)
        };
      });
    }
    function aiDeckSystemPrompt(){
      return String.raw`You are cleaning a raw Lumina Presentation Maker deck extracted from PDF/PPT/PPTX.

Your job is NOT to preserve the extracted deck literally. Your job is to produce a clean, teachable, editable Lumina JSON deck.

Input:
- raw Lumina JSON deck from slide extraction
- extracted text/image blocks may be fragmented, duplicated, malformed, or poorly positioned
- math may have OCR/PDF glyph errors

Output:
- Return ONLY valid JSON.
- Do not wrap in markdown.
- Do not include explanations outside the JSON.
- The output must be a complete Lumina deck object with deckTitle, theme, presentationOptions, and slides.

Core cleanup requirements:
1. Rebuild the deck pedagogically.
   - Combine fragmented PDF text blocks into coherent slides.
   - Remove junk PDF artifacts, base64 page backgrounds, malformed glyph fragments, and repeated imported fragments.
   - Keep the lecture's original conceptual sequence.
   - Prefer clean editable text blocks over many tiny positioned import-text fragments.
   - Use 16:9 slide-friendly layouts.

2. Fix all math.
   - All LaTeX in JSON strings MUST escape every backslash.
   - Correct examples:
     "\\(X \\in \\mathbb{R}^{n \\times d}\\)"
     "\\(f_w(X) \\in \\{\\text{positive},\\text{negative}\\}\\)"
     "\\(QK^\\top\\)"
     "\\(\\operatorname{softmax}(QK^\\top)V\\)"
     "\\(w_{\\text{filter}} \\in \\mathbb{R}^{r \\times d}\\)"
   - Never output malformed math such as:
     "n imes d", "ext{text}", "op", "2 R", "⇥", "ﬁlter", "</latexit>", or random base64/LaTeX extraction debris.
   - Before finalizing, scan every text field and repair these errors:
     " imes" -> "\\times"
     " ext{" -> "\\text{"
     " op" when used as transpose -> "\\top"
     "2 R" when used as membership -> "\\in \\mathbb{R}"
     "⇥" -> "\\times"
     "ﬁ" -> "fi"

3. Use custom HTML/SVG animations only when they clarify a concept better than static text.
   Good candidates:
   - tokenization and embedding
   - pooling
   - convolutional window scanning
   - attention as fuzzy lookup
   - self-attention matrix computation
   - multi-head attention
   - residual connection
   - layer normalization
   - transformer block

4. Animation correctness rules.
   - Do not merely decorate diagrams with motion; animate the mathematical operation being explained.
   - Tokenization animation: show sentence -> tokens -> embedding vectors.
   - Pooling animation: show many token vectors collapsing into one pooled vector.
   - Convolution animation: show a window moving across adjacent tokens.
   - Attention animation: show query-to-key scores, softmax weights, and weighted sum of values.
   - Self-attention matrix animation: show Q, K, V, QK^T, row-wise softmax, then multiply by V.
   - Multi-head attention: show several heads in parallel, then concat/project.
   - Residual animation: show both the layer path and skip path meeting at addition.
   - LayerNorm animation: show unequal coordinates normalized to centered/scaled coordinates.
   - Transformer block animation: show attention, add+norm, FFN, add+norm.

5. Custom HTML/SVG block rules.
   - Use mode: "custom".
   - The custom block content must be a complete iframe-safe HTML document.
   - Use only inline HTML, CSS, and SVG.
   - Do NOT use external scripts, external fonts, external images, remote URLs, iframes, canvas, or JavaScript unless absolutely necessary.
   - Prefer CSS-only SVG animations.
   - Do not use huge base64 images.
   - Use aria-label on the main SVG.
   - Keep all animation readable even if CSS animation is paused.
   - Use a 16:9 SVG viewBox such as "0 0 960 540" or "0 0 1000 560".
   - CSS should include:
     html, body { margin:0; width:100%; height:100%; overflow:hidden; background:#fff; }
     .stage { width:100%; height:100%; display:grid; place-items:center; padding:18px; box-sizing:border-box; }
     svg { width:100%; height:100%; max-width:100%; max-height:100%; }
   - Avoid body min-height:720px for two-column slides.
   - Avoid fixed custom animation heights like height:720px unless the slide is a full single-slide animation.
   - If the animation needs a large full-slide area, make that slide slideType: "single" instead of putting the animation in a two-column right block.

6. Layout rules.
   - Prefer 18-26 slides for a full lecture cleanup unless the source deck is much shorter.
   - Use two-col for explanation + small figure.
   - Use single or title-center for section breaks and large animations.
   - Do not put a 720px-tall custom animation beside a large left column; use a single-slide animation instead.
   - Keep each slide visually sparse: at most 5 bullets, at most 2 equations, and at most 1 major animation/figure.

7. Lumina block style rules.
   - Use "panel" for clean editable text and equations.
   - Use "custom" for animations.
   - Use "title-center" for section dividers.
   - Avoid "import-text" unless preserving exact source layout is necessary.
   - Avoid raw PDF-positioned fragments unless the user explicitly requested exact visual import.
   - Use buildIn: "fade", buildOut: "none".
   - Use stepMode: "by-item" for bullet lists.
   - Use stepMode: "all" for equations and animations.

8. Final self-check before returning JSON.
   - JSON parses successfully.
   - No markdown fences.
   - No malformed LaTeX remnants: " imes", " ext{", " op ", "</latexit>", "ﬁ", "⇥", "2 R".
   - No giant base64 page screenshots unless explicitly necessary.
   - Every custom HTML block is self-contained and iframe-safe.
   - Every animation has a clear pedagogical purpose stated in the slide notes.
   - The deck should look like a hand-authored lecture, not an imported PDF dump.`;
    }
    function aiDeckUserPrompt(deckTitle, slides){
      const compact = {
        deckTitle: deckTitle || 'Imported deck',
        sourceSlideCount: (slides || []).length,
        importedSlides: compactSlidesForAi(slides)
      };
      return [
        'Review this imported deck, clean it up, add or edit blocks within slides, and wherever useful replace figures with better editable diagrams or custom HTML/SVG animations.',
        'Make the output look like a hand-authored lecture deck, not a raw PDF import.',
        'Only return the cleaned Lumina deck JSON. Do not wrap it in markdown.',
        'The raw imported deck has been compacted below to avoid embedding large base64 images:',
        JSON.stringify(compact, null, 2)
      ].join('\n\n');
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
    const AI_IMPORT_BAD_PATTERNS = [
      { label:'literal </latexit> fragment', re:/<\/latexit>/i },
      { label:'broken LaTeX \\times rendered as imes', re:/(^|[^a-zA-Z])imes\b/ },
      { label:'broken LaTeX \\text rendered as ext{...}', re:/(^|[^a-zA-Z])ext\{/ },
      { label:'broken LaTeX \\top rendered as op', re:/(^|[^a-zA-Z])op\b/ },
      { label:'bad multiplication glyph ⇥', re:/⇥/ },
      { label:'fi ligature ﬁ', re:/ﬁ/ },
      { label:'broken membership/mathbb pattern like 2 R', re:/\b2\s*R/ },
      { label:'huge base64 image still present', re:/data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]{80000,}/i }
    ];
    function collectAiDeckText(deck){
      try{ return JSON.stringify(deck || {}); }
      catch(_err){ return String(deck || ''); }
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
    function aiDeckRepairPrompt(previousText, problems){
      const prior = String(previousText || '').slice(0, 180000);
      return [
        'Your previous Lumina deck JSON had validation problems:',
        (problems || []).map(p => '- ' + p).join('\n'),
        '',
        'Repair the JSON only. Do not redesign the deck unless required to fix the listed problems.',
        'Return ONLY valid JSON. Do not wrap it in markdown.',
        'Ensure every LaTeX backslash is JSON-escaped: use "\\\\times", "\\\\text{}", "\\\\top", "\\\\operatorname{}" inside JSON strings.',
        'Ensure custom animations use responsive 100% height/width CSS, no external assets, no <script>, no iframes, and no fixed 720px two-column stage height.',
        '',
        'Previous output to repair:',
        prior
      ].join('\n');
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
      const res = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify(body) });
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
      return normalizeAiReviewDeck(parsed, fallbackTitle);
    }
    async function callImportAiReview(deckTitle, slides){
      const endpoint = aiReviewEndpointValue();
      if(!endpoint) throw new Error('Set an AI review endpoint first. For your Cloud Run backend use the same URL as extraction, ending in /api/lumina/ai.');
      const token = aiReviewTokenValue();
      const provider = aiReviewProviderValue();
      const model = aiReviewModelValue();
      const system = aiDeckSystemPrompt();
      const input = aiDeckUserPrompt(deckTitle, slides);
      let text = await requestAiReviewText(endpoint, token, provider, model, system, input, 0.2, 36000);
      let deck;
      let problems = [];
      try{
        deck = parseAiReviewResponseText(text, deckTitle);
        problems = findAiImportDeckProblems(deck, text);
      }catch(err){
        problems = ['AI returned invalid JSON: ' + (err && err.message ? err.message : String(err))];
      }
      if(problems.length){
        showToast('AI cleanup needs one repair pass…');
        text = await requestAiReviewText(endpoint, token, provider, model, system, aiDeckRepairPrompt(text, problems), 0.1, 36000);
        deck = parseAiReviewResponseText(text, deckTitle);
        problems = findAiImportDeckProblems(deck, text);
        if(problems.length){
          throw new Error('AI deck still failed cleanup validation: ' + problems.join('; '));
        }
      }
      try{ global.__LUMINA_STAGE41N_LAST_AI_IMPORT_REVIEW = { ok:true, endpoint, provider, model, inputSlides:(slides||[]).length, outputSlides:deck.slides.length, validation:'passed', at:new Date().toISOString() }; }catch(_err){}
      return deck;
    }
    async function maybeReviewImportedDeckWithAi(importedSlides, deckTitle){
      if(!aiReviewAfterImportEnabled()) return { deckTitle, slides:importedSlides, theme:null, presentationOptions:null, aiReviewed:false };
      showToast('Asking AI Copilot to clean the imported deck…');
      try{
        const deck = await callImportAiReview(deckTitle, importedSlides);
        showToast('AI cleaned import: ' + deck.slides.length + ' slide' + (deck.slides.length === 1 ? '' : 's') + ' ready.');
        return Object.assign({ aiReviewed:true }, deck);
      }catch(err){
        try{ global.__LUMINA_STAGE41N_LAST_AI_IMPORT_REVIEW = { ok:false, error:err && err.message ? err.message : String(err), inputSlides:(importedSlides||[]).length, at:new Date().toISOString() }; }catch(_err){}
        throw new Error('AI import review failed; raw extracted deck was not loaded. ' + (err && err.message ? err.message : String(err)));
      }
    }
    function isExtractablePresentationFile(file){
      const name = String(file && file.name || '').toLowerCase();
      return /\.(pdf|pptx|ppt)$/i.test(name) || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file.type === 'application/vnd.ms-powerpoint';
    }
    function fileKind(file){
      const name = String(file && file.name || '').toLowerCase();
      if(/\.pdf$/i.test(name) || file.type === 'application/pdf') return 'pdf';
      if(/\.pptx$/i.test(name)) return 'pptx';
      if(/\.ppt$/i.test(name)) return 'ppt';
      return '';
    }
    async function extractPresentationFile(file){
      if(typeof fetch !== 'function' || typeof FormData !== 'function') throw new Error('This browser does not support fetch/FormData upload.');
      const endpoint = extractionEndpointValue();
      if(!endpoint) throw new Error('Set an extraction backend endpoint first.');
      const form = new FormData();
      form.append('file', file, file.name || 'presentation');
      const kind = fileKind(file);
      if(kind) form.append('kind', kind);
      // Stage 41J: explicitly request all pages/slides so a stale Cloud Run env
      // such as LUMINA_EXTRACT_MAX_PDF_PAGES=1 cannot silently limit imports.
      form.append('maxPdfPages', String(DEFAULT_MAX_IMPORT_PAGES));
      form.append('maxPptxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
      form.append('maxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
      // Stage 41J: import PDF images as individual image blocks; do not include a full-page
      // background bitmap unless explicitly added later. This prevents page 1 from becoming
      // a repeated background across imported slides.
      form.append('includePdfBackground', '0');
      const headers = {};
      const token = extractionTokenValue();
      if(token) headers.Authorization = 'Bearer ' + token;
      const res = await fetch(endpoint, { method:'POST', headers, body:form });
      const text = await res.text();
      let payload = null;
      try{ payload = text ? JSON.parse(text) : null; }
      catch(_err){ payload = { ok:false, error:{ message: text ? text.slice(0, 500) : 'Empty response from extraction backend.' } }; }
      if(!res.ok || !payload || payload.ok === false){
        const msg = payload && payload.error && payload.error.message ? payload.error.message : ('Extraction backend failed with HTTP ' + res.status + '.');
        throw new Error(msg);
      }
      if(!Array.isArray(payload.slides) || !payload.slides.length) throw new Error('Extraction backend returned no slides.');
      try{ global.__LUMINA_STAGE41M_LAST_EXTRACTION = { ok:true, slideCount:payload.slides.length, source:payload.source || null, meta:payload.meta || null, warnings:payload.warnings || [], endpoint:endpoint, filename:file && file.name || '' }; }catch(_err){}
      return payload;
    }
    function applyImportedSlides(importedSlides, opts={}){
      const incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
      try{ global.__LUMINA_STAGE41M_LAST_IMPORT = { requestedSlides:(importedSlides||[]).length, normalizedSlides:incoming.length, mode:opts && opts.mode || 'append', at:new Date().toISOString() }; }catch(_err){}
      if(!incoming.length) throw new Error('No slides were imported.');
      syncPreviewFiguresToDraft(false);
      saveCurrentBlockToDraft();
      saveCurrentSlideToDeck();
      if(opts.theme) applyThemeToForm(opts.theme);
      if(opts.presentationOptions) applyPresentationOptions(opts.presentationOptions);
      const mode = opts.mode === 'replace' ? 'replace' : 'append';
      if(mode === 'replace'){
        setSlides(incoming);
        setActiveIndex(0);
        if(opts.deckTitle) fields.deckTitle.value = opts.deckTitle;
      } else {
        const current = getSlides();
        const base = current.length ? clone(current) : [];
        const next = base.concat(incoming);
        setSlides(next);
        setActiveIndex(base.length);
        if(opts.deckTitle && !fields.deckTitle.value) fields.deckTitle.value = opts.deckTitle;
      }
      const slides = getSlides();
      const activeIndex = getActiveIndex();
      applySlideToForm(slides[activeIndex]);
      renderDeckList();
      buildPreview();
      scheduleAutosave('Autosaved after import.');
      showToast('Imported ' + incoming.length + ' slide' + (incoming.length === 1 ? '' : 's') + '.');
    }

    async function importSelectedFiles(fileList){
      initExtractionFields();
      const files = Array.from(fileList || []);
      if(!files.length) throw new Error('Choose one or more files first.');
      let imported = [];
      let deckTitle = '';
      const warnings = [];
      let usedExtractionBackend = false;
      for(const file of files){
        const lower = String(file.name || '').toLowerCase();
        if(!deckTitle) deckTitle = String(file.name || 'Imported deck').replace(/\.[^.]+$/,'');

        if(isExtractablePresentationFile(file)){
          if(extractionBackendEnabled()){
            try{
              const payload = await extractPresentationFile(file);
              usedExtractionBackend = true;
              if(payload.deckTitle && !deckTitle) deckTitle = payload.deckTitle;
              const payloadSlides = Array.isArray(payload.slides) ? payload.slides : [];
              imported.push(...payloadSlides);
              const expectedCount = payload && payload.source ? Number(payload.source.pageCount || payload.source.slideCount || 0) : 0;
              if(expectedCount && payloadSlides.length < expectedCount){
                const msg = 'Extraction backend returned only ' + payloadSlides.length + ' of ' + expectedCount + ' pages/slides. This usually means the frontend is still pointing to an old backend revision or the extraction response was too large. Check /health and redeploy Stage 41J or newer.';
                if(payloadSlides.length <= 1 && expectedCount > 1) throw new Error(msg);
                warnings.push(msg);
              }
              if(Array.isArray(payload.warnings)) warnings.push(...payload.warnings);
            } catch(err){
              throw new Error('Could not extract ' + (file.name || 'presentation') + ' with the Lumina extraction backend. ' + (err && err.message ? err.message : ''));
            }
          } else if(/\.pdf$/i.test(lower) || file.type === 'application/pdf'){
            const dataUrl = await readFileAsDataUrl(file);
            imported.push(makeReferencePdfSlide(dataUrl, file.name));
          } else {
            throw new Error('PPT/PPTX import requires the extraction backend. Enable it and set the backend endpoint.');
          }
          continue;
        }

        if((file.type && file.type.startsWith('image/')) || /\.(png|jpe?g|gif|webp|svg)$/i.test(lower)){
          const dataUrl = await readFileAsDataUrl(file);
          imported.push(makeReferenceImageSlide(dataUrl, file.name));
        } else {
          const text = await file.text();
          if(/\.(md|markdown)$/i.test(lower)) imported.push(...parseMarkdownToSlides(text));
          else if(/\.(tex|ltx)$/i.test(lower)) imported.push(...parseBeamerToSlides(text));
          else if(/\.json$/i.test(lower)) imported.push(...parseJsonOutlineToSlides(text));
          else imported.push(...parsePowerPointTextToSlides(text));
        }
      }
      let importDeck = { deckTitle, slides: imported, theme:null, presentationOptions:null, aiReviewed:false };
      if(usedExtractionBackend){
        importDeck = await maybeReviewImportedDeckWithAi(imported, deckTitle);
        imported = importDeck.slides || imported;
        deckTitle = importDeck.deckTitle || deckTitle;
      }
      applyImportedSlides(imported, { mode: importModeValue(), deckTitle, theme: importDeck.theme, presentationOptions: importDeck.presentationOptions });
      if(warnings.length) showToast(warnings[0]);
    }

    async function loadDeckFromFile(file){
      const text = await file.text();
      let payload;
      if(/\.json$/i.test(file.name) || String(text).trim().startsWith('{')){
        payload = JSON.parse(text);
      } else {
        const match = text.match(new RegExp('<script id=["\']deck-source["\'][^>]*type=["\']application\\/json["\'][^>]*>([\\s\\S]*?)<\\/script>', 'i'));
        if(!match) throw new Error('This file does not contain an editable deck-source block.');
        payload = JSON.parse(match[1]);
      }
      if(!payload || !Array.isArray(payload.slides)) throw new Error('Could not parse slides from this HTML file.');
      fields.deckTitle.value = payload.deckTitle || 'My HTML Presentation';
      if(payload.theme) applyThemeToForm(payload.theme);
      if(payload.presentationOptions) applyPresentationOptions(payload.presentationOptions);
      const nextSlides = payload.slides.map(normalizeSlide);
      setSlides(nextSlides);
      setActiveIndex(nextSlides.length ? 0 : -1);
      if(getActiveIndex() >= 0) applySlideToForm(getSlides()[0]);
      else clearForm(false);
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
      const nextSlides = payload.slides.map(normalizeSlide);
      setSlides(nextSlides);
      setActiveIndex(nextSlides.length ? 0 : -1);
      if(getActiveIndex() >= 0) applySlideToForm(getSlides()[0]);
      else clearForm(false);
      buildPreview();
      renderDeckList();
    }

    setTimeout(initExtractionFields, 0);

    return {
      importModeValue,
      applyImportedSlides,
      importSelectedFiles,
      loadDeckFromFile,
      loadPresentationJsonFromFile,
      extractPresentationFile,
      maybeReviewImportedDeckWithAi
    };
  }

  global.LuminaFileIo = { createApi };
})(window);
