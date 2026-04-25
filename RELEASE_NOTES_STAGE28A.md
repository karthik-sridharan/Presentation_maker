# Release Notes — Stage 28A

Stage 28A continues the ES module migration without changing the production boot path.

## What changed

- Added ESM parity copies for structured text parsing: `js/esm/parser-stage28a.js`.
- Added ESM parity copies for import parsers/helpers: `js/esm/import-stage28a.js`.
- Extended `js/es-module-smoke-stage28a.js` to compare utility, block-style, parser, and import helper behavior against the classic Stage 24C globals.
- Kept `index.html` on the known-good Stage 24C classic runtime.
- Kept ES module loading optional and non-blocking through inline dynamic import.
- Updated the copied startup diagnostics so `LuminaDiagnostics.collectReport()` includes `esModuleDiagnostics`.

## Expected browser result

The classic editor should boot with no missing assets, no missing globals, and no boot errors. If the production host supports module imports, the copied diagnostics should include:

```js
esModuleDiagnostics.ok === true
esModuleDiagnostics.status === "passed"
```

If module imports are blocked, the editor should still boot and the optional ES module status should show a diagnostic-only failure.
