# Stage 27B Hotfix Notes

Stage 27B fixes the Stage 27A browser load failure:

> Failed to load js/es-module-smoke-stage27a.mjs

The Stage 27A zip contained the file, but many static hosts do not serve `.mjs` with a module-compatible JavaScript MIME type. Browsers reject module scripts unless the MIME type is JavaScript-compatible.

## What changed

- Replaced active `.mjs` module assets with `.js` files loaded via `<script type="module">`.
- Updated the module smoke harness imports:
  - `js/esm/utils-stage27b.js`
  - `js/esm/block-style-stage27b.js`
- Updated diagnostics and manifest expectations to reference only `.js` module assets.
- Kept the classic Stage 24C runtime authoritative.

## Validation URL

Use a fresh cache-busted URL after deploying:

```text
index.html?v=stage27b-20260425-1&clearLuminaStorage=1
diagnostics-stage27b.html?v=stage27b-20260425-1
```

Expected browser result:

```js
window.LuminaEsModuleDiagnostics && window.LuminaEsModuleDiagnostics.ok === true
```
