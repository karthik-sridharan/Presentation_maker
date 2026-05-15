# Lumina Presentation Maker — Stage 43AA

Stage: `stage43aa-43v-baseline-safe-mathpix-text-20260515-1`

This build is intentionally based on the known-good Stage 43V frontend and restores the Stage 43V import path.

Changes from 43V are deliberately narrow:

- Fix literal LaTeX `\text{...}` corruption by no longer decoding every `\t` as a tab.
- Repair Mathpix/MinerU selected-block outputs such as `ext { ... }` back to `\text{...}` before saving.
- Avoid saving the whole slide as a checkpoint during selected-block extraction, so stale form fields cannot overwrite an imported slide.
- Resolve selected-block image sources from embedded `data:image`, canvas, blob, or same-origin image elements without changing the import pipeline.

No 43X/43Y/43Z import rescue or review fallback code is included.
