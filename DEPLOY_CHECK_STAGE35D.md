# Deploy check: Stage 35D

1. Upload the patch contents at the repository root.
2. Open:

```text
index.html?v=stage35d-20260425-1&clearLuminaStorage=1
```

3. Run diagnostics. Expected:

```json
{
  "stage": "stage35d-20260425-1",
  "bootErrors": [],
  "capturedErrors": [],
  "efficiencyStage": "stage35d-20260425-1",
  "efficiencySummary": {
    "quickDock": true,
    "quickDockButtonCount": 7,
    "quickActionReturnHotfix": true
  }
}
```

4. Manually test Quick Dock: Add slide, Duplicate, Update slide, Compact view, Hide rail.
