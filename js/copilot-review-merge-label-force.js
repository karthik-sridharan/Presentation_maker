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
