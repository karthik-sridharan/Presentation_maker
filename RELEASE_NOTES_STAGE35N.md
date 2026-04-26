# Stage 35N combined release — Export diagnostics + deck outline

Stage: stage35n-20260425-1

This patch combines the requested Stage 35M and Stage 35N work in one deployable root patch.

## Added

- Stage 35M Export health panel from the quick dock.
- Browser export support probe for Blob, Blob URL, anchor download, clipboard, FileReader, and localStorage.
- Last export action/status/error capture for HTML and JSON export buttons.
- Copyable export diagnostics report for Safari/Download Failed debugging.
- Stage 35N persistent Deck outline panel under the slide rail.
- Outline grouping by section divider slides, with click-to-jump navigation.
- Outline refresh button and mutation observer so add/duplicate/delete/reorder updates the outline.

## Preserved

- Stage 35L slide jump overlay and Ctrl/⌘+K shortcut.
- Stage 35K Help / keys overlay.
- Stage 35J contrast fallbacks and visual contrast audit.
- Guarded live ESM modules and classic shadows.

## Notes

- Export diagnostics are passive except for a safe Blob URL probe; they do not change export behavior.
- The outline navigator uses existing deck rail buttons for selection, so it follows the current app state without replacing deck logic.
