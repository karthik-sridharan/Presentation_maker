Stage 24B — guarded Copilot binding

Copy/extract this flat patch directly into the Presentation_maker project root.

Runtime URL:
  index.html?v=stage24b-20260425-1&clearLuminaStorage=1

Diagnostics:
  diagnostics-stage24b.html?v=stage24b-20260425-1

What changed:
- Copilot core functions are still defined by legacy-app, but exposed through window.LuminaCopilotCore.
- Copilot UI event binding now lives in js/copilot-stage24b.js.
- js/copilot-stage24b.js loads after the main app, so Copilot failure should not prevent preview/tabs/editor startup.
- Diagnostics now reports copilotCoreExposed and copilotGuardBound separately.

Expected diagnostics:
- missingAssets: []
- missingGlobals: []
- basicUiBound: true
- previewHasContent: true
- copilotCoreExposed: true
- copilotGuardBound: true
- commandsBound: true
- bootErrors: []

Tests:
1. App loads, preview renders, and tabs work.
2. Copilot tab opens.
3. Copilot settings save/load.
4. Paste valid Copilot JSON and apply first/append/replace.
5. Only after those pass, test an actual API call.
