Stage 41I patch: external system prompt + no 30-slide plan cap

Changed files only:
- `index.html`
- `js/esm/copilot-stage34k.js`
- `js/legacy-app-stage24c.js`
- `prompts/system_promp.txt`

Changes:
1. Removed the Stage 40A planner schema cap `slidePlan.maxItems: 30`.
2. Removed Copilot-side 100-slide request/normalization clipping so the Copilot core no longer slices returned decks down automatically.
3. Added `prompts/system_promp.txt` and changed the Copilot system-role prompt to load from that file at runtime.
4. The old `prompts/dev.txt` / `prompts/deck.txt` files are still present for compatibility, but Stage 41I no longer appends them into the system-role prompt. Put system/developer behavior in `prompts/system_promp.txt` instead.
5. The AI plan-generation call in `index.html` now also uses the loaded system prompt file for its system-role message.
6. The main Copilot request body now sends request-specific data under labels like `REQUEST_KIND`, `TARGET_SLIDE_COUNT`, `USER_REQUEST`, `REFERENCE_URLS`, and `CURRENT_DECK_CONTEXT_JSON`; behavioral instructions live in `prompts/system_promp.txt`.

Deploy by copying these files over the existing app files, preserving paths.
