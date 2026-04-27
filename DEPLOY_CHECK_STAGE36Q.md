# Stage 36Q Deploy Check

Recommended smoke test:

1. Open `index.html?v=stage36q-20260427-1&clearLuminaStorage=1`.
2. Confirm the editor loads with no blocking boot error.
3. Create or open a slide and confirm preview renders.
4. Export generated HTML and confirm it opens.
5. Confirm generated-presentation top controls fade after 2 seconds and reappear only on activity.
6. In Copilot, ask for a small HTML demo and confirm the result uses a custom block.
7. In Copilot, ask for one generated image and confirm it either inserts a figure or creates an explicit image-failure placeholder.

Notes:

- The browser-based app still needs an API key or backend proxy for Copilot and image generation.
- Public deployments should use a backend proxy rather than storing OpenAI keys in the browser.
