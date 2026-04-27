# Stage 38A deploy check

Manual smoke checks:

1. Open `index.html?v=stage38a-20260427-1&clearLuminaStorage=1`.
2. Confirm the UI opens as a three-panel workspace:
   - left: slide rail / thumbnails
   - center: large live canvas
   - right: selected-item inspector
3. Click `Controls` or `Open editor` and confirm the old editor opens in a drawer.
4. Click `Edit`, `AI`, and `Export` quick buttons and confirm they open the drawer to the matching workspace.
5. Click a preview text block and confirm the right inspector updates.
6. Run diagnostics and confirm `stage38CanvasFirstStatus.pass` is `true`.

Internal static checks performed:
- Stage ID/signature updated to Stage 38A.
- Stage 38A CSS and JS injected once each.
- Stage 38A JS passed `node --check` after extracting the script body.
