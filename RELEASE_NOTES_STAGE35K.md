# Stage 35K — Help overlay feature polish

This stage builds on the stable Stage 35J contrast baseline and adds a small discoverability feature.

## What changed

- Stage identity updated to `stage35k-20260425-1`.
- Adds a **Help / keys** button to the quick action dock.
- Adds a lightweight **Shortcuts & workflows** overlay.
- The overlay shows:
  - the five workflow areas,
  - common quick paths,
  - keyboard shortcuts,
  - live command-registry entries when `LuminaCommands` is available.
- Adds keyboard access: `?` or `Ctrl/⌘ + /` opens the overlay when focus is not inside an editable field.
- `Esc` or the close button dismisses it.
- Keeps the Stage 35J solid contrast fallbacks and the visual contrast audit.

## Behavior

No deck/data behavior changes. This is a UI discoverability polish layer only.
