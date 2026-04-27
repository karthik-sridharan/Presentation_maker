# Deploy Stage 38H

Deploy this folder contents over the previous site. This is an emergency rollback package for the Stage 38G refresh-loop regression.

Recommended test URL after deploy:

`index.html?v=stage38h-20260427-1&clearLuminaStorage=1`

Then run the normal diagnostic report. Confirm:

- `stage` is `stage38h-20260427-1`
- `bootErrors` is empty
- `capturedErrors` is empty
- `stage38HRecoveryStatus.pass` is true
- `stage38FCanvasFitStatus.pass` remains true
