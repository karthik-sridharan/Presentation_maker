# Stage 40B Release Notes

Stage 40B builds on the clean Stage 40A v2 planning baseline and hardens the plan-first AI drawer workflow.

## What changed

- Added a clearer two-step plan workflow hero:
  - Step 1: Build plan from outline or ask AI for a plan.
  - Step 2: Check the plan and generate a preview from the plan.
- Added friendly plan validation that avoids JSON-heavy messages.
- Added deck-level quick fields for deck title, audience, and theme hint.
- Added slide-card health chips and quick tools for adding a key point, switching to two-column, switching to figure layout, or marking a demo/visual request.
- Hid raw plan JSON behind an advanced toggle by default.
- Preserved the Stage 40A safety model: generating from plan creates a preview only; Apply remains the only deck mutation path.
- Added Stage 40B diagnostics: `stage40BPlanHardeningStatus` and `stage40BPlanHardeningDiagnostics`.

## Stage marker

```text
stage40b-20260427-1
index-inline-stage40b-plan-workflow-hardening-20260427-1
```

## Internal checks

- Static deploy diagnostic: passed.
- Classic inline JavaScript syntax check: passed.
- Preserved Stage 40A/39B/39A layers: passed.
