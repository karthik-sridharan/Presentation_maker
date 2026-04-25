Stage 15 UI shell patch

Copy/extract the contents of this zip directly into your existing project root.

New files:
  js/ui-stage15.js
  js/ui.js

Updated files:
  index.html
  js/legacy-app-stage15.js
  js/legacy-app.js

What moved:
  - slide rail cleanup / hide rail logic
  - left panel tab switching
  - subtab switching

Test URL:
  http://localhost:8000/index.html?v=stage15-20260424-1

Primary checks:
  - app loads and preview renders
  - Files / Slides / Insert / Design / Copilot tabs switch
  - subtabs switch inside panels
  - Hide rail / Show rail works
  - stage 14 file import and stage 11 export workflows still work
