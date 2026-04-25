# Stage 34J deploy check

After deploying this package, open:

https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage34j-20260425-1&clearLuminaStorage=1

The diagnostic report should include:

- `stage`: `stage34j-20260425-1`
- `stageFromWindow`: `stage34j-20260425-1`
- `indexStageSignature`: contains `stage34j-live-esm-core-renderer-export-ui`
- `optionalEsmAssetCount`: `19`
- `optionalEsmAssets` includes:
  - `js/esm/export-stage34j.js`
  - `js/esm/ui-stage34j.js`
- `liveRuntimeStatus.exportUi.ok`: `true`
- `exportRuntimeSource`: `esm:js/esm/export-stage34j.js`
- `uiRuntimeSource`: `esm:js/esm/ui-stage34j.js`

If the report still says `stage34h`, the new root `index.html` was not deployed/replaced.
