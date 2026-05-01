# Stage 42C — Theme Designer discoverability fix

This patch makes the Theme Designer and Theme Copilot directly visible in the **Design** workflow tab.

## What changed

- Adds a clear **Theme Designer** entry card inside `Design / Theme + motion`.
- Moves the existing master theme controls into the Design tab instead of hiding them under Organizer / Theme.
- Moves the JSON theme library and **Theme Copilot** panel into the Design tab.
- Adds visible buttons for **Theme Designer**, **Theme Copilot**, and **AI setup**.
- Routes the top-toolbar **Theme** button to the Theme Designer instead of the slide preset area.
- Leaves a small forwarding card in the older Organizer / Theme location.

## New files

- `css/theme-discovery-stage42c.css`
- `js/theme-discovery-stage42c.js`

## Manual test

1. Open `index.html?v=stage42c-20260501-1&clearLuminaStorage=1`.
2. Click **Design / Theme + motion**.
3. Confirm a visible card titled **Theme Designer** appears near the top.
4. Click **Theme Designer** and confirm master theme controls are visible.
5. Click **Theme Copilot** and confirm the reference URL/upload fields and “Generate theme from reference” button are visible.
6. Click the top toolbar **Theme** button and confirm it routes to the same Theme Designer area.
7. Click **AI setup** and confirm it opens the AI setup tab.

## Diagnostic status

The patch publishes `window.__LUMINA_STAGE42C_THEME_DISCOVERY_STATUS` and adds `stage42CThemeDiscoveryStatus` to the Lumina diagnostic report.
