# Stage 40B Deploy Check

Use this after deploying Stage 40B.

## Required pass fields

```text
stage40BPlanHardeningStatus.pass === true
stage40BPlanHardeningStatus.clearPlanCreateCtas === true
stage40BPlanHardeningStatus.clearGeneratePreviewCta === true
stage40BPlanHardeningStatus.friendlyValidationMessages === true
stage40BPlanHardeningStatus.deckLevelQuickFields === true
stage40BPlanHardeningStatus.slideQuickEditControls === true
stage40BPlanHardeningStatus.previewOnlyGenerationPreserved === true
stage40BPlanHardeningStatus.applyOnlyMutationPreserved === true
stage40ADeckPlanningStatus.pass === true
```

## UI smoke test

- AI drawer opens from the center dock or top toolbar.
- Plan tab contains Step 1 and Step 2 cards.
- Raw JSON is hidden initially behind Show advanced JSON.
- Plan validation displays a friendly checklist.
- Slide cards show health chips and quick tools after a plan is built.
- Preview generation from a plan does not mutate the live deck until Apply.
