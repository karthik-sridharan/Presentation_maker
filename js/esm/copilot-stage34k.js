/* Stage 34K: Guarded Copilot UI binding.
   The button handlers resolve window.LuminaCopilotCore at click time so the
   guarded ESM Copilot core can replace the classic fallback before use. */
(function(global){
  'use strict';
  var status = global.LuminaCopilotGuardStatus = {
    stage: 'stage36x-20260427-1',
    bound: false,
    validationBound: false,
    lastAction: '',
    buttonCount: 0,
    errors: [],
    generationInFlight: false,
    duplicateClicksIgnored: 0
  };
  function record(message, err){
    var msg = String(message || 'Copilot guard error');
    if(err && err.message) msg += ': ' + err.message;
    status.errors.push({ time: new Date().toISOString(), message: msg });
    if(global.console && console.warn) console.warn('[Lumina Copilot Guard]', msg, err || '');
  }
  function byId(id){ return document.getElementById(id); }
  function currentCore(){ return global.LuminaCopilotCore; }
  var generationButtonIds = ['copilotDraftSlideBtn','copilotAddSlideBtn','copilotGenerateDeckBtn'];
  function setGenerationButtonsBusy(isBusy){
    generationButtonIds.forEach(function(id){
      var btn = byId(id);
      if(!btn) return;
      btn.dataset.copilotBusy = isBusy ? '1' : '0';
      btn.disabled = !!isBusy;
      btn.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    });
  }
  function add(id, type, fn){
    var el = byId(id);
    if(!el) return false;
    var eventType = type || 'click';
    var guardKey = '__luminaCopilotGuardBound_' + eventType;
    if(el[guardKey]) return false;
    el[guardKey] = true;
    el.addEventListener(eventType, function(evt){
      if(evt && evt.preventDefault) evt.preventDefault();
      if(evt && evt.stopPropagation) evt.stopPropagation();
      if(evt && evt.stopImmediatePropagation) evt.stopImmediatePropagation();
      if(el.dataset && el.dataset.copilotBusy === '1'){
        status.duplicateClicksIgnored += 1;
        return;
      }
      try{
        var result = fn(evt);
        if(result && typeof result.catch === 'function'){
          result.catch(function(err){
            record('Copilot action failed for #' + id, err);
            alert(setCoreError(err));
          });
        }
      }catch(err){
        record('Copilot action failed for #' + id, err);
        alert(setCoreError(err));
      }
    }, true);
    status.buttonCount += 1;
    return true;
  }

  function setCoreError(err){
    var core = currentCore();
    var msg = (err && err.message) || String(err || 'Copilot failed.');
    if(core && typeof core.recordCopilotError === 'function') msg = core.recordCopilotError(err || msg);
    if(core && typeof core.setCopilotStatus === 'function') core.setCopilotStatus(msg, true);
    return msg;
  }
  function safeValidate(){
    var core = currentCore();
    if(core && typeof core.updateCopilotKeyWarning === 'function'){
      try{ return core.updateCopilotKeyWarning(); }
      catch(err){ setCoreError(err); return false; }
    }
    return true;
  }
  function callCore(method){
    var core = currentCore();
    if(!core || typeof core[method] !== 'function') throw new Error('Copilot core is not ready: ' + method);
    return core[method].apply(core, Array.prototype.slice.call(arguments, 1));
  }
  function runGeneration(label, method){
    var args = Array.prototype.slice.call(arguments, 2);
    if(status.generationInFlight){
      status.duplicateClicksIgnored += 1;
      var core = currentCore();
      if(core && typeof core.setCopilotStatus === 'function') core.setCopilotStatus('Copilot is already generating. Wait for the current request to finish.', true);
      return null;
    }
    status.generationInFlight = true;
    setGenerationButtonsBusy(true);
    var p;
    try{
      p = callCore.apply(null, [method].concat(args));
    }catch(err){
      status.generationInFlight = false;
      setGenerationButtonsBusy(false);
      throw err;
    }
    return Promise.resolve(p).finally(function(){
      status.generationInFlight = false;
      setGenerationButtonsBusy(false);
    });
  }

  function bind(){
    var core = currentCore();
    if(!core){
      record('LuminaCopilotCore is missing. Main app still works, but Copilot controls are disabled.');
      status.bound = false;
      return;
    }
    try{
      if(typeof core.loadCopilotSettings === 'function') core.loadCopilotSettings();
      ['copilotApiKey','copilotEndpoint'].forEach(function(id){ var el = byId(id); if(el) el.addEventListener('input', safeValidate); });
      status.validationBound = true;
      safeValidate();
      add('saveCopilotKeyBtn', 'click', function(){ status.lastAction = 'save settings'; return callCore('saveCopilotSettings', true); });
      var model = byId('copilotModel'); if(model) model.addEventListener('change', function(){ try{ callCore('saveCopilotSettings', false); }catch(err){ record('Could not save Copilot model setting', err); } });
      var endpoint = byId('copilotEndpoint'); if(endpoint) endpoint.addEventListener('change', function(){ try{ callCore('saveCopilotSettings', false); }catch(err){ record('Could not save Copilot endpoint setting', err); } });
      var tone = byId('copilotTone'); if(tone) tone.addEventListener('change', function(){ try{ callCore('saveCopilotSettings', false); }catch(err){ record('Could not save Copilot tone setting', err); } });
      add('copilotDraftSlideBtn', 'click', function(){ status.lastAction = 'draft current slide'; return runGeneration('draft current slide', 'generateCopilotSlide', 'replace'); });
      add('copilotAddSlideBtn', 'click', function(){ status.lastAction = 'append generated slide'; return runGeneration('append generated slide', 'generateCopilotSlide', 'append'); });
      add('copilotGenerateDeckBtn', 'click', function(){ status.lastAction = 'generate deck'; return runGeneration('generate deck', 'generateCopilotDeck'); });
      add('copilotApplyFirstSlideBtn', 'click', function(){ status.lastAction = 'apply first slide'; return callCore('applyCopilotFirstSlide'); });
      add('copilotAppendResultBtn', 'click', function(){ status.lastAction = 'append result'; return callCore('appendCopilotSlides'); });
      add('copilotReplaceDeckBtn', 'click', function(){ status.lastAction = 'replace deck'; return callCore('replaceDeckWithCopilot'); });
      status.bound = true;
      if(typeof currentCore().setCopilotStatus === 'function'){
        currentCore().setCopilotStatus('Copilot ready. Main app is guarded from Copilot startup failures.');
      }
    }catch(err){
      status.bound = false;
      record('Copilot binding failed. Main app should remain usable.', err);
      if(core && typeof core.setCopilotStatus === 'function') core.setCopilotStatus('Copilot failed to initialize. Main editor should still work.', true);
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once:true });
  else bind();
})(window);
