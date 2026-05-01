/* theme-discovery-stage42d.js — visible Theme Designer + Theme Copilot entry points. */
(function(){
  'use strict';
  var W=window,D=document;
  var STAGE='stage42d-theme-discovery-fontsize-hotfix-20260501-1';
  var SIG='index-inline-stage42d-theme-discovery-fontsize-hotfix-20260501-1';
  var state={movedMaster:false,movedCopilot:false,entry:false,quickActions:false,toolbarBound:false,placeholder:false,lastAction:'',lastTarget:'',lastUpdatedAt:'',tests:{},pass:false};
  function byId(id){return D.getElementById(id)}
  function qs(sel,root){return (root||D).querySelector(sel)}
  function qsa(sel,root){return Array.prototype.slice.call((root||D).querySelectorAll(sel))}
  function closest(el,sel){return el&&el.closest?el.closest(sel):null}
  function h(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function toast(msg){try{if(W.LuminaAppCommands&&W.LuminaAppCommands.showToast)W.LuminaAppCommands.showToast(msg)}catch(_e){}}
  function click(el){if(el&&typeof el.click==='function'){el.click();return true}return false}
  function openTab(tab){
    var btn=qs('[data-left-tab="'+tab+'"]')||qs('[data-left-tab-proxy="'+tab+'"]');
    if(click(btn))return true;
    qsa('[data-left-tab]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-left-tab')===tab);b.setAttribute('aria-selected',b.getAttribute('data-left-tab')===tab?'true':'false')});
    qsa('[data-left-pane]').forEach(function(p){p.classList.toggle('active',p.getAttribute('data-left-pane')===tab)});
    return !!qs('[data-left-pane="'+tab+'"]');
  }
  function markUpdated(action,target){state.lastAction=action||'';state.lastTarget=target||'';state.lastUpdatedAt=new Date().toISOString();publishStatus();}
  function highlight(el){
    if(!el)return;
    el.classList.add('stage42c-highlight');
    setTimeout(function(){el.classList.remove('stage42c-highlight')},1600);
  }
  function scrollToTarget(el){
    if(!el)return false;
    try{el.scrollIntoView({behavior:'smooth',block:'start'});}catch(_e){try{el.scrollIntoView(true)}catch(_ee){}}
    highlight(el);
    return true;
  }
  function openThemeDesigner(target){
    ensure();
    openTab('styles');
    setTimeout(function(){
      var el=target==='copilot'?(qs('#stage42aThemePanel .stage42a-copilot')||byId('stage42aThemePanel')):(byId('stage42cMasterThemeMount')||byId('stage42cThemeDesignerHost'));
      scrollToTarget(el);
      markUpdated('open-'+(target||'designer'), target||'designer');
    },80);
    return true;
  }
  function openAiSetup(){openTab('ai-setup');markUpdated('open-ai-setup','ai-setup');return true;}
  function ensureEntry(){
    var pane=qs('[data-left-pane="styles"]'); if(!pane)return false;
    var host=byId('stage42cThemeDesignerHost');
    if(!host){
      host=D.createElement('section');
      host.id='stage42cThemeDesignerHost';
      host.className='stage42c-theme-entry';
      host.innerHTML=''
        +'<div class="stage42c-head"><div><div class="smallcaps">Theme Designer</div><h2>Design theme + Theme Copilot</h2><p>Theme controls and Theme Copilot now live directly in the Design tab. Use the designer for colors, typography, chrome, and reusable JSON themes; use Theme Copilot to match a reference presentation.</p><div class="stage42c-path">Path: <b>Design</b> → <b>Theme Designer</b> / <b>Theme Copilot</b></div></div><span class="stage42c-chip">Stage 42D visible entry</span></div>'
        +'<div class="stage42c-actions"><button class="btn mini primary" type="button" id="stage42cOpenThemeDesignerBtn">Theme Designer</button><button class="btn mini primary" type="button" id="stage42cOpenThemeCopilotBtn">Theme Copilot</button><button class="btn mini" type="button" id="stage42cOpenAiSetupBtn">AI setup</button></div>'
        +'<div class="stage42c-mounts"><div class="stage42c-mount" id="stage42cMasterThemeMount"></div><div class="stage42c-mount" id="stage42cThemeCopilotMount"></div></div>';
      var card=qs('[data-left-pane="styles"] .workflow-jump-card');
      if(card&&card.parentNode)card.parentNode.insertBefore(host,card.nextSibling); else pane.insertBefore(host,pane.firstChild);
    }
    bindButton('stage42cOpenThemeDesignerBtn',function(){openThemeDesigner('designer')});
    bindButton('stage42cOpenThemeCopilotBtn',function(){openThemeDesigner('copilot')});
    bindButton('stage42cOpenAiSetupBtn',openAiSetup);
    state.entry=true;
    return true;
  }
  function bindButton(id,fn){var b=byId(id);if(b&&!b.__stage42cBound){b.__stage42cBound=true;b.addEventListener('click',function(e){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();e.stopPropagation();fn();},true)}}
  function findMasterPanel(){
    var pane=qs('[data-subpane="slides:theme"]');
    if(!pane)return null;
    var panels=qsa(':scope > .panel',pane); // modern browsers
    if(!panels.length)panels=qsa('.panel',pane).filter(function(p){return p.parentNode===pane});
    for(var i=0;i<panels.length;i++){
      if(panels[i].textContent&&/Master theme/i.test(panels[i].textContent))return panels[i];
    }
    return panels[0]||null;
  }
  function ensureHiddenPlaceholder(){
    var pane=qs('[data-subpane="slides:theme"]'); if(!pane||byId('stage42cHiddenThemePlaceholder'))return !!pane;
    var div=D.createElement('div');
    div.id='stage42cHiddenThemePlaceholder';
    div.className='stage42c-hidden-theme-placeholder';
    div.innerHTML='<div class="smallcaps">Theme tools moved</div><p>The full Theme Designer and Theme Copilot are now in the Design tab.</p><div class="stage42c-actions"><button class="btn mini primary" type="button" id="stage42cHiddenOpenDesignBtn">Open Theme Designer</button><button class="btn mini" type="button" id="stage42cHiddenOpenCopilotBtn">Open Theme Copilot</button></div>';
    pane.insertBefore(div,pane.firstChild);
    bindButton('stage42cHiddenOpenDesignBtn',function(){openThemeDesigner('designer')});
    bindButton('stage42cHiddenOpenCopilotBtn',function(){openThemeDesigner('copilot')});
    state.placeholder=true;
    return true;
  }
  function movePanels(){
    ensureEntry();
    var master=findMasterPanel(), mm=byId('stage42cMasterThemeMount');
    if(master&&mm&&!mm.contains(master)){mm.appendChild(master);state.movedMaster=true;}
    var themePanel=byId('stage42aThemePanel'), cm=byId('stage42cThemeCopilotMount');
    if(themePanel&&cm&&!cm.contains(themePanel)){cm.appendChild(themePanel);state.movedCopilot=true;}
    ensureHiddenPlaceholder();
  }
  function ensureQuickActions(){
    var card=qs('[data-left-pane="styles"] .workflow-jump-card'); if(!card)return false;
    var actions=qs('.workflow-jump-actions',card); if(!actions)return false;
    if(!byId('stage42cDesignThemeDesignerShortcut')){
      var wrap=D.createElement('div');
      wrap.className='stage42c-design-quick-actions';
      wrap.innerHTML='<button class="btn mini primary" type="button" id="stage42cDesignThemeDesignerShortcut">Theme Designer</button><button class="btn mini primary" type="button" id="stage42cDesignThemeCopilotShortcut">Theme Copilot</button><button class="btn mini" type="button" id="stage42cDesignAiSetupShortcut">AI setup</button>';
      actions.insertBefore(wrap,actions.firstChild);
    }
    bindButton('stage42cDesignThemeDesignerShortcut',function(){openThemeDesigner('designer')});
    bindButton('stage42cDesignThemeCopilotShortcut',function(){openThemeDesigner('copilot')});
    bindButton('stage42cDesignAiSetupShortcut',openAiSetup);
    state.quickActions=true;
    return true;
  }
  function bindToolbarTheme(){
    qsa('[data-stage38c-action="theme"], [data-stage38b-action="theme"]').forEach(function(btn){
      if(!btn.__stage42cThemeBound){
        btn.__stage42cThemeBound=true;
        btn.title='Open Theme Designer in the Design tab';
        btn.setAttribute('aria-label','Open Theme Designer');
        btn.addEventListener('click',function(e){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();e.stopPropagation();openThemeDesigner('designer');},true);
      }
    });
    if(!W.__stage42cThemeToolbarDelegate){
      W.__stage42cThemeToolbarDelegate=true;
      D.addEventListener('click',function(e){
        var t=e.target&&e.target.closest&&e.target.closest('[data-stage38c-action="theme"],[data-stage38b-action="theme"]');
        if(!t)return;
        e.preventDefault();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        e.stopPropagation();
        openThemeDesigner('designer');
      },true);
    }
    state.toolbarBound=qsa('[data-stage38c-action="theme"], [data-stage38b-action="theme"]').some(function(btn){return !!btn.__stage42cThemeBound}) || !!W.__stage42cThemeToolbarDelegate;
  }
  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics; if(!LD||LD.__stage42cThemeDiscoveryPatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null)); if(!prev)return false;
    function wrap(){var r={};try{r=prev()||{}}catch(e){r={stage:STAGE,stage42cPreviousReportError:String(e&&(e.stack||e.message)||e)}}runTests();r.stage=STAGE;r.diagnosticScriptStage=STAGE;r.stageFromWindow=W.LUMINA_STAGE||STAGE;r.indexStageSignature=W.LUMINA_STAGE_SIGNATURE||SIG;if(D.documentElement&&D.documentElement.dataset)r.indexDatasetStage=D.documentElement.dataset.luminaStage||STAGE;r.stage42CThemeDiscoveryStatus=status();r.stage42DThemeDiscoveryStatus=status();r.stage42CThemeDiscoveryDiagnostics={lastAction:state.lastAction,lastTarget:state.lastTarget,hostInDesign:!!(byId('stage42cThemeDesignerHost')&&qs('[data-left-pane="styles"]')&&qs('[data-left-pane="styles"]').contains(byId('stage42cThemeDesignerHost'))),masterInDesign:!!(byId('stage42cMasterThemeMount')&&byId('themeName')&&byId('stage42cMasterThemeMount').contains(byId('themeName'))),copilotInDesign:!!(byId('stage42cThemeCopilotMount')&&byId('stage42aThemePanel')&&byId('stage42cThemeCopilotMount').contains(byId('stage42aThemePanel')))};r.stage42DThemeDiscoveryDiagnostics=Object.assign({},r.stage42CThemeDiscoveryDiagnostics||{});if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{themeDesignerVisible:true,themeCopilotVisibleEntry:true,themeToolbarRoutesToDesign:true});return r}
    LD.collectReport=wrap; LD.getReport=wrap; LD.__stage42cThemeDiscoveryPatched=true; return true;
  }
  function runTests(){
    var styles=qs('[data-left-pane="styles"]');
    state.tests={
      designPane:!!styles,
      themeDesignerHost:!!byId('stage42cThemeDesignerHost'),
      themeDesignerButtons:!!(byId('stage42cOpenThemeDesignerBtn')&&byId('stage42cOpenThemeCopilotBtn')),
      quickActions:!!(byId('stage42cDesignThemeDesignerShortcut')&&byId('stage42cDesignThemeCopilotShortcut')),
      masterThemeControlsVisibleInDesign:!!(styles&&byId('themeName')&&styles.contains(byId('themeName'))),
      themeCopilotVisibleInDesign:!!(styles&&byId('stage42aGenerateThemeBtn')&&styles.contains(byId('stage42aGenerateThemeBtn'))),
      hiddenThemePlaceholder:!!byId('stage42cHiddenThemePlaceholder'),
      toolbarThemeBound:state.toolbarBound,
      aiSetupShortcut:!!byId('stage42cOpenAiSetupBtn')
    };
    state.tests.pass=state.tests.designPane&&state.tests.themeDesignerHost&&state.tests.themeDesignerButtons&&state.tests.quickActions&&state.tests.masterThemeControlsVisibleInDesign&&state.tests.themeCopilotVisibleInDesign&&state.tests.hiddenThemePlaceholder&&state.tests.toolbarThemeBound;
    state.pass=!!state.tests.pass;
    return state.tests;
  }
  function status(){runTests();return {stage:STAGE,themeDesignerVisible:true,themeCopilotVisibleEntry:true,themeControlsMovedToDesign:state.tests.masterThemeControlsVisibleInDesign,themeCopilotMovedToDesign:state.tests.themeCopilotVisibleInDesign,toolbarThemeRoutesToDesign:state.toolbarBound,lastAction:state.lastAction,lastTarget:state.lastTarget,lastUpdatedAt:state.lastUpdatedAt,tests:Object.assign({},state.tests),pass:state.pass};}
  function publishStatus(){W.__LUMINA_STAGE42C_THEME_DISCOVERY_STATUS=status();W.__LUMINA_STAGE42D_THEME_DISCOVERY_STATUS=W.__LUMINA_STAGE42C_THEME_DISCOVERY_STATUS;}
  function ensure(){
    try{W.LUMINA_STAGE=STAGE;W.LUMINA_STAGE_SIGNATURE=SIG;if(D.documentElement){D.documentElement.setAttribute('data-lumina-stage',STAGE);D.documentElement.setAttribute('data-lumina-stage-signature',SIG)}}catch(_e){}
    ensureEntry(); ensureQuickActions(); movePanels(); bindToolbarTheme(); patchDiagnostics(); publishStatus(); return state.pass;
  }
  W.LuminaThemeDiscoveryStage42C={stage:STAGE,ensure:ensure,openThemeDesigner:function(){return openThemeDesigner('designer')},openThemeCopilot:function(){return openThemeDesigner('copilot')},openAiSetup:openAiSetup,status:status};
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',ensure,{once:true}); else ensure();
  [50,150,400,900,1500,2600,4200,6500].forEach(function(ms){setTimeout(ensure,ms)});
})();

try{window.LuminaThemeDiscoveryStage42D=window.LuminaThemeDiscoveryStage42C;}catch(_e){}
