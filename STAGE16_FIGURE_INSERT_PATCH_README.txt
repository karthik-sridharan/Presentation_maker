Stage 16 figure insertion patch

Copy/extract the contents of this zip directly into your existing project root.

New files:
  js/figure-insert-stage16.js
  js/figure-insert.js

Updated files:
  index.html
  js/legacy-app-stage16.js
  js/legacy-app.js

What moved:
  - figure HTML wrapping
  - image figure HTML generation
  - figure insertion into current block / new block
  - figure modal open/close helpers
  - text insertion at cursor helper

Still unchanged:
  - diagram editor popup implementation
  - interactive figure drag/resize/align/crop logic
  - Copilot remains inside legacy-app.js
  - classic script loading; no ES modules

Test URL:
  http://localhost:8000/index.html?v=stage16-20260424-1

Primary checks:
  - app loads and preview renders
  - Insert Figure modal opens and closes
  - insert figure by URL into panel/plain block
  - insert figure by file upload
  - insert figure into custom HTML block
  - figure drag/resize/align/crop still works
  - previous import/export/design workflows still work
