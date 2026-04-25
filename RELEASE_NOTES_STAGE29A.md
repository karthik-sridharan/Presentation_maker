# Release Notes — Stage 29A

Stage 29A extends the non-blocking ES module migration parity harness.

## Added

- `js/esm/state-stage29a.js`
- `js/esm/theme-stage29a.js`
- `js/esm/presets-stage29a.js`
- Stage 29A diagnostics page: `diagnostics-stage29a.html`

## Updated

- `index.html` stage signature and optional ESM import list.
- `diagnostics.html` / `diagnostics-stage29a.html` optional ESM asset probes.
- Migration docs and runtime inventory.

## Runtime safety

The production editor still boots through the Stage 24C classic script graph. The Stage 29A ESM harness is optional and non-blocking.
