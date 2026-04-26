# Deploy check — Stage 35I

1. Upload/replace `index.html` at the GitHub Pages root.
2. Open:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35i-20260425-1&clearLuminaStorage=1
```

3. Copy the diagnostic report. Expected fields:

```json
"stage": "stage35i-20260425-1",
"indexStageSignature": "index-inline-stage35i-contrast-audit-regression-guard-20260425-1",
"visualContrastAuditStage": "stage35i-20260425-1",
"visualContrastSmokePassed": true,
"visualContrastAudit": { "failureCount": 0 }
```

If `failureCount` is nonzero, paste the report back so the specific selector/colors can be patched.
