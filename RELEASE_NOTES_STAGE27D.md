# Lumina Presenter Stage 27D

Hotfix for Stage 27C startup errors.

- Restores Stage 24C diagnostic and manifest files as the only required diagnostic startup assets.
- Removes required external Stage 27 module loader from `index.html`.
- Keeps ES module parity smoke test optional and inline-triggered.
- Adds `diagnostics-stage27d.html`.

Deploy the full folder and test `index.html?v=stage27d-20260425-1&clearLuminaStorage=1`.
