Stage 43AD frontend runtime overlay

Apply this overlay on top of your current GitHub Pages frontend, including 43X/43Y/43Z/43AC.
It intentionally contains the full js/ runtime folder plus root index.html so stale runtime files are overwritten.

Fixes included:
- Reset to clean Stage 43V runtime for import behavior.
- Preserve/strengthen Stage 43I import preview isolation.
- Do not sync/save the previous visible title/cover slide during replace-import.
- Disable automatic background Mathpix patch repair during import; use manual selected-block Mathpix/MinerU.
- Fix literal escape decoding so LaTeX \text{...} does not become ext {...}.
- Selected-block Mathpix/MinerU can use data:image, blob/http image sources, or a rasterization of the visible selected block.

Upload the CONTENTS of this folder to the repo root:
- index.html -> repo root index.html
- js/ -> repo root js/

Open with:
index.html?v=stage43ad-43v-reset-safe-import-mathpix-text-20260515-1&clearLuminaStorage=1
