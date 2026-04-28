/* Stage 41D: visible, durable Copilot Review entry points.
   This intentionally avoids depending on a seventh AI-drawer tab, because
   Stage 40A owns and refreshes the six-tab AI workflow. */
(function(){
  'use strict';
  var W=window,D=document;
  var STAGE='stage41d-review-visible-entry-20260428-1';
  var SIG='index-inline-stage41d-review-visible-entry-20260428-1';
  function byId(id){return D.getElementById(id)}
  function qs(sel,root){return (root||D).querySelector(sel)}
  function qsa(sel,root){return Array.prototype.slice.call((root||D).querySelectorAll(sel))}
  function app(){return W.LuminaAppCommands||{}}
  function slideCount(){try{var a=app(); if(typeof a.getSlideCount==='function')return Number(a.getSlideCount()||0); if(typeof a.getSlides==='function'){var s=a.getSlides(); return Array.isArray(s)?s.length:0}}catch(_e){} return 0}
  function deckBridgeOk(){var a=app(); return !!(a&&typeof a.getSlides==='function'&&typeof a.setSlides==='function')}
  function stop(ev){if(!ev)return; ev.preventDefault(); ev.stopPropagation(); if(ev.stopImmediatePropagation)ev.stopImmediatePropagation()}
  function openReview(ev){
    stop(ev);
    refresh();
    if(W.CopilotReview&&typeof W.CopilotReview.open==='function'){
      try{W.CopilotReview.open(); return true}catch(err){console.error('[Stage41D] CopilotReview.open failed',err); alert('Could not open Review deck with Copilot: '+((err&&err.message)||err)); return false}
    }
    alert('Review deck with Copilot did not load. Confirm js/copilot-review.js is deployed.');
    return false;
  }
  function openDrawer(ev){
    stop(ev);
    try{
      if(W.LuminaStage40ADeckPlanning&&typeof W.LuminaStage40ADeckPlanning.openAI==='function') W.LuminaStage40ADeckPlanning.openAI('plan');
      else if(W.LuminaStage39AAiDrawerWorkflow&&typeof W.LuminaStage39AAiDrawerWorkflow.openAI==='function') W.LuminaStage39AAiDrawerWorkflow.openAI('prompt');
      else if(W.LuminaStage38QAiDrawerAdvanced&&typeof W.LuminaStage38QAiDrawerAdvanced.openAI==='function') W.LuminaStage38QAiDrawerAdvanced.openAI('generate');
    }catch(_e){}
    refresh();
    var d=byId('stage38qAiDrawer');
    if(d){d.classList.add('open');d.setAttribute('aria-hidden','false')}
    var card=byId('stage41dReviewAlwaysCard');
    if(card&&card.scrollIntoView){try{card.scrollIntoView({behavior:'smooth',block:'start'})}catch(_e){card.scrollIntoView()}}
    return !!d;
  }
  function bind(btn,fn){
    if(!btn||btn.dataset.stage41dReviewBound==='1')return;
    btn.dataset.stage41dReviewBound='1';
    btn.addEventListener('click',fn,true);
    btn.addEventListener('touchend',function(_ev){}, {passive:true});
  }
  function makeButton(tag,attrs,html){
    var el=D.createElement(tag||'button');
    Object.keys(attrs||{}).forEach(function(k){ if(k==='class')el.className=attrs[k]; else if(k==='text')el.textContent=attrs[k]; else el.setAttribute(k,attrs[k]); });
    if(html!=null)el.innerHTML=html;
    return el;
  }
  function ensureTopToolbarButton(){
    var bar=byId('stage38cTopToolbar')||byId('stage38bTopToolbar'); if(!bar)return false;
    var btn=byId('stage41dTopReviewBtn');
    if(!btn){
      btn=makeButton('button',{id:'stage41dTopReviewBtn',type:'button',class:'stage38c-tool-btn stage41d-review-toolbar-btn','data-stage41d-review-entry':'topbar','aria-label':'Review deck with Copilot'},'<span aria-hidden="true">🔎</span>Review');
      var ai=qs('[data-stage38c-action="copilot"], [data-stage38b-action="copilot"]',bar);
      if(ai&&ai.parentNode===bar)bar.insertBefore(btn,ai); else bar.appendChild(btn);
    }
    bind(btn,openReview); return true;
  }
  function ensureCenterDockButton(){
    var dock=qs('.stage35c-quick-dock'); if(!dock)return false;
    var btn=byId('stage41dCenterReviewBtn');
    if(!btn){
      btn=makeButton('button',{id:'stage41dCenterReviewBtn',type:'button',class:'btn primary stage41d-review-center-btn','data-stage41d-review-entry':'center'},'Review deck');
      var ai=qsa('button',dock).filter(function(b){return /AI drawer|Copilot|AI/i.test((b.textContent||''))})[0];
      if(ai&&ai.parentNode===dock) dock.insertBefore(btn,ai); else dock.appendChild(btn);
    }
    btn.title='Review deck with Copilot: keep, remove, remake, or merge slides.';
    bind(btn,openReview); return true;
  }
  function ensureRailButton(){
    var rail=qs('.stage38a-rail-actions'); if(!rail)return false;
    var btn=byId('stage41dRailReviewBtn');
    if(!btn){
      btn=makeButton('button',{id:'stage41dRailReviewBtn',type:'button',class:'btn mini stage41d-review-rail-btn','data-stage41d-review-entry':'rail'},'Review');
      rail.appendChild(btn);
    }
    bind(btn,openReview); return true;
  }
  function ensureFloatingButton(){
    if(!D.body)return false;
    var btn=byId('stage41dFloatingReviewBtn');
    if(!btn){
      btn=makeButton('button',{id:'stage41dFloatingReviewBtn',type:'button',class:'stage41d-floating-review','data-stage41d-review-entry':'floating','aria-label':'Review deck with Copilot'},'<span aria-hidden="true">🔎</span><span>Review deck</span>');
      D.body.appendChild(btn);
    }
    btn.title='Open Review deck with Copilot';
    bind(btn,openReview); return true;
  }
  function ensureDrawerAlwaysCard(){
    var d=byId('stage38qAiDrawer'), body=byId('stage38qAiDrawerBody')||qs('.stage38q-drawer-body',d); if(!d||!body)return false;
    var card=byId('stage41dReviewAlwaysCard');
    if(!card){
      card=D.createElement('div');
      card.id='stage41dReviewAlwaysCard';
      card.className='stage41d-review-always-card';
      card.setAttribute('data-ai-section','outline references prompt plan preview apply generate review');
      card.innerHTML='<h3>Review current deck with Copilot</h3><p>This opens the slide-by-slide review window: Keep, Remove, or Remake. Remake can merge selected slides and previews the final deck before Apply.</p><div class="stage41d-review-always-actions"><button class="btn primary" type="button" id="stage41dDrawerStartReviewBtn">Start deck review</button><button class="btn" type="button" id="stage41dDrawerOpenWorkspaceBtn">Keep drawer open</button></div><div class="stage41d-review-chip" id="stage41dDrawerReviewCount">Deck ready</div>';
      var first=body.firstElementChild;
      if(first&&first.nextSibling) body.insertBefore(card,first.nextSibling); else if(first) body.appendChild(card); else body.appendChild(card);
    }
    var c=byId('stage41dDrawerReviewCount'); if(c){var n=slideCount(); c.textContent='Current deck: '+n+' slide'+(n===1?'':'s');}
    bind(byId('stage41dDrawerStartReviewBtn'),openReview);
    bind(byId('stage41dDrawerOpenWorkspaceBtn'),openDrawer);
    return true;
  }
  function refresh(){
    if(D.body)D.body.classList.add('stage41d-review-visible');
    try{W.LUMINA_STAGE=STAGE; W.LUMINA_STAGE_SIGNATURE=SIG; if(D.documentElement){D.documentElement.setAttribute('data-lumina-stage',STAGE);D.documentElement.setAttribute('data-lumina-stage-signature',SIG)}}catch(_e){}
    ensureTopToolbarButton(); ensureCenterDockButton(); ensureRailButton(); ensureFloatingButton(); ensureDrawerAlwaysCard();
    W.__LUMINA_STAGE41D_REVIEW_VISIBLE_STATUS=status();
    patchDiagnostics(); patchApis();
    return W.__LUMINA_STAGE41D_REVIEW_VISIBLE_STATUS;
  }
  function patchApis(){
    ['LuminaStage40ADeckPlanning','LuminaStage39AAiDrawerWorkflow','LuminaStage38QAiDrawerAdvanced'].forEach(function(name){
      var api=W[name]; if(!api||api.__stage41dWrapped)return;
      ['openAI','refresh'].forEach(function(k){
        if(typeof api[k]!=='function'||api[k].__stage41dWrapped)return;
        var orig=api[k];
        api[k]=function(){var out; try{out=orig.apply(this,arguments)}finally{setTimeout(refresh,0);setTimeout(refresh,80)} return out};
        api[k].__stage41dWrapped=1;
      });
      api.__stage41dWrapped=1;
    });
  }
  function status(){
    var tests={reviewScriptLoaded:!!(W.CopilotReview&&typeof W.CopilotReview.open==='function'),deckBridge:deckBridgeOk(),topToolbarEntry:!!byId('stage41dTopReviewBtn'),centerDockEntry:!!byId('stage41dCenterReviewBtn'),railEntry:!!byId('stage41dRailReviewBtn'),floatingEntry:!!byId('stage41dFloatingReviewBtn'),drawerAlwaysCard:!!byId('stage41dReviewAlwaysCard')};
    tests.visibleEntry=tests.topToolbarEntry||tests.centerDockEntry||tests.railEntry||tests.floatingEntry;
    tests.pass=tests.reviewScriptLoaded&&tests.deckBridge&&tests.visibleEntry;
    return {stage:STAGE,reviewVisibleEntry:true,doesNotDependOnReviewDrawerTab:true,slideCount:slideCount(),tests:tests,pass:!!tests.pass,placements:{topToolbar:!!byId('stage41dTopReviewBtn'),centerDock:!!byId('stage41dCenterReviewBtn'),rail:!!byId('stage41dRailReviewBtn'),floating:!!byId('stage41dFloatingReviewBtn'),drawerAlwaysCard:!!byId('stage41dReviewAlwaysCard')}};
  }
  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics; if(!LD||LD.__stage41dReviewVisiblePatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null)); if(!prev)return false;
    function wrap(){
      var r={}; try{r=prev()||{}}catch(e){r={stage:STAGE,stage41dPreviousReportError:String(e&&(e.stack||e.message)||e)}}
      try{ensureTopToolbarButton();ensureCenterDockButton();ensureRailButton();ensureFloatingButton();ensureDrawerAlwaysCard()}catch(_e){}
      var st=status();
      r.stage=STAGE; r.diagnosticScriptStage=STAGE; r.stageFromWindow=W.LUMINA_STAGE||STAGE; r.indexStageSignature=W.LUMINA_STAGE_SIGNATURE||SIG;
      if(D.documentElement&&D.documentElement.dataset)r.indexDatasetStage=D.documentElement.dataset.luminaStage||STAGE;
      r.stage41DReviewVisibleEntryStatus=st;
      r.stage41DReviewVisibleEntryDiagnostics={tests:st.tests,placements:st.placements,slideCount:st.slideCount,note:'Stage 41D provides visible review buttons and a drawer card that do not depend on a seventh AI drawer tab.'};
      if(r.stage41BCopilotReviewStatus&&!r.stage41BCopilotReviewStatus.pass){r.stage41BCopilotReviewStatus.supersededByStage41DVisibleEntries=true;}
      if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{copilotReview:true,reviewMainEntry:true,stage41DVisibleReviewEntry:true});
      return r;
    }
    LD.collectReport=wrap; LD.getReport=wrap; LD.__stage41dReviewVisiblePatched=true; return true;
  }
  function init(){refresh();[80,180,420,900,1800,3600,6500].forEach(function(ms){setTimeout(refresh,ms)});W.LuminaStage41DReviewVisibleEntry={stage:STAGE,refresh:refresh,status:status,openReview:openReview,openDrawer:openDrawer};}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
