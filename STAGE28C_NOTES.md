# Stage 28C — forced diagnostics stage and ES module visibility

Stage 28C keeps the Stage 24C classic runtime authoritative. The ES module smoke test remains optional and non-blocking.

This patch addresses the Stage 28B report that showed `url` with `v=stage28b...` but `stage: stage28a...` and still omitted the ES module fields.

Changes:

- Forces copied reports to use the current `window.LUMINA_STAGE`.
- Adds `baseDiagnosticStage` so stale/cached diagnostic collectors are visible instead of hidden.
- Adds `stageFromWindow`, `indexStageSignature`, and `indexDatasetStage` to prove which `index.html` actually loaded.
- Adds `esModuleDiagnostics`, `esModuleSmokeStatus`, `esModuleSmokePassed`, `optionalEsmAssets`, and `optionalEsmAssetCount` to copied reports.
- Updates `diagnostics-stage28c.html` to show iframe stage/signature and detect stale-index deployments.

Expected signature after deploy:

```json
"stage": "stage28c-20260425-1",
"indexStageSignature": "index-inline-stage28c-20260425-1"
```

No Stage 28C external script is required for production startup.
