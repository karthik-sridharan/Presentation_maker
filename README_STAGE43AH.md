Stage 43AH frontend overlay

Target: apply on top of 43AG/43AF or any 43X-Y-Z descendant.

Fixes:
- PyMuPDF image-blob imports are locked as freeform-import slides.
- Automatic background Mathpix/AI repair is disabled for PyMuPDF image-blob batches to avoid cover/title leakage after the review dialog.
- Import handoff clears stale preview DOM before pre-import draft sync.
- Later-page image-blob blocks whose source hints match the cover/title strings are dropped before import.
- Existing \text{...} repair remains.

Stage: stage43ah-image-blob-import-lock-no-title-leak-20260515-1
