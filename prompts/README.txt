Stage 42I import AI prompts

ai_import_review_prompt.txt is intentionally patch-based.
The AI should return only {"patches":[...]} instead of a complete deck.
The frontend applies those patches to the already-loaded source-extracted slides, so image assets and layout metadata are preserved deterministically.

Use $ ... $ for inline math and \[ ... \] for displayed equations.
