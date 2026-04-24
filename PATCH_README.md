Stage 3 migration patch — small, classic-script utility extraction

Overwrite these files in your existing lumina-presenter folder:

  index.html
  js/utils.js
  js/legacy-app.js

What changed:
- index.html now loads js/utils.js before js/legacy-app.js.
- cache-busting query strings were added to CSS/JS references: ?v=stage3a.
- clone/HTML escaping/math-token/color/theme normalization helpers moved from legacy-app.js into js/utils.js.
- legacy-app.js remains a classic non-module script. No ES module import chain yet.

Testing:
- Run through a local server:
    python3 -m http.server 8000
- Open:
    http://localhost:8000/index.html?v=stage3a
- If behavior looks stale, hard-refresh or increment the final query string.
