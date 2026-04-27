# Next stage context after Stage 40A

Stage 40A introduced real deck planning mode in the AI drawer. The key next improvements are likely:

- Stage 40B: plan diff/revision loop, so users can ask the AI to revise only the plan before generating slides.
- Stage 40C: richer plan validation, including slide count, missing visuals, duplicated titles, and layout balance.
- Stage 40D: preserve a plan history and connect applied decks back to the plan that generated them.

Implementation note: Stage 40A is an overlay. It converts the editable plan to the existing DeckPlan JSON consumed by Stage 39A's preview-only `generatePreview('deck-spec')` path.
