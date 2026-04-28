# Lumina Presenter Stage 40A v2 — prompt-plan entry hotfix

Deploy the contents of this folder to the GitHub Pages project root.

Stage: `stage40a-20260427-2`  
Signature: `index-inline-stage40a-real-deck-planning-mode-prompt-entry-hotfix-20260427-2`

## What changed from Stage 40A v1

- Fixes the Prompt-step entry point for planning mode.
- The Stage 40A prompt strip now attaches to the existing Stage 39A prompt action card by class fallback, not only by the missing `stage39aPromptActions` id.
- Diagnostics now accept the actual prompt planning strip/buttons as the proof for `promptPlanEntry`.

## Expected diagnostics

After deployment, confirm:

- `stage === "stage40a-20260427-2"`
- `indexStageSignature === "index-inline-stage40a-real-deck-planning-mode-prompt-entry-hotfix-20260427-2"`
- `stage40ADeckPlanningStatus.pass === true`
- `stage40ADeckPlanningStatus.tests.promptPlanEntry === true`
- `stage39BAiDrawerUsabilityStatus.pass === true`
- `esModuleSmokePassed === true`
- `visualContrastSmokePassed === true`

Cache-busting URL example:

```text
index.html?v=stage40a-20260427-2&clearLuminaStorage=1
```
