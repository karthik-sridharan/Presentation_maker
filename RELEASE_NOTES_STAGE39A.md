# Stage 39A release notes

Stage 39A polishes the AI drawer into a staged assistant workflow.

## What changed

- Reworked the AI drawer into five clear steps: **Outline → References → Prompt → Preview → Apply**.
- Added preview-only generation buttons:
  - Generate slide preview
  - Generate deck preview
  - Generate preview from outline
- Hid the older auto-apply Copilot generation controls inside the AI drawer so generation no longer has to mutate the deck immediately.
- Added a generated-slide preview card that renders the first generated slide and lists generated slide titles.
- Renamed apply actions to be explicit:
  - Apply to current slide
  - Append as new slides
  - Replace entire deck
- Added friendlier Copilot status messages for missing auth, endpoint/network, and invalid JSON failures.
- Preserved Stage 38Q Advanced drawer separation for JSON, raw import, export controls, AI settings, and diagnostics.
- Added `stage39AAiDrawerWorkflowStatus` to the diagnostics report.

## Compatibility

This is an additive inline stage on top of Stage 38R. It does not alter the guarded ESM modules or the legacy module assets.
