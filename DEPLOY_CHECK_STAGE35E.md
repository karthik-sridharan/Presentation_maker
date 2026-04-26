# Deploy check: Stage 35E

1. Upload the patch contents at the repository root, overwriting `index.html`.
2. Open:

```text
index.html?v=stage35e-20260425-1&clearLuminaStorage=1
```

3. Run diagnostics. Expected:

```json
{
  "stage": "stage35e-20260425-1",
  "stageFromWindow": "stage35e-20260425-1",
  "indexDatasetStage": "stage35e-20260425-1",
  "bootErrors": [],
  "capturedErrors": [],
  "efficiencyStage": "stage35e-20260425-1",
  "efficiencySummary": {
    "quickDock": true,
    "quickDockButtonCount": 7,
    "quickActionReturnHotfix": true
  }
}
```

If the report still says Stage 35C after this URL, the repository/root `index.html` was not overwritten or GitHub Pages is still serving the old file.
