# Deploy Check — Stage 34K

Use a cache-busting URL such as:

`index.html?v=stage34k-20260425-1&clearLuminaStorage=1`

Expected report highlights:

- `stage`: `stage34k-20260425-1`
- `expectedAssetCount`: `24`
- `missingAssets`: `[]`
- `missingGlobals`: `[]`
- `previewHasContent`: `true`
- `window.__LUMINA_COPILOT_RUNTIME_SOURCE`: `esm:js/esm/copilot-stage34k.js`
- `window.LuminaLiveRuntimeStatus.copilot.ok`: `true`
- `window.LuminaEsModuleDiagnostics.status`: `ok` or otherwise only optional warnings that preserve the classic fallback

Quick manual Copilot check:

1. Open the Copilot tab.
2. Enter a short prompt, for example: `Create one slide about gradient descent.`
3. Use a backend proxy endpoint or paste an OpenAI key locally.
4. Click **Add generated slide**.
5. Confirm a slide is appended and the editor/preview remain responsive.
