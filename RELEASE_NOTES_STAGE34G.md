# Release Notes: Stage 34G

Stage 34G continues the guarded ES module migration from Stage 34F.

## What changed

- `LuminaFigureTools` now runs from `js/esm/figure-tools-stage34g.js` when dynamic import succeeds.
- The classic `LuminaFigureTools` runtime is captured as `LuminaClassicFigureToolsStage34G` before promotion.
- Diagnostics now report `figureToolsRuntimeSource`, `classicFigureToolsShadowReady`, and `liveRuntimeStatus.figureTools`.
- The parity harness now asserts the live Figure Tools runtime source in addition to workflow parity.

## Runtime safety

All promoted ESM modules remain guarded and optional. If an ESM import fails, Stage 34G preserves the captured Stage 24C classic runtime and records the failure as an optional diagnostic warning instead of surfacing a startup error.

## Test URL

```text
index.html?v=stage34g-20260425-1&clearLuminaStorage=1
```

## Expected markers

```text
stage: stage34g-20260425-1
bootErrors: []
capturedErrors: []
esModuleDiagnostics.ok: true
esModuleSmokePassed: true
figureToolsRuntimeSource: esm:js/esm/figure-tools-stage34g.js
classicFigureToolsShadowReady: true
```
