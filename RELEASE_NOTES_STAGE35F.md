# Stage 35F — Classic color balance hotfix

Stage 35F keeps the Stage 35B layout/spacing/radius/shadow polish, but changes the UI color scheme back toward the earlier classic blue/gray palette.

## What changed

- Restored darker blue active workflow tabs and subtabs so tab labels are never pale-on-white.
- Kept the Stage 35B visual hierarchy, rounded cards, preview framing, compact-mode helpers, and quick dock behavior.
- Rebalanced normal buttons, primary buttons, active deck/block/library cards, Copilot status, input borders, and preview chrome to a classic high-contrast palette.
- No behavior changes and no JS module changes.

## Deploy

Upload the files in this patch over the current Stage 35E deployment, then test with:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35f-20260425-1&clearLuminaStorage=1
```
