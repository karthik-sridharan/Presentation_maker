# Stage 42A — JSON Theme Library + Theme Copilot

This deploy adds a JSON-backed theme system.

## What changed

- Built-in theme presets now live in `/theme/*.json`.
- `/theme/manifest.json` lists the available theme JSON files.
- `js/theme-stage24c.js` and `js/esm/theme-stage34j.js` now consult `window.LuminaThemeRegistry` before falling back to legacy hardcoded presets.
- A new `js/theme-json-stage42a.js` add-on loads the theme manifest, renders a JSON theme library UI, and keeps the older visual theme gallery synced.
- The theme builder now has:
  - **Save current theme JSON**
  - **Load theme JSON**
  - **Theme Copilot**: upload/paste a reference presentation and generate a reusable Lumina theme.
- Theme Copilot uses `prompts/theme_prompt.txt`.

## New files

- `theme/manifest.json`
- `theme/classic.json`
- `theme/berkeley.json`
- `theme/madrid.json`
- `theme/annarbor.json`
- `theme/cambridgeus.json`
- `theme/pittsburgh.json`
- `theme/notebook.json`
- `theme/chalkboard.json`
- `js/theme-json-stage42a.js`
- `css/theme-json-stage42a.css`
- `prompts/theme_prompt.txt`

## Manual test

1. Deploy all files, including the new `/theme` directory.
2. Open the app with `?clearLuminaStorage=1`.
3. Go to the theme builder.
4. Confirm the JSON theme library appears and shows 8 themes.
5. Apply Madrid or Chalkboard and confirm the preview changes.
6. Click **Save current theme JSON** and confirm a `.json` theme downloads.
7. Load that JSON back and confirm it reapplies.
8. In Theme Copilot, paste a source presentation URL or upload a PDF/HTML/text deck, generate a theme, review the JSON, then apply it.
