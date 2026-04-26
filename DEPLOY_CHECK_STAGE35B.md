# Stage 35B deploy check

Deploy the files at repo root, then open:

`index.html?v=stage35b-20260425-1&clearLuminaStorage=1`

Expected checks:

1. The visible top workflow tabs are still Build, Design, Assets, Copilot, Present.
2. The active workflow tab has a stronger highlighted card state with a small blue dot.
3. Inputs, buttons, cards, subtabs, preview, rail, and Copilot panel have the polished rounded/shadowed styling.
4. Basic diagnostics still pass with no missing assets, missing globals, or captured errors.
5. Copilot prompt files are still reported as `prompts/dev.txt` and `prompts/deck.txt`.
