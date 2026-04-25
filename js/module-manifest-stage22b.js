/* Stage 22B migration note:
   Runtime manifest / diagnostics alignment only.
   This is a classic browser script and does not change editor behavior.
*/
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage22b-20260425-1',
    assets: [
    "css/styles-stage22b.css",
    "js/diagnostics-stage22b.js",
    "js/module-manifest-stage22b.js",
    "js/utils-stage22b.js",
    "js/block-library-stage22b.js",
    "js/theme-stage22b.js",
    "js/presets-stage22b.js",
    "js/parser-stage22b.js",
    "js/block-style-stage22b.js",
    "js/import-stage22b.js",
    "js/state-stage22b.js",
    "js/export-stage22b.js",
    "js/renderer-stage22b.js",
    "js/deck-stage22b.js",
    "js/file-io-stage22b.js",
    "js/ui-stage22b.js",
    "js/figure-insert-stage22b.js",
    "js/diagram-editor-stage22b.js",
    "js/figure-tools-stage22b.js",
    "js/editor-selection-stage22b.js",
    "js/block-editor-stage22b.js",
    "js/legacy-app-stage22b.js",
    "js/commands-stage22b.js"
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
      'Copilot remains inside legacy-app; do not split until core app is stable.',
      'Commands live in LuminaCommands and app bridge lives in LuminaAppCommands.'
    ],
    loadOrder: [
    "js/diagnostics-stage22b.js",
    "js/module-manifest-stage22b.js",
    "js/utils-stage22b.js",
    "js/block-library-stage22b.js",
    "js/theme-stage22b.js",
    "js/presets-stage22b.js",
    "js/parser-stage22b.js",
    "js/block-style-stage22b.js",
    "js/import-stage22b.js",
    "js/state-stage22b.js",
    "js/export-stage22b.js",
    "js/renderer-stage22b.js",
    "js/deck-stage22b.js",
    "js/file-io-stage22b.js",
    "js/ui-stage22b.js",
    "js/figure-insert-stage22b.js",
    "js/diagram-editor-stage22b.js",
    "js/figure-tools-stage22b.js",
    "js/editor-selection-stage22b.js",
    "js/block-editor-stage22b.js",
    "js/legacy-app-stage22b.js",
    "js/commands-stage22b.js"
]
  });
})(window);
