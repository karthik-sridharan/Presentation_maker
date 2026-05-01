# Lumina Presenter — Stage 42E theme button route hotfix

Stage: `stage42e-theme-button-route-hotfix-20260501-1`

## What changed

- Fixes the top toolbar **Theme** button so it opens the visible Design / Theme Designer panel instead of routing to the old `presets:styles` path.
- Adds a late, capture-level router for all theme entry points:
  - top toolbar Theme button
  - selection-aware inspector Theme button
  - Design quick-action Theme Designer buttons
- Patches `LuminaStage38B.runAction('theme')` after toolbar initialization, so both direct clicks and command-style routing use the new destination.
- Preserves Stage 42D theme-discovery and font-size-entry fixes.

## Diagnostic fields to check

After deployment, open:

```text
index.html?v=stage42e-20260501-1&clearLuminaStorage=1
```

Then copy diagnostics and confirm:

```text
stageFromWindow: stage42e-theme-button-route-hotfix-20260501-1
indexStageSignature: index-inline-stage42e-theme-button-route-hotfix-20260501-1
stage42EThemeButtonStatus.pass: true
stage42EThemeButtonStatus.stage38BRunActionPatched: true
stage42EThemeButtonStatus.delegatesBound: true
```

Manual check: click the top toolbar **Theme** button. It should open the drawer, switch to **Design**, and scroll/highlight the Theme Designer area.
