# Runtime Inventory — Stage 23B2 Known-Good

This inventory documents the current known-good runtime used before Stage 24A.

Stage 24A does not alter these runtime files.

## Entry points

```text
index.html
diagnostics-stage23b2.html
```

## Stylesheet

```text
css/styles-stage23b2.css
```

## Script load order

The current app uses classic scripts, loaded in this order:

1. `js/diagnostics-stage23b2.js`
2. `js/module-manifest-stage23b2.js`
3. `js/utils-stage23b2.js`
4. `js/block-library-stage23b2.js`
5. `js/theme-stage23b2.js`
6. `js/presets-stage23b2.js`
7. `js/parser-stage23b2.js`
8. `js/block-style-stage23b2.js`
9. `js/import-stage23b2.js`
10. `js/state-stage23b2.js`
11. `js/export-stage23b2.js`
12. `js/renderer-stage23b2.js`
13. `js/deck-stage23b2.js`
14. `js/file-io-stage23b2.js`
15. `js/ui-stage23b2.js`
16. `js/figure-insert-stage23b2.js`
17. `js/diagram-editor-stage23b2.js`
18. `js/figure-tools-stage23b2.js`
19. `js/editor-selection-stage23b2.js`
20. `js/block-editor-stage23b2.js`
21. `js/legacy-app-stage23b2.js`
22. `js/commands-stage23b2.js`

## External async libraries

These are loaded asynchronously by `index.html`:

```text
MathJax
html2canvas
jsPDF
```

They should not block the local app shell from booting.

## Runtime globals expected by diagnostics

Key runtime/global checks include:

```text
LuminaDiagnostics
LuminaModuleManifest
LuminaRendererApi
LuminaAppCommands
LuminaCommands
```

The renderer API bridge exposes:

```text
LuminaRendererApi.buildSlideMarkup
LuminaRendererApi.normalizeSlide
LuminaRendererApi.legacyBuildPreview
```

## DOM ids expected by diagnostics

Important shell DOM ids include:

```text
preview
deckList
tabFiles
tabSlides
tabInsert
tabDesign
tabCopilot
```

## Known caveats

- `legacy-app-stage23b2.js` still contains Copilot logic.
- Copilot has not yet been safely extracted.
- Figure crop is still inconsistent and should be repaired with a dedicated test workflow.
- Stage-tagged files should remain until a stable-file deployment is proven clean.
