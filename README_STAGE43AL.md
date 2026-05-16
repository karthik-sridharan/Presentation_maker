# Stage 43AL frontend overlay

Built on working Stage 43AK.

Fixes selected-block Mathpix/MinerU extraction for image blocks that are visible in the preview but do not expose a plain `data:image` source in the selected block record. The selected-block path now:

- prefers the actual selected figure/freeform image block over stale preview target state;
- resolves `data:image`, `blob:`, HTTP, SVG, and canvas-backed images to a PNG data URL;
- falls back to rasterizing the visible selected block/figure with html2canvas;
- keeps the Stage 43AK image-blob source guard and import leak fix intact;
- keeps the `\text{...}` fix intact.

Upload the contents of this folder to the GitHub repo root.
