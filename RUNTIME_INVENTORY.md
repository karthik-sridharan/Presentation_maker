# Runtime Inventory — Stage 27C Checkpoint

Stage 27C starts ES module migration without changing the core editor behavior. The editor still boots through Stage 24C classic scripts, then a Stage 27C ES module harness runs after those scripts and reports parity diagnostics.

## Root files

```text
index.html
diagnostics.html
diagnostics-stage27c.html
```

## CSS

```text
css/styles-stage24c.css
```

## Classic JavaScript load order

```text
js/diagnostics-stage27c.js
js/module-manifest-stage27c.js
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

## ES module harness

```text
js/esm/utils-stage27c.js
js/esm/block-style-stage27c.js
js/es-module-smoke-stage27c.js
```

The harness is loaded with:

```html
<script src="js/es-module-loader-stage27c.js?v=stage27c-20260425-1"></script>
```

## External CDNs

These are loaded asynchronously and should not block the local app shell:

```text
https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js
https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
```

## Important global APIs exposed

```text
window.LuminaDiagnostics
window.LuminaModuleManifest
window.LuminaRendererApi
window.LuminaAppCommands
window.LuminaCommands
window.LuminaCopilotCore
window.LuminaCopilotGuard
window.LuminaCopilotRuntimeStatus
window.LuminaEsModuleDiagnostics
```

## Notes

- `index.html` remains the safe classic runtime entry point.
- The new ESM files are not yet authoritative for production behavior.
- `window.LuminaEsModuleDiagnostics.ok === true` is the gate for continuing ES module conversion.
- A full ESM runtime should not replace this path until all startup diagnostics and parity checks are stable.
