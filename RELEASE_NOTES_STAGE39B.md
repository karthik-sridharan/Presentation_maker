# Stage 39B Release Notes

Stage 39B polishes the Stage 39A AI drawer workflow with safer preview/apply behavior and clearer reference ingestion feedback.

## Added

- AI drawer usability card: “What do you want to make?” with the five-step workflow.
- Outline upload visibility: selected outline file name, size, and quick clear/next controls.
- Reference upload visibility: selected reference file names, sizes, PDF/text classification, and file-list clear control.
- Generation context summary before preview generation:
  - outline present/absent
  - reference URL count
  - pasted reference text character count
  - attached PDF count
- Apply gating: Apply buttons are disabled until the latest Copilot result contains valid slide JSON.
- Guarded apply-click interception: invalid or stale JSON cannot mutate the deck from the Apply step.
- Better local warnings for empty or unsupported uploaded files.
- New diagnostics object: `stage39BAiDrawerUsabilityStatus`.

## Preserved

- Stage 39A five-step AI workflow: Outline → References → Prompt → Preview → Apply.
- Stage 38Q advanced/debug hiding and AI/Advanced drawer split.
- Stage 38R diagnostics alignment for the AI drawer label.
- ESM guarded runtime and legacy fallback structure.
