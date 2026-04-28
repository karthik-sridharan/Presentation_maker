# Deploy Stage 40D

Deploy the contents of this folder as the static site root.

Recommended cache-busted test URL:

```text
index.html?v=stage40d-20260427-1&clearLuminaStorage=1
```

Expected diagnostics:

- `stage`: `stage40d-20260427-1`
- `indexStageSignature`: `index-inline-stage40d-plan-board-ux-tightening-20260427-1`
- `stage40DPlanBoardUxStatus.pass`: `true`
- `stage40CPromptDedupStatus.pass`: `true`
- `stage40BPlanHardeningStatus.pass`: `true`
- `stage40ADeckPlanningStatus.pass`: `true`

Manual smoke test:

1. Open AI drawer → Plan.
2. Confirm there is one Plan board with storyboard, starter CTA, and quick add buttons.
3. Confirm Advanced JSON is still hidden behind the existing toggle.
4. Click `4-slide starter`, then check storyboard cards and slide cards update.
5. Click `+ slide`, `+ section`, and `+ demo`, then verify the plan changes without changing the deck.
6. Generate preview from plan and confirm the deck does not mutate until Apply.
