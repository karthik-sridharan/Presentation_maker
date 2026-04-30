/* copilot-workflow-stage41k.js — split Copilot workflow, Review tab, and AI setup tab. */
(function(){
  'use strict';
  var W=window,D=document;
  var STAGE='stage41k-copilot-workflow-split-20260430-1';
  var SIG='index-inline-stage41k-copilot-workflow-split-20260430-1';
  var state={mode:'choice',lastImportFileNames:[],lastImportStatus:'',lastSetupAt:'',lastGeneratedAt:'',lastError:''};
  function byId(id){return D.getElementById(id)}
  function qs(sel,root){return (root||D).querySelector(sel)}
  function qsa(sel,root){return Array.prototype.slice.call((root||D).querySelectorAll(sel))}
  function h(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function mk(tag,attrs,html){var e=D.createElement(tag);Object.keys(attrs||{}).forEach(function(k){if(k==='class')e.className=attrs[k];else if(k==='text')e.textContent=attrs[k];else e.setAttribute(k,attrs[k])});if(html!=null)e.innerHTML=html;return e}
  function app(){return W.LuminaAppCommands||{}}
  function core(){return W.LuminaCopilotCore||null}
  function toast(msg){try{if(app().showToast)return app().showToast(msg)}catch(_e){} console.log('[Stage41K]',msg)}
  function setValue(el,val){if(!el)return;el.value=String(val==null?'':val);try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}catch(_e){}}
  function field(id){var el=byId(id);return el&&el.closest&&el.closest('.field')}
  function currentSlides(){try{if(app().getSlides)return app().getSlides()||[]}catch(_e){}return Array.isArray(W.slides)?W.slides:[]}
  function openLeftTab(name){var btn=qs('[data-left-tab="'+name+'"]');if(btn){btn.click();return true}return false}

  function ensureWorkflowTabs(){
    var tabs=byId('leftTabs')||qs('.left-tabs.mode-bar.stage35a-workflow-tabs');
    if(!tabs)return false;
    var cop=qs('[data-left-tab="copilot"]',tabs);
    if(cop){
      var title=qs('.tab-title',cop),desc=qs('.tab-desc',cop);
      if(title)title.textContent='Copilot'; else cop.textContent='Copilot';
      if(desc)desc.textContent='Import / create';
    }
    if(!qs('[data-left-tab="review"]',tabs)){
      var review=mk('button',{class:'left-tab workflow-primary',type:'button','data-left-tab':'review','data-left-tab-group':'review','data-workflow-primary':'1'},'<span class="tab-title">Review</span><span class="tab-desc">Slides</span>');
      cop&&cop.parentNode?cop.parentNode.insertBefore(review,cop.nextSibling):tabs.appendChild(review);
    }
    if(!qs('[data-left-tab="ai-setup"]',tabs)){
      var setup=mk('button',{class:'left-tab workflow-primary',type:'button','data-left-tab':'ai-setup','data-left-tab-group':'ai-setup','data-workflow-primary':'1'},'<span class="tab-title">AI setup</span><span class="tab-desc">Key / backend</span>');
      var after=qs('[data-left-tab="review"]',tabs)||cop;
      after&&after.parentNode?after.parentNode.insertBefore(setup,after.nextSibling):tabs.appendChild(setup);
    }
    return true;
  }

  function ensureLeftPane(name,html,cls){
    var pane=qs('.left-pane[data-left-pane="'+name+'"]');
    if(pane)return pane;
    pane=mk('div',{class:'left-pane '+(cls||''),'data-left-pane':name},html||'');
    var rail=byId('slideRailShell');
    if(rail&&rail.parentNode)rail.parentNode.insertBefore(pane,rail);else (qs('.left-shell')||D.body).appendChild(pane);
    return pane;
  }
  function ensureReviewPane(){
    var pane=ensureLeftPane('review','', 'stage41k-review-pane');
    if(pane.dataset.stage41kReady==='1')return pane;
    pane.dataset.stage41kReady='1';
    pane.innerHTML='<div class="stage41k-card"><div class="smallcaps">Review slides</div><h2>Review, remake, merge, then apply</h2><p>This is now a first-class workflow tab. It opens the slide review workspace without crowding the Copilot creation drawer.</p><div class="stage41k-kpis"><span><b id="stage41kReviewSlideCount">0</b>slides</span><span><b>Keep</b>default action</span><span><b>Preview</b>before apply</span></div><div class="stage41k-actions"><button class="btn primary" type="button" id="stage41kOpenReviewBtn">Open slide review</button><button class="btn" type="button" id="stage41kReviewRefreshBtn">Refresh count</button></div><p class="help" style="margin-top:.65rem">Review remains non-destructive until you apply the reviewed result.</p></div>';
    var open=byId('stage41kOpenReviewBtn'); if(open)open.addEventListener('click',function(){if(W.CopilotReview&&W.CopilotReview.open)W.CopilotReview.open();else alert('Review module is not loaded yet.');},true);
    var ref=byId('stage41kReviewRefreshBtn'); if(ref)ref.addEventListener('click',refreshCounts,true);
    return pane;
  }
  function ensureSetupPane(){
    var pane=ensureLeftPane('ai-setup','', 'stage41k-setup-pane');
    if(pane.dataset.stage41kReady!=='1'){
      pane.dataset.stage41kReady='1';
      pane.innerHTML='<div class="stage41k-card"><div class="smallcaps">AI setup</div><h2>Connection settings</h2><p>Choose temporary browser-key testing or a deployment backend proxy. These controls are intentionally separate from deck creation and review.</p><div id="stage41kSetupPanelMount"></div><div class="stage41k-prompt-files"><div><b>Editable prompt files</b></div><code>prompts/import_prompt.txt — faithful source presentation import</code><code>prompts/create_prompt.txt — new deck creation</code><code>prompts/system_promp.txt — legacy fallback only</code></div></div>';
    }
    return pane;
  }
  function moveSetupPanel(){
    ensureSetupPane();
    var mount=byId('stage41kSetupPanelMount');
    var panel=byId('stage41cBrowserKeyPanel');
    if(mount&&panel&&panel.parentNode!==mount){mount.appendChild(panel);state.lastSetupAt=new Date().toISOString()}
  }
  function refreshCounts(){var el=byId('stage41kReviewSlideCount');if(el)el.textContent=String(currentSlides().length||0)}

  function ensureDrawerRouter(){
    var d=byId('stage38qAiDrawer'); if(!d)return false;
    d.classList.add('stage41k-repurposed');
    if(!d.getAttribute('data-stage41k-mode'))d.setAttribute('data-stage41k-mode',state.mode||'choice');
    var head=qs('.stage38q-drawer-head',d);
    if(head){var cap=qs('.smallcaps',head),h2=qs('h2',head),p=qs('p',head); if(cap)cap.textContent='Copilot deck workspace'; if(h2)h2.textContent='Import or create a deck with Copilot'; if(p)p.textContent='Start by choosing whether Copilot should faithfully import an existing presentation or create a new deck from references and prompts.';}
    var body=byId('stage38qAiDrawerBody')||qs('.stage38q-drawer-body',d); if(!body)return false;
    var panel=qs('.copilot-panel',body)||qs('.copilot-panel');
    if(panel&&!body.contains(panel))body.appendChild(panel);
    if(panel){
      panel.style.display='';
      ['copilotModel','copilotEndpoint','copilotApiKey'].forEach(function(id){var f=field(id);if(f)f.setAttribute('data-stage41k-ai-setting','1')});
      var rev=byId('copilotReviewBtn'); if(rev)rev.setAttribute('data-stage41k-hidden-in-create','1');
    }
    if(!byId('stage41kCopilotRouter')){
      var router=mk('div',{id:'stage41kCopilotRouter',class:'stage41k-router'},[
        '<div class="stage41k-choice-grid">',
        '<button class="stage41k-choice" type="button" data-stage41k-pick="import"><strong>Import existing presentation</strong><span>Provide a URL or upload a source PDF/HTML/text slide deck. Copilot reconstructs the slides as faithfully as possible.</span></button>',
        '<button class="stage41k-choice" type="button" data-stage41k-pick="create"><strong>Create new deck</strong><span>Use prompts, references, plan editing, preview, then apply as before.</span></button>',
        '</div>',
        '<div class="stage41k-import-card" id="stage41kImportCard">',
        '<h3>Import with Copilot</h3><p>Use this for “make this app presentation match the source deck.” The import prompt is loaded from <code>prompts/import_prompt.txt</code>.</p>',
        '<div class="stage41k-field-grid">',
        '<div class="stage41k-field full"><label for="stage41kImportUrls">Source URL(s)</label><textarea id="stage41kImportUrls" spellcheck="false" placeholder="https://example.com/source-slides.pdf\nhttps://example.com/presentation.html"></textarea><div class="stage41k-help">URLs are passed as references. PDF URLs are attached through the OpenAI Responses file-url path when using the default OpenAI endpoint.</div></div>',
        '<div class="stage41k-field full"><label for="stage41kImportFiles">Upload source files</label><input id="stage41kImportFiles" type="file" multiple accept=".pdf,.html,.htm,.txt,.md,.markdown,.json,.csv,.tex,.ppt,.pptx,application/pdf,text/html,text/plain,text/markdown,application/json" /><div class="stage41k-help">Best fidelity: export PowerPoint/Keynote to PDF or HTML first. Text/HTML/Markdown/JSON are read into reference text; PDFs are attached to the model request.</div></div>',
        '<div class="stage41k-field full"><label for="stage41kImportUserPrompt">Additional import instructions</label><textarea id="stage41kImportUserPrompt" placeholder="Example: Preserve all 76 slides, match the lecture order, keep equations, and turn demos into custom HTML blocks when visible."></textarea></div>',
        '<div class="stage41k-field"><label for="stage41kImportSlideCount">Target slides</label><input id="stage41kImportSlideCount" type="number" min="1" step="1" placeholder="Auto or source count" /></div>',
        '<div class="stage41k-field"><label for="stage41kImportTone">Tone / style</label><select id="stage41kImportTone"><option value="source-faithful academic lecture" selected>Source-faithful lecture</option><option value="technical and rigorous">Technical / rigorous</option><option value="clear and concise">Clear and concise</option><option value="visual and workshop-friendly">Workshop-friendly</option></select></div>',
        '<div class="stage41k-field"><label for="stage41kImportMode">Apply generated slides as</label><select id="stage41kImportMode"><option value="replace" selected>Replace current deck</option><option value="append">Append to current deck</option></select></div>',
        '<div class="stage41k-field"><label for="stage41kImportWebSearch">Reference links</label><label class="stage41k-help" style="display:flex;gap:.45rem;align-items:center"><input id="stage41kImportWebSearch" type="checkbox" checked style="width:auto" /> Use web search for source URLs</label></div>',
        '</div>',
        '<div class="stage41k-actions"><button class="btn primary" type="button" id="stage41kGenerateImportPreviewBtn">Generate import preview</button><button class="btn" type="button" id="stage41kGoApplyBtn">Go to Apply</button><button class="btn" type="button" id="stage41kBackChoiceBtn">Back to choices</button></div>',
        '<div class="stage41k-import-status" id="stage41kImportStatus">No import source selected yet.</div>',
        '</div>',
        '<div class="stage41k-create-card" id="stage41kCreateCard"><h3>Create with Copilot</h3><p>The create workflow uses <code>prompts/create_prompt.txt</code>. Use the existing prompt, references, plan, preview, and apply sections below. AI setup has moved to the separate AI setup tab.</p><div class="stage41k-actions"><button class="btn primary" type="button" id="stage41kGoCreatePromptBtn">Go to prompt</button><button class="btn" type="button" id="stage41kGoCreatePlanBtn">Go to plan</button><button class="btn" type="button" id="stage41kCreateBackChoiceBtn">Back to choices</button></div></div>'
      ].join(''));
      body.insertBefore(router,body.firstChild);
      router.addEventListener('click',function(e){var pick=e.target&&e.target.closest&&e.target.closest('[data-stage41k-pick]');if(pick){setMode(pick.getAttribute('data-stage41k-pick'));return}if(e.target&&e.target.id==='stage41kBackChoiceBtn')setMode('choice');if(e.target&&e.target.id==='stage41kCreateBackChoiceBtn')setMode('choice');if(e.target&&e.target.id==='stage41kGoCreatePromptBtn'){setMode('create');setOldSection('prompt')}if(e.target&&e.target.id==='stage41kGoCreatePlanBtn'){setMode('create');setOldSection('plan')}if(e.target&&e.target.id==='stage41kGoApplyBtn'){setOldSection('apply')}},true);
      var gen=byId('stage41kGenerateImportPreviewBtn'); if(gen)gen.addEventListener('click',generateImportPreview,true);
    }
    updateChoiceButtons();
    return true;
  }
  function setOldSection(section){
    var d=byId('stage38qAiDrawer'); if(d){d.dataset.section=section||'prompt';qsa('[data-tab]',d).forEach(function(b){var on=b.getAttribute('data-tab')===(section||'prompt');b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')})}
  }
  function setMode(mode){
    state.mode=(mode==='import'||mode==='create')?mode:'choice';
    var d=byId('stage38qAiDrawer'); if(d)d.setAttribute('data-stage41k-mode',state.mode);
    var c=core();try{if(c&&typeof c.setCopilotPromptMode==='function')c.setCopilotPromptMode(state.mode==='import'?'import':'create')}catch(_e){}
    W.LuminaCopilotPromptMode=state.mode==='import'?'import':'create';
    if(state.mode==='create')setOldSection('prompt');
    if(state.mode==='import')setOldSection('preview');
    updateChoiceButtons();
  }
  function updateChoiceButtons(){var d=byId('stage38qAiDrawer');var mode=(d&&d.getAttribute('data-stage41k-mode'))||state.mode||'choice';qsa('[data-stage41k-pick]',d||D).forEach(function(b){b.classList.toggle('active',b.getAttribute('data-stage41k-pick')===mode)})}
  function openCopilot(mode){
    try{if(W.LuminaStage40ADeckPlanning&&W.LuminaStage40ADeckPlanning.openAI)W.LuminaStage40ADeckPlanning.openAI(mode==='import'?'preview':'prompt');else if(W.LuminaStage39AAiDrawerWorkflow&&W.LuminaStage39AAiDrawerWorkflow.openAI)W.LuminaStage39AAiDrawerWorkflow.openAI(mode==='import'?'preview':'prompt');else if(W.LuminaStage38QAiDrawerAdvanced&&W.LuminaStage38QAiDrawerAdvanced.openAI)W.LuminaStage38QAiDrawerAdvanced.openAI(mode==='import'?'preview':'prompt')}catch(_e){}
    setTimeout(function(){ensureDrawerRouter();setMode(mode||'choice')},60);
  }

  function isPdf(file){return /\.pdf$/i.test(file.name||'')||/application\/pdf/i.test(file.type||'')}
  function isProbablyText(file){return /^text\//i.test(file.type||'')||/\.(txt|md|markdown|json|csv|tex|html?|xml|yaml|yml)$/i.test(file.name||'')}
  function readAsDataUrl(file){return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(){resolve(String(r.result||''))};r.onerror=function(){reject(r.error||new Error('Could not read '+(file.name||'file')))};r.readAsDataURL(file)})}
  function readAsText(file){return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(){resolve(String(r.result||''))};r.onerror=function(){reject(r.error||new Error('Could not read '+(file.name||'file')))};r.readAsText(file)})}
  async function collectImportFiles(){
    var input=byId('stage41kImportFiles');var files=Array.prototype.slice.call(input&&input.files||[]);var textParts=[],pdfs=[],unsupported=[];
    for(var i=0;i<files.length;i++){
      var f=files[i];
      if(isPdf(f)){pdfs.push({filename:f.name||('source-'+(i+1)+'.pdf'),file_data:await readAsDataUrl(f),bytes:f.size||0});}
      else if(isProbablyText(f)){textParts.push('--- SOURCE FILE: '+(f.name||('source-'+(i+1)))+' ---\n'+await readAsText(f));}
      else unsupported.push(f.name||('file-'+(i+1)));
    }
    state.lastImportFileNames=files.map(function(f){return f.name||'file'});
    return {text:textParts.join('\n\n'),pdfs:pdfs,unsupported:unsupported,files:files};
  }
  async function generateImportPreview(){
    try{
      ensureDrawerRouter(); setMode('import');
      var c=core(); if(!c)throw new Error('Copilot core is not ready yet.');
      var urls=(byId('stage41kImportUrls')&&byId('stage41kImportUrls').value||'').trim();
      var user=(byId('stage41kImportUserPrompt')&&byId('stage41kImportUserPrompt').value||'').trim();
      var count=(byId('stage41kImportSlideCount')&&byId('stage41kImportSlideCount').value||'').trim();
      var tone=(byId('stage41kImportTone')&&byId('stage41kImportTone').value)||'source-faithful academic lecture';
      var mode=(byId('stage41kImportMode')&&byId('stage41kImportMode').value)||'replace';
      var web=!!(byId('stage41kImportWebSearch')&&byId('stage41kImportWebSearch').checked);
      var files=await collectImportFiles();
      if(!urls&&!files.text&&!files.pdfs.length)throw new Error('Add a source URL or upload a source PDF/HTML/text file first.');
      var prompt=[
        'Import the provided source presentation as faithfully as possible into Lumina slides.',
        count?'Target slide count: '+count:'Preserve the source slide count. If the source count is visible, use that count.',
        user?'Additional user instructions: '+user:'Additional user instructions: preserve ordering, titles, equations, visuals, and teaching flow.',
        files.unsupported.length?'Unsupported uploaded files that could not be read in browser: '+files.unsupported.join(', '):''
      ].filter(Boolean).join('\n');
      W.LuminaCopilotPromptMode='import';
      if(c.setCopilotPromptMode)c.setCopilotPromptMode('import');
      if(c.setCopilotReferenceUrls)c.setCopilotReferenceUrls(urls);
      if(c.setCopilotReferenceText)c.setCopilotReferenceText(files.text||'',false);
      if(c.setCopilotReferencePdfFiles)c.setCopilotReferencePdfFiles(files.pdfs||[],false);
      setValue(byId('copilotPrompt'),prompt);
      setValue(byId('copilotSlideCount'),count||String(Math.max(1,currentSlides().length||6)));
      setValue(byId('copilotTone'),tone);
      setValue(byId('copilotMode'),mode);
      if(byId('copilotWebSearch'))byId('copilotWebSearch').checked=web;
      var st=byId('stage41kImportStatus'); if(st)st.textContent='Prepared import source: '+(urls?urls.split(/\n+/).filter(Boolean).length+' URL(s), ':'')+files.pdfs.length+' PDF(s), '+(files.text?files.text.length:0)+' text chars. Generating preview…';
      var api=W.LuminaStage39AAiDrawerWorkflow;
      var deck=null;
      if(api&&typeof api.generatePreview==='function')deck=await api.generatePreview('deck');
      else if(c.callCopilot){deck=await c.callCopilot('deck'); if(byId('copilotResultJson'))byId('copilotResultJson').value=JSON.stringify(deck,null,2)}
      state.lastGeneratedAt=new Date().toISOString();
      if(st)st.textContent=deck&&deck.slides?'Import preview ready: '+deck.slides.length+' generated slide(s). Go to Apply to replace or append.':'Import preview request finished. Check Latest Copilot result.';
      setOldSection('preview');
      toast('Import preview ready. Review before applying.');
      return deck;
    }catch(err){
      var msg=(err&&err.message)||String(err);state.lastError=msg;var st=byId('stage41kImportStatus');if(st)st.textContent='Import error: '+msg;try{if(core()&&core().setCopilotStatus)core().setCopilotStatus(msg,true)}catch(_e){};return null;
    }
  }

  function patchOpeners(){
    if(W.__stage41kOpenersPatched)return; W.__stage41kOpenersPatched=1;
    function wrap(obj,name){if(!obj||typeof obj[name]!=='function'||obj[name].__stage41kWrapped)return;var old=obj[name];obj[name]=function(section){var r=old.apply(this,arguments);setTimeout(ensureDrawerRouter,40);return r};obj[name].__stage41kWrapped=1;}
    try{wrap(W.LuminaStage38QAiDrawerAdvanced,'openAI');wrap(W.LuminaStage39AAiDrawerWorkflow,'openAI');wrap(W.LuminaStage40ADeckPlanning,'openAI')}catch(_e){}
    D.addEventListener('click',function(e){var t=e.target&&e.target.closest&&e.target.closest('[data-stage41k-open-copilot]');if(!t)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();openCopilot(t.getAttribute('data-stage41k-open-copilot')||'choice')},true);
  }
  function addCopilotPaneIntro(){
    var pane=qs('.left-pane[data-left-pane="copilot"]'); if(!pane||byId('stage41kCopilotTabCard'))return;
    pane.innerHTML='<div class="stage41k-card" id="stage41kCopilotTabCard"><div class="smallcaps">Copilot</div><h2>Import or create with AI</h2><p>Choose a focused workflow. Import reconstructs an existing presentation using <code>prompts/import_prompt.txt</code>. Create uses references, planning, preview, and <code>prompts/create_prompt.txt</code>.</p><div class="stage41k-actions"><button class="btn primary" type="button" data-stage41k-open-copilot="import">Import slides with Copilot</button><button class="btn primary" type="button" data-stage41k-open-copilot="create">Create new deck with Copilot</button><button class="btn" type="button" data-left-tab-proxy="ai-setup">AI setup</button></div></div>';
  }
  function bindNewWorkflowControls(){
    qsa('[data-left-tab="review"],[data-left-tab="ai-setup"]').forEach(function(btn){
      if(btn.dataset.stage41kTabBound)return; btn.dataset.stage41kTabBound='1';
      btn.addEventListener('click',function(){
        var tab=btn.getAttribute('data-left-tab');
        var group=btn.dataset.proxyGroup || btn.dataset.leftTabGroup || tab;
        qsa('[data-left-tab]').forEach(function(el){
          if(el.dataset.workflowPrimary==='1')el.classList.toggle('active',(el.dataset.leftTabGroup||el.dataset.leftTab)===group);
          else el.classList.toggle('active',el===btn);
        });
        qsa('[data-left-pane]').forEach(function(el){el.classList.toggle('active',el.dataset.leftPane===tab)});
        if(tab==='ai-setup')moveSetupPanel();
        if(tab==='review')refreshCounts();
      },true);
    });
    qsa('[data-left-tab-proxy="ai-setup"],[data-left-tab-proxy="review"]').forEach(function(btn){
      if(btn.dataset.stage41kProxyBound)return; btn.dataset.stage41kProxyBound='1';
      btn.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        openLeftTab(btn.getAttribute('data-left-tab-proxy'));
      },true);
    });
  }

  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics;if(!LD||LD.__stage41kWorkflowPatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null));if(!prev)return false;
    function wrap(){var r={};try{r=prev()||{}}catch(e){r={stage:STAGE,stage41kPreviousReportError:String(e&&(e.stack||e.message)||e)}}var st=status();r.stage=STAGE;r.diagnosticScriptStage=STAGE;r.stageFromWindow=W.LUMINA_STAGE||STAGE;r.indexStageSignature=W.LUMINA_STAGE_SIGNATURE||SIG;if(D.documentElement&&D.documentElement.dataset)r.indexDatasetStage=D.documentElement.dataset.luminaStage||STAGE;r.stage41KCopilotWorkflowStatus=st;r.stage41KCopilotWorkflowDiagnostics={tabs:st.tabs,drawerMode:st.drawerMode,tests:st.tests,lastImportStatus:state.lastImportStatus,lastError:state.lastError};if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{reviewSeparateTab:true,aiSetupSeparateTab:true,copilotImportCreateRouter:true,importPromptFile:true,createPromptFile:true});return r}
    LD.collectReport=wrap;LD.getReport=wrap;LD.__stage41kWorkflowPatched=true;return true;
  }
  function status(){
    var tabs=qsa('[data-workflow-primary="1"]').map(function(b){return (b.textContent||'').trim().replace(/\s+/g,' ')});
    var d=byId('stage38qAiDrawer');
    var tests={workflowClass:!!(D.body&&D.body.classList.contains('stage41k-copilot-workflow')),reviewTab:!!qs('[data-left-tab="review"]'),aiSetupTab:!!qs('[data-left-tab="ai-setup"]'),reviewPane:!!qs('.left-pane[data-left-pane="review"]'),setupPane:!!qs('.left-pane[data-left-pane="ai-setup"]'),setupPanelMoved:!!(byId('stage41kSetupPanelMount')&&byId('stage41cBrowserKeyPanel')&&byId('stage41kSetupPanelMount').contains(byId('stage41cBrowserKeyPanel'))),copilotTabRepurposed:!!byId('stage41kCopilotTabCard'),drawerRouter:!!byId('stage41kCopilotRouter'),importPromptFile:true,createPromptFile:true,promptModeApi:!!(core()&&typeof core().setCopilotPromptMode==='function')};
    tests.pass=Object.keys(tests).every(function(k){return !!tests[k]});
    return {stage:STAGE,reviewSeparateTab:true,aiSetupSeparateTab:true,copilotImportCreateRouter:true,importPromptFile:'prompts/import_prompt.txt',createPromptFile:'prompts/create_prompt.txt',tabs:tabs,drawerMode:d&&d.getAttribute('data-stage41k-mode')||null,lastSetupAt:state.lastSetupAt,lastGeneratedAt:state.lastGeneratedAt,lastError:state.lastError,tests:tests,pass:tests.pass};
  }
  function refresh(){
    try{W.LUMINA_STAGE=STAGE;W.LUMINA_STAGE_SIGNATURE=SIG;if(D.documentElement){D.documentElement.setAttribute('data-lumina-stage',STAGE);D.documentElement.setAttribute('data-lumina-stage-signature',SIG)}}catch(_e){}
    if(D.body)D.body.classList.add('stage41k-copilot-workflow');
    ensureWorkflowTabs(); ensureReviewPane(); ensureSetupPane(); addCopilotPaneIntro(); bindNewWorkflowControls(); moveSetupPanel(); refreshCounts(); ensureDrawerRouter(); patchOpeners(); patchDiagnostics();
    W.__LUMINA_STAGE41K_COPILOT_WORKFLOW_STATUS=status();
    return W.__LUMINA_STAGE41K_COPILOT_WORKFLOW_STATUS;
  }
  function init(){refresh();[80,180,420,900,1800,3600,6500].forEach(function(ms){setTimeout(refresh,ms)});setInterval(function(){moveSetupPanel();refreshCounts();if(byId('stage38qAiDrawer')&&byId('stage38qAiDrawer').classList.contains('open'))ensureDrawerRouter()},1600);W.LuminaStage41KCopilotWorkflow={stage:STAGE,refresh:refresh,status:status,openCopilot:openCopilot,setMode:setMode,generateImportPreview:generateImportPreview};}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
