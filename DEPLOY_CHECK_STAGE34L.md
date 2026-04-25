# Stage 34L deploy check

Stage 34L is cleanup-only. It does not migrate a new feature module.

Test URL:

```text
index.html?v=stage34l-20260425-1&clearLuminaStorage=1
```

Expected diagnostics:

```text
stage: "stage34l-20260425-1"
esModuleSmokePassed: true
liveRuntimeStatus.copilot.source: "esm"
copilotRuntimeSource: "esm:js/esm/copilot-stage34k.js"
copilotRuntimeStage: "stage34l-20260425-1"
bootErrors: []
capturedErrors: []
```

Manual Copilot smoke checklist:

1. Save Copilot settings/API key or endpoint.
2. Use Draft current slide and confirm JSON appears without captured errors.
3. Use Append generated slide and confirm the deck count increases.
4. Generate a 2-slide deck and confirm preview/deck list update.
