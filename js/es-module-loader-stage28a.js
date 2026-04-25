/* Stage 28A: classic-script ES module loader.
   The app must not fail startup just because a host blocks external ES modules
   (file://, MIME, CSP, dependency fetch, or older browser). This classic loader is
   the required asset. The actual ESM smoke harness is optional and reported via
   window.LuminaEsModuleDiagnostics. */
(function () {
  'use strict';
  var W = window;
  var STAGE = 'stage28a-20260425-1';
  var D = W.LuminaDiagnostics;
  function markLoaded(asset) {
    if (D && typeof D.markLoaded === 'function') D.markLoaded(asset);
  }
  function warn(message) {
    if (D && typeof D.warn === 'function') D.warn(message);
  }
  function setReport(report) {
    W.LuminaEsModuleDiagnostics = Object.freeze(report);
  }
  function now() { return new Date().toISOString(); }
  markLoaded('js/es-module-loader-stage28a.js');
  setReport({
    stage: STAGE,
    checkedAt: now(),
    ok: null,
    status: 'pending',
    migrationMode: 'classic loader with optional dynamic import; classic runtime remains authoritative'
  });

  var params;
  try { params = new URLSearchParams(W.location.search || ''); }
  catch (e) { params = { has: function () { return false; } }; }
  if (params.has('disableEsModuleSmoke')) {
    setReport({ stage: STAGE, checkedAt: now(), ok: null, status: 'disabled', reason: 'disableEsModuleSmoke query parameter present' });
    warn('ES module smoke disabled by query parameter.');
    return;
  }
  if (W.location.protocol === 'file:') {
    setReport({
      stage: STAGE,
      checkedAt: now(),
      ok: null,
      status: 'skipped-file-protocol',
      reason: 'Browsers commonly block ES module imports from local file:// pages. Serve the folder over HTTP to run the smoke harness.'
    });
    warn('ES module smoke skipped on file://. Serve over HTTP to test module import parity.');
    return;
  }
  var importer;
  try {
    importer = new Function('specifier', 'return import(specifier);');
  } catch (e) {
    setReport({ stage: STAGE, checkedAt: now(), ok: null, status: 'unsupported', reason: String(e && e.message || e) });
    warn('Dynamic import is not available in this browser.');
    return;
  }
  var scriptUrl = (document.currentScript && document.currentScript.src) || (W.location.href.replace(/[^/]*$/, '') + 'js/es-module-loader-stage28a.js');
  var specifier;
  try {
    specifier = new URL('es-module-smoke-stage28a.js?v=' + encodeURIComponent(STAGE), scriptUrl).href;
  } catch (e) {
    specifier = 'js/es-module-smoke-stage28a.js?v=' + encodeURIComponent(STAGE);
  }
  importer(specifier).then(function (module) {
    var report = (module && module.report) || W.LuminaEsModuleDiagnostics;
    if (report && report.ok === true) {
      setReport(report);
      markLoaded('js/es-module-smoke-stage28a.js');
      markLoaded('js/esm/utils-stage28a.js');
      markLoaded('js/esm/block-style-stage28a.js');
    } else {
      setReport(report || { stage: STAGE, checkedAt: now(), ok: false, status: 'failed-without-report' });
      warn('ES module smoke imported but did not report success.');
    }
  }).catch(function (e) {
    var message = String((e && (e.stack || e.message)) || e || 'unknown dynamic import failure');
    setReport({
      stage: STAGE,
      checkedAt: now(),
      ok: false,
      status: 'load-failed',
      error: message,
      migrationMode: 'classic runtime unaffected; optional ESM smoke failed before execution or while importing dependencies'
    });
    if (D && typeof D.markOptionalFailed === 'function') D.markOptionalFailed('js/es-module-smoke-stage28a.js', message);
    else warn('Optional ES module smoke failed: ' + message);
    if (params.has('strictEsModuleSmoke') && typeof W.luminaBootError === 'function') {
      W.luminaBootError('Strict ES module smoke failed: ' + message);
    }
  });
})();
