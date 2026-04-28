# Copilot Review — installed in stage40d build

This zip contains your `lumina-presenter-stage40d-clean-deploy` project with
the **Copilot Review** feature already installed. No further setup needed —
upload to your server and hard-refresh.

---

## What this feature does

After a deck exists (built by hand or by the AI), click **Review deck with
Copilot…** in the Copilot panel. A modal opens listing every slide with a
thumbnail. For each one, choose:

- **Keep** — leave it as-is, no AI call
- **Remove** — drop it from the final deck, no AI call
- **Remake** — AI rewrites it. You can:
  - write a free-form prompt explaining how to remake, **and/or**
  - **Merge with other slides** — pick any other slides whose content should
    be folded into this single remade slide. There's a checkbox to choose
    whether the merged-in slides stay in the deck or get dropped.

A live summary at the top shows the running keep/remove/remake counts and the
projected final deck size. Your example — 20 slides → 15 kept + 2 removed +
3 merged into 1 remake — shows `Final deck: 16 slides` before you ever press
Run.

After **Run review**, AI calls execute one per remake group, the proposed deck
is built in memory, and a **side-by-side preview** opens (original on the left,
proposed on the right). **Apply** replaces your deck; **Discard** keeps the
original. Nothing is written to your deck until you click Apply.

---

## Files added / modified

```
css/copilot-review.css      ← NEW
js/copilot-review.js        ← NEW
index.html                  ← MODIFIED (3 small additions)
js/legacy-app-stage24c.js   ← MODIFIED (added getSlides/setSlides to LuminaAppCommands)
```

The `index.html` changes are:
1. CSS link added after the main stylesheet (line ~136)
2. New "Review deck with Copilot…" button added to the `.copilot-actions` row
3. Script tag and binder added just before `</body>`

The `legacy-app-stage24c.js` change is two new entries on `LuminaAppCommands`
(line ~2162) so the review module can read and write the deck through the
existing app surface.

No other files were touched.

---

## How it integrates with your existing Copilot

The review module **reuses your Copilot completely** — it does not have its own
key, endpoint, or model selection:

- AI calls go through `LuminaCopilotCore.callCopilot('slide')`, which already
  reads `#copilotApiKey`, `#copilotEndpoint`, `#copilotModel`, the web search
  toggle, reference PDFs, reference URLs, and pasted text.
- For each remake the module temporarily writes the constructed prompt to
  `#copilotPrompt` and sets `#copilotSlideCount` to `1`, fires the call, then
  restores both. If you cancel mid-run the originals are restored exactly.
- Output is normalized through `LuminaCopilotCore.normalizeCopilotSlide`, so
  AI-returned slides have the same shape as everything else in your deck.
- Thumbnails and the preview render through `LuminaRendererApi.buildSlideMarkup`
  with theme/styling intact.

Remake calls use `kind: 'slide'`, so the deck-level prompt prefix from
`prompts/dev.txt` / `prompts/deck.txt` is **not** injected — that prompt biases
toward "make a complete deck", which fights single-slide remakes. No changes
to your prompt files are needed.

---

## Sanity check after install

1. Serve the project (or open `index.html` directly if your setup allows it).
2. Hard-refresh (`Cmd/Ctrl-Shift-R`).
3. Open the Copilot panel. Make sure your API key is saved.
4. With at least 3 slides in the deck, click **Review deck with Copilot…**.
5. The summary strip should immediately read
   `Original: N · Keep: N · Remake: 0 · Remove: 0 · Final deck: N slides`.
6. Mark slide 2 as **Remove** → the final-deck count drops by 1.
7. Mark slide 3 as **Remake**, click **Merge with other slides…**, pick slide
   4, hit Apply selection → the summary now shows `Final deck: N-2 slides`
   (one removed, one merged in).
8. Tick **Also keep the merged-in slides** → the count goes back up by 1.

You can verify the planning math without ever pressing Run. Run executes the
AI calls and opens the preview.

---

## Failure modes

- **AI call fails on a remake.** The whole review aborts before any change is
  made to your deck. You see an alert with the slide number and the underlying
  error. Fix the prompt and re-run.
- **No prompt and no merge selected for a remake.** Run is blocked with a
  message naming the offending slide. (We don't auto-default to "improve this
  slide" — silent prompts produce silent regressions.)
- **A slide is selected as a merge target by two different remakes.** The
  picker disables it for the second remake and shows which remake already owns
  it. Clear the first remake's merge picks to free it up.
- **You close the preview without applying.** Nothing changes. The proposed
  deck is dropped. Re-open the review from scratch any time.

---

## Versioning

The module advertises itself as `stage41a-review-20260428-1` in the script tag
query string (`?v=stage41a-20260428-1`) so the browser drops cached copies on
deploy. The global `window.CopilotReview` is created on script load and exposes
`_state` for debugging.

---

## Reverting

If you ever want to back this out, delete the four lines/blocks added to
`index.html` (search for `copilot-review` and `copilotReviewBtn`), revert the
`LuminaAppCommands` patch in `js/legacy-app-stage24c.js` (search for
`Stage 41a`), and remove `css/copilot-review.css` and `js/copilot-review.js`.
Nothing else in the project depends on these.
