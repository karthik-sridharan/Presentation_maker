# Stage 40A deploy check

Use:

```text
index.html?v=stage40a-20260427-1&clearLuminaStorage=1
```

Required diagnostics:

```text
stage40ADeckPlanningStatus.pass === true
stage40ADeckPlanningStatus.realDeckPlanningMode === true
stage40ADeckPlanningStatus.editableSlideBySlidePlan === true
stage40ADeckPlanningStatus.planBeforeDeckGeneration === true
stage40ADeckPlanningStatus.previewOnlyGenerationPreserved === true
stage40ADeckPlanningStatus.applyOnlyMutationPreserved === true
```

Manual plan flow:

```text
Prompt/outline → Plan → edit cards → Validate plan → Generate preview from plan → Preview → Apply
```
