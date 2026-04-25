# Clean Release — Stage 27A

This release continues from the Stage 24C stable browser runtime and the Stage 25A documentation cleanup.

Stage 27A is intentionally conservative: the editor still runs on the known-good classic-script files, while ES module versions of the first leaf helpers are introduced under `js/esm/` and tested by a non-blocking browser smoke harness.

Use these entry points after deployment:

```text
index.html?v=stage27a-20260425-1&clearLuminaStorage=1
diagnostics-stage27a.html?v=stage27a-20260425-1
```

The key success signal is:

```js
window.LuminaEsModuleDiagnostics.ok === true
```
