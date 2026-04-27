# Stage 38I — Safe command-only deck structure sync

Stage 38I reintroduces the useful part of the aborted Stage 38G deck-sync work, but without the risky live DOM observer path that caused the refresh/re-render loop.

## What changed

- Added `stage38i-safe-command-deck-structure-sync-script`.
- Sync is command-only: deck mutations/navigation schedule one bounded refresh after explicit commands or UI clicks.
- No `MutationObserver` is created by the Stage 38I sync layer.
- No page reload, location, or history hooks are used.
- Diagnostics do not rewrite the DOM; they only sample and publish status.
- One safe startup render refreshes outline/jump parity once after boot, then stops.

## Preserved from previous stages

- Stage 38H emergency rollback guard remains in place to block the old Stage 38G script.
- Stage 38F canvas-fit regression cleanup is preserved.
- Stage 38E slide rail/outline structure controls are preserved.
- Stage 38D visual layout/theme galleries are preserved.

## Diagnostic target

Expected report fields:

- `stage: "stage38i-20260427-1"`
- `stage38ISafeDeckSyncStatus.tests.pass: true`
- `stage38ISafeDeckSyncStatus.noMutationObserver: true`
- `stage38ISafeDeckSyncStatus.noPageReloadHooks: true`
- `stage38ISafeDeckSyncStatus.activeObserversAdded: false`
- `stage38HRecoveryStatus.pass: true`
- `stage38FCanvasFitStatus.pass: true`
