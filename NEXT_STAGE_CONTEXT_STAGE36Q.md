# Context for Continuing After Stage 36Q

This is the clean continuation bundle. It contains only runtime assets and concise stage notes.

Important runtime files:

- `index.html` — main shell and inline guarded stage code.
- `css/styles-stage24c.css` — active stylesheet.
- `js/legacy-app-stage24c.js` — classic core runtime and fallback Copilot core.
- `js/esm/copilot-stage34k.js` — guarded ESM Copilot core, patched in Stage 36Q.
- `js/export-stage24c.js` and `js/esm/export-stage34j.js` — export paths for generated HTML.
- `prompts/dev.txt` and `prompts/deck.txt` — deck-generation prompt files.

Recent user-requested behavior already in this bundle:

- Generated HTML: touch devices require double tap or Next button for advancing; desktop click still advances.
- Generated HTML: pointer menu includes Red, Blue, Green, Pointer, and None.
- Generated HTML: Full screen button appears next to Previous/Next and Cmd/Ctrl+F toggles full screen.
- Generated HTML: optional controls are selectable in the export panel.
- Generated HTML: buttons fade out after 2 seconds of inactivity.
- Editor: undo/redo was added.
- Copilot: supports custom HTML blocks and generated-image blocks.
- Copilot: attempts to attach current slide style context/screenshot to generation requests.

Likely next improvements:

- Add a visible Copilot UI chip showing whether style screenshot context attached successfully.
- Add a user-facing option to limit the number of generated images per Copilot request.
- Add stricter sanitization/validation preview for custom HTML blocks.
- Add a server-side proxy path for safer API keys and image generation.


## Stage 36S note
Generated standalone presentation navigation was hardened after a report that Next/Previous and the slide map did not change slides. Look in `js/export-stage24c.js` and `js/esm/export-stage34j.js` around `setVisibleSlideState`, `render`, `go`, and the slide-map event delegation.
