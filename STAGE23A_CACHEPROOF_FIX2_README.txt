Stage 23A cache-proof fix 2

Copy/extract this zip directly into your Presentation_maker project root.

This patch avoids the stale stable runtime by using unique filenames:
  css/styles-stage23afix2.css
  js/*-stage23afix2.js

Open:
  https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage23afix2-20260425-1&clearLuminaStorage=1

If you still see legacy-app.js?v=stage23a-stable-20260425-1 in the error, the deployed index.html is not the one from this patch or the browser/GitHub Pages is still serving an old index.

Direct URL checks:
  https://karthik-sridharan.github.io/Presentation_maker/js/legacy-app-stage23afix2.js?v=stage23afix2-20260425-1
  https://karthik-sridharan.github.io/Presentation_maker/js/state-stage23afix2.js?v=stage23afix2-20260425-1
