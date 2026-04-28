/* copilot-browser-key-test.js — Stage 41C temporary browser API-key testing panel.
 * Remove this file, css/copilot-browser-key-test.css, and their index.html tags before production. */
(function(){
  'use strict';
  var W=window,D=document;
  var STAGE='stage41c-browser-key-test-20260428-1';
  var SIG='index-inline-stage41c-browser-key-test-20260428-1';
  var DEFAULT_ENDPOINT='https://api.openai.com/v1/responses';
  var SETTINGS_KEY='html-presentation-generator-copilot-settings-v1';
  var API_KEY_STORAGE='html-presentation-generator-openai-api-key-v1';
  var MODE_KEY='html-presentation-generator-copilot-connection-mode-v1';
  var lastStatus='', lastMode='', lastSyncedAt='';
  function byId(id){return D.getElementById(id)}
  function qs(sel,root){return (root||D).querySelector(sel)}
  function h(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function get(k){try{return W.localStorage?W.localStorage.getItem(k):null}catch(_e){return null}}
  function set(k,v){try{if(W.localStorage)W.localStorage.setItem(k,v)}catch(_e){}}
  function del(k){try{if(W.localStorage)W.localStorage.removeItem(k)}catch(_e){}}
  function setValue(el,v){if(!el)return;el.value=String(v==null?'':v);try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}catch(_e){}}
  function existing(){
    var s={};try{s=JSON.parse(get(SETTINGS_KEY)||'{}')||{}}catch(_e){s={}}
    var endpoint=(byId('copilotEndpoint')&&byId('copilotEndpoint').value)||s.endpoint||DEFAULT_ENDPOINT;
    return {endpoint:endpoint,model:(byId('copilotModel')&&byId('copilotModel').value)||s.model||'gpt-4.1-mini',apiKey:(byId('copilotApiKey')&&byId('copilotApiKey').value)||get(API_KEY_STORAGE)||'',mode:get(MODE_KEY)||(/api\.openai\.com/i.test(endpoint)?'browser-openai':'backend-proxy')};
  }
  function setStatus(msg,type){
    lastStatus=String(msg||'');
    var el=byId('stage41cBrowserKeyStatus');
    if(el){el.textContent=lastStatus;el.classList.toggle('ready',type==='ready');el.classList.toggle('error',type==='error')}
    try{var core=W.LuminaCopilotCore;if(core&&typeof core.setCopilotStatus==='function')core.setCopilotStatus(lastStatus,type==='error')}catch(_e){}
  }
  function makePanel(){
    var p=byId('stage41cBrowserKeyPanel'); if(p)return p;
    p=D.createElement('div'); p.id='stage41cBrowserKeyPanel'; p.className='stage41c-browser-key-card';
    p.setAttribute('data-ai-section','outline references prompt plan preview apply review');
    p.innerHTML=[
      '<h3>Temporary browser API key testing</h3>',
      '<p>This restores the old easy testing flow: paste an OpenAI key in the browser, generate/review a deck, then remove this add-on before public deployment.</p>',
      '<div class="stage41c-key-grid">',
      '<div class="stage41c-field"><label for="stage41cConnectionMode">Connection mode</label><select id="stage41cConnectionMode"><option value="browser-openai">Browser OpenAI key — temporary testing</option><option value="backend-proxy">Backend proxy — deployment</option></select></div>',
      '<div class="stage41c-field"><label for="stage41cModel">Model</label><input id="stage41cModel" value="gpt-4.1-mini" autocomplete="off" /></div>',
      '<div class="stage41c-field full"><label for="stage41cEndpoint">Endpoint / backend proxy URL</label><input id="stage41cEndpoint" value="'+h(DEFAULT_ENDPOINT)+'" autocomplete="off" /></div>',
      '<div class="stage41c-field full"><label for="stage41cApiKey">OpenAI API key for browser testing</label><div class="stage41c-key-input-row"><input id="stage41cApiKey" type="password" autocomplete="off" placeholder="sk-proj-..." /><button class="btn mini" type="button" id="stage41cToggleKeyBtn">Show</button></div></div>',
      '</div>',
      '<div class="stage41c-actions"><button class="btn primary mini" type="button" id="stage41cUseBrowserKeyBtn">Use browser key for testing</button><button class="btn mini" type="button" id="stage41cSaveBrowserKeyBtn">Save key locally</button><button class="btn mini" type="button" id="stage41cClearBrowserKeyBtn">Clear saved key</button><button class="btn mini" type="button" id="stage41cUseBackendBtn">Use backend proxy instead</button></div>',
      '<div class="stage41c-warning" id="stage41cBrowserKeyWarning"></div>',
      '<div class="stage41c-status" id="stage41cBrowserKeyStatus">Choose browser-key mode for quick private testing, or backend-proxy mode for deployment.</div>'
    ].join('');
    return p;
  }
  function placePanel(){
    var p=makePanel(), review=byId('stage41bReviewCard'), drawer=qs('#stage38qAiDrawer .copilot-panel')||qs('.copilot-panel'), main=byId('stage41bReviewMainEntry');
    if(review&&review.parentNode)review.parentNode.insertBefore(p,review.nextSibling);
    else if(drawer)drawer.insertBefore(p,drawer.firstChild);
    else if(main&&main.parentNode)main.parentNode.insertBefore(p,main.nextSibling);
    else if(D.body)D.body.appendChild(p);
    return p;
  }
  function updateModeUi(){
    var mode=(byId('stage41cConnectionMode')&&byId('stage41cConnectionMode').value)||'browser-openai';
    var endpoint=byId('stage41cEndpoint'), key=byId('stage41cApiKey'), warn=byId('stage41cBrowserKeyWarning');
    if(endpoint){endpoint.readOnly=mode==='browser-openai'; if(mode==='browser-openai')endpoint.value=DEFAULT_ENDPOINT; endpoint.placeholder=mode==='backend-proxy'?'https://your-proxy.example.com/api/lumina/ai':DEFAULT_ENDPOINT;}
    if(key){key.disabled=mode==='backend-proxy'; key.placeholder=mode==='backend-proxy'?'No browser key needed in backend mode':'sk-proj-...'}
    if(warn){warn.innerHTML=mode==='browser-openai'?'<strong>Temporary testing mode:</strong> the key is sent directly from this browser and may be saved in localStorage if you click Save. Do not use this in a public deployment.':'<strong>Backend proxy mode:</strong> the browser does not store or send your OpenAI secret. Put the key only in your server environment variables.';}
  }
  function syncMirror(){
    var s=existing();
    if(byId('stage41cConnectionMode'))byId('stage41cConnectionMode').value=s.mode;
    if(byId('stage41cEndpoint'))byId('stage41cEndpoint').value=s.endpoint;
    if(byId('stage41cModel'))byId('stage41cModel').value=s.model;
    if(byId('stage41cApiKey')&&!byId('stage41cApiKey').value)byId('stage41cApiKey').value=s.apiKey;
    updateModeUi();
  }
  function syncCore(saveKey){
    var mode=(byId('stage41cConnectionMode')&&byId('stage41cConnectionMode').value)||'browser-openai';
    var endpoint=(byId('stage41cEndpoint')&&byId('stage41cEndpoint').value.trim())||DEFAULT_ENDPOINT;
    var model=(byId('stage41cModel')&&byId('stage41cModel').value.trim())||'gpt-4.1-mini';
    var key=(byId('stage41cApiKey')&&byId('stage41cApiKey').value.trim())||'';
    if(mode==='browser-openai')endpoint=DEFAULT_ENDPOINT;
    setValue(byId('copilotEndpoint'),endpoint); setValue(byId('copilotModel'),model); setValue(byId('copilotApiKey'),mode==='browser-openai'?key:'');
    set(MODE_KEY,mode); set(SETTINGS_KEY,JSON.stringify({endpoint:endpoint,model:model,tone:(byId('copilotTone')&&byId('copilotTone').value)||'clear and concise'}));
    if(saveKey){ if(mode==='browser-openai'&&key) set(API_KEY_STORAGE,key); else if(mode==='browser-openai'&&!key) del(API_KEY_STORAGE); }
    lastMode=mode; lastSyncedAt=new Date().toISOString(); updateModeUi();
    try{if(W.LuminaCopilotCore&&typeof W.LuminaCopilotCore.saveCopilotSettings==='function')W.LuminaCopilotCore.saveCopilotSettings(false)}catch(_e){}
    return {mode:mode,endpoint:endpoint,model:model,hasKey:!!key};
  }
  function useBrowser(saveKey){
    if(byId('stage41cConnectionMode'))byId('stage41cConnectionMode').value='browser-openai';
    if(byId('stage41cEndpoint'))byId('stage41cEndpoint').value=DEFAULT_ENDPOINT;
    var key=(byId('stage41cApiKey')&&byId('stage41cApiKey').value.trim())||'';
    if(!key){setStatus('Paste your OpenAI key first, then click Use browser key for testing.','error');return false}
    if(!/^sk-/i.test(key)){setStatus('That does not look like an OpenAI key. It should usually start with sk-proj- or sk-.','error');return false}
    var r=syncCore(!!saveKey); setStatus((saveKey?'Saved locally and enabled':'Enabled')+' browser-key testing mode. Copilot/Review now uses the direct OpenAI endpoint.','ready'); return r;
  }
  function useBackend(){
    if(byId('stage41cConnectionMode'))byId('stage41cConnectionMode').value='backend-proxy';
    del(API_KEY_STORAGE); if(byId('stage41cApiKey'))byId('stage41cApiKey').value='';
    var r=syncCore(false); setStatus('Enabled backend-proxy mode. Enter your deployed proxy URL in the endpoint field; no browser key is used.','ready'); return r;
  }
  function clearKey(){del(API_KEY_STORAGE);setValue(byId('copilotApiKey'),'');if(byId('stage41cApiKey'))byId('stage41cApiKey').value='';setStatus('Cleared the locally saved browser API key.','ready')}
  function bind(){
    var p=placePanel(); if(p.dataset.stage41cBound==='1')return p; p.dataset.stage41cBound='1';
    p.addEventListener('input',function(e){if(e.target&&/^stage41c(ConnectionMode|Endpoint|Model|ApiKey)$/.test(e.target.id||'')){if(e.target.id==='stage41cConnectionMode')updateModeUi();syncCore(false)}},true);
    p.addEventListener('change',function(e){if(e.target&&/^stage41c(ConnectionMode|Endpoint|Model|ApiKey)$/.test(e.target.id||'')){if(e.target.id==='stage41cConnectionMode')updateModeUi();syncCore(false)}},true);
    var b=byId('stage41cUseBrowserKeyBtn'); if(b)b.addEventListener('click',function(){useBrowser(false)},true);
    b=byId('stage41cSaveBrowserKeyBtn'); if(b)b.addEventListener('click',function(){useBrowser(true)},true);
    b=byId('stage41cClearBrowserKeyBtn'); if(b)b.addEventListener('click',clearKey,true);
    b=byId('stage41cUseBackendBtn'); if(b)b.addEventListener('click',useBackend,true);
    b=byId('stage41cToggleKeyBtn'); if(b)b.addEventListener('click',function(){var i=byId('stage41cApiKey');if(!i)return;var show=i.type==='password';i.type=show?'text':'password';this.textContent=show?'Hide':'Show'},true);
    syncMirror(); return p;
  }
  function status(){
    var s=existing();
    var tests={panelPresent:!!byId('stage41cBrowserKeyPanel'),coreEndpointField:!!byId('copilotEndpoint'),coreApiKeyField:!!byId('copilotApiKey'),coreModelField:!!byId('copilotModel'),reviewEntryPreserved:!!(W.__LUMINA_STAGE41B_COPILOT_REVIEW_STATUS?W.__LUMINA_STAGE41B_COPILOT_REVIEW_STATUS.pass:true),removableAddon:true};
    tests.pass=Object.keys(tests).every(function(k){return k==='pass'||!!tests[k]});
    return {stage:STAGE,browserKeyTesting:true,removableAddon:true,mode:s.mode,endpoint:s.endpoint,model:s.model,hasBrowserKey:!!s.apiKey,lastMode:lastMode,lastSyncedAt:lastSyncedAt,lastStatus:lastStatus,tests:tests,pass:tests.pass};
  }
  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics;if(!LD||LD.__stage41cBrowserKeyPatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null));if(!prev)return false;
    function wrap(){var r={};try{r=prev()||{}}catch(e){r={stage:STAGE,stage41cPreviousReportError:String(e&&(e.stack||e.message)||e)}}var st=status();r.stage=STAGE;r.diagnosticScriptStage=STAGE;r.stageFromWindow=W.LUMINA_STAGE||STAGE;r.indexStageSignature=W.LUMINA_STAGE_SIGNATURE||SIG;if(D.documentElement&&D.documentElement.dataset)r.indexDatasetStage=D.documentElement.dataset.luminaStage||STAGE;r.stage41CBrowserKeyTestingStatus=st;r.stage41CBrowserKeyTestingDiagnostics={tests:st.tests,mode:st.mode,endpoint:st.endpoint,hasBrowserKey:st.hasBrowserKey,lastStatus:st.lastStatus,removal:'Remove css/copilot-browser-key-test.css, js/copilot-browser-key-test.js, and their index.html tags.'};if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{temporaryBrowserKeyTesting:true,stage41CBrowserKeyTesting:true});return r}
    LD.collectReport=wrap;LD.getReport=wrap;LD.__stage41cBrowserKeyPatched=true;return true;
  }
  function refresh(){bind();patchDiagnostics();W.__LUMINA_STAGE41C_BROWSER_KEY_STATUS=status();return W.__LUMINA_STAGE41C_BROWSER_KEY_STATUS}
  function openPanel(){try{if(W.LuminaStage41BCopilotReview&&typeof W.LuminaStage41BCopilotReview.openReviewDrawer==='function')W.LuminaStage41BCopilotReview.openReviewDrawer()}catch(_e){}setTimeout(function(){var p=byId('stage41cBrowserKeyPanel');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'center'})},120)}
  function init(){W.LUMINA_STAGE=STAGE;W.LUMINA_STAGE_SIGNATURE=SIG;try{D.documentElement.setAttribute('data-lumina-stage',STAGE);D.documentElement.setAttribute('data-lumina-stage-signature',SIG)}catch(_e){}if(D.body)D.body.classList.add('stage41c-browser-key-test');refresh();[80,180,420,900,1800,3600,6500].forEach(function(ms){setTimeout(refresh,ms)});W.LuminaStage41CBrowserKeyTesting={stage:STAGE,refresh:refresh,status:status,open:openPanel,useBrowserKey:function(save){return useBrowser(!!save)},useBackend:useBackend,clearKey:clearKey}}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
