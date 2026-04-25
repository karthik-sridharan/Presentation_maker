/* Stage 28A migration note:
   ES module migration remains a bridge, but the production page no longer uses a
   direct <script type="module"> tag. A classic loader owns the optional dynamic
   import so hosts with module/MIME/file:// restrictions do not produce startup
   failures. */
(function(global){
  'use strict';
  global.LuminaModuleManifest = Object.freeze({
    stage: 'stage28a-20260425-1',
    assets: [
      'css/styles-stage24c.css',
      'js/diagnostics-stage28a.js',
      'js/module-manifest-stage28a.js',
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
      'js/es-module-loader-stage28a.js'
    ],
    optionalAssets: [
      'js/esm/utils-stage28a.js',
      'js/esm/block-style-stage28a.js',
      'js/es-module-smoke-stage28a.js'
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
      'LuminaCommands'
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
      'Stage 28A hotfixes Stage 28A external-module startup failures.',
      'The production app loads js/es-module-loader-stage28a.js as a classic required script.',
      'The loader attempts an optional dynamic import of js/es-module-smoke-stage28a.js only when the browser/server environment allows it.',
      'ESM helpers remain under js/esm/ and continue parity checking when imports can run.',
      'The Stage 24C classic runtime remains authoritative and must not be blocked by ESM diagnostics.'
    ],
    loadOrder: [
      'js/diagnostics-stage28a.js',
      'js/module-manifest-stage28a.js',
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
      'js/es-module-loader-stage28a.js'
    ]
  });
})(window);
