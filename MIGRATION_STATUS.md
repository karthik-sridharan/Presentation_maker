# Lumina Presenter Migration Status

Current stable baseline: **Stage 21B diagnostics**, built on the last confirmed working **Stage 20** runtime.

## Stage 21B changes

This is a non-feature migration safety patch. It does **not** split Copilot and does **not** change editor behavior.

Added:

- `js/diagnostics-stage21b.js`
- `diagnostics-stage21b.html`
- cache-proof stage-21B runtime filenames
- per-script `onload`/`onerror` diagnostics
- a bottom-right **Diagnostics** button in the app
- expected-global checks after startup

## Confirmed modular layers through Stage 20

- `utils`
- `block-library`
- `theme`
- `presets`
- `parser`
- `block-style`
- `import`
- `state/autosave`
- `export`
- `renderer`
- `deck/snippet`
- `file-io`
- `ui`
- `figure-insert`
- `diagram-editor`
- `figure-tools` — duplicate fixed; crop still needs UX/behavior review
- `editor-selection`
- `block-editor`

## Do not split yet

Copilot has broken startup twice. Leave it inside the main runtime until the remaining app core is cleaner and the diagnostics layer has been tested.

## Test URL

```text
http://localhost:8000/index.html?v=stage21b-20260425-1&clearLuminaStorage=1
```

## Diagnostic URL

```text
http://localhost:8000/diagnostics-stage21b.html?v=stage21b-20260425-1
```
