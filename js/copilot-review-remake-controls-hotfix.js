/* Stage 41E manual hotfix: make Remake prompt + merge controls obvious and keep old validation from blocking blank remakes.
   Safe to remove later: delete this file and its <script> include. */
(function(){
  'use strict';
  var STAGE = 'stage41e-manual-hotfix-remake-controls-20260428-1';
  var DEFAULT_PROMPT = 'Remake this slide to improve clarity, polish, visual structure, and narrative fit with the full deck. Keep the slide concise and avoid duplicating other slides.';

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function state(){
    return window.CopilotReview && window.CopilotReview._state ? window.CopilotReview._state : null;
  }
  function schedule(){
    window.setTimeout(enhanceReviewModal, 0);
    window.setTimeout(enhanceReviewModal, 80);
    window.setTimeout(enhanceReviewModal, 250);
  }
  function getList(root){ return root && root.querySelector ? root.querySelector('#crvList') : null; }
  function slideTitle(slide, i){ return (slide && slide.title) ? slide.title : ('Slide ' + (i + 1)); }
  function isRemake(decision){ return decision && decision.action === 'remake'; }

  function renderSummaryLite(st){
    var el = st.rootEl && st.rootEl.querySelector('#crvSummary');
    if (!el) return;
    var total = st.slides.length, keep = 0, remove = 0, remake = 0;
    var consumed = {};
    st.decisions.forEach(function(d, i){
      if (!d || d.action !== 'remake') return;
      (d.mergeWith || []).forEach(function(j){ if (j !== i && !d.keepMerged) consumed[j] = true; });
    });
    st.decisions.forEach(function(d, i){
      if (consumed[i]) return;
      if (!d || d.action === 'keep') keep += 1;
      else if (d.action === 'remove') remove += 1;
      else if (d.action === 'remake') remake += 1;
    });
    var finalCount = 0;
    st.decisions.forEach(function(d, i){
      if (consumed[i]) return;
      if (d && d.action === 'remove') return;
      finalCount += 1;
    });
    el.innerHTML = ''
      + '<span class="crv-pill"><span>Original</span><b>' + total + '</b></span>'
      + '<span class="crv-pill keep"><span>Keep</span><b>' + keep + '</b></span>'
      + '<span class="crv-pill remake"><span>Remake</span><b>' + remake + '</b></span>'
      + '<span class="crv-pill remove"><span>Remove</span><b>' + remove + '</b></span>'
      + '<span class="crv-pill final"><span>Final deck</span><b>' + finalCount + ' slides</b></span>';
  }

  function ensureDefaultPrompt(decision){
    if (!decision) return;
    if (decision.action === 'remake' && !String(decision.prompt || '').trim() && !(decision.mergeWith || []).length) {
      // The older Stage 41D validator rejects blank remake instructions. Store a safe default so Run review works.
      decision.prompt = DEFAULT_PROMPT;
    }
  }

  function enhanceReviewModal(){
    var st = state();
    if (!st || !st.rootEl || !st.decisions || !st.slides) return;
    var list = getList(st.rootEl);
    if (!list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll('.crv-card'));
    cards.forEach(function(card, idx){
      var decision = st.decisions[idx];
      if (!decision) return;
      card.setAttribute('data-stage41e-hotfix-card-index', String(idx));
      if (!isRemake(decision)) {
        var old = card.querySelector('.stage41e-remake-hotfix-panel');
        if (old) old.remove();
        return;
      }
      ensureDefaultPrompt(decision);
      injectPanel(st, card, idx, decision);
    });
    renderSummaryLite(st);
    window.__LUMINA_STAGE41E_REMAKE_HOTFIX_STATUS = {
      stage: STAGE,
      loaded: true,
      rootPresent: true,
      cardCount: cards.length,
      remakeCount: st.decisions.filter(function(d){return d && d.action === 'remake';}).length,
      checkedAt: new Date().toISOString()
    };
  }

  function injectPanel(st, card, idx, decision){
    var existing = card.querySelector('.stage41e-remake-hotfix-panel');
    if (existing) existing.remove();

    var panel = document.createElement('div');
    panel.className = 'stage41e-remake-hotfix-panel';
    panel.innerHTML = ''
      + '<div class="stage41e-hotfix-title">Remake controls for slide ' + (idx + 1) + '</div>'
      + '<label class="stage41e-hotfix-label">Optional prompt for this remake</label>'
      + '<textarea class="stage41e-hotfix-prompt" data-stage41e-prompt="' + idx + '" rows="4"></textarea>'
      + '<div class="stage41e-hotfix-help">Leave the default text, edit it, or replace it with your own instruction. This is now visible so the old validation does not block you.</div>'
      + '<div class="stage41e-hotfix-label stage41e-hotfix-merge-title">Optional: merge other slides into this remade slide</div>'
      + '<div class="stage41e-hotfix-merge-grid" data-stage41e-merge-grid="' + idx + '"></div>'
      + '<label class="stage41e-hotfix-keep"><input type="checkbox" data-stage41e-keep-merged="' + idx + '"> Keep the selected merged-in slides as separate slides too</label>';

    var actions = card.querySelector('.crv-actions');
    if (actions && actions.parentNode) actions.parentNode.insertBefore(panel, actions.nextSibling);
    else card.appendChild(panel);

    var ta = panel.querySelector('[data-stage41e-prompt]');
    ta.value = decision.prompt || DEFAULT_PROMPT;
    ta.addEventListener('input', function(){
      decision.prompt = ta.value;
      if (!String(decision.prompt || '').trim() && !(decision.mergeWith || []).length) decision.prompt = DEFAULT_PROMPT;
    });

    var grid = panel.querySelector('[data-stage41e-merge-grid]');
    st.slides.forEach(function(slide, j){
      if (j === idx) return;
      var id = 'stage41e-merge-' + idx + '-' + j;
      var label = document.createElement('label');
      label.className = 'stage41e-hotfix-chip';
      label.setAttribute('for', id);
      label.innerHTML = '<input id="' + id + '" type="checkbox" value="' + j + '">'
        + '<span>Slide ' + (j + 1) + ': ' + esc(slideTitle(slide, j)).slice(0, 90) + '</span>';
      var input = label.querySelector('input');
      input.checked = Array.isArray(decision.mergeWith) && decision.mergeWith.indexOf(j) >= 0;
      input.addEventListener('change', function(){
        var picks = Array.prototype.slice.call(grid.querySelectorAll('input[type="checkbox"]:checked'))
          .map(function(x){ return Number(x.value); })
          .filter(function(n){ return Number.isFinite(n) && n !== idx; })
          .sort(function(a,b){ return a-b; });
        decision.mergeWith = picks;
        if (picks.length && String(decision.prompt || '').trim() === DEFAULT_PROMPT) {
          decision.prompt = 'Synthesize the selected slides into one clear remade slide. Preserve the key ideas, remove redundancy, and fit the surrounding deck.';
          ta.value = decision.prompt;
        }
        if (!picks.length && !String(decision.prompt || '').trim()) {
          decision.prompt = DEFAULT_PROMPT;
          ta.value = decision.prompt;
        }
        renderSummaryLite(st);
      });
      grid.appendChild(label);
    });

    var keep = panel.querySelector('[data-stage41e-keep-merged]');
    keep.checked = !!decision.keepMerged;
    keep.addEventListener('change', function(){
      decision.keepMerged = !!keep.checked;
      renderSummaryLite(st);
    });
  }

  function patchOpen(){
    if (!window.CopilotReview || window.CopilotReview.__stage41eHotfixPatched) return false;
    var originalOpen = window.CopilotReview.open;
    if (typeof originalOpen !== 'function') return false;
    window.CopilotReview.open = function(){
      var ret = originalOpen.apply(this, arguments);
      schedule();
      return ret;
    };
    window.CopilotReview.__stage41eHotfixPatched = true;
    return true;
  }

  function boot(){
    patchOpen();
    schedule();
    document.addEventListener('click', function(ev){
      if (ev.target && ev.target.closest && ev.target.closest('.crv-root .crv-action-btn, .crv-root [data-act="run"]')) schedule();
    }, true);
    document.addEventListener('change', function(ev){
      if (ev.target && ev.target.closest && ev.target.closest('.crv-root')) schedule();
    }, true);
    window.__LUMINA_STAGE41E_REMAKE_HOTFIX_STATUS = { stage: STAGE, loaded: true, rootPresent: false, checkedAt: new Date().toISOString() };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* Stage 41G add-on: force titles + mini thumbnails into the visible merge checkbox chips. */
(function(){
  'use strict';
  var STAGE='stage41g-review-merge-title-thumb-force-20260428-1';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function plain(s){return String(s==null?'':s).replace(/<[^>]*>/g,' ').replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g,' ').replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^}]*\})?/g,' ').replace(/[{}_`*#>~|$]/g,' ').replace(/\s+/g,' ').trim();}
  function cut(s,n){s=plain(s); n=n||90; return s.length>n?s.slice(0,n-1).trim()+'…':s;}
  function st(){return window.CopilotReview&&window.CopilotReview._state?window.CopilotReview._state:null;}
  function title(slide,i){return cut(slide&&slide.title,96)||('Slide '+(i+1));}
  function type(slide){return cut(slide&&slide.slideType,40)||'single';}
  function summary(slide){
    var text=cut((slide&&(slide.kicker||slide.lede)),110); if(text)return text;
    var blocks=[]; if(slide&&Array.isArray(slide.leftBlocks))blocks=blocks.concat(slide.leftBlocks); if(slide&&Array.isArray(slide.rightBlocks))blocks=blocks.concat(slide.rightBlocks);
    for(var k=0;k<blocks.length;k++){var b=blocks[k]||{}, t=cut(b.title,42), c=cut(b.content,90); if(t&&c)return t+': '+c; if(t)return t; if(c)return c;}
    return '';
  }
  function consumer(state,idx,anchor){
    if(!state||!Array.isArray(state.decisions))return -1;
    for(var i=0;i<state.decisions.length;i++){if(i===anchor)continue;var d=state.decisions[i];if(d&&d.action==='remake'&&Array.isArray(d.mergeWith)&&d.mergeWith.indexOf(idx)>=0)return i;}
    return -1;
  }
  function thumb(slide,i){
    var two=/two|comparison|image|figure|callout/i.test(type(slide));
    return '<span class="stage41g-merge-thumb" aria-hidden="true"><span class="stage41g-merge-thumb-bar"><b>'+(i+1)+'</b></span><span class="stage41g-merge-thumb-title"></span><span class="stage41g-merge-thumb-lines '+(two?'two':'one')+'"><i></i><i></i>'+(two?'<i></i><i></i>':'')+'</span></span>';
  }
  function chipHtml(state,anchor,idx){
    var slide=(state.slides&&state.slides[idx])||{}, c=consumer(state,idx,anchor), sub=summary(slide);
    return thumb(slide,idx)+'<span class="stage41g-merge-copy"><span class="stage41g-merge-head"><b>Slide '+(idx+1)+'</b><strong>'+esc(title(slide,idx))+'</strong></span><span class="stage41g-merge-type">'+esc(type(slide))+'</span>'+(sub?'<span class="stage41g-merge-sub">'+esc(sub)+'</span>':'')+(c>=0?'<span class="stage41g-merge-lock">Already merges into slide '+(c+1)+'</span>':'')+'</span>';
  }
  function enhance(){
    var state=st(), count=0, titled=0, thumbs=0; if(!state||!state.rootEl||!Array.isArray(state.slides)){record(0,0,0,false);return;}
    var grids=[].slice.call(state.rootEl.querySelectorAll('.stage41e-hotfix-merge-grid,[data-stage41e-merge-grid],.crv-inline-merge-grid,.crv-merge-grid'));
    grids.forEach(function(grid){
      var anchor=Number(grid.getAttribute('data-stage41e-merge-grid')||grid.getAttribute('data-anchor')||-1);
      [].slice.call(grid.querySelectorAll('label')).forEach(function(label){
        var input=label.querySelector('input[type="checkbox"]'); if(!input)return;
        var idx=Number(input.value||input.getAttribute('data-index')||input.getAttribute('data-slide-index')); if(!Number.isFinite(idx)||idx<0||!state.slides[idx])return;
        var checked=input.checked, disabled=input.disabled;
        if(input.parentNode)input.parentNode.removeChild(input);
        label.textContent=''; label.classList.add('stage41g-merge-chip');
        input.checked=checked; input.disabled=disabled; input.setAttribute('aria-label','Merge slide '+(idx+1)+': '+title(state.slides[idx],idx));
        label.appendChild(input);
        var wrap=document.createElement('span'); wrap.className='stage41g-merge-wrap'; wrap.innerHTML=chipHtml(state,anchor,idx); label.appendChild(wrap);
        count++; if(label.querySelector('.stage41g-merge-copy strong'))titled++; if(label.querySelector('.stage41g-merge-thumb'))thumbs++;
      });
    });
    record(count,titled,thumbs,true);
  }
  function record(count,titled,thumbs,root){
    window.__LUMINA_STAGE41G_REVIEW_MERGE_LABEL_STATUS={stage:STAGE,loaded:true,rootPresent:!!root,choiceCount:count,choicesWithTitles:titled,choicesWithThumbs:thumbs,pass:count===0||(count===titled&&count===thumbs),checkedAt:new Date().toISOString()};
    window.stage41GReviewMergeLabelStatus=window.__LUMINA_STAGE41G_REVIEW_MERGE_LABEL_STATUS;
  }
  function schedule(){[0,60,180,420,900].forEach(function(ms){setTimeout(enhance,ms);});}
  function patch(){var CR=window.CopilotReview;if(CR&&!CR.__stage41gMergeLabelPatched&&typeof CR.open==='function'){var old=CR.open;CR.open=function(){var r=old.apply(this,arguments);schedule();return r;};CR.__stage41gMergeLabelPatched=true;}}
  function boot(){patch();schedule();setTimeout(function(){patch();schedule();},900);document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('.crv-root,[data-stage41d-review-open],[data-open-review]'))schedule();},true);document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('.crv-root'))schedule();},true);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
