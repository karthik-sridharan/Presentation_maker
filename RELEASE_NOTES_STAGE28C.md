# Release notes — Stage 28C

Stage 28C is a diagnostic hardening patch for the ES module migration bridge.

## Fixed

- Copied diagnostic reports now force the active stage from `window.LUMINA_STAGE` instead of preserving stale `report.stage` values.
- Reports include stage provenance fields: `baseDiagnosticStage`, `stageFromWindow`, `indexStageSignature`, and `indexDatasetStage`.
- Reports include optional ES module smoke fields even when an older diagnostic collector was loaded first.
- `diagnostics-stage28c.html` now checks whether the iframe is truly running Stage 28C.

## Runtime safety

- Required startup remains on Stage 24C classic scripts.
- ES module smoke remains optional and non-blocking.
- No direct production `type=module` script is required.

## Browser test URL

`index.html?v=stage28c-20260425-1&clearLuminaStorage=1`

`diagnostics-stage28c.html?v=stage28c-20260425-1`
