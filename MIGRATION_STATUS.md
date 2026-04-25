# Lumina Presenter migration status — Stage 22A

Stage 22A adds a classic-script command and keyboard-shortcut layer.

## Still intentionally unchanged

- No ES modules yet.
- Copilot is still inside the main app because prior Copilot splits broke startup.
- Runtime keeps cache-proof stage filenames.

## New files

- `js/commands-stage22a.js`
- `js/commands.js`
- `diagnostics-stage22a.html`

## Test URL

`http://localhost:8000/index.html?v=stage22a-20260425-1&clearLuminaStorage=1`

## Main tests

- App loads, preview renders, tabs work.
- Diagnostics report has no missing assets/globals/DOM ids.
- `Ctrl/Cmd+S` saves current slide.
- `Alt+Shift+N/U/D` add/update/duplicate slides.
- `Alt+Shift+ArrowLeft/Right` navigates slides.
- `Alt+Shift+B/E/X` add/update/delete blocks.
