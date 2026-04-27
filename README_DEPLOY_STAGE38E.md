# Deploy — Stage 38E

Deploy this folder as the static site root. The entry point is `index.html`.

Expected diagnostics after deploy:

- `stage: "stage38e-20260427-1"`
- `indexStageSignature: "index-inline-stage38e-slide-structure-outline-polish-20260427-1"`
- `stage38ESlideStructureStatus.pass: true`
- `stage38DVisualGalleryStatus.pass: true`
- `stage38CSelectionAwareInspectorStatus.pass: true`
- `esModuleSmokePassed: true`
- `visualContrastSmokePassed: true`

Cache-busting URL example:

```text
index.html?v=stage38e-20260427-1&clearLuminaStorage=1
```
