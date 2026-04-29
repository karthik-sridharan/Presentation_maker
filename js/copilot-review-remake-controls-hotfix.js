/* Stage 41E manual hotfix:
   - makes Remake prompt + merge controls obvious
   - prevents old validation from blocking blank remakes
   - safe to remove later by deleting this file and its script include
*/

(function () {
  'use strict';

  var STAGE = 'stage41e-manual-hotfix-remake-controls-20260428-1';

  var DEFAULT_PROMPT =
    'Remake this slide to improve clarity, polish, visual structure, and narrative fit with the full deck. Keep the slide concise and avoid duplicating other slides.';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getReviewState() {
    return window.CopilotReview && window.CopilotReview._state
      ? window.CopilotReview._state
      : null;
  }

  function scheduleEnhance() {
    window.setTimeout(enhanceReviewModal, 0);
    window.setTimeout(enhanceReviewModal, 80);
    window.setTimeout(enhanceReviewModal, 250);
  }

  function getReviewList(root) {
    return root && root.querySelector ? root.querySelector('#crvList') : null;
  }

  function slideTitle(slide, index) {
    return slide && slide.title ? slide.title : 'Slide ' + (index + 1);
  }

  function isRemake(decision) {
    return decision && decision.action === 'remake';
  }

  function ensureDefaultPrompt(decision) {
    if (!decision) return;

    if (
      decision.action === 'remake' &&
      !String(decision.prompt || '').trim() &&
      !(decision.mergeWith || []).length
    ) {
      decision.prompt = DEFAULT_PROMPT;
    }
  }

  function renderSummaryLite(reviewState) {
    var summaryEl = reviewState.rootEl && reviewState.rootEl.querySelector('#crvSummary');
    if (!summaryEl) return;

    var total = reviewState.slides.length;
    var keep = 0;
    var remove = 0;
    var remake = 0;
    var consumed = {};

    reviewState.decisions.forEach(function (decision, index) {
      if (!decision || decision.action !== 'remake') return;

      (decision.mergeWith || []).forEach(function (mergeIndex) {
        if (mergeIndex !== index && !decision.keepMerged) {
          consumed[mergeIndex] = true;
        }
      });
    });

    reviewState.decisions.forEach(function (decision, index) {
      if (consumed[index]) return;

      if (!decision || decision.action === 'keep') {
        keep += 1;
      } else if (decision.action === 'remove') {
        remove += 1;
      } else if (decision.action === 'remake') {
        remake += 1;
      }
    });

    var finalCount = 0;

    reviewState.decisions.forEach(function (decision, index) {
      if (consumed[index]) return;
      if (decision && decision.action === 'remove') return;
      finalCount += 1;
    });

    summaryEl.innerHTML =
      '<span class="crv-pill"><span>Original</span><b>' +
      total +
      '</b></span>' +
      '<span class="crv-pill keep"><span>Keep</span><b>' +
      keep +
      '</b></span>' +
      '<span class="crv-pill remake"><span>Remake</span><b>' +
      remake +
      '</b></span>' +
      '<span class="crv-pill remove"><span>Remove</span><b>' +
      remove +
      '</b></span>' +
      '<span class="crv-pill final"><span>Final deck</span><b>' +
      finalCount +
      ' slides</b></span>';
  }

  function enhanceReviewModal() {
    var reviewState = getReviewState();

    if (
      !reviewState ||
      !reviewState.rootEl ||
      !reviewState.decisions ||
      !reviewState.slides
    ) {
      window.__LUMINA_STAGE41E_REMAKE_HOTFIX_STATUS = {
        stage: STAGE,
        loaded: true,
        rootPresent: false,
        checkedAt: new Date().toISOString()
      };
      return;
    }

    var list = getReviewList(reviewState.rootEl);
    if (!list) return;

    var cards = Array.prototype.slice.call(list.querySelectorAll('.crv-card'));

    cards.forEach(function (card, index) {
      var decision = reviewState.decisions[index];
      if (!decision) return;

      card.setAttribute('data-stage41e-hotfix-card-index', String(index));

      if (!isRemake(decision)) {
        var oldPanel = card.querySelector('.stage41e-remake-hotfix-panel');
        if (oldPanel) oldPanel.remove();
        return;
      }

      ensureDefaultPrompt(decision);
      injectRemakePanel(reviewState, card, index, decision);
    });

    renderSummaryLite(reviewState);

    window.__LUMINA_STAGE41E_REMAKE_HOTFIX_STATUS = {
      stage: STAGE,
      loaded: true,
      rootPresent: true,
      cardCount: cards.length,
      remakeCount: reviewState.decisions.filter(function (decision) {
        return decision && decision.action === 'remake';
      }).length,
      checkedAt: new Date().toISOString()
    };
  }

  function injectRemakePanel(reviewState, card, index, decision) {
    var existingPanel = card.querySelector('.stage41e-remake-hotfix-panel');
    if (existingPanel) existingPanel.remove();

    var panel = document.createElement('div');
    panel.className = 'stage41e-remake-hotfix-panel';

    panel.innerHTML =
      '<div class="stage41e-hotfix-title">Remake controls for slide ' +
      (index + 1) +
      '</div>' +
      '<label class="stage41e-hotfix-label">Optional prompt for this remake</label>' +
      '<textarea class="stage41e-hotfix-prompt" data-stage41e-prompt="' +
      index +
      '" rows="4"></textarea>' +
      '<div class="stage41e-hotfix-help">Leave the default text, edit it, or replace it with your own instruction. This is now visible so the old validation does not block you.</div>' +
      '<div class="stage41e-hotfix-label stage41e-hotfix-merge-title">Optional: merge other slides into this remade slide</div>' +
      '<div class="stage41e-hotfix-merge-grid" data-stage41e-merge-grid="' +
      index +
      '"></div>' +
      '<label class="stage41e-hotfix-keep"><input type="checkbox" data-stage41e-keep-merged="' +
      index +
      '"> Keep the selected merged-in slides as separate slides too</label>';

    var actions = card.querySelector('.crv-actions');
    if (actions && actions.parentNode) {
      actions.parentNode.insertBefore(panel, actions.nextSibling);
    } else {
      card.appendChild(panel);
    }

    var promptTextarea = panel.querySelector('[data-stage41e-prompt]');
    promptTextarea.value = decision.prompt || DEFAULT_PROMPT;

    promptTextarea.addEventListener('input', function () {
      decision.prompt = promptTextarea.value;

      if (
        !String(decision.prompt || '').trim() &&
        !(decision.mergeWith || []).length
      ) {
        decision.prompt = DEFAULT_PROMPT;
      }
    });

    var mergeGrid = panel.querySelector('[data-stage41e-merge-grid]');

    reviewState.slides.forEach(function (slide, mergeIndex) {
      if (mergeIndex === index) return;

      var id = 'stage41e-merge-' + index + '-' + mergeIndex;
      var label = document.createElement('label');

      label.className = 'stage41e-hotfix-chip';
      label.setAttribute('for', id);

      label.innerHTML =
        '<input id="' +
        id +
        '" type="checkbox" value="' +
        mergeIndex +
        '">' +
        '<span>Slide ' +
        (mergeIndex + 1) +
        ': ' +
        esc(slideTitle(slide, mergeIndex)).slice(0, 90) +
        '</span>';

      var input = label.querySelector('input');

      input.checked =
        Array.isArray(decision.mergeWith) &&
        decision.mergeWith.indexOf(mergeIndex) >= 0;

      input.addEventListener('change', function () {
        var picks = Array.prototype.slice
          .call(mergeGrid.querySelectorAll('input[type="checkbox"]:checked'))
          .map(function (checkbox) {
            return Number(checkbox.value);
          })
          .filter(function (number) {
            return Number.isFinite(number) && number !== index;
          })
          .sort(function (a, b) {
            return a - b;
          });

        decision.mergeWith = picks;

        if (
          picks.length &&
          String(decision.prompt || '').trim() === DEFAULT_PROMPT
        ) {
          decision.prompt =
            'Synthesize the selected slides into one clear remade slide. Preserve the key ideas, remove redundancy, and fit the surrounding deck.';
          promptTextarea.value = decision.prompt;
        }

        if (!picks.length && !String(decision.prompt || '').trim()) {
          decision.prompt = DEFAULT_PROMPT;
          promptTextarea.value = decision.prompt;
        }

        renderSummaryLite(reviewState);
      });

      mergeGrid.appendChild(label);
    });

    var keepMergedCheckbox = panel.querySelector('[data-stage41e-keep-merged]');
    keepMergedCheckbox.checked = !!decision.keepMerged;

    keepMergedCheckbox.addEventListener('change', function () {
      decision.keepMerged = !!keepMergedCheckbox.checked;
      renderSummaryLite(reviewState);
    });
  }

  function patchCopilotReviewOpen() {
    if (!window.CopilotReview || window.CopilotReview.__stage41eHotfixPatched) {
      return false;
    }

    var originalOpen = window.CopilotReview.open;

    if (typeof originalOpen !== 'function') {
      return false;
    }

    window.CopilotReview.open = function () {
      var result = originalOpen.apply(this, arguments);
      scheduleEnhance();
      return result;
    };

    window.CopilotReview.__stage41eHotfixPatched = true;
    return true;
  }

  function boot() {
    patchCopilotReviewOpen();
    scheduleEnhance();

    document.addEventListener(
      'click',
      function (event) {
        if (
          event.target &&
          event.target.closest &&
          event.target.closest('.crv-root .crv-action-btn, .crv-root [data-act="run"]')
        ) {
          scheduleEnhance();
        }
      },
      true
    );

    document.addEventListener(
      'change',
      function (event) {
        if (
          event.target &&
          event.target.closest &&
          event.target.closest('.crv-root')
        ) {
          scheduleEnhance();
        }
      },
      true
    );

    window.__LUMINA_STAGE41E_REMAKE_HOTFIX_STATUS = {
      stage: STAGE,
      loaded: true,
      rootPresent: false,
      checkedAt: new Date().toISOString()
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
