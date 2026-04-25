# Lumina Presenter Stage 31A — ESM deck/import/figure/library parity

Stage 31A continues the ES module migration while keeping the production editor on the known-good Stage 24C classic-script runtime.

## Added optional ES module leaves

- `js/esm/deck-stage31a.js`
- `js/esm/file-io-stage31a.js`
- `js/esm/figure-insert-stage31a.js`
- `js/esm/block-library-stage31a.js`

These are loaded only by the inline non-blocking parity harness. They are not startup-critical.

## Carried forward from Stage 30A

- utilities
- block style helpers
- structured-text parser
- import parsers
- autosave/state helpers
- theme/style helpers
- slide presets
- renderer helpers

## Expected diagnostic signals

- `stage`: `stage31a-20260425-1`
- `indexStageSignature`: `index-inline-stage31a-20260425-1`
- `bootErrors`: `[]`
- `capturedErrors`: `[]`
- `esModuleSmokePassed`: `true`
- `esModuleSmokeStatus`: `passed`
- `optionalEsmAssetCount`: `12`

## Rollback

Rollback is unchanged: redeploy Stage 30A or Stage 24C. Stage 31A does not replace the classic runtime path.
