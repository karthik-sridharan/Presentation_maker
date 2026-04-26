# Stage 35F deploy check

Use this URL after uploading the patch:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35f-20260425-1&clearLuminaStorage=1
```

Expected diagnostics:

- `stage`: `stage35f-20260425-1`
- `stageFromWindow`: `stage35f-20260425-1`
- `indexStageSignature`: `index-inline-stage35f-classic-color-balance-quick-action-hotfix-20260425-1`
- `esModuleSmokeStatus`: `passed`
- `bootErrors`: `[]`
- `capturedErrors`: `[]`
- `efficiencySummary.quickActionReturnHotfix`: `true`
- `colorBalanceStage`: `stage35f-20260425-1`

Manual visual checks:

- Workflow tabs use dark blue active state with white readable labels.
- Subtabs use dark blue active state with white readable labels.
- Inactive tabs/cards remain light with dark text.
- Quick Dock primary button remains dark blue/white.
- Compact mode still toggles and persists.
