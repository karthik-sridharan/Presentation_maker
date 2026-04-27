# Stage 38Q release notes

## What changed

1. **AI drawer**
   - Copilot is no longer shown as a normal left workflow pane.
   - Top toolbar AI/Create and center-panel AI drawer buttons open the new AI drawer.
   - AI drawer tabs separate Outline, References, Generate, and Preview & apply.
   - Copilot result JSON now has an explicit preview-summary step before apply/append/replace.

2. **Advanced drawer**
   - Current-slide JSON snippet moved out of the normal Build flow.
   - Raw JSON import moved out of normal import tools.
   - Generated HTML optional controls moved out of normal Present flow.
   - AI model, endpoint, and local API-key settings moved to Advanced.
   - Diagnostics and export diagnostics are grouped under Advanced.

## Guardrails

- Renderer/export/ESM module files were not changed.
- Existing element IDs are preserved, so legacy handlers keep working.
- Center action behavior remains command-backed; AI/Advanced opens are intercepted at window capture to avoid stale old drawer routes.
