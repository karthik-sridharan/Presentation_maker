# Next-stage context after Stage 38I

Stage 38H confirmed the refresh loop was caused by the Stage 38G active sync layer. Stage 38I restores deck structure parity using a safer command-only approach:

- No MutationObserver in the new sync layer.
- No page reload/history/location hooks.
- No diagnostic-time DOM rewrite.
- Explicit deck commands and relevant UI clicks schedule a bounded sync.

Next recommended stage: if 38I diagnostics pass after manual add/duplicate/delete/reorder tests, proceed to a UI usability pass for the structure panel and jump/outline parity, still avoiding passive live observers.
