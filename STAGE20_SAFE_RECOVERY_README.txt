Stage 20 safe recovery patch.

Copy/extract this ZIP directly into your project root.

Open:
  http://localhost:8000/index.html?v=stage20safe-20260425-1&clearLuminaStorage=1

This version:
- restores the last confirmed working stage-20 runtime,
- uses fresh stage20safe filenames to avoid cache,
- loads local app scripts synchronously at the end of the page,
- changes external CDN scripts to async so they cannot block local app startup,
- binds the left tabs/subtabs/hide rail before the main app startup completes.

If it still fails, copy the red Lumina startup error box text exactly.
