# Deploy — Stage 38G

Deploy the contents of this folder as the static site root.

## Stage identity

- `window.LUMINA_STAGE = "stage38g-20260427-1"`
- `window.LUMINA_STAGE_SIGNATURE = "index-inline-stage38g-live-deck-structure-sync-20260427-1"`

## Main addition

Stage 38G fixes the Stage 38F count-staleness regression where the visible thumbnail rail could show a different slide count from Slide Jump, Deck Outline, or Stage 38E diagnostics.

The patch is non-destructive and late-loaded. It does not replace the stable Stage 35/38 modules; it synchronizes their final public status and visible outline/jump views from one live deck snapshot.

## Manual smoke test

1. Open with a cache buster and optional storage clear:
   `index.html?v=stage38g-20260427-1&clearLuminaStorage=1`
2. Add a slide from the layout gallery.
3. Duplicate a slide.
4. Delete a slide.
5. Reorder from the rail and from the outline.
6. Open Jump slide and Deck outline.
7. Run diagnostics and verify:
   - `stage38GDeckSyncStatus.pass === true`
   - `stage38GDeckSyncStatus.allStructureCountsMatch === true`
   - `slideJumpStatus.slideCount === deckOutlineStatus.slideCount`
   - `slideRailThumbnailStatus.renderedThumbCount === stage38GDeckSyncStatus.liveDeckCount`
   - `rightPanelFitStatus.previewDeadSpace.verticalDeadSpaceApprox` remains near zero.
