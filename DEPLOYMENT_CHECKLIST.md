# Deployment Checklist — Stage 27A

## Before deploy

- Confirm the Stage 24C rollback archive is retained.
- Upload all files listed in `RELEASE_FILES_STAGE27A.json`.
- Keep the `js/esm/` folder structure intact; module imports are relative.

## After deploy

1. Open `index.html?v=stage27a-20260425-1&clearLuminaStorage=1`.
2. Confirm the editor preview renders a slide.
3. Confirm tabs and command shortcuts bind.
4. Open `diagnostics-stage27a.html?v=stage27a-20260425-1`.
5. Confirm:

```json
{
  "missingAssets": [],
  "missingGlobals": [],
  "missingDomIds": [],
  "esModuleSmokePassed": true,
  "bootErrors": []
}
```

## Rollback

If any Stage 27A diagnostics fail, roll back to the Stage 24C index and assets documented in `ROLLBACK.md`.
