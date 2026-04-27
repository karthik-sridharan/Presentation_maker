# Next-stage context after Stage 38M

Current focus: canvas-first UI polish.

Stage 38M adds a final high-specificity CSS/diagnostic pass that makes the top preview toolbar controls match the small left rail Deck / Slides buttons. It explicitly styles both `.stage38c-tool-btn` and `.stage38c-mode-pill button`; Stage 38K had only measured the tool buttons, so the mode pill could still feel too large.

Preserve:
- Stage 38K compact-toolbar preview lift.
- Stage 38L fresh-deck seed on clean launch.
- Stage 38I safe command-only deck sync.
- No MutationObserver/page reload hooks.

Useful diagnostics:
- `stage38MRailSizedTopToolbarStatus`
- `stage38KCompactToolbarStatus`
- `stage38LFreshDeckSeedStatus`
- `stage38ISafeDeckSyncStatus`
