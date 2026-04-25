(function () {
  'use strict';
  var W = window;
  var D = W.LuminaDiagnostics = W.LuminaDiagnostics || {};
  D.stage = 'stage27c-20260425-1';
  D.loaded = D.loaded || {};
  D.failed = D.failed || {};
  D.errors = D.errors || [];
  D.warnings = D.warnings || [];
  D.startedAt = new Date().toISOString();
  var previousBootError = W.luminaBootError;
  W.luminaBootError = function (message) {
    var msg = String(message || 'Unknown startup error');
    D.errors.push({ time: new Date().toISOString(), message: msg });
    if (typeof previousBootError === 'function') previousBootError(msg);
    else { W.LUMINA_BOOT_ERRORS = W.LUMINA_BOOT_ERRORS || []; W.LUMINA_BOOT_ERRORS.push(msg); }
  };
  D.warn = function (message) {
    D.warnings.push({ time: new Date().toISOString(), message: String(message || 'warning') });
  };
  D.markLoaded = function (asset) { D.loaded[String(asset)] = true; };
  D.markFailed = function (asset) { D.failed[String(asset)] = true; W.luminaBootError('Failed to load ' + asset); };
  D.markOptionalFailed = function (asset, detail) {
    D.failed[String(asset)] = true;
    D.warn('Optional asset did not load: ' + asset + (detail ? ' — ' + detail : ''));
  };
  function hasOwn(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
  function expectedAssets() { return (W.LuminaModuleManifest && W.LuminaModuleManifest.assets ? W.LuminaModuleManifest.assets : (W.LUMINA_EXPECTED_ASSETS || [])).slice(); }
  function optionalAssets() { return (W.LuminaModuleManifest && W.LuminaModuleManifest.optionalAssets ? W.LuminaModuleManifest.optionalAssets : (W.LUMINA_OPTIONAL_ES_MODULE_ASSETS || [])).slice(); }
  function expectedGlobals() { return (W.LuminaModuleManifest && W.LuminaModuleManifest.globals ? W.LuminaModuleManifest.globals : [
    'LuminaUtils','LuminaBlockLibrary','LuminaTheme','LuminaPresets','LuminaParser','LuminaBlockStyle','LuminaImport','LuminaState','LuminaExport','LuminaRendererApi','LuminaDeck','LuminaFileIo','LuminaFigureInsert','LuminaDiagramEditor','LuminaFigureTools','LuminaEditorSelection','LuminaBlockEditor','LuminaCopilotCore','LuminaCopilotGuardStatus','LuminaCommands'
  ]).slice(); }
  function expectedDomIds() { return (W.LuminaModuleManifest && W.LuminaModuleManifest.domIds ? W.LuminaModuleManifest.domIds : ['leftTabs','slideType','preview','deckList','blockList','deckTitle']).slice(); }
  function collectReport() {
    var assets = expectedAssets();
    var missingAssets = assets.filter(function (asset) {
      if (/\.css(?:\?|$)/.test(asset)) return false;
      return !hasOwn(D.loaded, asset) || D.loaded[asset] !== true;
    });
    var missingGlobals = expectedGlobals().filter(function (key) { return !W[key]; });
    var missingDom = expectedDomIds().filter(function (id) { return !document.getElementById(id); });
    var bootErrors = (W.LUMINA_BOOT_ERRORS || []).slice();
    var esm = W.LuminaEsModuleDiagnostics || null;
    return {
      stage: D.stage,
      url: location.href,
      userAgent: navigator.userAgent,
      startedAt: D.startedAt,
      checkedAt: new Date().toISOString(),
      expectedAssetCount: assets.length,
      optionalAssetCount: optionalAssets().length,
      loadedScriptCount: Object.keys(D.loaded).length,
      missingAssets: missingAssets,
      optionalAssets: optionalAssets(),
      missingGlobals: missingGlobals,
      missingDomIds: missingDom,
      basicUiBound: !!W.__LUMINA_BASIC_UI_BOUND,
      previewHasContent: !!(document.getElementById('preview') && document.getElementById('preview').children.length),
      rendererFunctionBased: !!(W.LuminaRendererApi && typeof W.LuminaRendererApi.buildSlideMarkup === 'function'),
      uiFunctionBased: typeof W.initPanelTabs === 'function' && typeof W.initUiCleanupLayout === 'function',
      manifestLoaded: !!W.LuminaModuleManifest,
      rendererApi: {
        exposed: typeof W.LuminaRendererApi,
        buildSlideMarkup: W.LuminaRendererApi ? typeof W.LuminaRendererApi.buildSlideMarkup : 'undefined',
        normalizeSlide: W.LuminaRendererApi ? typeof W.LuminaRendererApi.normalizeSlide : 'undefined',
        legacyBuildPreview: typeof W.buildPreview
      },
      appCommandBridge: !!W.LuminaAppCommands,
      copilotCoreExposed: !!W.LuminaCopilotCore,
      copilotGuardBound: !!(W.LuminaCopilotGuardStatus && W.LuminaCopilotGuardStatus.bound),
      copilotGuard: W.LuminaCopilotGuardStatus || null,
      copilotRuntimeStatus: W.LuminaCopilotRuntimeStatus || null,
      copilotValidationBound: !!(W.LuminaCopilotGuardStatus && W.LuminaCopilotGuardStatus.validationBound),
      commandsBound: !!W.__LUMINA_COMMANDS_BOUND,
      commandCount: W.LuminaCommands && typeof W.LuminaCommands.list === 'function' ? W.LuminaCommands.list().length : 0,
      esModuleDiagnostics: esm,
      esModuleSmokePassed: !!(esm && esm.ok === true),
      esModuleSmokeStatus: esm ? (esm.status || (esm.ok ? 'passed' : 'failed')) : 'not-started',
      bootErrors: bootErrors,
      capturedErrors: D.errors.map(function (e) { return e.message || String(e); }),
      warnings: D.warnings.map(function (e) { return e.message || String(e); })
    };
  }
  D.collectReport = collectReport;
  D.copyReport = function () {
    var text = JSON.stringify(collectReport(), null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return text; });
    return Promise.resolve(text);
  };
  function makePanel() {
    var existing = document.getElementById('luminaDiagPanel'); if (existing) existing.remove();
    var panel = document.createElement('div'); panel.id = 'luminaDiagPanel';
    panel.style.cssText = 'position:fixed;right:12px;bottom:58px;z-index:999998;width:min(680px,calc(100vw - 24px));max-height:70vh;overflow:auto;background:#111;color:#f8fafc;border:1px solid #475569;border-radius:12px;box-shadow:0 18px 55px rgba(0,0,0,.35);font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;padding:12px;';
    var title = document.createElement('div'); title.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;font:600 13px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;';
    title.innerHTML = '<span>Lumina diagnostics — ' + D.stage + '</span>';
    var controls = document.createElement('span'); controls.style.cssText = 'display:flex;gap:6px;';
    function mkButton(label) { var b=document.createElement('button'); b.type='button'; b.textContent=label; b.style.cssText='font:12px system-ui;padding:5px 8px;border-radius:8px;border:1px solid #64748b;background:#1e293b;color:#f8fafc;cursor:pointer;'; return b; }
    var copy = mkButton('Copy report'); copy.onclick = function () { D.copyReport().then(function () { copy.textContent='Copied'; setTimeout(function () { copy.textContent='Copy report'; }, 1200); }); };
    var close = mkButton('Close'); close.onclick = function () { panel.remove(); };
    controls.appendChild(copy); controls.appendChild(close); title.appendChild(controls);
    var pre = document.createElement('pre'); pre.style.cssText = 'margin:0;white-space:pre-wrap;word-break:break-word;'; pre.textContent = JSON.stringify(collectReport(), null, 2);
    panel.appendChild(title); panel.appendChild(pre); document.body.appendChild(panel);
  }
  function ensureButton() {
    if (document.getElementById('luminaDiagButton')) return;
    var btn = document.createElement('button'); btn.id = 'luminaDiagButton'; btn.type = 'button'; btn.textContent = 'Diagnostics'; btn.title = 'Show Lumina startup/module diagnostics';
    btn.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:999997;border:0;border-radius:999px;background:#0f172a;color:#f8fafc;padding:9px 12px;font:600 12px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer;';
    btn.onclick = makePanel; document.body.appendChild(btn);
  }
  function delayedChecks() {
    var report = collectReport();
    if (report.missingAssets.length) W.luminaBootError('Missing script load markers: ' + report.missingAssets.join(', '));
    if (report.missingGlobals.length) W.luminaBootError('Missing globals after startup: ' + report.missingGlobals.join(', '));
    if (report.missingDomIds.length) W.luminaBootError('Missing DOM ids: ' + report.missingDomIds.join(', '));
    if (!report.basicUiBound) W.luminaBootError('Basic UI binding marker missing.');
    if (!report.manifestLoaded) W.luminaBootError('Module manifest did not load.');
    if (!report.commandsBound) W.luminaBootError('Command shortcut binding marker missing.');
    if (report.esModuleSmokeStatus !== 'passed') D.warn('ES module smoke status: ' + report.esModuleSmokeStatus + '. This is optional in Stage 27C and does not block the classic runtime.');
    ensureButton();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(delayedChecks, 2500); });
  else setTimeout(delayedChecks, 2500);
})();
