# Deploy check — Stage 38B

1. Open `index.html` with a cache-busting query, for example `?v=stage38b-20260427-1&clearLuminaStorage=1`.
2. Confirm the top toolbar appears above the slide canvas.
3. Confirm Add slide, Update, Duplicate, Create, Edit, Present, AI, Theme, and Export buttons open or trigger the expected workflows.
4. Run diagnostics and confirm `stage38KeynoteToolbarStatus.pass` is `true` and `esModuleSmokePassed` is `true`.
5. Export a generated HTML presentation as a smoke test.
