Stage 43AN frontend overlay

Fixes chunked image-blob imports hitting the backend rate limiter after many page-range requests.
Keeps the working Stage 43AK/43AL behavior:
- PyMuPDF image-blob import remains enabled
- title/cover leak source guard remains active
- selected-block Mathpix raster fallback remains active

New in 43AN:
- chunked page-range extraction retries HTTP 429 with exponential backoff
- inserts a small delay between chunks
- publishes window.__LUMINA_STAGE43AN_CHUNK_RATE_LIMIT_BACKOFF diagnostics
