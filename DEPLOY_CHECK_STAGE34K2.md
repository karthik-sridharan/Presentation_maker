# Stage 34K hotfix 2 deploy check

Upload these files to the repository root, replacing existing files:

- `index.html`
- `js/copilot-stage34k.js`
- `js/esm/copilot-stage34k.js`
- `js/legacy-app-stage24c.js`

Then test:

`index.html?v=stage34k-20260425-2&clearLuminaStorage=1`

Expected diagnostics:

- `missingAssets: []`
- `bootErrors: []`
- `capturedErrors: []`
- `esModuleSmokePassed: true`
- `copilotRuntimeStatus.runtimeSource` may be `esm:js/esm/copilot-stage34k.js`
- `liveRuntimeStatus.copilot.source === "esm"`
- `liveRuntimeStatus.copilot.asset === "js/esm/copilot-stage34k.js"`

This hotfix handles both cases:
1. The Stage 34K dependency bridge in `legacy-app-stage24c.js` is present.
2. The deployed legacy file is stale and lacks `window.LuminaCopilotDepsStage34K`; in that case, the ESM Copilot installs through a classic-core compatibility bridge instead of falling back to classic runtime source.
