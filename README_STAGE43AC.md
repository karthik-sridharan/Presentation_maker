# Stage 43AC frontend reset overlay

Apply this overlay on top of 43X/43Y/43Z/43AB by uploading the contents of this folder to the GitHub repo root.

It resets the full frontend runtime `js/` folder and `index.html`, keeps the `\text{...}` fix, and disables automatic background Mathpix patch repair during import. Manual selected-block Mathpix/MinerU actions remain available.

This overlay also removes the pre-import preview/editor sync step, which prevents stale cover/title-slide blocks from being written into imported slides while replacing the deck.

For PyMuPDF image-patch title bleed, the backend must also be Stage 43AC or clean Stage 43V+. Check backend `/health`.
