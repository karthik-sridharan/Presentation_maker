# Runtime Inventory — Stage 28A Checkpoint

Stage 28A continues ES module migration without changing the core editor behavior. The editor still boots through Stage 24C classic scripts, then an inline optional dynamic import runs the Stage 28A ESM parity harness.

## Root files

```text
index.html
diagnostics.html
diagnostics-stage28a.html
```

## Required CSS

```text
css/styles-stage24c.css
```

## Required classic JavaScript load order

```text
js/diagnostics-stage24c.js
js/module-manifest-stage24c.js
js/utils-stage24c.js
js/block-library-stage24c.js
js/theme-stage24c.js
js/presets-stage24c.js
js/parser-stage24c.js
js/block-style-stage24c.js
js/import-stage24c.js
js/state-stage24c.js
js/export-stage24c.js
js/renderer-stage24c.js
js/deck-stage24c.js
js/file-io-stage24c.js
js/ui-stage24c.js
js/figure-insert-stage24c.js
js/diagram-editor-stage24c.js
js/figure-tools-stage24c.js
js/editor-selection-stage24c.js
js/block-editor-stage24c.js
js/legacy-app-stage24c.js
js/copilot-stage24c.js
js/commands-stage24c.js
```

## Optional ES module harness

```text
js/esm/utils-stage28a.js
js/esm/block-style-stage28a.js
js/esm/parser-stage28a.js
js/esm/import-stage28a.js
js/es-module-smoke-stage28a.js
```

## Important globals

```text
window.LuminaDiagnostics
window.LuminaModuleManifest
window.LuminaRendererApi
window.LuminaAppCommands
window.LuminaCommands
window.LuminaCopilotCore
window.LuminaCopilotGuardStatus
window.LuminaCopilotRuntimeStatus
window.LuminaEsModuleDiagnostics
```
