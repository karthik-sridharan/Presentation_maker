/* Stage 27B migration note:
   ES module migration begins with non-blocking parity modules for leaf helpers.
   The production editor still loads the Stage 24C classic-script runtime first;
   Stage 27B then loads a module smoke harness that imports ESM utilities and
   compares them against the classic globals. */
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage27b-20260425-1',
    assets: [
      'css/styles-stage24c.css',
      'js/diagnostics-stage27b.js',
      'js/module-manifest-stage27b.js',
      'js/utils-stage24c.js',
      'js/block-library-stage24c.js',
      'js/theme-stage24c.js',
      'js/presets-stage24c.js',
      'js/parser-stage24c.js',
      'js/block-style-stage24c.js',
      'js/import-stage24c.js',
      'js/state-stage24c.js',
      'js/export-stage24c.js',
      'js/renderer-stage24c.js',
      'js/deck-stage24c.js',
      'js/file-io-stage24c.js',
      'js/ui-stage24c.js',
      'js/figure-insert-stage24c.js',
      'js/diagram-editor-stage24c.js',
      'js/figure-tools-stage24c.js',
      'js/editor-selection-stage24c.js',
      'js/block-editor-stage24c.js',
      'js/legacy-app-stage24c.js',
      'js/copilot-stage24c.js',
      'js/commands-stage24c.js',
      'js/esm/utils-stage27b.js',
      'js/esm/block-style-stage27b.js',
      'js/es-module-smoke-stage27b.js'
    ],
    globals: [
      'LuminaUtils',
      'LuminaBlockLibrary',
      'LuminaTheme',
      'LuminaPresets',
      'LuminaParser',
      'LuminaBlockStyle',
      'LuminaImport',
      'LuminaState',
      'LuminaExport',
      'LuminaRendererApi',
      'LuminaDeck',
      'LuminaFileIo',
      'LuminaFigureInsert',
      'LuminaDiagramEditor',
      'LuminaFigureTools',
      'LuminaEditorSelection',
      'LuminaBlockEditor',
      'LuminaCopilotCore',
      'LuminaCopilotGuardStatus',
      'LuminaCopilotRuntimeStatus',
      'LuminaCommands',
      'LuminaEsModuleDiagnostics'
    ],
    domIds: [
      'leftTabs',
      'slideType',
      'preview',
      'deckList',
      'blockList',
      'deckTitle'
    ],
    notes: [
      'Stage 27B starts ES module migration without changing the authoritative runtime.',
      'Leaf helpers have ESM copies under js/esm/.',
      'js/es-module-smoke-stage27b.js imports the ESM helpers and verifies parity with classic globals.',
      'Full runtime conversion remains deferred until the module loader can own the complete boot path.'
    ],
    loadOrder: [
      'js/diagnostics-stage27b.js',
      'js/module-manifest-stage27b.js',
      'js/utils-stage24c.js',
      'js/block-library-stage24c.js',
      'js/theme-stage24c.js',
      'js/presets-stage24c.js',
      'js/parser-stage24c.js',
      'js/block-style-stage24c.js',
      'js/import-stage24c.js',
      'js/state-stage24c.js',
      'js/export-stage24c.js',
      'js/renderer-stage24c.js',
      'js/deck-stage24c.js',
      'js/file-io-stage24c.js',
      'js/ui-stage24c.js',
      'js/figure-insert-stage24c.js',
      'js/diagram-editor-stage24c.js',
      'js/figure-tools-stage24c.js',
      'js/editor-selection-stage24c.js',
      'js/block-editor-stage24c.js',
      'js/legacy-app-stage24c.js',
      'js/copilot-stage24c.js',
      'js/commands-stage24c.js',
      'js/es-module-smoke-stage27b.js'
    ]
  });
})(window);
