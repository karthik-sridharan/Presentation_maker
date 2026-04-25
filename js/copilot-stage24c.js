/* Stage 24C: Guarded Copilot UI binding.
   This is intentionally a classic script loaded after legacy-app.
   If this file or Copilot logic fails, the main editor/preview should already be running.
*/
(function(global){
  'use strict';
  var status = global.LuminaCopilotGuardStatus = {
    stage: 'stage24c-20260425-1',
    bound: false,
    validationBound: false,
    lastAction: '',
    buttonCount: 0,
    errors: []
  };
  function record(message, err){
    var msg = String(message || 'Copilot guard error');
    if(err && err.message) msg += ': ' + err.message;
    status.errors.push({ time: new Date().toISOString(), message: msg });
    if(global.console && console.warn) console.warn('[Lumina Copilot Guard]', msg, err || '');
  }
  function byId(id){ return document.getElementById(id); }
  function add(id, type, fn){
    var el = byId(id);
    if(!el) return false;
    el.addEventListener(type || 'click', function(evt){
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
    });
    status.buttonCount += 1;
    return true;
  }

  function setCoreError(err){
    var core = global.LuminaCopilotCore;
    var msg = (err && err.message) || String(err || 'Copilot failed.');
    if(core && typeof core.recordCopilotError === 'function') msg = core.recordCopilotError(err || msg);
    if(core && typeof core.setCopilotStatus === 'function') core.setCopilotStatus(msg, true);
    return msg;
  }
  function safeValidate(){
    var core = global.LuminaCopilotCore;
    if(core && typeof core.updateCopilotKeyWarning === 'function'){
      try{ return core.updateCopilotKeyWarning(); }
      catch(err){ setCoreError(err); return false; }
    }
    return true;
  }

  function bind(){
    var core = global.LuminaCopilotCore;
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
      add('saveCopilotKeyBtn', 'click', function(){ status.lastAction = 'save settings'; return core.saveCopilotSettings(true); });
      var model = byId('copilotModel'); if(model) model.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot model setting', err); } });
      var endpoint = byId('copilotEndpoint'); if(endpoint) endpoint.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot endpoint setting', err); } });
      var tone = byId('copilotTone'); if(tone) tone.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot tone setting', err); } });
      add('copilotDraftSlideBtn', 'click', function(){ status.lastAction = 'draft current slide'; return core.generateCopilotSlide('replace'); });
      add('copilotAddSlideBtn', 'click', function(){ status.lastAction = 'append generated slide'; return core.generateCopilotSlide('append'); });
      add('copilotGenerateDeckBtn', 'click', function(){ status.lastAction = 'generate deck'; return core.generateCopilotDeck(); });
      add('copilotApplyFirstSlideBtn', 'click', function(){ status.lastAction = 'apply first slide'; return core.applyCopilotFirstSlide(); });
      add('copilotAppendResultBtn', 'click', function(){ status.lastAction = 'append result'; return core.appendCopilotSlides(); });
      add('copilotReplaceDeckBtn', 'click', function(){ status.lastAction = 'replace deck'; return core.replaceDeckWithCopilot(); });
      status.bound = true;
      if(typeof core.setCopilotStatus === 'function'){
        core.setCopilotStatus('Copilot ready. Main app is guarded from Copilot startup failures.');
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
