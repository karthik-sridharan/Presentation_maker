# Stage 36X release notes

Fixes a Copilot duplicate-generation regression where a single Generate full deck click could trigger overlapping generation/apply actions, producing two decks in one editor deck.

## Changes
- Adds a Copilot generation lock around full-deck and single-slide generation.
- Disables Copilot generation buttons while a request is in flight.
- Adds a guarded button binding check so Copilot click handlers cannot be attached twice to the same button.
- Preserves Stage 36S generated-presentation navigation hardening and Stage 36R image-generation response fix.

## Verification
- Classic Copilot guard JS syntax passes.
- Classic app JS syntax passes.
- ESM Copilot JS syntax passes.
- Zip integrity passes.


## Stage 36X chalkboard canvas fix
- Chalkboard and notebook visual themes now force their intended slide canvas colours even when slides were previously saved with per-slide background/font overrides.
- Chalkboard slide CSS now uses a strong dark canvas fallback for preview and generated HTML.
