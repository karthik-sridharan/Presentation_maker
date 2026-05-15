# Stage 43W deploy check

Stage: `stage43w-mathpix-text-command-render-fix-20260514-1`

## What this fixes

Mathpix selected-block extraction could return or preserve correct LaTeX like `\text{...}`, but Lumina’s literal-tab decoding converted the `\t` prefix into a space, making the slide show `ext{...}`.

## Files patched

- `js/renderer-stage24c.js` and `js/esm/renderer-stage34j.js`
- `js/export-stage24c.js` and `js/esm/export-stage34j.js`
- `js/file-io-stage24c.js` and `js/esm/file-io-stage34j.js`
- `js/legacy-app-stage24c.js`
- `index.html` stage/cache-bust strings

## Test after deploy

1. Open `index.html?v=stage43w-mathpix-text-command-render-fix-20260514-1&clearLuminaStorage=1`.
2. Import/select the Mathpix block containing `Y=f_w(X)`.
3. Run selected-block Mathpix extraction.
4. Confirm the block content displays as:

```latex
\[\mathbf{Y}=f_{\mathbf{w}}(\mathbf{X}) \in\{ \text{positive, negative}\}\]
```

It should not display `ext { positive, negative }`.
