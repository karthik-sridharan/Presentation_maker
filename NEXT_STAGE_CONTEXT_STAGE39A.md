# Next-stage context after Stage 39A

Stage 39A makes Copilot safer and clearer by splitting generation from deck mutation.

Suggested next stage: **Stage 39B import/reference pipeline polish**.

Recommended Stage 39B scope:

1. Make import/reference tools first-class:
   - Markdown outline → deck
   - LaTeX/Beamer outline → deck
   - PDF/image → reference assets
   - JSON outline remains under Advanced unless explicitly selected
2. Feed imported references into the AI drawer reference area without creating unwanted slides by default.
3. Add reference chips/list UI showing uploaded file names and whether they are text/PDF/image.
4. Add diagnostics for import-to-AI reference flow.

Preserve:
- Stage 38R diagnostics alignment.
- Stage 39A preview-only generation and Apply-only mutation.
- Advanced drawer hiding for low-level JSON/debug controls.
