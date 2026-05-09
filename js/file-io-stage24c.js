/* Stage 41G file/import workflow helpers.
   Classic browser script; exposes window.LuminaFileIo.
   Adds backend extraction for all PDF/PPTX/PPT pages/slides via /api/lumina/extract.
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
    function initExtractionFields(){
      const d = doc();
      const endpoint = d.getElementById('extractionEndpointInput');
      const token = d.getElementById('extractionTokenInput');
      const enabled = d.getElementById('useExtractionBackendCheckbox');
      if(endpoint && !endpoint.value) endpoint.value = storageGet(STORAGE_ENDPOINT, '/api/lumina/extract');
      if(token && !token.value) token.value = storageGet(STORAGE_TOKEN, '');
      if(enabled && !enabled.__luminaExtractionInit){
        enabled.checked = storageGet(STORAGE_ENABLED, 'true') !== 'false';
        enabled.__luminaExtractionInit = true;
      }
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
      // Stage 41G: explicitly request all pages/slides so a stale Cloud Run env
      // such as LUMINA_EXTRACT_MAX_PDF_PAGES=1 cannot silently limit imports.
      form.append('maxPdfPages', String(DEFAULT_MAX_IMPORT_PAGES));
      form.append('maxPptxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
      form.append('maxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
      // Stage 41G: import PDF images as individual image blocks; do not include a full-page
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
      try{ global.__LUMINA_STAGE41G_LAST_EXTRACTION = { ok:true, slideCount:payload.slides.length, source:payload.source || null, meta:payload.meta || null, warnings:payload.warnings || [], endpoint:endpoint, filename:file && file.name || '' }; }catch(_err){}
      return payload;
    }
    function applyImportedSlides(importedSlides, opts={}){
      const incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
      try{ global.__LUMINA_STAGE41G_LAST_IMPORT = { requestedSlides:(importedSlides||[]).length, normalizedSlides:incoming.length, mode:opts && opts.mode || 'append', at:new Date().toISOString() }; }catch(_err){}
      if(!incoming.length) throw new Error('No slides were imported.');
      syncPreviewFiguresToDraft(false);
      saveCurrentBlockToDraft();
      saveCurrentSlideToDeck();
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
      const imported = [];
      let deckTitle = '';
      const warnings = [];
      for(const file of files){
        const lower = String(file.name || '').toLowerCase();
        if(!deckTitle) deckTitle = String(file.name || 'Imported deck').replace(/\.[^.]+$/,'');

        if(isExtractablePresentationFile(file)){
          if(extractionBackendEnabled()){
            try{
              const payload = await extractPresentationFile(file);
              if(payload.deckTitle && !deckTitle) deckTitle = payload.deckTitle;
              const payloadSlides = Array.isArray(payload.slides) ? payload.slides : [];
              imported.push(...payloadSlides);
              const expectedCount = payload && payload.source ? Number(payload.source.pageCount || payload.source.slideCount || 0) : 0;
              if(expectedCount && payloadSlides.length < expectedCount){
                const msg = 'Extraction backend returned only ' + payloadSlides.length + ' of ' + expectedCount + ' pages/slides. This usually means the frontend is still pointing to an old backend revision or the extraction response was too large. Check /health and redeploy Stage 41G.';
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
      applyImportedSlides(imported, { mode: importModeValue(), deckTitle });
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
      extractPresentationFile
    };
  }

  global.LuminaFileIo = { createApi };
})(window);
