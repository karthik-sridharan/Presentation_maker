/* Stage 23A migration note:
   Stable filename cleanup. Runtime now loads stable names such as js/utils-stage24b.js
   while stage-tagged files can remain in the repository as rollback references.
   This is a classic browser script and does not change editor behavior.
*/
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage24b-20260425-1',
    assets: [
    "css/styles-stage24b.css",
    "js/diagnostics-stage24b.js",
    "js/module-manifest-stage24b.js",
    "js/utils-stage24b.js",
    "js/block-library-stage24b.js",
    "js/theme-stage24b.js",
    "js/presets-stage24b.js",
    "js/parser-stage24b.js",
    "js/block-style-stage24b.js",
    "js/import-stage24b.js",
    "js/state-stage24b.js",
    "js/export-stage24b.js",
    "js/renderer-stage24b.js",
    "js/deck-stage24b.js",
    "js/file-io-stage24b.js",
    "js/ui-stage24b.js",
    "js/figure-insert-stage24b.js",
    "js/diagram-editor-stage24b.js",
    "js/figure-tools-stage24b.js",
    "js/editor-selection-stage24b.js",
    "js/block-editor-stage24b.js",
    "js/legacy-app-stage24b.js",
    "js/copilot-stage24b.js",
    "js/commands-stage24b.js"
],
    globals: [
    "LuminaUtils",
    "LuminaBlockLibrary",
    "LuminaTheme",
    "LuminaPresets",
    "LuminaParser",
    "LuminaBlockStyle",
    "LuminaImport",
    "LuminaState",
    "LuminaExport",
    "LuminaRendererApi",
    "LuminaDeck",
    "LuminaFileIo",
    "LuminaFigureInsert",
    "LuminaDiagramEditor",
    "LuminaFigureTools",
    "LuminaEditorSelection",
    "LuminaBlockEditor",
    "LuminaCopilotCore",
    "LuminaCopilotGuardStatus",
    "LuminaCommands"
],
    domIds: [
    "leftTabs",
    "slideType",
    "preview",
    "deckList",
    "blockList",
    "deckTitle"
],
    notes: [
      'Classic script runtime; no ES modules yet.',
      'Stage 23B aligns diagnostics with the actual renderer API.',
      'Stage-tagged files remain cache-proof rollback artifacts.',
      'Stage 24B moves Copilot event binding into a guarded classic script; Copilot core remains exposed from legacy-app.',
      'Commands live in LuminaCommands and app bridge lives in LuminaAppCommands.'
    ],
    loadOrder: [
    "js/diagnostics-stage24b.js",
    "js/module-manifest-stage24b.js",
    "js/utils-stage24b.js",
    "js/block-library-stage24b.js",
    "js/theme-stage24b.js",
    "js/presets-stage24b.js",
    "js/parser-stage24b.js",
    "js/block-style-stage24b.js",
    "js/import-stage24b.js",
    "js/state-stage24b.js",
    "js/export-stage24b.js",
    "js/renderer-stage24b.js",
    "js/deck-stage24b.js",
    "js/file-io-stage24b.js",
    "js/ui-stage24b.js",
    "js/figure-insert-stage24b.js",
    "js/diagram-editor-stage24b.js",
    "js/figure-tools-stage24b.js",
    "js/editor-selection-stage24b.js",
    "js/block-editor-stage24b.js",
    "js/legacy-app-stage24b.js",
    "js/copilot-stage24b.js",
    "js/commands-stage24b.js"
]
  });
})(window);
