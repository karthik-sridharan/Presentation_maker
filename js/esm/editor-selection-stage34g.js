/* Stage 34G: browser-compatible ES module version of preview selection helpers.
   Runtime note: guarded live ESM command runtime with classic Stage 24C shadow fallback. */
'use strict';

function createApi(deps){
    deps = deps || {};
    const {
      normalizeBlockStyle,
      normalizeAnimation,
      preview,
      blockFields,
      snippetOutput,
      previewBlockLabel,
      previewBlockFontScale,
      previewBlockFontFamily,
      previewBlockFontColor,
      previewBlockBulletType,
      animateTargetLabel,
      animateBuildIn,
      animateBuildOut,
      animateStepMode,
      animateOrder,
      getDraftBlock,
      getDraftTitleStyle,
      setDraftTitleStyle,
      getDraftTitleAnimation,
      setDraftTitleAnimation,
      getSelectedFigureBoxes,
      refreshFigureToolState,
      saveSelectedFigures,
      saveCurrentBlockToDraft,
      loadSelectedBlockIntoEditor,
      setSelectedIndex,
      slideForSnippet,
      currentDraftSlide,
      buildPreview,
      scheduleAutosave
    } = deps;

    let selectedPreviewBlockRef = null;

    function selectedPreviewBlock(){
      if(!selectedPreviewBlockRef || selectedPreviewBlockRef.type === 'title') return null;
      return getDraftBlock(selectedPreviewBlockRef.column, selectedPreviewBlockRef.index);
    }
    function selectedPreviewTitleStyle(){
      return normalizeBlockStyle(getDraftTitleStyle && getDraftTitleStyle());
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
        const nextStyle = normalizeBlockStyle({ ...((getDraftTitleStyle && getDraftTitleStyle()) || {}), ...(patch || {}) });
        setDraftTitleStyle(nextStyle);
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
        return { type:'title', label:'Slide title', animation: normalizeAnimation(getDraftTitleAnimation && getDraftTitleAnimation()) };
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
        setDraftTitleAnimation(patch);
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
        setDraftTitleAnimation(patch);
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

    return {
      selectedPreviewBlock,
      selectedPreviewTitleStyle,
      populatePreviewBlockStyleEditor,
      populatePreviewTitleStyleEditor,
      updatePreviewBlockSelectionUI,
      selectPreviewBlock,
      selectPreviewTitle,
      applySelectedPreviewBlockStyle,
      resetSelectedPreviewBlockStyle,
      selectedAnimationTargetInfo,
      updateAnimationControls,
      applySelectedAnimation,
      clearSelectedAnimation,
      initPreviewBlockSelection
    };
  }

export { createApi };
export default { createApi };
