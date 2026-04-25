# Stage 27C Hotfix Notes

## Problem

Stage 27B still used a direct external module script:

```html
<script type="module" src="js/es-module-smoke-stage27b.js"></script>
```

In some environments the browser fails external module loading before the smoke harness executes. Common causes include local `file://` use, incorrect JavaScript MIME types, restrictive CSP, or dependency fetch restrictions. The existing diagnostics surfaced that as a boot error: `Failed to load js/es-module-smoke-stage27b.js`.

## Fix

Stage 27C removes the direct module script from `index.html` and replaces it with:

```html
<script src="js/es-module-loader-stage27c.js"></script>
```

That classic loader performs an optional dynamic import of the ESM smoke harness only when the browser/server environment allows it. Import failures are captured in `window.LuminaEsModuleDiagnostics` and logged as diagnostics warnings, not startup blockers.

## Expected result

The editor should no longer show `Failed to load js/es-module-smoke-stage27b.js` or `Failed to load js/es-module-smoke-stage27c.js` during normal startup. The classic Stage 24C runtime remains the source of truth while ES module migration continues incrementally.
