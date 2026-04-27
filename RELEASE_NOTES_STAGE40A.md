# Stage 40A — Real deck planning mode

Stage 40A adds a planning-first workflow to the AI drawer. The drawer now supports an editable slide-by-slide deck plan before deck JSON generation.

## New behavior

- Adds a six-step AI workflow: Outline → References → Prompt → Plan → Preview → Apply.
- Adds a Plan tab with structured editable cards for every planned slide.
- Supports AI-generated editable deck plans using the configured Copilot endpoint/API key.
- Supports local plan building from pasted/uploaded outlines when the user wants to avoid an API call.
- Lets users edit title, purpose, layout, visual/demo request, key points, and speaker-note constraints per slide.
- Generates deck preview from the edited plan by converting the plan to a DeckPlan spec and calling the existing preview-only Stage 39A generator.
- Preserves the Stage 39B Apply gate: the deck is not mutated until the user reaches Apply and valid preview JSON exists.

## Safety / compatibility

- Implemented as a Stage 40A overlay on top of Stage 39B.
- Does not rewrite the guarded Copilot core.
- Does not bypass preview/apply separation.
- Aligns older Stage 39A/39B diagnostics with the new six-tab workflow so the superseded five-tab check does not create a false regression.

## Runtime diagnostic key

- `stage40ADeckPlanningStatus`
