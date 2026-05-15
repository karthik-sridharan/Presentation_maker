# Deploy check — Stage 43X

1. Deploy the frontend zip or overlay.
2. Open `index.html?v=stage43x-selected-block-raster-mathpix-20260515-1&clearLuminaStorage=1`.
3. Import the PDF and select the visible math/text block in the preview.
4. Click **Mathpix extract** from the floating selected-block actions.
5. Confirm no `Selected block does not contain an extractable image` alert appears.
6. Confirm the diagnostic object `window.__LUMINA_STAGE43K_LAST_SELECTED_BLOCK_MATHPIX` has `ok: true` and either `hadImageSrc: true` or `rasterizedImageSrc: true`.
