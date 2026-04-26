# Stage 35S — Thumbnail slide rail

Stage: `stage35s-20260425-1`

## What changed

- Replaced the slide rail's text-only slide entries with compact thumbnail cards.
- Preserved existing `deck-item` and `data-index` behavior so slide switching, move up/down, duplicate, delete, Jump slide, and Deck outline observers continue to work.
- Uses lightweight miniature slide drawings from title, layout, colors, and block kind instead of heavy embedded iframes.
- Adds `slideRailThumbnailStatus` diagnostics with rendered thumbnail count and text-only fallback count.
