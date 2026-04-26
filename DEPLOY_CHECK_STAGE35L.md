# Deploy check — Stage 35L

1. Replace the GitHub Pages root `index.html` with the file from this patch.
2. Open:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35l-20260425-1&clearLuminaStorage=1
```

3. Copy the diagnostic report. Expected fields:

```json
"stage": "stage35l-20260425-1",
"indexStageSignature": "index-inline-stage35l-slide-jump-feature-polish-20260425-1",
"esModuleSmokePassed": true,
"visualContrastSmokePassed": true,
"visualContrastAudit": { "failureCount": 0 },
"featurePolishStage": "stage35l-20260425-1"
```

4. Manual smoke:

- Confirm the quick dock contains **Jump slide** and **Help / keys**.
- Click **Jump slide** and confirm the overlay opens.
- Type part of a slide title and confirm the list filters.
- Click a slide and confirm the deck rail selection/preview changes.
- Press `Ctrl/⌘ + K` while not editing text and confirm the overlay opens.
- Press `Esc` and confirm it closes.
- Confirm Update slide / Add slide / Duplicate still work from the quick dock.
