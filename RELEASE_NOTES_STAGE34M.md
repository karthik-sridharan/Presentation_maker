# Stage 34M release notes

Stage 34M adds a deck-only Copilot prompt prefix file.

## What changed

- Added `prompts/deck.txt`.
- Copilot now fetches `prompts/deck.txt` only for **Generate full deck**.
- If `prompts/deck.txt` is missing, blank, or cannot be fetched, Copilot falls back to a built-in default deck prompt.
- Single-slide Copilot actions do not append the deck prompt file.
- Diagnostics now expose:
  - `copilotDeckPromptFile`
  - `copilotDeckPromptAppliesTo`
  - `copilotDeckPromptSource`
  - `copilotDeckPromptStatus`

## How to customize

Edit this file in the repository:

`prompts/deck.txt`

The text in that file is prepended before the user's Copilot prompt for whole-deck generation only.
