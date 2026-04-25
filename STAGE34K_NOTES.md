# Stage 34K

Stage 34K promotes the Copilot core to guarded live ES modules while keeping the legacy Stage 24C app shell authoritative for mutable deck state.

## What changed

- Added `js/esm/copilot-stage34k.js`, a side-effect-free ES module exporting `createApi(deps)`.
- Added `js/copilot-stage34k.js`, a guarded classic binder whose button handlers resolve `window.LuminaCopilotCore` dynamically.
- Added a narrow dependency bridge, `window.LuminaCopilotDepsStage34K`, from `legacy-app-stage24c.js` so the ESM Copilot can read/write deck state without migrating the whole app shell.
- Added an inline guarded loader in `index.html` that captures the classic Copilot core as `window.LuminaClassicCopilotCoreStage34K`, tries the ESM core, and falls back to the classic core without blocking the editor.
- Added Copilot to the optional ESM asset list and smoke/parity diagnostics.

## Fallback rule

If `js/esm/copilot-stage34k.js` fails to load, parse, or initialize, `window.LuminaCopilotCore` remains the classic core from `legacy-app-stage24c.js` and diagnostics record an optional ESM warning rather than a startup failure.
