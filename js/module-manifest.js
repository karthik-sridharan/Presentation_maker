/* Stage 23A migration note:
   Stable filename cleanup. Runtime now loads stable names such as js/utils.js
   while stage-tagged files can remain in the repository as rollback references.
   This is a classic browser script and does not change editor behavior.
*/
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage23a-stable-20260425-1',
    assets: [
    "css/styles.css",
    "js/diagnostics.js",
    "js/module-manifest.js",
    "js/utils.js",
    "js/block-library.js",
    "js/theme.js",
    "js/presets.js",
    "js/parser.js",
    "js/block-style.js",
    "js/import.js",
    "js/state.js",
    "js/export.js",
    "js/renderer.js",
    "js/deck.js",
    "js/file-io.js",
    "js/ui.js",
    "js/figure-insert.js",
    "js/diagram-editor.js",
    "js/figure-tools.js",
    "js/editor-selection.js",
    "js/block-editor.js",
    "js/legacy-app.js",
    "js/commands.js"
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
      'Stage 23A switches active runtime paths to stable filenames.',
      'Stage-tagged files may remain in the repo as rollback artifacts.',
      'Copilot remains inside legacy-app; do not split until core app is stable.',
      'Commands live in LuminaCommands and app bridge lives in LuminaAppCommands.'
    ],
    loadOrder: [
    "js/diagnostics.js",
    "js/module-manifest.js",
    "js/utils.js",
    "js/block-library.js",
    "js/theme.js",
    "js/presets.js",
    "js/parser.js",
    "js/block-style.js",
    "js/import.js",
    "js/state.js",
    "js/export.js",
    "js/renderer.js",
    "js/deck.js",
    "js/file-io.js",
    "js/ui.js",
    "js/figure-insert.js",
    "js/diagram-editor.js",
    "js/figure-tools.js",
    "js/editor-selection.js",
    "js/block-editor.js",
    "js/legacy-app.js",
    "js/commands.js"
]
  });
})(window);
