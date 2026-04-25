/* Stage 13 migration note:
   Deck list, slide CRUD, snippet load/save, and clipboard helpers live here.
   This is intentionally a classic browser script, not an ES module yet.
*/
(function(){
  function createApi(deps){
    const {
      clone,
      escapeHtml,
      normalizeSlide,
      slideForSnippet,
      snippetOutput,
      deckCount,
      deckList,
      fields,
      getSlides,
      setSlides,
      getActiveIndex,
      setActiveIndex,
      saveCurrentBlockToDraft,
      saveCurrentSlideToDeck,
      applySlideToForm,
      buildPreview,
      scheduleAutosave,
      showToast,
      currentDraftSlide
    } = deps;

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
      const activeIndex = getActiveIndex();
      const slides = getSlides();
      if(activeIndex < 0 || activeIndex >= slides.length){
        throw new Error('Select a slide first.');
      }
      slides[activeIndex] = parseSnippetSlide();
      setSlides(slides);
      applySlideToForm(slides[activeIndex]);
      buildPreview();
      renderDeckList();
      showToast('Replaced selected slide from snippet.');
      scheduleAutosave('Autosaved after replacing slide from snippet.');
    }
    function addSlideFromSnippet(){
      const slide = parseSnippetSlide();
      const slides = getSlides();
      slides.push(slide);
      setSlides(slides);
      setActiveIndex(slides.length - 1);
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
      const slides = getSlides();
      const activeIndex = getActiveIndex();
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
          const nextIndex = Number(btn.dataset.index);
          setActiveIndex(nextIndex);
          applySlideToForm(getSlides()[nextIndex]);
          buildPreview();
          renderDeckList();
          scheduleAutosave('Autosaved after slide switch.');
        });
      });
    }
    function addSlide(){
      const slides = getSlides();
      slides.push(currentDraftSlide());
      setSlides(slides);
      setActiveIndex(slides.length - 1);
      renderDeckList();
      showToast('Added slide.');
      scheduleAutosave('Autosaved after slide add.');
    }
    function updateSlide(){
      const activeIndex = getActiveIndex();
      const slides = getSlides();
      if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
      slides[activeIndex] = currentDraftSlide();
      setSlides(slides);
      renderDeckList();
      showToast('Updated slide.');
      scheduleAutosave('Autosaved after slide update.');
    }
    function duplicateSlide(){
      let activeIndex = getActiveIndex();
      const slides = getSlides();
      if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
      slides.splice(activeIndex + 1, 0, clone(slides[activeIndex]));
      activeIndex += 1;
      setSlides(slides);
      setActiveIndex(activeIndex);
      renderDeckList();
      showToast('Duplicated slide.');
      scheduleAutosave('Autosaved after slide duplicate.');
    }
    function deleteSlide(){
      let activeIndex = getActiveIndex();
      const slides = getSlides();
      if(activeIndex < 0 || activeIndex >= slides.length){ showToast('Select a slide first.'); return; }
      slides.splice(activeIndex, 1);
      if(activeIndex >= slides.length) activeIndex = slides.length - 1;
      setSlides(slides);
      setActiveIndex(activeIndex);
      if(activeIndex >= 0) applySlideToForm(slides[activeIndex]); else clearForm(false);
      buildPreview();
      renderDeckList();
      showToast('Deleted slide.');
      scheduleAutosave('Autosaved after slide delete.');
    }
    function moveSlide(dir){
      let activeIndex = getActiveIndex();
      const slides = getSlides();
      if(activeIndex < 0 || activeIndex >= slides.length) return;
      const next = activeIndex + dir;
      if(next < 0 || next >= slides.length) return;
      const tmp = slides[activeIndex];
      slides[activeIndex] = slides[next];
      slides[next] = tmp;
      activeIndex = next;
      setSlides(slides);
      setActiveIndex(activeIndex);
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

    return {
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
    };
  }

  window.LuminaDeck = { createApi };
})();
