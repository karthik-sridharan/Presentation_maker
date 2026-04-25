/* Stage 14 file/import workflow helpers.
   Classic browser script; exposes window.LuminaFileIo.
   This layer owns browser FileReader/text loading and the bridge that applies imported slides to app state.
*/
(function(global){
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

    function doc(){ return typeof getDocument === 'function' ? getDocument() : global.document; }
    function readFileAsDataUrl(file){
      return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read file: ' + (file && file.name ? file.name : 'unknown file')));
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(file);
      });
    }
    function importModeValue(){
      return (doc().getElementById('importModeSelect')?.value || 'append') === 'replace' ? 'replace' : 'append';
    }
    function applyImportedSlides(importedSlides, opts={}){
      const incoming = (importedSlides || []).map(normalizeSlide).filter(Boolean);
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
      const files = Array.from(fileList || []);
      if(!files.length) throw new Error('Choose one or more files first.');
      const imported = [];
      let deckTitle = '';
      for(const file of files){
        const lower = String(file.name || '').toLowerCase();
        if(!deckTitle) deckTitle = String(file.name || 'Imported deck').replace(/.[^.]+$/,'');
        if((file.type && file.type.startsWith('image/')) || /.(png|jpe?g|gif|webp|svg)$/i.test(lower)){
          const dataUrl = await readFileAsDataUrl(file);
          imported.push(makeReferenceImageSlide(dataUrl, file.name));
        } else if(file.type === 'application/pdf' || /.pdf$/i.test(lower)){
          const dataUrl = await readFileAsDataUrl(file);
          imported.push(makeReferencePdfSlide(dataUrl, file.name));
        } else {
          const text = await file.text();
          if(/.(md|markdown)$/i.test(lower)) imported.push(...parseMarkdownToSlides(text));
          else if(/.(tex|ltx)$/i.test(lower)) imported.push(...parseBeamerToSlides(text));
          else if(/.json$/i.test(lower)) imported.push(...parseJsonOutlineToSlides(text));
          else imported.push(...parsePowerPointTextToSlides(text));
        }
      }
      applyImportedSlides(imported, { mode: importModeValue(), deckTitle });
    }

    async function loadDeckFromFile(file){
      const text = await file.text();
      let payload;
      if(/.json$/i.test(file.name) || String(text).trim().startsWith('{')){
        payload = JSON.parse(text);
      } else {
        const match = text.match(new RegExp('<script id=[\"\']deck-source[\"\'][^>]*type=[\"\']application\\/json[\"\'][^>]*>([\\s\\S]*?)<\\/script>', 'i'));
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

    return {
      importModeValue,
      applyImportedSlides,
      importSelectedFiles,
      loadDeckFromFile,
      loadPresentationJsonFromFile
    };
  }

  global.LuminaFileIo = { createApi };
})(window);
