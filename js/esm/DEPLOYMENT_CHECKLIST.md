# Stage 27C Deployment Checklist

1. Deploy the full Stage 27C folder.
2. Hard refresh or add the cache-busting query:
   `index.html?v=stage27c-20260425-1&clearLuminaStorage=1`
3. Confirm the editor opens without a red startup error panel.
4. Open diagnostics:
   `diagnostics-stage27c.html?v=stage27c-20260425-1`
5. Confirm required runtime diagnostics are OK.
6. Review `window.LuminaEsModuleDiagnostics.status`:
   - `passed` means the optional ESM parity harness ran successfully.
   - `skipped-file-protocol`, `load-failed`, or `unsupported` means the classic editor is still usable, but the environment is not currently executing the optional module smoke test.
7. For a strict ESM-hosting check, test:
   `index.html?v=stage27c-20260425-1&strictEsModuleSmoke=1`
