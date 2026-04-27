# Release notes — Stage 38B

- Adds a Keynote-style persistent top toolbar above the canvas-first workspace.
- Toolbar provides quick Add slide, Update, Duplicate, Undo/Redo, Create/Edit/Present/Advanced mode shortcuts, Theme, AI, and Export actions.
- Keeps Stage 38A three-panel canvas-first structure: slide rail left, slide canvas center, selected-item inspector right, full editor in drawer.
- Adds Stage 38B diagnostics under `stage38KeynoteToolbarStatus` and `stage38KeynoteToolbarDiagnostics`.
- Maintains the Stage 37H passing ESM/parity baseline and all Stage 36/37 Copilot/reference/PDF/spec support.

Hotfix v3:
- Moved the Stage 38B toolbar `<style>`/`<script>` block out of the SVG figure-editor HTML template literal and into the main document tail.
- Fixes Safari/Chrome startup parse error: `SyntaxError: Unexpected EOF at index.html:3490:0`.
