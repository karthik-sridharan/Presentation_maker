/* Stage 24B: Guarded Copilot UI binding.
   This is intentionally a classic script loaded after legacy-app.
   If this file or Copilot logic fails, the main editor/preview should already be running.
*/
(function(global){
  'use strict';
  var status = global.LuminaCopilotGuardStatus = {
    stage: 'stage24b-20260425-1',
    bound: false,
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
            if(global.LuminaCopilotCore && typeof global.LuminaCopilotCore.setCopilotStatus === 'function'){
              global.LuminaCopilotCore.setCopilotStatus((err && err.message) || 'Copilot failed.', true);
            }
            alert((err && err.message) || 'Copilot failed.');
          });
        }
      }catch(err){
        record('Copilot action failed for #' + id, err);
        if(global.LuminaCopilotCore && typeof global.LuminaCopilotCore.setCopilotStatus === 'function'){
          global.LuminaCopilotCore.setCopilotStatus((err && err.message) || 'Copilot failed.', true);
        }
        alert((err && err.message) || 'Copilot failed.');
      }
    });
    status.buttonCount += 1;
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
      add('saveCopilotKeyBtn', 'click', function(){ return core.saveCopilotSettings(true); });
      var model = byId('copilotModel'); if(model) model.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot model setting', err); } });
      var endpoint = byId('copilotEndpoint'); if(endpoint) endpoint.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot endpoint setting', err); } });
      var tone = byId('copilotTone'); if(tone) tone.addEventListener('change', function(){ try{ core.saveCopilotSettings(false); }catch(err){ record('Could not save Copilot tone setting', err); } });
      add('copilotDraftSlideBtn', 'click', function(){ return core.generateCopilotSlide('replace'); });
      add('copilotAddSlideBtn', 'click', function(){ return core.generateCopilotSlide('append'); });
      add('copilotGenerateDeckBtn', 'click', function(){ return core.generateCopilotDeck(); });
      add('copilotApplyFirstSlideBtn', 'click', function(){ return core.applyCopilotFirstSlide(); });
      add('copilotAppendResultBtn', 'click', function(){ return core.appendCopilotSlides(); });
      add('copilotReplaceDeckBtn', 'click', function(){ return core.replaceDeckWithCopilot(); });
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
