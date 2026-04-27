# Next Stage Context after 39B

Stage 39B completed AI drawer usability and reference-ingestion polish.

Recommended next stage: Stage 40A real deck planning mode.

Goals:

- Add an editable slide-by-slide plan before generation.
- Let the user approve/reorder/delete planned slides before calling Copilot for full slide JSON.
- Keep the current safety invariant: preview generation only writes preview JSON; deck mutation only happens in Apply.
- Add diagnostics such as `stage40ADeckPlanningStatus` with plan count, approval state, and apply gating.
