# Stage 38H — Emergency rollback of Stage 38G active sync

Stage 38H is based on the stable Stage 38F package and removes the active Stage 38G live deck-sync layer that could cause repeated refresh/re-render behavior before diagnostics could be collected.

## Preserved
- Stage 38F canvas-fit regression cleanup.
- Stage 38E slide structure UI controls.
- Stage 38D visual galleries.
- Stage 38C selection-aware inspector.
- Existing ESM parity harness and Copilot guard.

## Changed
- Removed Stage 38G active MutationObserver / command wrapping / jump-outline API patching layer.
- Added Stage 38H recovery diagnostics: `stage38HRecoveryStatus`.
- Added an early boot-loop guard that disables stale 38G sync entry points without reloading the page.
