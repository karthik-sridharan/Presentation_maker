Stage 33A rail toggle + empty deck UI hotfix

Replace these files in the repository:

  index.html
  css/styles-stage24c.css
  js/ui-stage24c.js
  js/deck-stage24c.js
  js/esm/deck-stage33a.js

Fixes:
  1. Slide rail Hide/Show button now directly hides/shows the rail content, updates aria-expanded, changes button text, and persists state in localStorage key luminaSlideRailCollapsed.
  2. Empty decks now render a visible empty-state card in the slide rail with an Add first slide button.
  3. The slide rail CSS still uses a dedicated grid row so it remains visible instead of being clipped by the editor pane.

After deploy, reload with a fresh cache buster such as:
  ?v=stage33a-rail-empty-fix-1&clearLuminaStorage=1
