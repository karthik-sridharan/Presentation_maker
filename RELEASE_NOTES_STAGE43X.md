# Stage 43X — selected-block Mathpix raster fallback

Fixes selected-block Mathpix extraction when the selected block is an editable/freeform text or math block rather than an imported `data:image` patch.

## Changes

- Selected-block Mathpix now prepares a usable image before calling the backend.
- If the block already contains a `data:image`, it uses that image directly.
- If the visible block is an image/canvas/svg, it converts that visible media to a PNG/data URL when possible.
- If the selected block is editable text/math with no embedded image, it rasterizes the selected preview block to a PNG and sends that to Mathpix.
- MinerU selected-block extraction gets the same raster fallback.
- If rasterization is impossible but the block has repairable LaTeX command damage such as `ext { ... }`, the selected block is repaired locally instead of failing with the backend image-source error.

## Expected result

Running **Extract selected block with Mathpix** on the visible block should no longer fail with:

`Selected block does not contain an extractable image.`
