# Stage 35L — Slide jump feature polish

This stage builds on the stable Stage 35K help overlay and adds a small navigation polish layer.

## What changed

- Stage identity updated to `stage35l-20260425-1`.
- Adds a **Jump slide** button to the quick action dock.
- Adds a searchable **Jump to slide** overlay backed by the existing live slide rail.
- `Ctrl/⌘ + K` opens the slide jump overlay when focus is not inside an editable field.
- `Esc` or the close button dismisses the overlay.
- Selecting a result clicks the existing deck rail item, so the underlying deck behavior is unchanged.
- Extends diagnostics and contrast audit with the new slide-jump button.

## Behavior

No deck/data model changes. This is a UI navigation/discoverability polish layer only.
