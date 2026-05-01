# Lumina Presenter Stage 42B — Theme typography defaults

Stage 42B extends the Stage 42A JSON theme library with true theme-level typography defaults.

## What changed

- Themes can now store reusable font-size defaults for:
  - `titleH1FontSize`
  - `titleH2FontSize`
  - `kickerFontSize`
  - `ledeFontSize`
  - `bodyFontSize`
  - `bulletFontSize`
  - `blockHeadingFontSize`
  - `mathFontSize`
  - `codeFontSize`
  - `cardFontSize`
  - `placeholderFontSize`
- The Theme Builder UI exposes these defaults under **Theme typography defaults**.
- The renderer maps those values into CSS variables on every slide.
- Individual block-level `style.fontSize` remains the strongest override. If a block has no explicit font size, it now inherits the relevant theme default.
- `prompts/theme_prompt.txt` and the Theme Copilot JSON schema now ask for these font sizes when extracting a theme from a reference deck.
- Built-in JSON themes in `/theme` were upgraded to schema version 2 while keeping visual defaults identical to Stage 42A.

## Backward compatibility

Old themes without the new font-size fields still load. Missing typography fields are filled with defaults matching the previous renderer behavior.

## Deploy

Upload these files over the existing Stage 42A deployment. No backend changes are required.
