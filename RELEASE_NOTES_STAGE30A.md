# Stage 30A release notes

Stage 30A extends the optional ES module parity track to renderer helpers.

The production editor runtime still boots from the known-good Stage 24C classic scripts. The new ES module renderer is loaded only by the non-blocking diagnostics/parity harness.

New optional ESM asset:

- `js/esm/renderer-stage30a.js`

Expected report signals:

```json
{
  "stage": "stage30a-20260425-1",
  "indexStageSignature": "index-inline-stage30a-20260425-1",
  "bootErrors": [],
  "capturedErrors": [],
  "esModuleSmokePassed": true,
  "esModuleSmokeStatus": "passed",
  "optionalEsmAssetCount": 8
}
```
