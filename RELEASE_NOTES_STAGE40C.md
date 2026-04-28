# Stage 40C — Prompt Action Dedup Hotfix

Fixes a Stage 40B regression where the AI planning workspace Prompt tab could accumulate many copies of the “Generate without changing the deck” action block.

## What changed

- Adds the missing stable `stage39aPromptActions` id to the Stage 39A prompt-action card source.
- Adds a Stage 40C runtime guard that removes duplicate prompt-action cards if they already exist in the DOM.
- Adds diagnostics: `stage40CPromptDedupStatus` and `stage40CPromptDedupDiagnostics`.
- Keeps preview-only generation and apply-only deck mutation behavior unchanged.

## Expected diagnostic gates

- `stage40CPromptDedupStatus.pass === true`
- `stage40CPromptDedupStatus.promptActionBlockCount <= 1`
- `stage40CPromptDedupStatus.duplicatePromptButtonIds.length === 0`
- `stage40BPlanHardeningStatus.pass === true`
- `capturedErrors` and `bootErrors` remain empty
