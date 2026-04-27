# Stage 38M — Rail-sized top toolbar buttons

Stage 38M keeps Stage 38L's fresh-start deck seed fix and tightens the top preview toolbar so its controls visually match the small buttons under the left rail's **Deck / Slides** header.

## Changes
- Targets both normal top toolbar action buttons and the workspace mode pill buttons (`Create`, `Edit`, `Present`, `Advanced`).
- Shrinks the toolbar brand/mark so the whole top bar no longer dominates the canvas.
- Makes top toolbar controls pill-shaped with compact font, padding, and height aligned to the left rail reference buttons.
- Preserves Stage 38K compact-toolbar preview lift and Stage 38L fresh-deck seed behavior.
- Adds `stage38MRailSizedTopToolbarStatus` diagnostics comparing top toolbar button height/font size against the left rail button reference.

## Expected diagnostic signals
- `stage38MRailSizedTopToolbarStatus.tests.pass: true`
- `stage38MRailSizedTopToolbarStatus.topButtonCount >= 10`
- `stage38MRailSizedTopToolbarStatus.buttonsNoTallerThanRail: true` inside tests
- `stage38KCompactToolbarStatus.pass: true`
- `stage38LFreshDeckSeedStatus.tests.pass: true`
- No boot errors or captured errors.
