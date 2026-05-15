Stage 43AG frontend overlay

This is Stage 43AF plus an index.html syntax fix.

The previous 43AF/43AD index accidentally placed a stage marker <script> inside the diagram-editor popup HTML template. Browsers treat </script> as the end of the current app script even inside JS template strings, causing startup errors near line 3568.

Apply contents to GitHub repo root:
- index.html -> repo root index.html
- js/ -> repo root js/

Open with:
index.html?v=stage43ag-43v-clean-reset-text-command-fix-index-fix-20260515-1&clearLuminaStorage=1
