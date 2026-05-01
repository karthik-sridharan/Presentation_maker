/* theme-button-stage42e.js — robust Theme button routing to the visible Design / Theme Designer panel. */
(function(){
  'use strict';
  var W = window, D = document;
  var STAGE = 'stage42e-theme-button-route-hotfix-20260501-1';
  var SIG = 'index-inline-stage42e-theme-button-route-hotfix-20260501-1';
  var STATUS = {
    stage: STAGE,
    themeButtonRouteHotfix: true,
    windowDelegateBound: false,
    documentDelegateBound: false,
    toolbarButtonsBound: 0,
    inspectorButtonsBound: 0,
    stage38BRunActionPatched: false,
    lastAction: '',
    lastTarget: '',
    lastOpenedAt: '',
    lastError: '',
    tests: {},
    pass: false
  };
  function byId(id){ return D.getElementById(id); }
  function qs(sel, root){ return (root || D).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
  function clickEl(el){ if(el && typeof el.click === 'function'){ el.click(); return true; } return false; }
  function setStage(){
    try{
      W.LUMINA_STAGE = STAGE;
      W.LUMINA_STAGE_SIGNATURE = SIG;
      if(D.documentElement){
        D.documentElement.setAttribute('data-lumina-stage', STAGE);
        D.documentElement.setAttribute('data-lumina-stage-signature', SIG);
      }
    }catch(_e){}
  }
  function toast(msg){
    try{ if(W.LuminaAppCommands && typeof W.LuminaAppCommands.showToast === 'function') W.LuminaAppCommands.showToast(msg); }catch(_e){}
  }
  function publish(){
    runTests();
    W.__LUMINA_STAGE42E_THEME_BUTTON_STATUS = Object.assign({}, STATUS, { tests: Object.assign({}, STATUS.tests) });
    return W.__LUMINA_STAGE42E_THEME_BUTTON_STATUS;
  }
  function ensureThemeDiscovery(){
    try{
      var api = W.LuminaThemeDiscoveryStage42D || W.LuminaThemeDiscoveryStage42C;
      if(api && typeof api.ensure === 'function') api.ensure();
    }catch(err){ STATUS.lastError = String(err && (err.message || err) || 'Theme discovery ensure failed.'); }
  }
  function forceLeftTab(tab){
    var button = qs('[data-left-tab="' + tab + '"]');
    if(clickEl(button)) return true;
    qsa('[data-left-tab]').forEach(function(b){
      var on = b.getAttribute('data-left-tab') === tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    qsa('[data-left-pane]').forEach(function(p){
      p.classList.toggle('active', p.getAttribute('data-left-pane') === tab);
    });
    return !!qs('[data-left-pane="' + tab + '"]');
  }
  function openDrawer(){
    try{ if(W.LuminaStage38A && typeof W.LuminaStage38A.setDrawerOpen === 'function') W.LuminaStage38A.setDrawerOpen(true); }catch(_e){}
  }
  function highlight(el){
    if(!el || !el.classList) return;
    el.classList.add('stage42c-highlight');
    setTimeout(function(){ try{ el.classList.remove('stage42c-highlight'); }catch(_e){} }, 1600);
  }
  function scrollToDesigner(target){
    var el = target === 'copilot'
      ? (qs('#stage42aThemePanel .stage42a-copilot') || byId('stage42aThemePanel') || byId('stage42cThemeCopilotMount'))
      : (byId('stage42cMasterThemeMount') || byId('stage42cThemeDesignerHost') || byId('stage38dThemeGalleryPanel') || qs('[data-left-pane="styles"]'));
    if(el){
      try{ el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      catch(_e){ try{ el.scrollIntoView(true); }catch(_ee){} }
      highlight(el);
      return true;
    }
    return false;
  }
  function openThemeDesigner(target){
    setStage();
    openDrawer();
    ensureThemeDiscovery();
    forceLeftTab('styles');
    setTimeout(function(){
      ensureThemeDiscovery();
      forceLeftTab('styles');
      scrollToDesigner(target || 'designer');
      STATUS.lastAction = 'open-theme-designer';
      STATUS.lastTarget = target || 'designer';
      STATUS.lastOpenedAt = new Date().toISOString();
      STATUS.lastError = '';
      publish();
    }, 40);
    return true;
  }
  function isThemeTrigger(node){
    if(!node || !node.closest) return null;
    return node.closest('[data-stage38c-action="theme"],[data-stage38b-action="theme"],[data-stage38c-open-tab="styles"],[data-left-tab-proxy="styles"]');
  }
  function themeCaptureHandler(event){
    var trigger = isThemeTrigger(event.target);
    if(!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    openThemeDesigner('designer');
  }
  function bindDelegates(){
    if(!W.__stage42eThemeWindowDelegateBound){
      W.__stage42eThemeWindowDelegateBound = true;
      W.addEventListener('click', themeCaptureHandler, true);
    }
    if(!W.__stage42eThemeDocumentDelegateBound){
      W.__stage42eThemeDocumentDelegateBound = true;
      D.addEventListener('click', themeCaptureHandler, true);
    }
    STATUS.windowDelegateBound = !!W.__stage42eThemeWindowDelegateBound;
    STATUS.documentDelegateBound = !!W.__stage42eThemeDocumentDelegateBound;
  }
  function bindConcreteButtons(){
    var toolbar = 0, inspector = 0;
    qsa('[data-stage38c-action="theme"],[data-stage38b-action="theme"]').forEach(function(btn){
      btn.title = 'Open Theme Designer';
      btn.setAttribute('aria-label', 'Open Theme Designer');
      btn.dataset.stage42eThemeRoute = '1';
      toolbar += 1;
    });
    qsa('[data-stage38c-open-tab="styles"],[data-left-tab-proxy="styles"]').forEach(function(btn){
      btn.dataset.stage42eThemeRoute = '1';
      inspector += 1;
    });
    STATUS.toolbarButtonsBound = toolbar;
    STATUS.inspectorButtonsBound = inspector;
  }
  function patchStage38BRunAction(){
    var api = W.LuminaStage38B;
    if(!api || typeof api.runAction !== 'function') return false;
    if(api.__stage42eThemePatched){ STATUS.stage38BRunActionPatched = true; return true; }
    var prev = api.runAction.bind(api);
    api.runAction = function(action){
      if(action === 'theme') return openThemeDesigner('designer');
      return prev(action);
    };
    api.__stage42eThemePatched = true;
    STATUS.stage38BRunActionPatched = true;
    return true;
  }
  function patchDiagnostics(){
    var LD = W.LuminaDiagnostics;
    if(!LD || LD.__stage42eThemeButtonPatched) return false;
    var prev = (typeof LD.collectReport === 'function' ? LD.collectReport.bind(LD) : (typeof LD.getReport === 'function' ? LD.getReport.bind(LD) : null));
    if(!prev) return false;
    function wrap(){
      var report = {};
      try{ report = prev() || {}; }catch(err){ report = { stage: STAGE, stage42ePreviousReportError: String(err && (err.stack || err.message) || err) }; }
      setStage();
      bindDelegates();
      bindConcreteButtons();
      patchStage38BRunAction();
      report.stage = STAGE;
      report.diagnosticScriptStage = STAGE;
      report.stageFromWindow = W.LUMINA_STAGE || STAGE;
      report.indexStageSignature = W.LUMINA_STAGE_SIGNATURE || SIG;
      if(D.documentElement && D.documentElement.dataset) report.indexDatasetStage = D.documentElement.dataset.luminaStage || STAGE;
      report.stage42EThemeButtonStatus = publish();
      return report;
    }
    LD.collectReport = wrap;
    LD.getReport = wrap;
    LD.__stage42eThemeButtonPatched = true;
    return true;
  }
  function runTests(){
    var styles = qs('[data-left-pane="styles"]');
    STATUS.tests = {
      designPanePresent: !!styles,
      themeButtonPresent: qsa('[data-stage38c-action="theme"],[data-stage38b-action="theme"],[data-stage38c-open-tab="styles"],[data-left-tab-proxy="styles"]').length > 0,
      delegatesBound: !!(STATUS.windowDelegateBound && STATUS.documentDelegateBound),
      toolbarButtonsRouted: qsa('[data-stage38c-action="theme"],[data-stage38b-action="theme"]').every(function(b){ return b.dataset.stage42eThemeRoute === '1'; }),
      stage38BRunActionPatched: !!STATUS.stage38BRunActionPatched,
      themeDesignerAvailable: !!(byId('stage42cThemeDesignerHost') || byId('stage42cMasterThemeMount') || byId('themeName'))
    };
    STATUS.tests.pass = STATUS.tests.designPanePresent && STATUS.tests.themeButtonPresent && STATUS.tests.delegatesBound && STATUS.tests.stage38BRunActionPatched;
    STATUS.pass = !!STATUS.tests.pass;
    return STATUS.tests;
  }
  function ensure(){
    setStage();
    bindDelegates();
    bindConcreteButtons();
    patchStage38BRunAction();
    patchDiagnostics();
    publish();
    return STATUS.pass;
  }
  W.LuminaThemeButtonStage42E = {
    stage: STAGE,
    ensure: ensure,
    openThemeDesigner: function(){ return openThemeDesigner('designer'); },
    openThemeCopilot: function(){ return openThemeDesigner('copilot'); },
    status: publish
  };
  if(D.readyState === 'loading') D.addEventListener('DOMContentLoaded', ensure, { once: true }); else ensure();
  [60,160,420,900,1500,2600,4200,6500].forEach(function(ms){ setTimeout(ensure, ms); });
})();
