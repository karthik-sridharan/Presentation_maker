# Stage 38J — rail declutter and compact thumbnails

This polish pass builds on the stable Stage 38I command-only deck sync.

## Changes

- Hid the duplicate Deck outline panel below the slide rail while preserving its DOM/status for diagnostics.
- Tightened thumbnail rail spacing, thumbnail width, item height, captions, and grip size.
- Kept per-slide actions available, but only visually shows the active/hover/focus row so the rail no longer has large gaps between thumbnails.
- Added Stage 38J diagnostics: `stage38JRailDeclutterStatus` and `stage38JRailDeclutterDiagnostics`.

## Safety

- No mutation-observer sync was reintroduced.
- Stage 38I safe command deck sync remains the sync baseline.
- Existing slide rail, structure controls, outline DOM, jump overlay, and canvas fit diagnostics remain preserved.
