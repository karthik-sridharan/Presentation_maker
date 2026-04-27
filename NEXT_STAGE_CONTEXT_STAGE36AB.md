# Context for continuing after Stage 36AB

Stage 36AB fixes the real font-size inspector. The key file patched is `js/esm/block-style-stage34j.js`; the previous bug was that the live guarded ESM block-style runtime dropped `fontSize`, so the preview renderer never received `--block-font-size` even though the classic path and saved style had been updated.

Also patched:
- `js/block-style-stage24c.js` for classic parity and inline `font-size`.
- `css/styles-stage24c.css` with strong explicit font-size overrides.
- `js/export-stage24c.js` and `js/esm/export-stage34j.js` for exported/generated HTML.
