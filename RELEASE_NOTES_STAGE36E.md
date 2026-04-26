# Release Notes — Stage 36E

Stage 36E adds undo/redo history to the editable presentation maker.

## Added

- Undo/Redo buttons in the slide action toolbars.
- `Ctrl/⌘+Z` for Undo.
- `Ctrl/⌘+Shift+Z` and `Ctrl/⌘+Y` for Redo.
- A bounded editor-history stack with status exposed at `window.__LUMINA_STAGE36E_HISTORY`.

## Behavior

- History captures the state before autosaved mutations.
- Text typing is coalesced so a burst of typing becomes one undo step instead of one step per keystroke.
- Undo/redo restores deck title, theme, presentation options, slides, active slide, current draft slide, selected block, and block column.
- Undo/redo autosaves the restored state.

## Preserved

- Stage 36D generated HTML keeps `Generate PDF` on the top toolbar line.
- Stage 36C generated HTML has `Pointer` instead of black laser-dot mode.
- Stage 36B touch presentations still require double-tap or the Next button for slide advance.
