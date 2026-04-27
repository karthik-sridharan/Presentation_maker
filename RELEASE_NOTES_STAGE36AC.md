# Stage 36AC Release Notes

Stage 36AC adds Copilot Deck Spec / Outline generation.

## Added
- New Copilot deck spec panel with paste/upload support for `.txt`, `.md`, `.markdown`, and `.json` outlines.
- New **Check deck spec** action that parses the outline and reports target slides, slide specs, figures, and demos.
- New **Generate deck from spec** action that sends a structured DeckPlan to Copilot.
- Markdown/text spec parser supporting:
  - `Deck:` / `# Deck:`
  - `Slides:`
  - `Style:` / `Theme:`
  - `Slide N:` and `Slide N-M:` ranges
  - `Content:`
  - `Figure:` / `Image:` with `Prompt:` and `Size:`
  - `Demo:` / `HTML Demo:` for custom HTML/CSS/JS blocks
  - `Topics:`
  - natural language such as `add next 3 slides on ...`
- JSON spec support when the pasted/uploaded file is already structured.

## Copilot behavior
- Deck specs are converted into a DeckPlan and passed as hard constraints.
- Figure requirements are instructed to become `mode: image` blocks with `assetPrompt`, `assetAlt`, and `assetSize`.
- Demo requirements are instructed to become `mode: custom` blocks with self-contained HTML/CSS/JS.
- Slide ranges are instructed to expand into separate slides while honoring the target slide count.

## Preserved
- Stage 36AB real font-size rendering fixes.
- Stage 36X/36W Notebook and Chalkboard themes.
- Stage 36V image-generation pipeline improvements.
- Stage 36U single-generation guard.
- Stage 36S generated-presentation navigation hardening.
