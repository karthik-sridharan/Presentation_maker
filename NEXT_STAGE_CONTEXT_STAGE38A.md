# Next stage context after Stage 38A

Stage 38A created the canvas-first shell. Suggested next step is Stage 38B: replace mode tabs with a Keynote-like top toolbar.

Current Stage 38A structure:
- `#stage38aRailColumn` contains `#slideRailShell`.
- `#stage38aCanvasCenter` contains `.preview-wrap` and the live preview.
- `#stage38aInspectorColumn` contains the selected-item inspector panel.
- `#stage38aEditorDrawer` contains the original `.editor-shell`.

Diagnostics added:
- `stage38CanvasFirstStatus`
- `stage38CanvasFirstDiagnostics`
