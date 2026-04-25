# Runtime Inventory — Stage 30A Checkpoint

Stage 30A continues ES module migration without changing the core editor behavior. The editor still boots through Stage 24C classic scripts, then an inline optional dynamic import runs the Stage 30A ESM parity harness.

## Required classic runtime assets

The required startup path remains unchanged from Stage 24C:

```text
css/styles-stage24c.css
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

## Optional ESM parity assets

These files are non-blocking and are dynamically imported only by the diagnostics/parity harness:

```text
js/esm/utils-stage30a.js
js/esm/block-style-stage30a.js
js/esm/parser-stage30a.js
js/esm/import-stage30a.js
js/esm/state-stage30a.js
js/esm/theme-stage30a.js
js/esm/presets-stage30a.js
js/esm/renderer-stage30a.js
```

## Startup guardrail

No Stage 30A file is required for editor startup. If optional ESM parity fails, the production editor should still boot and the failure should appear only in `window.LuminaEsModuleDiagnostics`.
