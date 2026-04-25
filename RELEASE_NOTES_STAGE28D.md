# Release notes — Stage 28D

Stage 28D is a diagnostic hardening patch for the ES module migration.

## Summary

- Classic Stage 24C runtime remains the production path.
- The optional ES module parity test no longer imports a static graph through a smoke module.
- The browser now imports each ESM leaf helper individually and records detailed results.
- ESM helper syntax was made more conservative for Safari/WebKit compatibility.

## Validation target

Open:

```text
index.html?v=stage28d-20260425-1&clearLuminaStorage=1
diagnostics-stage28d.html?v=stage28d-20260425-1
```

Core runtime should continue to report no missing assets/globals/DOM IDs and no boot errors.

Optional ESM success should report:

```json
"esModuleSmokeStatus": "passed"
```

If optional ESM fails, the report should include specific `assetProbeResults` and `leafImportResults`.
