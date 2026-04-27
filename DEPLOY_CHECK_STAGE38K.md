# Deploy Check — Stage 38K

After deployment, hard refresh with:

```
index.html?v=stage38k-20260427-1&clearLuminaStorage=1
```

Then copy diagnostics and confirm:

- `stage === "stage38k-20260427-1"`
- `stage38KCompactToolbarStatus.pass === true`
- `stage38KCompactToolbarStatus.tests.toolbarCompact === true`
- `stage38KCompactToolbarStatus.tests.buttonsCompact === true`
- `stage38FCanvasFitStatus.pass === true`
- `stage38ISafeDeckSyncStatus.tests.pass === true`
- `bootErrors` and `capturedErrors` are empty
