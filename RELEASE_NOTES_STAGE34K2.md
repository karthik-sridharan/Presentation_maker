# Stage 34K Hotfix 2

Fixes the Stage 34K diagnostic failure where `js/esm/copilot-stage34k.js` loaded and imported successfully, but the live Copilot runtime stayed at `classic-preserved:legacy-app-stage24c.js`.

Changes:

- Bumps cache marker to `stage34k-20260425-2`.
- Keeps the normal Stage 34K dependency bridge when available.
- Adds a compatibility dependency bridge in `index.html` when the deployed `legacy-app-stage24c.js` is stale or does not expose `window.LuminaCopilotDepsStage34K`.
- Updates the Copilot ESM core so compatibility mode can expose the ESM runtime while safely delegating stateful actions to the preserved classic core.
