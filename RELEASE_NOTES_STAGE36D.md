# Stage 36D — Generated HTML PDF toolbar placement

Build: `stage36d-20260426-1`

## Fix
- Keeps the generated HTML presentation toolbar on one horizontal row.
- Moves `Generate PDF` before the Pointer dropdown so it remains on the top line after the pointer controls were added.
- Prevents slide action controls from wrapping vertically; if the available width is very narrow, the toolbar scrolls horizontally instead of dropping the PDF button to a second line.

## Preserved from prior stages
- Stage 36A export checkbox wrapping fix and pointer color/none controls.
- Stage 36B touch-screen double-tap navigation behavior.
- Stage 36C `Pointer` mode with classic black cursor arrow.
