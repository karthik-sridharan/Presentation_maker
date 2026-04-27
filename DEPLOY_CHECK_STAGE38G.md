# Deploy Check — Stage 38G

## Required runtime checks

- No missing assets.
- No boot errors.
- No captured errors.
- ESM smoke remains passed.
- Stage 38F canvas fit remains passed.
- Stage 38G deck sync reports passed.

## New 38G parity checks

Verify the diagnostic report includes:

```json
"stage38GDeckSyncStatus": {
  "unifiedLiveDeckSync": true,
  "liveDeckCount": <n>,
  "slideRailCount": <n>,
  "outlineCount": <n>,
  "jumpCount": <n>,
  "allStructureCountsMatch": true,
  "pass": true
}
```

## Regression targets

- The slide rail, outline, and slide jump overlay must stay synchronized after:
  - Add
  - Duplicate
  - Delete
  - Reorder
  - Add from snippet
  - Add section
  - Copilot append / replace
  - Import append / replace
