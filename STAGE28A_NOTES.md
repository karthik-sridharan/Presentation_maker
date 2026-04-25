# Stage 28A Notes

This stage is a parity-only ES module migration step. It does not replace the production runtime.

New optional ESM files:

- `js/esm/parser-stage28a.js`
- `js/esm/import-stage28a.js`
- `js/es-module-smoke-stage28a.js`

Required startup remains the Stage 24C classic graph. Rollback remains simple: redeploy Stage 27D or Stage 24C.
