# Release Notes — Stage 38G

Stage 38G adds a focused, late-loaded live deck synchronization layer on top of Stage 38F.

## What changed

- Added unified live deck structure sync across:
  - slide thumbnail rail,
  - Slide Jump,
  - Deck Outline,
  - Stage 38E slide-structure diagnostics.
- Added a canonical visible deck snapshot with diagnostic fields:
  - `liveDeckCount`
  - `appDeckCount`
  - `slideRailCount`
  - `outlineCount`
  - `jumpCount`
  - `activeSlideIndex`
  - `allStructureCountsMatch`
- Wrapped deck mutation commands so structure widgets resync after add, duplicate, delete, reorder, snippet add, and navigation.
- Patched final diagnostics to override stale Slide Jump / Deck Outline counts with the unified live snapshot.
- Preserved Stage 38F canvas-fit cleanup and all Stage 38E structure controls.

## Expected diagnostic result

Look for:

```json
"stage38GDeckSyncStatus": {
  "unifiedLiveDeckSync": true,
  "allStructureCountsMatch": true,
  "pass": true
}
```

Also confirm these counts match after any add/duplicate/delete/reorder operation:

```json
liveDeckCount == slideRailCount == outlineCount == jumpCount
```
