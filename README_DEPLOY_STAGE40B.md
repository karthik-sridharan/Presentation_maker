# Deploy Stage 40B

This folder is deploy-ready for GitHub Pages/static hosting.

## Files to deploy

Upload the contents of this folder, preserving the directory structure.

## Expected diagnostic markers

After deployment and refresh with cache busting, the diagnostic report should include:

```text
stage: stage40b-20260427-1
indexStageSignature: index-inline-stage40b-plan-workflow-hardening-20260427-1
stage40BPlanHardeningStatus.pass: true
stage40ADeckPlanningStatus.pass: true
bootErrors: []
capturedErrors: []
missingAssets: []
missingGlobals: []
missingDomIds: []
```

## Main manual checks

1. Open the AI drawer.
2. Confirm the six tabs remain: Outline, References, Prompt, Plan, Preview, Apply.
3. Open Plan and confirm the two-step hero is visible.
4. Use Build plan from outline, then confirm editable slide cards appear.
5. Edit deck title/audience/theme hint and a slide title/key point.
6. Confirm the friendly plan check updates without showing raw JSON errors.
7. Use Generate preview from plan and confirm the deck is previewed but not applied until the Apply tab/action is used.
