# Stage 34J

Stage 34J is a fresh, strongly marked redeploy of the Stage 34I export/UI promotion.
It exists because a test URL with `v=stage34i` still served the Stage 34H index.

Functional changes from 34H:
- Adds guarded live ESM export helper runtime.
- Adds guarded live ESM UI shell helper runtime.
- Keeps classic export/UI shadows for fallback.
- Keeps legacy app and Copilot classic.
