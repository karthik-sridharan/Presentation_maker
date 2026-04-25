# Lumina Presenter Migration Status

Current known-good stage: **Stage 23B2 — cache-proof renderer diagnostics cleanup**.

Stage 24A is a **documentation-only cleanup stage**. It does not change `index.html`, JavaScript, CSS, app behavior, or runtime loading.

## Current runtime strategy

The app is still intentionally using a conservative runtime model:

- Classic browser scripts, not ES modules.
- Cache-proof stage-tagged filenames.
- Full flat patches for runtime changes to avoid missing-file/path issues.
- Diagnostics and manifest checks are part of the app shell.
- Copilot remains inside the main legacy runtime for now.

Do **not** convert to ES modules yet. The current priority is keeping the app stable while the remaining code is separated.

## Current known-good test URLs

Main app:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage23b2-20260425-2
```

Diagnostics:

```text
https://karthik-sridharan.github.io/Presentation_maker/diagnostics-stage23b2.html?v=stage23b2-20260425-2
```

Expected diagnostics:

```json
{
  "missingAssets": [],
  "missingGlobals": [],
  "missingDomIds": [],
  "basicUiBound": true,
  "previewHasContent": true,
  "rendererFunctionBased": true,
  "uiFunctionBased": true,
  "manifestLoaded": true,
  "commandsBound": true,
  "bootErrors": [],
  "capturedErrors": []
}
```

## Successful extractions so far

1. `utils`
2. `block-library`
3. `theme`
4. `presets`
5. `parser`
6. `block-style`
7. `import`
8. `state/autosave`
9. `export`
10. `renderer`
11. `deck/snippet`
12. `file-io`
13. `ui shell`
14. `figure insertion`
15. `diagram editor`
16. `figure tools` — duplicate works; crop still needs deeper refinement later.
17. `editor selection`
18. `block editor/form synchronization`
19. `commands / keyboard shortcuts`
20. `module manifest / diagnostics alignment`
21. `renderer diagnostics API bridge`

## Current known issues / deferred work

### Copilot

Copilot extraction broke startup twice. Keep Copilot inside the main legacy app until it can be isolated behind a safer feature flag or lazy loader.

Recommended future approach:

- Load Copilot after the core app boots.
- Wrap Copilot initialization in `try/catch`.
- Ensure Copilot failure cannot block tabs, preview, or editor controls.
- Expose diagnostics for Copilot separately from main startup diagnostics.

### Figure crop

Figure duplication works after Stage 18B, but crop remains inconsistent. Do not refactor crop further until a small visual crop test page or dedicated crop test workflow is added.

### Stable filenames

An attempt to move back to stable filenames in Stage 23A caused cache/stale-file confusion. Continue using stage-tagged runtime filenames until the deployment process is fully clean.

## Recommended next stages

### Stage 24B — safe Copilot guard, not extraction

Add a feature flag or lazy initialization guard around Copilot without moving its code yet. Goal: prove Copilot can fail without freezing the app.

### Stage 24C — figure crop test harness

Add a small diagnostic/test workflow for figure crop so the crop behavior can be repaired safely.

### Stage 25 — retry Copilot extraction

Only after Stage 24B confirms Copilot is isolated from app startup.

### Later — ES modules

Convert to ES modules only after classic-script modularization is stable, diagnostics are clean, and rollback is straightforward.
