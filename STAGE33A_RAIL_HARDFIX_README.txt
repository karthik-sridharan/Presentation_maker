Stage 33A rail hardfix

Files to replace:
- index.html
- css/styles-stage24c.css
- js/ui-stage24c.js
- js/deck-stage24c.js
- js/esm/deck-stage33a.js

Fixes:
- Replaces competing rail click handlers with one shared LuminaSlideRailApi.
- Hide rail now leaves only the Show rail button visible.
- The rail state persists in localStorage.
- Keeps the empty-deck Add first slide button.

Verification after reload:
- Click Hide rail: the slide list/header text should disappear and the button should say Show rail.
- In the console, window.__LUMINA_RAIL_TOGGLE_FIX should equal stage33a-rail-toggle-hardfix-20260425-1.
