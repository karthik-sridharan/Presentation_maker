# Stage 40D deploy check

Use:

```text
index.html?v=stage40d-20260427-1&clearLuminaStorage=1
```

Collect diagnostics and check:

```text
stage40DPlanBoardUxStatus.pass === true
stage40DPlanBoardUxStatus.planBoardUx === true
stage40DPlanBoardUxStatus.storyboardBeforeJson === true
stage40DPlanBoardUxStatus.jsonFirstReduced === true
stage40CPromptDedupStatus.pass === true
stage40BPlanHardeningStatus.pass === true
stage40ADeckPlanningStatus.pass === true
capturedErrors.length === 0
bootErrors.length === 0
```
