# Stage 38L — Fresh deck seed + compact toolbar preserved

Stage 38L fixes the fresh-start deck/rail regression observed in Stage 38K v2 diagnostics.

## Changes
- Keeps Stage 38K compact top toolbar and preview lift.
- Seeds the default concept slide into the editable deck on a clean launch when no autosave exists.
- Restores non-empty slide rail/outline state after `clearLuminaStorage=1`.
- Adds `stage38LFreshDeckSeedStatus` diagnostics for app slide count, rail item count, deck empty-card state, and preservation of compact toolbar + safe deck sync.

## Expected diagnostic signals
- `stage38LFreshDeckSeedStatus.tests.pass: true`
- `stage38LFreshDeckSeedStatus.appSlideCount >= 1`
- `stage38LFreshDeckSeedStatus.railItemCount >= 1`
- `stage38KCompactToolbarStatus.pass: true`
- No boot errors or captured errors.
