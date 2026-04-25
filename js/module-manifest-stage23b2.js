/* Stage 23A migration note:
   Stable filename cleanup. Runtime now loads stable names such as js/utils-stage23b2.js
   while stage-tagged files can remain in the repository as rollback references.
   This is a classic browser script and does not change editor behavior.
*/
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage23b2-20260425-1',
    assets: [
    "css/styles-stage23b2.css",
    "js/diagnostics-stage23b2.js",
    "js/module-manifest-stage23b2.js",
    "js/utils-stage23b2.js",
    "js/block-library-stage23b2.js",
    "js/theme-stage23b2.js",
    "js/presets-stage23b2.js",
    "js/parser-stage23b2.js",
    "js/block-style-stage23b2.js",
    "js/import-stage23b2.js",
    "js/state-stage23b2.js",
    "js/export-stage23b2.js",
    "js/renderer-stage23b2.js",
    "js/deck-stage23b2.js",
    "js/file-io-stage23b2.js",
    "js/ui-stage23b2.js",
    "js/figure-insert-stage23b2.js",
    "js/diagram-editor-stage23b2.js",
    "js/figure-tools-stage23b2.js",
    "js/editor-selection-stage23b2.js",
    "js/block-editor-stage23b2.js",
    "js/legacy-app-stage23b2.js",
    "js/commands-stage23b2.js"
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
      'Copilot remains inside legacy-app; do not split until core app is stable.',
      'Commands live in LuminaCommands and app bridge lives in LuminaAppCommands.'
    ],
    loadOrder: [
    "js/diagnostics-stage23b2.js",
    "js/module-manifest-stage23b2.js",
    "js/utils-stage23b2.js",
    "js/block-library-stage23b2.js",
    "js/theme-stage23b2.js",
    "js/presets-stage23b2.js",
    "js/parser-stage23b2.js",
    "js/block-style-stage23b2.js",
    "js/import-stage23b2.js",
    "js/state-stage23b2.js",
    "js/export-stage23b2.js",
    "js/renderer-stage23b2.js",
    "js/deck-stage23b2.js",
    "js/file-io-stage23b2.js",
    "js/ui-stage23b2.js",
    "js/figure-insert-stage23b2.js",
    "js/diagram-editor-stage23b2.js",
    "js/figure-tools-stage23b2.js",
    "js/editor-selection-stage23b2.js",
    "js/block-editor-stage23b2.js",
    "js/legacy-app-stage23b2.js",
    "js/commands-stage23b2.js"
]
  });
})(window);
