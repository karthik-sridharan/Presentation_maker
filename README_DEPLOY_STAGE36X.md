# Lumina Presenter — Stage 36X Clean Deploy

This folder is a deploy-ready static bundle. Upload the contents of this folder to static hosting such as GitHub Pages, Netlify, Vercel static output, S3, or any plain web server.

Start at:

- `index.html`

Runtime folders:

- `css/` — active stylesheet used by `index.html`
- `js/` — active classic and guarded ESM runtime assets used by `index.html`
- `prompts/` — Copilot developer/deck prompts loaded at runtime

This clean bundle intentionally excludes old migration snapshots, previous-stage release notes, diagnostics pages, build scripts, and rollback artifacts.

## Stage 36X additions

- Copilot schema can now request `custom` blocks for HTML demos/animations.
- Copilot schema can now request `image` blocks with `assetPrompt`, `assetAlt`, and `assetSize` fields.
- Copilot materializes up to 6 generated image blocks per request using the configured OpenAI-compatible image generation endpoint.
- Copilot attaches text style context and attempts to attach a screenshot of the current slide preview as visual style context.
- Generated image failures fall back to an explicit placeholder block instead of breaking deck generation.

## Deployment

Deploy the folder contents as-is. Keep relative paths intact.

For cache-busting, load:

`index.html?v=stage36x-20260427-1&clearLuminaStorage=1`



## Stage 36X note
Copilot deck/slide generation now uses an in-flight lock and disables generation buttons while running, preventing duplicate full-deck appends from a single click or double-bound handler.
