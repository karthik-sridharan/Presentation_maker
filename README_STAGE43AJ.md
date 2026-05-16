Stage 43AJ frontend runtime overlay

Built from clean Stage 43V with a targeted image-blob fix.

Fixes:
- Keeps PyMuPDF image-blob/all-text-as-image mode enabled; it is NOT remapped to hybrid.
- Adds a preview ownership guard so figure/image sync is skipped when the preview DOM belongs to the previous slide.
- Clears the preview before deck-rail slide switching, preventing cover/title image blobs from being serialized into later slides.
- Disables automatic background Mathpix repair for image-blob batches only. Manual selected-block Mathpix/MinerU remains available.
- Keeps the LaTeX text command fix so \text{...} is not decoded as a tab.

Upload contents of this folder to GitHub repo root:
- index.html -> repo root index.html
- js/ -> repo root js/

Open with:
index.html?v=stage43aj-image-blob-preview-sync-guard-text-fix-20260516-1&clearLuminaStorage=1
