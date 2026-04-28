# Next Stage Context after 40B

Stage 40B stabilized the plan-first workflow and made the Plan tab more usable.

Recommended Stage 40C candidates:

1. Plan-to-preview quality improvements
   - Better prompt packaging from the editable plan.
   - More explicit layout instructions per slide.
   - Better handling of visual/demo requests.

2. Plan import/export
   - Export editable plan as JSON or Markdown.
   - Import a previously edited plan.
   - Allow plan reuse across decks.

3. Apply review guard
   - Add a final comparison between plan and generated preview before Apply.
   - Highlight generated slides that ignored the plan.

4. Browser runtime manual diagnostics
   - Capture plan creation, local edit, validation, generate-from-plan, and apply-gating states in one end-to-end report.

Preserve the Stage 40B invariant: preview generation can prepare output, but only Apply mutates the deck.
