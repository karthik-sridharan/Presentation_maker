# Deploy check — Stage 35W

After uploading the root patch, open:

`index.html?v=stage35w-20260426-1&clearLuminaStorage=1`

Confirm diagnostics report:

- `stage`: `stage35w-20260426-1`
- `indexStageSignature`: `index-inline-stage35w-editable-figure-hotfix-20260426-1`
- `bootErrors`: empty
- `capturedErrors`: empty
- `window.__LUMINA_STAGE35W_EDITABLE_FIGURE_HOTFIX.bound`: `true`


Stage 35W note: fixes save-back by updating the live preview figure before the legacy figure-position sync runs, preventing the old SVG from overwriting the edited one.
