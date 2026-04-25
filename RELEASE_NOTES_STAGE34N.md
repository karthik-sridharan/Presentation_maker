# Stage 34N — Copilot reference-following and figure prompt fix

## What changed
- Copilot now looks for `prompts/dev.txt` first for full-deck developer instructions, falling back to `prompts/deck.txt`, then the built-in default.
- Deck prompt instructions are injected into the system/developer side of the request for full-deck generation only, not single-slide generation.
- Full-deck prompts with URLs can optionally enable OpenAI Responses web search via the Copilot panel checkbox.
- System instructions now strongly require non-generic, source-following decks and concrete figure/diagram placeholder blocks when figures are requested.

## Manual smoke test
1. Put an obvious instruction in `prompts/dev.txt`.
2. In Copilot, ask for a full deck from a lecture URL and leave “Use OpenAI web search for URLs” checked.
3. Confirm generated JSON includes source-specific slide titles and placeholder figure blocks.
4. Run diagnostics and check `copilotDeckPromptSource`, `copilotWebSearchEnabled`, and `copilotWebSearchStatus`.
