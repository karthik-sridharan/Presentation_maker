/* =============================================================================
 * copilot-review.js  —  Per-slide review pass for Lumina Presenter
 * Stage: 41e-review-remake-controls-20260428-1
 * -----------------------------------------------------------------------------
 * For every slide in the current deck the user picks one action:
 *    keep       — leave it as-is
 *    remove     — drop it from the final deck
 *    remake     — AI rewrites it (with optional merge-with picks)
 *
 * After all decisions are recorded, the AI is invoked once per remake group,
 * a NEW deck is assembled in memory, and a side-by-side preview is opened so
 * the user can Apply or Discard the result.
 *
 * Integration with existing Lumina:
 *   - Uses window.LuminaCopilotCore.callCopilot('slide')   (reuses key/endpoint)
 *   - Uses window.LuminaCopilotCore.normalizeCopilotSlide  (when exposed)
 *   - Uses window.LuminaRendererApi.buildSlideMarkup       (for preview)
 *   - Uses window.LuminaAppCommands.{getSlides,setSlides,goToSlide,...}
 *
 *   The minor patch you'll add to legacy-app-stage24c.js exposes
 *   getSlides/setSlides on LuminaAppCommands. See the README.
 *
 * Usage:
 *   <link rel="stylesheet" href="copilot-review.css">
 *   <script src="copilot-review.js" defer></script>
 *   <button id="copilotReviewBtn">Review with Copilot</button>
 *   document.getElementById('copilotReviewBtn').onclick = () => CopilotReview.open();
 * ===========================================================================*/

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
   * Internal state for one review session.
   * ---------------------------------------------------------------------*/
  const session = {
    slides: [],       // snapshot of deck at open time (deep clone)
    decisions: [],    // one per slide: { action, prompt, mergeWith[], keepMerged }
    rootEl: null,
    pickerEl: null,
    previewEl: null,
    busyEl: null,
    pendingResult: null  // computed deck after Run
  };

  function makeDecision() {
    return {
      action: 'keep',     // 'keep' | 'remove' | 'remake'
      prompt: '',
      mergeWith: [],      // indexes (relative to original deck) of slides to fold in
      keepMerged: false   // if true, those merged-with slides also remain in deck
    };
  }

  /* -----------------------------------------------------------------------
   * Public API
   * ---------------------------------------------------------------------*/
  const CopilotReview = {
    open() {
      try {
        const slides = readDeckSlides();
        if (!slides.length) {
          alert('No slides to review. Build or load a deck first.');
          return;
        }
        session.slides = slides.map(deepClone);
        session.decisions = session.slides.map(makeDecision);
        renderModal();
      } catch (err) {
        console.error('[CopilotReview] open failed:', err);
        alert('Could not open review: ' + (err && err.message || err));
      }
    },
    close() {
      if (session.rootEl) { session.rootEl.remove(); session.rootEl = null; }
      closePicker();
      closePreview();
      hideBusy();
    },
    // For programmatic testing.
    _state: session
  };
  window.CopilotReview = CopilotReview;
  window.__LUMINA_COPILOT_REVIEW_REMAKE_CONTROLS_STAGE = 'stage41e-review-remake-controls-20260428-1';

  /* -----------------------------------------------------------------------
   * Lumina integration helpers
   * ---------------------------------------------------------------------*/
  function readDeckSlides() {
    const cmds = window.LuminaAppCommands;
    if (cmds && typeof cmds.getSlides === 'function') {
      const arr = cmds.getSlides();
      return Array.isArray(arr) ? arr : [];
    }
    // Fallback: try to read from the renderer's compactDeck if exposed
    throw new Error(
      'LuminaAppCommands.getSlides is not available. '
      + 'Apply the small patch from copilot-review-README.md to expose it.'
    );
  }

  function writeDeckSlides(newSlides) {
    const cmds = window.LuminaAppCommands;
    if (!cmds || typeof cmds.setSlides !== 'function') {
      throw new Error('LuminaAppCommands.setSlides is not available.');
    }
    cmds.setSlides(newSlides);
    if (typeof cmds.renderDeckList === 'function') cmds.renderDeckList();
    if (typeof cmds.buildPreview === 'function') cmds.buildPreview();
    if (typeof cmds.goToSlide === 'function' && newSlides.length) cmds.goToSlide(0);
    if (typeof cmds.persistAutosaveNow === 'function') {
      cmds.persistAutosaveNow('Autosaved after Copilot review apply.');
    } else if (typeof cmds.scheduleAutosave === 'function') {
      cmds.scheduleAutosave('Autosaved after Copilot review apply.');
    }
  }

  function normalizeSlide(slide) {
    const core = window.LuminaCopilotCore;
    if (core && typeof core.normalizeCopilotSlide === 'function') {
      return core.normalizeCopilotSlide(slide);
    }
    const r = window.LuminaRendererApi;
    if (r && typeof r.normalizeSlide === 'function') return r.normalizeSlide(slide);
    return slide;
  }

  function buildSlideMarkup(slide) {
    const r = window.LuminaRendererApi;
    if (r && typeof r.buildSlideMarkup === 'function') {
      try { return r.buildSlideMarkup(slide); } catch (_) { /* fall through */ }
    }
    // Cheap fallback if renderer isn't ready
    return '<div style="padding:10px;font-size:11px"><b>'
      + escapeHtml(slide && slide.title || 'Untitled')
      + '</b><br><span style="color:#666">'
      + escapeHtml(slide && slide.lede || '')
      + '</span></div>';
  }

  /**
   * Calls the existing Lumina copilot for a single slide.
   * Strategy: temporarily set the copilot prompt textarea and slideCount to 1,
   * invoke callCopilot('slide'), restore the originals.
   * Returns the first slide of the returned deck (already normalized).
   */
  async function callCopilotForSlide(promptText) {
    const core = window.LuminaCopilotCore;
    if (!core || typeof core.callCopilot !== 'function') {
      throw new Error('LuminaCopilotCore.callCopilot is not available. '
        + 'Make sure the copilot module loaded successfully.');
    }
    const promptEl = document.getElementById('copilotPrompt');
    const countEl  = document.getElementById('copilotSlideCount');
    if (!promptEl) {
      throw new Error('Copilot prompt textarea (#copilotPrompt) not found.');
    }
    const savedPrompt = promptEl.value;
    const savedCount  = countEl ? countEl.value : null;
    try {
      promptEl.value = promptText;
      if (countEl) countEl.value = '1';
      const deck = await core.callCopilot('slide');
      const first = deck && deck.slides && deck.slides[0];
      if (!first) throw new Error('Copilot returned no slide.');
      return normalizeSlide(first);
    } finally {
      promptEl.value = savedPrompt;
      if (countEl && savedCount != null) countEl.value = savedCount;
    }
  }

  /* -----------------------------------------------------------------------
   * Main modal rendering
   * ---------------------------------------------------------------------*/
  function renderModal() {
    if (session.rootEl) session.rootEl.remove();

    const root = document.createElement('div');
    root.className = 'crv-root';
    root.innerHTML = ''
      + '<div class="crv-backdrop"></div>'
      + '<div class="crv-modal" role="dialog" aria-label="Review deck with copilot">'
      +   '<header class="crv-header">'
      +     '<div class="crv-title">'
      +       '<span class="crv-dot"></span>'
      +       '<h2>Review deck</h2>'
      +       '<span class="crv-sub">Decide what to do with each slide before applying changes.</span>'
      +     '</div>'
      +     '<div class="crv-header-actions">'
      +       '<button class="crv-btn crv-btn-ghost" data-act="cancel">Cancel</button>'
      +       '<button class="crv-btn crv-btn-primary" data-act="run">Run review</button>'
      +     '</div>'
      +   '</header>'
      +   '<div class="crv-summary" id="crvSummary"></div>'
      +   '<main class="crv-list" id="crvList"></main>'
      + '</div>';

    document.body.appendChild(root);
    session.rootEl = root;

    root.querySelector('[data-act="cancel"]').onclick = () => CopilotReview.close();
    root.querySelector('[data-act="run"]').onclick    = onRunClicked;
    root.querySelector('.crv-backdrop').onclick       = () => CopilotReview.close();

    renderList();
    renderSummary();
    typesetMath(root);
  }

  function renderList() {
    const list = session.rootEl.querySelector('#crvList');
    list.innerHTML = '';
    session.slides.forEach((slide, idx) => {
      list.appendChild(buildCard(slide, idx));
    });
  }

  function buildCard(slide, idx) {
    const decision = session.decisions[idx];
    const card = document.createElement('section');
    card.className = 'crv-card';
    card.dataset.action = decision.action;

    // Detect "this slide is being merged into another remake"
    const consumedBy = findConsumingMerge(idx);
    if (consumedBy >= 0 && consumedBy !== idx) card.dataset.action = 'merged-into';

    // Thumbnail (rendered HTML at small scale)
    const thumb = document.createElement('div');
    thumb.className = 'crv-thumb';
    thumb.innerHTML = buildThumbHtml(slide, idx);

    // Body
    const body = document.createElement('div');
    body.className = 'crv-card-body';
    body.appendChild(buildCardHead(slide, idx, consumedBy));
    body.appendChild(buildActionRow(idx, consumedBy));
    if (decision.action === 'remake' && consumedBy < 0) {
      body.appendChild(buildRemakePanel(idx));
    }

    card.appendChild(thumb);
    card.appendChild(body);
    return card;
  }

  function buildThumbHtml(slide, idx) {
    // Try to render real slide HTML in a scaled wrapper. Fall back to text.
    const inner = buildSlideMarkup(slide);
    return ''
      + '<div style="position:relative;width:100%;height:100%;overflow:hidden">'
      +   '<div style="transform:scale(0.18);transform-origin:top left;'
      +              'width:1280px;height:720px;background:#fff;color:#111">'
      +     inner
      +   '</div>'
      + '</div>';
  }

  function buildCardHead(slide, idx, consumedBy) {
    const head = document.createElement('div');
    head.className = 'crv-card-head';
    const title = (slide && slide.title) || 'Untitled slide';
    const stype = (slide && slide.slideType) || 'single';
    let consumedNote = '';
    if (consumedBy >= 0 && consumedBy !== idx) {
      consumedNote =
        '<span class="crv-status-tag merged">Will merge into slide '
        + (consumedBy + 1) + '</span>';
    }
    head.innerHTML = ''
      + '<span class="crv-num">Slide ' + (idx + 1) + '</span>'
      + '<span class="crv-stitle">' + escapeHtml(title) + '</span>'
      + '<span class="crv-stype">' + escapeHtml(stype) + '</span>'
      + consumedNote;
    return head;
  }

  function plainMergeText(value) {
    return String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, ' ')
      .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^}]*\})?/g, ' ')
      .replace(/[{}_*`#>~|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function shortMergeText(value, maxLen) {
    const text = plainMergeText(value);
    if (!text) return '';
    const limit = maxLen || 96;
    return text.length > limit ? text.slice(0, limit - 1).trimEnd() + '…' : text;
  }

  function firstBlockSummary(slide) {
    if (!slide) return '';
    const pools = [];
    if (Array.isArray(slide.leftBlocks)) pools.push.apply(pools, slide.leftBlocks);
    if (Array.isArray(slide.rightBlocks)) pools.push.apply(pools, slide.rightBlocks);
    for (const block of pools) {
      const title = shortMergeText(block && block.title, 60);
      const content = shortMergeText(block && block.content, 90);
      if (title && content) return title + ': ' + content;
      if (title) return title;
      if (content) return content;
    }
    return '';
  }

  function slideMergeInfo(slide, idx, lockedElsewhere, consumer) {
    const title = shortMergeText(slide && slide.title, 90) || 'Untitled slide';
    const subtitle = shortMergeText((slide && (slide.kicker || slide.lede)) || firstBlockSummary(slide), 110);
    const type = shortMergeText(slide && slide.slideType, 48) || 'single';
    const lock = lockedElsewhere ? 'Already merges into slide ' + (consumer + 1) : '';
    return { title, subtitle, type, lock, number: idx + 1 };
  }

  function buildTinyMergeThumb(slide, idx) {
    const thumb = document.createElement('span');
    thumb.className = 'crv-merge-mini-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    try {
      thumb.innerHTML = buildThumbHtml(slide, idx);
    } catch (err) {
      thumb.innerHTML = '<span class="crv-merge-mini-thumb-fallback">' + (idx + 1) + '</span>';
    }
    return thumb;
  }

  function buildActionRow(idx, consumedBy) {
    const row = document.createElement('div');
    row.className = 'crv-actions';
    const decision = session.decisions[idx];
    const disabled = consumedBy >= 0 && consumedBy !== idx;

    [
      ['keep',   'Keep'],
      ['remove', 'Remove'],
      ['remake', 'Remake']
    ].forEach(([act, label]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'crv-action-btn';
      btn.dataset.act = act;
      btn.setAttribute('aria-pressed', String(decision.action === act));
      btn.textContent = label;
      btn.disabled = disabled && act !== 'keep'; // can switch back to keep, but otherwise inert
      btn.onclick = () => {
        if (act === decision.action) return;
        decision.action = act;
        if (act !== 'remake') {
          decision.prompt = '';
          decision.mergeWith = [];
          decision.keepMerged = false;
        }
        renderList();
        renderSummary();
        if (act === 'remake') {
          setTimeout(() => {
            const ta = session.rootEl && session.rootEl.querySelector('[data-crv-remake-prompt="' + idx + '"]');
            if (ta && ta.focus) ta.focus({ preventScroll: false });
          }, 0);
        }
      };
      row.appendChild(btn);
    });
    return row;
  }

  function buildRemakePanel(idx) {
    const decision = session.decisions[idx];
    const wrap = document.createElement('div');
    wrap.className = 'crv-remake-panel crv-remake-panel-visible';

    const helper = document.createElement('div');
    helper.className = 'crv-remake-help';
    helper.innerHTML = '<b>Remake options for slide ' + (idx + 1) + '.</b> '
      + 'The prompt is optional. Leave it blank to let Copilot improve this slide using the full deck context, '
      + 'or type specific instructions. To merge, tick one or more slides below.';

    // Prompt textarea
    const promptLabel = document.createElement('label');
    promptLabel.className = 'crv-label';
    promptLabel.setAttribute('for', 'crvRemakePrompt' + idx);
    promptLabel.textContent = 'Optional prompt for this remake';
    const ta = document.createElement('textarea');
    ta.id = 'crvRemakePrompt' + idx;
    ta.className = 'crv-remake-prompt';
    ta.setAttribute('data-crv-remake-prompt', String(idx));
    ta.placeholder = 'Example: Tighten this into 3 bullets, add intuition, and remove redundancy with the next slide.';
    ta.value = decision.prompt;
    ta.oninput = () => { decision.prompt = ta.value; };

    // Merge controls
    const mergeRow = document.createElement('div');
    mergeRow.className = 'crv-merge-row';

    const mergeBtn = document.createElement('button');
    mergeBtn.type = 'button';
    mergeBtn.className = 'crv-btn crv-btn-mini';
    mergeBtn.textContent = decision.mergeWith.length
      ? 'Open large merge picker (' + decision.mergeWith.length + ')'
      : 'Open large merge picker…';
    mergeBtn.onclick = () => openPicker(idx);

    const summary = document.createElement('div');
    summary.className = 'crv-merge-summary';
    updateMergeSummary(summary, decision);

    mergeRow.appendChild(mergeBtn);
    mergeRow.appendChild(summary);

    // Inline merge picker: this is the iPad-friendly primary control.
    const inlinePicker = buildInlineMergePicker(idx);

    // Keep-merged checkbox
    const cb = document.createElement('label');
    cb.className = 'crv-checkbox crv-keep-merged-checkbox';
    const cbInput = document.createElement('input');
    cbInput.type = 'checkbox';
    cbInput.checked = !!decision.keepMerged;
    cbInput.disabled = !decision.mergeWith.length;
    cbInput.onchange = () => { decision.keepMerged = cbInput.checked; renderSummary(); };
    cb.appendChild(cbInput);
    cb.appendChild(document.createTextNode(' Keep the merged-in slides as separate slides too'));
    const cbHint = document.createElement('span');
    cbHint.className = 'crv-checkbox-hint';
    cbHint.textContent = decision.mergeWith.length
      ? 'Unchecked means selected merged slides are removed after being folded into this remake.'
      : 'Pick slides to merge to enable this option.';
    cb.appendChild(cbHint);

    wrap.appendChild(helper);
    wrap.appendChild(promptLabel);
    wrap.appendChild(ta);
    wrap.appendChild(inlinePicker);
    wrap.appendChild(mergeRow);
    wrap.appendChild(cb);
    return wrap;
  }

  function updateMergeSummary(summary, decision) {
    if (!summary) return;
    if (decision.mergeWith.length) {
      const list = decision.mergeWith.map(i => i + 1).join(', ');
      summary.innerHTML = 'Merging with slide(s) <b>' + list + '</b>.';
    } else {
      summary.textContent = 'No merge selected. This remake will replace only this slide.';
    }
  }

  function buildInlineMergePicker(anchorIdx) {
    const decision = session.decisions[anchorIdx];
    const wrap = document.createElement('div');
    wrap.className = 'crv-inline-merge-picker';

    const head = document.createElement('div');
    head.className = 'crv-inline-merge-head';
    head.innerHTML = '<span>Optional: merge other slides into this remade slide</span>'
      + '<small>Tap slide chips to include/exclude them.</small>';
    wrap.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'crv-inline-merge-grid';

    session.slides.forEach((slide, idx) => {
      if (idx === anchorIdx) return;
      const consumer = findConsumingMerge(idx);
      const lockedElsewhere = consumer >= 0 && consumer !== anchorIdx;
      const id = 'crvMerge' + anchorIdx + '_' + idx;
      const label = document.createElement('label');
      label.className = 'crv-inline-merge-chip';
      label.dataset.checked = String(decision.mergeWith.indexOf(idx) >= 0);
      label.dataset.disabled = String(lockedElsewhere);
      label.setAttribute('for', id);

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.checked = decision.mergeWith.indexOf(idx) >= 0;
      input.disabled = lockedElsewhere;
      input.onchange = () => {
        const set = new Set(decision.mergeWith);
        if (input.checked) set.add(idx);
        else set.delete(idx);
        decision.mergeWith = Array.from(set).sort((a, b) => a - b);
        if (!decision.mergeWith.length) decision.keepMerged = false;
        renderList();
        renderSummary();
      };

      const info = slideMergeInfo(slide, idx, lockedElsewhere, consumer);
      const meta = document.createElement('span');
      meta.className = 'crv-inline-merge-meta';
      meta.innerHTML = ''
        + '<b><span class="crv-merge-slide-num">Slide ' + info.number + '</span>'
        + '<span class="crv-merge-slide-title">' + escapeHtml(info.title) + '</span></b>'
        + '<small class="crv-merge-slide-type">' + escapeHtml(info.type) + '</small>'
        + (info.subtitle ? '<em class="crv-merge-slide-subtitle">' + escapeHtml(info.subtitle) + '</em>' : '')
        + (info.lock ? '<small class="crv-merge-slide-lock">' + escapeHtml(info.lock) + '</small>' : '');
      label.appendChild(input);
      label.appendChild(buildTinyMergeThumb(slide, idx));
      label.appendChild(meta);
      grid.appendChild(label);
    });

    if (!grid.children.length) {
      const empty = document.createElement('div');
      empty.className = 'crv-inline-merge-empty';
      empty.textContent = 'This deck has only one slide, so there are no other slides to merge.';
      grid.appendChild(empty);
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function renderSummary() {
    const el = session.rootEl && session.rootEl.querySelector('#crvSummary');
    if (!el) return;
    const total = session.slides.length;
    let kept = 0, removed = 0, remade = 0;
    const consumedSet = new Set();
    session.decisions.forEach((d, i) => {
      if (d.action === 'remake') {
        d.mergeWith.forEach(j => { if (j !== i) consumedSet.add(j); });
      }
    });
    session.decisions.forEach((d, i) => {
      if (consumedSet.has(i)) {
        // Counted as part of a merge; if keepMerged is set on its consumer, also counts as kept
        const consumer = findConsumingMerge(i);
        const keepIt = consumer >= 0 && session.decisions[consumer].keepMerged;
        if (keepIt) kept += 1;
        return;
      }
      if (d.action === 'keep')   kept += 1;
      if (d.action === 'remove') removed += 1;
      if (d.action === 'remake') remade += 1;
    });
    const finalCount = computeFinalSlideCount();

    el.innerHTML = ''
      + '<span class="crv-pill"><span>Original</span><b>' + total + '</b></span>'
      + '<span class="crv-pill keep"><span>Keep</span><b>' + kept + '</b></span>'
      + '<span class="crv-pill remake"><span>Remake</span><b>' + remade + '</b></span>'
      + '<span class="crv-pill remove"><span>Remove</span><b>' + removed + '</b></span>'
      + '<span class="crv-pill final"><span>Final deck</span><b>' + finalCount + ' slides</b></span>';
  }

  /* -----------------------------------------------------------------------
   * Merge picker (sub-modal)
   * ---------------------------------------------------------------------*/
  function openPicker(anchorIdx) {
    closePicker();
    const decision = session.decisions[anchorIdx];
    const selected = new Set(decision.mergeWith);

    const root = document.createElement('div');
    root.className = 'crv-picker-root';
    root.innerHTML = ''
      + '<div class="crv-picker-backdrop"></div>'
      + '<div class="crv-picker">'
      +   '<div class="crv-picker-head">'
      +     '<h3>Pick slides to merge into slide ' + (anchorIdx + 1) + '</h3>'
      +     '<button class="crv-btn crv-btn-ghost crv-btn-mini" data-act="cancel">Close</button>'
      +   '</div>'
      +   '<div class="crv-picker-grid" id="crvPickerGrid"></div>'
      +   '<div class="crv-picker-foot">'
      +     '<span id="crvPickerHint" style="color:#93a1b8;font-size:12px"></span>'
      +     '<div style="display:flex;gap:8px">'
      +       '<button class="crv-btn" data-act="clear">Clear all</button>'
      +       '<button class="crv-btn crv-btn-primary" data-act="apply">Apply selection</button>'
      +     '</div>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(root);
    session.pickerEl = root;

    const grid = root.querySelector('#crvPickerGrid');
    const hint = root.querySelector('#crvPickerHint');

    function refreshHint() {
      hint.textContent = selected.size
        ? selected.size + ' slide(s) selected to merge in.'
        : 'No slides selected.';
    }

    session.slides.forEach((slide, idx) => {
      if (idx === anchorIdx) return; // can't merge a slide into itself
      // A slide is unavailable if it's already locked into another remake's merge
      const consumer = findConsumingMerge(idx);
      const lockedElsewhere = consumer >= 0 && consumer !== anchorIdx;

      const info = slideMergeInfo(slide, idx, lockedElsewhere, consumer);
      const card = document.createElement('label');
      card.className = 'crv-pick-card crv-pick-card-with-checkbox';
      card.setAttribute('aria-pressed', String(selected.has(idx)));
      card.dataset.disabled = String(lockedElsewhere);

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'crv-pick-checkbox';
      input.checked = selected.has(idx);
      input.disabled = lockedElsewhere;
      input.setAttribute('aria-label', 'Merge slide ' + info.number + ': ' + info.title);

      const thumb = document.createElement('div');
      thumb.className = 'crv-pick-thumb';
      thumb.innerHTML = buildThumbHtml(slide, idx);

      const meta = document.createElement('div');
      meta.className = 'crv-pick-card-meta';
      meta.innerHTML = ''
        + '<b><span class="crv-merge-slide-num">Slide ' + info.number + '</span>'
        + '<span class="crv-merge-slide-title">' + escapeHtml(info.title) + '</span></b>'
        + '<span class="crv-merge-slide-type">' + escapeHtml(info.type) + '</span>'
        + (info.subtitle ? '<em class="crv-merge-slide-subtitle">' + escapeHtml(info.subtitle) + '</em>' : '')
        + (info.lock ? '<span class="crv-merge-slide-lock">' + escapeHtml(info.lock) + '</span>' : '');

      card.appendChild(input);
      card.appendChild(thumb);
      card.appendChild(meta);

      if (!lockedElsewhere) {
        input.onchange = () => {
          if (input.checked) selected.add(idx);
          else selected.delete(idx);
          card.setAttribute('aria-pressed', String(selected.has(idx)));
          refreshHint();
        };
        card.onclick = (event) => {
          if (event.target === input) return;
          event.preventDefault();
          input.checked = !input.checked;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        };
      }
      grid.appendChild(card);
    });
    refreshHint();
    typesetMath(grid);

    root.querySelector('.crv-picker-backdrop').onclick =
      root.querySelector('[data-act="cancel"]').onclick = closePicker;
    root.querySelector('[data-act="clear"]').onclick = () => {
      selected.clear();
      grid.querySelectorAll('.crv-pick-card').forEach(c => c.setAttribute('aria-pressed', 'false'));
      grid.querySelectorAll('.crv-pick-checkbox').forEach(c => { c.checked = false; });
      refreshHint();
    };
    root.querySelector('[data-act="apply"]').onclick = () => {
      decision.mergeWith = Array.from(selected).sort((a, b) => a - b);
      // Sanity: if nothing selected, also clear keepMerged
      if (!decision.mergeWith.length) decision.keepMerged = false;
      closePicker();
      renderList();
      renderSummary();
    };
  }
  function closePicker() {
    if (session.pickerEl) { session.pickerEl.remove(); session.pickerEl = null; }
  }

  /* -----------------------------------------------------------------------
   * "Run review" — orchestrates AI calls, builds the new deck, opens preview
   * ---------------------------------------------------------------------*/
  async function onRunClicked() {
    // Stage 41E: a Remake prompt is optional. If no prompt and no merge picks
    // are provided, Copilot performs a default clarity/quality remake using the
    // full deck as context.
    showBusy('Running Copilot on remake slides…');

    try {
      const remakeIndices = [];
      const remakeResults = {}; // anchorIdx -> remade slide

      session.decisions.forEach((d, i) => {
        const consumer = findConsumingMerge(i);
        if (d.action === 'remake' && (consumer < 0 || consumer === i)) {
          remakeIndices.push(i);
        }
      });

      // Run remakes sequentially. The existing Copilot plumbing already enforces
      // its own in-flight lock per call, so we don't parallelize.
      for (let k = 0; k < remakeIndices.length; k++) {
        const i = remakeIndices[k];
        showBusy('Remaking slide ' + (i + 1) + ' (' + (k + 1) + ' of ' + remakeIndices.length + ')…');
        try {
          remakeResults[i] = await runOneRemake(i);
        } catch (err) {
          hideBusy();
          console.error('[CopilotReview] remake failed:', err);
          alert('Remaking slide ' + (i + 1) + ' failed:\n' + (err && err.message || err)
            + '\n\nThe review was not applied.');
          return;
        }
      }

      // Assemble the new deck in original-deck order.
      const consumedSet = new Set();
      session.decisions.forEach((d, i) => {
        if (d.action === 'remake') {
          d.mergeWith.forEach(j => {
            if (j !== i && !d.keepMerged) consumedSet.add(j);
          });
        }
      });

      const newDeck = [];
      const trace = []; // for the preview UI
      for (let i = 0; i < session.slides.length; i++) {
        const d = session.decisions[i];
        const consumer = findConsumingMerge(i);
        if (d.action === 'remove') {
          trace.push({ originalIdx: i, status: 'removed', slide: session.slides[i] });
          continue;
        }
        if (consumer >= 0 && consumer !== i) {
          // This slide is merged into someone else.
          const keep = session.decisions[consumer].keepMerged;
          if (keep) {
            newDeck.push(session.slides[i]);
            trace.push({ originalIdx: i, status: 'kept-during-merge', slide: session.slides[i] });
          } else {
            trace.push({ originalIdx: i, status: 'merged', slide: session.slides[i],
                         mergedInto: consumer });
          }
          continue;
        }
        if (d.action === 'remake') {
          const remade = remakeResults[i];
          newDeck.push(remade);
          trace.push({
            originalIdx: i,
            status: d.mergeWith.length ? 'remade-merged' : 'remade',
            slide: remade,
            mergeOf: d.mergeWith.slice()
          });
        } else {
          // 'keep'
          newDeck.push(session.slides[i]);
          trace.push({ originalIdx: i, status: 'kept', slide: session.slides[i] });
        }
      }

      session.pendingResult = { newDeck, trace };
      hideBusy();
      openPreview();
    } catch (err) {
      hideBusy();
      console.error('[CopilotReview] run failed:', err);
      alert('Review run failed: ' + (err && err.message || err));
    }
  }

  async function runOneRemake(anchorIdx) {
    const d = session.decisions[anchorIdx];
    const promptText = buildRemakePrompt(anchorIdx);
    const result = await callCopilotForSlide(promptText);
    return normalizeSlide(result);
  }

  function buildRemakePrompt(anchorIdx) {
    const d = session.decisions[anchorIdx];
    const anchor = session.slides[anchorIdx];
    const lines = [];

    lines.push(
      'You are remaking ONE slide that will replace the anchor slide in the user\'s existing deck.'
    );
    lines.push(
      'Choose the layout (slideType) that best fits the content. You may pick title-center, single, or two-col, '
      + 'and you may include any block types you need (panel, plain, pseudocode-latex, image with assetPrompt, '
      + 'or custom HTML). Match the visual tone of the surrounding deck.'
    );

    if (d.prompt && d.prompt.trim()) {
      lines.push('User instructions for the remake:');
      lines.push(d.prompt.trim());
    } else {
      lines.push('No specific user instructions were provided. Improve this slide by making it clearer, more polished, less redundant, and better aligned with the surrounding deck. Keep the result faithful to the original intent.');
    }

    lines.push('Anchor slide (the slide being remade):');
    lines.push(JSON.stringify(compactSlide(anchor, anchorIdx), null, 2));

    if (d.mergeWith.length) {
      lines.push(
        'Merge the following ' + d.mergeWith.length + ' slide(s) INTO this single remade slide. '
        + 'Synthesize their content into one coherent slide; do not just concatenate. '
        + 'Preserve the most important points from each. The merged-in slides will be '
        + (d.keepMerged ? 'KEPT in the deck as separate slides (so the remake can be a higher-level synthesis).'
                       : 'REMOVED from the deck after the merge.')
      );
      d.mergeWith.forEach(j => {
        lines.push('Merged-in slide ' + (j + 1) + ':');
        lines.push(JSON.stringify(compactSlide(session.slides[j], j), null, 2));
      });
    }

    lines.push(
      'Full deck context (for narrative consistency only — do not duplicate other slides\' content):'
    );
    lines.push(JSON.stringify(compactDeck(), null, 2));

    lines.push(
      'Output exactly one slide. The deckTitle/summary fields are not used for this single-slide call, '
      + 'but you must still wrap the slide in the deck JSON schema with slides containing exactly one entry.'
    );
    return lines.join('\n\n');
  }

  function compactSlide(slide, idx) {
    if (!slide) return { index: idx + 1 };
    return {
      index: idx + 1,
      slideType: slide.slideType,
      title: slide.title,
      kicker: slide.kicker,
      lede: slide.lede,
      headingLevel: slide.headingLevel,
      leftBlocks:  (slide.leftBlocks  || []).map(compactBlock),
      rightBlocks: (slide.rightBlocks || []).map(compactBlock),
      notesTitle:  slide.notesTitle,
      notesBody:   slide.notesBody
    };
  }
  function compactBlock(b) {
    if (!b) return null;
    const content = String(b.content == null ? '' : b.content);
    return {
      mode:  b.mode,
      title: b.title,
      content: content.length > 1200 ? (content.slice(0, 1200) + '…') : content,
      assetPrompt: b.assetPrompt || '',
      assetAlt:    b.assetAlt || ''
    };
  }
  function compactDeck() {
    return {
      slideCount: session.slides.length,
      slides: session.slides.map((s, i) => ({
        index: i + 1,
        title: s.title,
        slideType: s.slideType,
        kicker: s.kicker
      }))
    };
  }

  /* -----------------------------------------------------------------------
   * Preview modal — accept or discard the computed deck
   * ---------------------------------------------------------------------*/
  function openPreview() {
    closePreview();
    const result = session.pendingResult;
    if (!result) return;

    const root = document.createElement('div');
    root.className = 'crv-preview-root';
    root.innerHTML = ''
      + '<div class="crv-backdrop" style="position:absolute;inset:0;background:rgba(8,12,22,.78)"></div>'
      + '<div class="crv-preview-modal">'
      +   '<div class="crv-preview-head">'
      +     '<div>'
      +       '<h2 style="margin:0;font-size:15px">Preview: ' + session.slides.length
      +         ' \u2192 ' + result.newDeck.length + ' slides</h2>'
      +       '<div style="color:#93a1b8;font-size:12.5px;margin-top:2px">'
      +         'Side-by-side: original (left) vs. proposed (right). '
      +         'Click <b>Apply</b> to replace your deck, or <b>Discard</b> to keep the current one.'
      +       '</div>'
      +     '</div>'
      +     '<button class="crv-btn crv-btn-ghost" data-act="back">\u2190 Back to review</button>'
      +   '</div>'
      +   '<div class="crv-preview-body">'
      +     '<div class="crv-preview-col">'
      +       '<h4>Original deck (' + session.slides.length + ' slides)</h4>'
      +       '<div class="crv-preview-list" id="crvOrigList"></div>'
      +     '</div>'
      +     '<div class="crv-preview-col">'
      +       '<h4>Proposed deck (' + result.newDeck.length + ' slides)</h4>'
      +       '<div class="crv-preview-list" id="crvNewList"></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="crv-preview-foot">'
      +     '<button class="crv-btn crv-btn-danger" data-act="discard">Discard</button>'
      +     '<button class="crv-btn crv-btn-primary" data-act="apply">Apply to deck</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(root);
    session.previewEl = root;

    const origList = root.querySelector('#crvOrigList');
    const newList  = root.querySelector('#crvNewList');

    // Original column: tag each slide with its trace status
    const traceByOrig = {};
    result.trace.forEach(t => { traceByOrig[t.originalIdx] = t; });
    session.slides.forEach((slide, i) => {
      const t = traceByOrig[i] || { status: 'kept' };
      origList.appendChild(buildPreviewTile(
        slide, 'Slide ' + (i + 1), t.status, traceTagText(t, i)
      ));
    });

    // Proposed column: each new-deck slide
    result.newDeck.forEach((slide, i) => {
      // Find its corresponding trace entry (entries with status that survive)
      const survivors = result.trace.filter(
        t => t.status === 'kept' || t.status === 'remade'
          || t.status === 'remade-merged' || t.status === 'kept-during-merge'
      );
      const t = survivors[i] || {};
      let status = t.status === 'remade-merged' ? 'merged' : t.status;
      if (status === 'kept-during-merge') status = 'kept';
      newList.appendChild(buildPreviewTile(
        slide, 'New slide ' + (i + 1), status, newTagText(t)
      ));
    });

    typesetMath(root);

    root.querySelector('[data-act="back"]').onclick = () => {
      closePreview();
    };
    root.querySelector('[data-act="discard"]').onclick = () => {
      session.pendingResult = null;
      closePreview();
    };
    root.querySelector('[data-act="apply"]').onclick = () => {
      try {
        writeDeckSlides(result.newDeck.map(normalizeSlide));
        closePreview();
        CopilotReview.close();
        toast('Applied review: ' + session.slides.length + ' \u2192 '
              + result.newDeck.length + ' slides.');
      } catch (err) {
        console.error('[CopilotReview] apply failed:', err);
        alert('Could not apply: ' + (err && err.message || err));
      }
    };
  }
  function closePreview() {
    if (session.previewEl) { session.previewEl.remove(); session.previewEl = null; }
  }

  function buildPreviewTile(slide, label, status, extraText) {
    const tile = document.createElement('div');
    tile.className = 'crv-preview-tile';
    tile.dataset.status = status || 'kept';
    const tagClass = ({
      kept: 'kept', removed: 'removed', remade: 'remade', merged: 'merged'
    })[status] || 'kept';
    const tagLabel = ({
      kept: 'Keep', removed: 'Remove', remade: 'Remake', merged: 'Merged in'
    })[status] || status;
    tile.innerHTML = ''
      + '<div class="crv-thumb">' + buildThumbHtml(slide) + '</div>'
      + '<div class="crv-preview-tile-meta">'
      +   '<b>' + escapeHtml(slide.title || label) + '</b>'
      +   '<span>' + escapeHtml(label) + ' · ' + escapeHtml(slide.slideType || 'single') + '</span>'
      +   '<span class="crv-status-tag ' + tagClass + '">' + tagLabel + '</span>'
      +   (extraText ? '<span style="color:#aab7cb">' + escapeHtml(extraText) + '</span>' : '')
      + '</div>';
    return tile;
  }
  function traceTagText(t, i) {
    if (t.status === 'merged') return 'Merged into slide ' + (t.mergedInto + 1);
    if (t.status === 'remade-merged') {
      return 'Synthesized with slides: '
        + (t.mergeOf || []).map(x => x + 1).join(', ');
    }
    if (t.status === 'remade') return 'AI rewrote this slide';
    if (t.status === 'removed') return 'Dropped from deck';
    if (t.status === 'kept-during-merge') return 'Kept (also folded into a remake)';
    return '';
  }
  function newTagText(t) {
    if (t.status === 'remade-merged') {
      return 'Remade from anchor + merged: ' + (t.mergeOf || []).map(x => x + 1).join(', ');
    }
    if (t.status === 'remade') return 'AI rewrite of slide ' + (t.originalIdx + 1);
    if (t.status === 'kept-during-merge') return 'Original slide ' + (t.originalIdx + 1) + ' (kept)';
    return 'Original slide ' + (t.originalIdx + 1);
  }

  /* -----------------------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------------------*/
  /**
   * Returns the index of the remake decision that has consumed slide `idx`
   * via a merge picker, or -1 if none. If `idx` itself is a remake anchor,
   * returns idx (so callers can treat anchors as their own consumers).
   */
  function findConsumingMerge(idx) {
    const own = session.decisions[idx];
    if (own && own.action === 'remake') return idx;
    for (let i = 0; i < session.decisions.length; i++) {
      const d = session.decisions[i];
      if (d.action !== 'remake') continue;
      if (d.mergeWith.indexOf(idx) >= 0) return i;
    }
    return -1;
  }

  function computeFinalSlideCount() {
    const consumed = new Set();
    session.decisions.forEach((d, i) => {
      if (d.action !== 'remake') return;
      d.mergeWith.forEach(j => {
        if (j !== i && !d.keepMerged) consumed.add(j);
      });
    });
    let count = 0;
    session.decisions.forEach((d, i) => {
      if (consumed.has(i)) return;
      if (d.action === 'remove') return;
      count += 1;
    });
    return count;
  }

  function showBusy(msg) {
    hideBusy();
    if (!session.rootEl) return;
    const el = document.createElement('div');
    el.className = 'crv-busy-overlay';
    el.innerHTML = '<span class="crv-spinner"></span><span>' + escapeHtml(msg) + '</span>';
    session.rootEl.appendChild(el);
    session.busyEl = el;
  }
  function hideBusy() {
    if (session.busyEl) { session.busyEl.remove(); session.busyEl = null; }
  }

  function deepClone(v) {
    if (typeof structuredClone === 'function') {
      try { return structuredClone(v); } catch (_) { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(v));
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function toast(msg) {
    const cmds = window.LuminaAppCommands;
    if (cmds && typeof cmds.showToast === 'function') { cmds.showToast(msg); return; }
    console.log('[CopilotReview]', msg);
  }
  function typesetMath(root) {
    try {
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise([root]);
      }
    } catch (_) {}
  }
})();
