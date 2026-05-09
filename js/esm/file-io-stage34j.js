/* Stage 41F: browser-compatible ES module version of file/import workflow helpers.
   Adds backend extraction for all PDF/PPTX/PPT pages/slides via /api/lumina/extract. */

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
  function initExtractionFields() {
    var d = doc();
    var endpoint = d.getElementById('extractionEndpointInput');
    var token = d.getElementById('extractionTokenInput');
    var enabled = d.getElementById('useExtractionBackendCheckbox');
    if (endpoint && !endpoint.value) endpoint.value = storageGet(STORAGE_ENDPOINT, '/api/lumina/extract');
    if (token && !token.value) token.value = storageGet(STORAGE_TOKEN, '');
    if (enabled && !enabled.__luminaExtractionInit) {
      var saved = storageGet(STORAGE_ENABLED, 'true');
      enabled.checked = saved !== 'false';
      enabled.__luminaExtractionInit = true;
    }
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
  function extractPresentationFile(file) {
    if (typeof fetch !== 'function' || typeof FormData !== 'function') return Promise.reject(new Error('This browser does not support fetch/FormData upload.'));
    var endpoint = extractionEndpointValue();
    if (!endpoint) return Promise.reject(new Error('Set an extraction backend endpoint first.'));
    var form = new FormData();
    form.append('file', file, file.name || 'presentation');
    var kind = fileKind(file);
    if (kind) form.append('kind', kind);
    // Stage 41F: explicitly request all pages/slides so a stale Cloud Run env
    // such as LUMINA_EXTRACT_MAX_PDF_PAGES=1 cannot silently limit imports.
    form.append('maxPdfPages', String(DEFAULT_MAX_IMPORT_PAGES));
    form.append('maxPptxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
    form.append('maxSlides', String(DEFAULT_MAX_IMPORT_SLIDES));
    var headers = {};
    var token = extractionTokenValue();
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(endpoint, { method:'POST', headers:headers, body:form }).then(function (res) {
      return res.text().then(function (text) {
        var payload = null;
        try { payload = text ? JSON.parse(text) : null; }
        catch (_err) { payload = { ok:false, error:{ message:text ? text.slice(0, 500) : 'Empty response from extraction backend.' } }; }
        if (!res.ok || !payload || payload.ok === false) {
          var msg = payload && payload.error && payload.error.message ? payload.error.message : ('Extraction backend failed with HTTP ' + res.status + '.');
          throw new Error(msg);
        }
        if (!Array.isArray(payload.slides) || !payload.slides.length) throw new Error('Extraction backend returned no slides.');
        try { globalThis.__LUMINA_STAGE41F_LAST_EXTRACTION = { ok:true, slideCount:payload.slides.length, source:payload.source || null, meta:payload.meta || null, warnings:payload.warnings || [], endpoint:endpoint, filename:file && file.name || '' }; } catch (_err) {}
        return payload;
      });
    });
  }
  function applyImportedSlides(importedSlides, opts) {
    opts = opts || {};
    var incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
    try { globalThis.__LUMINA_STAGE41F_LAST_IMPORT = { requestedSlides:(importedSlides||[]).length, normalizedSlides:incoming.length, mode:opts && opts.mode || 'append', at:new Date().toISOString() }; } catch (_err) {}
    if (!incoming.length) throw new Error('No slides were imported.');
    syncPreviewFiguresToDraft(false);
    saveCurrentBlockToDraft();
    saveCurrentSlideToDeck();
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
    var chain = Promise.resolve();
    files.forEach(function (file) {
      chain = chain.then(function () {
        var lower = String(file.name || '').toLowerCase();
        if (!deckTitle) deckTitle = String(file.name || 'Imported deck').replace(/\.[^.]+$/, '');

        if (isExtractablePresentationFile(file)) {
          if (extractionBackendEnabled()) {
            return extractPresentationFile(file).then(function (payload) {
              if (payload.deckTitle && !deckTitle) deckTitle = payload.deckTitle;
              var payloadSlides = Array.isArray(payload.slides) ? payload.slides : [];
              imported.push.apply(imported, payloadSlides);
              var expectedCount = payload && payload.source ? Number(payload.source.pageCount || payload.source.slideCount || 0) : 0;
              if (expectedCount && payloadSlides.length < expectedCount) {
                const msg = 'Extraction backend returned only ' + payloadSlides.length + ' of ' + expectedCount + ' pages/slides. This usually means the frontend is still pointing to an old backend revision or the extraction response was too large. Check /health and redeploy Stage 41F.';
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
      applyImportedSlides(imported, { mode:importModeValue(), deckTitle:deckTitle });
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
  return { importModeValue:importModeValue, applyImportedSlides:applyImportedSlides, importSelectedFiles:importSelectedFiles, loadDeckFromFile:loadDeckFromFile, loadPresentationJsonFromFile:loadPresentationJsonFromFile, extractPresentationFile:extractPresentationFile };
}

export default { createApi:createApi };
