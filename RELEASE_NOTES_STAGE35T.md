# Stage 35T — Direct Preview Editing

Stage 35T adds guarded direct editing inside the live preview.

## Added
- Click the visible slide title, kicker, lede, or a normal text-like content block in the preview and type directly.
- Edits commit back into the existing left-side form and JSON/snippet flow on blur or Ctrl/⌘+Enter.
- Direct editing is intentionally skipped for custom HTML/iframe blocks, figure blocks, and MathJax-rendered blocks to avoid corrupting complex embedded content.
- Copied diagnostics now report `directPreviewEditStatus` and the number of editable preview elements.

## Preserved
- Stage 35S thumbnail slide rail.
- Existing block/figure/style inspectors and keyboard command bridge.
- Existing autosave and preview renderer behavior.
