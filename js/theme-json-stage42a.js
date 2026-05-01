/* theme-json-stage42a.js — JSON theme library, theme save/load, and Theme Copilot. */
(function(){
  'use strict';
  var W=window,D=document;
  var STAGE='stage42b-theme-typography-20260430-1';
  var MANIFEST_PATH='theme/manifest.json';
  var THEME_PROMPT_PATH='prompts/theme_prompt.txt';
  var API_KEY_STORAGE='html-presentation-generator-openai-api-key-v1';
  var DEFAULT_ENDPOINT='https://api.openai.com/v1/responses';
  var state={loaded:false,source:'none',themes:[],themeMap:{},lastApplied:'',lastSaved:'',lastLoadedFile:'',lastAiThemeName:'',lastError:'',tests:{}};

  function byId(id){return D.getElementById(id)}
  function qs(sel,root){return (root||D).querySelector(sel)}
  function qsa(sel,root){return Array.prototype.slice.call((root||D).querySelectorAll(sel))}
  function h(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function slug(s){return String(s||'custom-theme').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'custom-theme'}
  function toast(msg){try{if(W.LuminaAppCommands&&W.LuminaAppCommands.showToast)W.LuminaAppCommands.showToast(msg);else console.log('[Stage42A]',msg)}catch(_e){}}
  function setStatus(msg,isError){var el=byId('stage42aThemeStatus'); if(el){el.textContent=msg; el.classList.toggle('error',!!isError)} if(isError)state.lastError=String(msg||'');}
  function syncJson(path){
    try{
      var xhr=new XMLHttpRequest();
      xhr.open('GET', path + (path.indexOf('?')>=0?'&':'?') + 'v=' + encodeURIComponent(STAGE), false);
      xhr.send(null);
      if(xhr.status>=200 && xhr.status<300) return JSON.parse(xhr.responseText || '{}');
      throw new Error('HTTP '+xhr.status+' loading '+path);
    }catch(err){
      state.lastError=String(err&&err.message||err);
      return null;
    }
  }
  function normalizeThemePayload(payload, fallbackId){
    payload=payload||{};
    var t=payload.theme||payload;
    function color(v,fb){v=String(v||'').trim(); return /^#[0-9a-f]{6}$/i.test(v)?v:fb}
    function fontSize(v,fb){v=String(v==null?'':v).trim(); if(!v)return fb; var n=Number(v.replace(/px$/i,'')); if(Number.isFinite(n))return Math.max(8,Math.min(180,n))+'px'; if(/^\d+(?:\.\d+)?(?:px|rem|em|pt)$/i.test(v))return v; if(/^clamp\([^<>;{}]+\)$/i.test(v))return v; return fb}
    var id=slug(payload.id || fallbackId || t.beamerStyle || t.name || 'theme');
    var out={
      id:id,
      name:String(payload.name || t.name || id).trim() || id,
      description:String(payload.description || '').trim(),
      theme:{
        name:String(t.name || payload.name || id).trim() || id,
        bgColor:color(t.bgColor,'#ffffff'),
        fontColor:color(t.fontColor,'#111111'),
        accentColor:color(t.accentColor,'#2f6fed'),
        panelRadius:Math.max(0,Math.min(48,Number.isFinite(Number(t.panelRadius))?Math.round(Number(t.panelRadius)):22)),
        titleScale:Math.max(.8,Math.min(1.6,Number.isFinite(Number(t.titleScale))?Number(t.titleScale):1)),
        titleH1FontSize:fontSize(t.titleH1FontSize,'5.6rem'),
        titleH2FontSize:fontSize(t.titleH2FontSize,'3.1rem'),
        kickerFontSize:fontSize(t.kickerFontSize,'1rem'),
        ledeFontSize:fontSize(t.ledeFontSize,'1.14rem'),
        bodyFontSize:fontSize(t.bodyFontSize,'1.26rem'),
        bulletFontSize:fontSize(t.bulletFontSize,'1.22rem'),
        blockHeadingFontSize:fontSize(t.blockHeadingFontSize,'1.3rem'),
        mathFontSize:fontSize(t.mathFontSize,'1.2rem'),
        codeFontSize:fontSize(t.codeFontSize,'1.08rem'),
        cardFontSize:fontSize(t.cardFontSize,'1.08rem'),
        placeholderFontSize:fontSize(t.placeholderFontSize,'1.12rem'),
        beamerStyle:(['classic','berkeley','madrid','annarbor','cambridgeus','pittsburgh','notebook','chalkboard'].indexOf(String(t.beamerStyle||'').toLowerCase())>=0?String(t.beamerStyle).toLowerCase():'classic'),
        chromeColor:color(t.chromeColor,'#17365d'),
        chromeTextColor:color(t.chromeTextColor,'#ffffff'),
        sidebarWidth:Math.max(72,Math.min(220,Number.isFinite(Number(t.sidebarWidth))?Math.round(Number(t.sidebarWidth)):118)),
        titleCaps:String(t.titleCaps)==='1'?'1':'0'
      }
    };
    out.theme.name=out.name||out.theme.name;
    return out;
  }
  function embeddedFallbackThemes(){
    return [
      {id:'classic',name:'Classic',description:'Minimal white canvas',theme:{name:'Classic',bgColor:'#ffffff',fontColor:'#111111',accentColor:'#2f6fed',panelRadius:22,titleScale:1,beamerStyle:'classic',chromeColor:'#17365d',chromeTextColor:'#ffffff',sidebarWidth:118,titleCaps:'0'}},
      {id:'berkeley',name:'Berkeley',description:'Left sidebar Beamer-style academic theme',theme:{name:'Berkeley',bgColor:'#ffffff',fontColor:'#111111',accentColor:'#d4a017',panelRadius:18,titleScale:1,beamerStyle:'berkeley',chromeColor:'#17365d',chromeTextColor:'#ffffff',sidebarWidth:118,titleCaps:'0'}},
      {id:'madrid',name:'Madrid',description:'Blue top chrome with accent footer',theme:{name:'Madrid',bgColor:'#ffffff',fontColor:'#111111',accentColor:'#2f6fed',panelRadius:20,titleScale:1,beamerStyle:'madrid',chromeColor:'#1f4e79',chromeTextColor:'#ffffff',sidebarWidth:118,titleCaps:'0'}},
      {id:'annarbor',name:'AnnArbor',description:'Warm cream-and-gold academic theme',theme:{name:'AnnArbor',bgColor:'#fffaf0',fontColor:'#2f2410',accentColor:'#7a4f01',panelRadius:18,titleScale:1,beamerStyle:'annarbor',chromeColor:'#c99a06',chromeTextColor:'#111111',sidebarWidth:118,titleCaps:'0'}},
      {id:'cambridgeus',name:'CambridgeUS',description:'Formal blue-and-red title chrome',theme:{name:'CambridgeUS',bgColor:'#ffffff',fontColor:'#10233b',accentColor:'#c53030',panelRadius:16,titleScale:1,beamerStyle:'cambridgeus',chromeColor:'#0f4c81',chromeTextColor:'#ffffff',sidebarWidth:118,titleCaps:'1'}},
      {id:'pittsburgh',name:'Pittsburgh',description:'Clean white deck with slim blue rule',theme:{name:'Pittsburgh',bgColor:'#ffffff',fontColor:'#111111',accentColor:'#2f6fed',panelRadius:22,titleScale:1.02,beamerStyle:'pittsburgh',chromeColor:'#2f6fed',chromeTextColor:'#ffffff',sidebarWidth:96,titleCaps:'0'}},
      {id:'notebook',name:'Notebook',description:'Warm lined-paper teaching style',theme:{name:'Notebook',bgColor:'#fffdf3',fontColor:'#1f2937',accentColor:'#2f6fed',panelRadius:14,titleScale:1.02,beamerStyle:'notebook',chromeColor:'#2f6fed',chromeTextColor:'#ffffff',sidebarWidth:118,titleCaps:'0'}},
      {id:'chalkboard',name:'Chalkboard',description:'Dark chalkboard classroom theme',theme:{name:'Chalkboard',bgColor:'#050807',fontColor:'#f8fafc',accentColor:'#d1d5db',panelRadius:18,titleScale:1.03,beamerStyle:'chalkboard',chromeColor:'#f8fafc',chromeTextColor:'#050807',sidebarWidth:118,titleCaps:'0'}}
    ].map(function(x){return normalizeThemePayload(x,x.id)});
  }
  function registerThemes(list, source){
    state.themes=(list||[]).map(function(x){return normalizeThemePayload(x,x.id)});
    state.themeMap={};
    state.themes.forEach(function(t){state.themeMap[t.id]=t; state.themeMap[String(t.name||'').toLowerCase()]=t;});
    state.loaded=true; state.source=source||'json';
    W.__LUMINA_STAGE42A_THEME_JSON_STATUS=status();
  }
  function loadRegistrySync(){
    var manifest=syncJson(MANIFEST_PATH);
    var list=[];
    if(manifest&&Array.isArray(manifest.themes)){
      manifest.themes.forEach(function(item){
        var file=item.file || (item.id+'.json');
        var payload=syncJson('theme/'+file);
        if(payload) list.push(normalizeThemePayload(Object.assign({}, item, payload), item.id || file));
      });
      if(list.length){registerThemes(list,'json:'+MANIFEST_PATH);return true;}
    }
    registerThemes(embeddedFallbackThemes(),'embedded-fallback');
    return false;
  }
  loadRegistrySync();

  function getThemeSync(id){return state.themeMap[String(id||'classic').toLowerCase()] || state.themeMap[slug(id)] || state.themeMap.classic || state.themes[0] || null}
  function themeIds(){return state.themes.map(function(t){return t.id})}
  function currentThemePayload(){
    var t={
      name:(byId('themeName')&&byId('themeName').value)||'Custom Theme',
      bgColor:(byId('themeBgColor')&&byId('themeBgColor').value)||'#ffffff',
      fontColor:(byId('themeFontColor')&&byId('themeFontColor').value)||'#111111',
      accentColor:(byId('themeAccentColor')&&byId('themeAccentColor').value)||'#2f6fed',
      panelRadius:(byId('themePanelRadius')&&byId('themePanelRadius').value)||22,
      titleScale:(byId('themeTitleScale')&&byId('themeTitleScale').value)||1,
      titleH1FontSize:(byId('themeTitleH1FontSize')&&byId('themeTitleH1FontSize').value)||'5.6rem',
      titleH2FontSize:(byId('themeTitleH2FontSize')&&byId('themeTitleH2FontSize').value)||'3.1rem',
      kickerFontSize:(byId('themeKickerFontSize')&&byId('themeKickerFontSize').value)||'1rem',
      ledeFontSize:(byId('themeLedeFontSize')&&byId('themeLedeFontSize').value)||'1.14rem',
      bodyFontSize:(byId('themeBodyFontSize')&&byId('themeBodyFontSize').value)||'1.26rem',
      bulletFontSize:(byId('themeBulletFontSize')&&byId('themeBulletFontSize').value)||'1.22rem',
      blockHeadingFontSize:(byId('themeBlockHeadingFontSize')&&byId('themeBlockHeadingFontSize').value)||'1.3rem',
      mathFontSize:(byId('themeMathFontSize')&&byId('themeMathFontSize').value)||'1.2rem',
      codeFontSize:(byId('themeCodeFontSize')&&byId('themeCodeFontSize').value)||'1.08rem',
      cardFontSize:(byId('themeCardFontSize')&&byId('themeCardFontSize').value)||'1.08rem',
      placeholderFontSize:(byId('themePlaceholderFontSize')&&byId('themePlaceholderFontSize').value)||'1.12rem',
      beamerStyle:(byId('themeBeamerStyle')&&byId('themeBeamerStyle').value)||'classic',
      chromeColor:(byId('themeChromeColor')&&byId('themeChromeColor').value)||'#17365d',
      chromeTextColor:(byId('themeChromeTextColor')&&byId('themeChromeTextColor').value)||'#ffffff',
      sidebarWidth:(byId('themeSidebarWidth')&&byId('themeSidebarWidth').value)||118,
      titleCaps:(byId('themeTitleCaps')&&byId('themeTitleCaps').value)||'0'
    };
    return normalizeThemePayload({id:slug(t.name),name:t.name,description:'Saved from Lumina Theme Builder.',theme:t}, slug(t.name));
  }
  function setVal(id,val){var el=byId(id); if(el){el.value=String(val==null?'':val); try{el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));}catch(_e){}}}
  function applyThemePayload(payload, reason){
    var p=normalizeThemePayload(payload, payload&&payload.id);
    var t=p.theme;
    setVal('themeName',p.name || t.name);
    setVal('themeBgColor',t.bgColor); setVal('themeFontColor',t.fontColor); setVal('themeAccentColor',t.accentColor);
    setVal('themePanelRadius',t.panelRadius); setVal('themeTitleScale',t.titleScale);
    setVal('themeTitleH1FontSize',t.titleH1FontSize);
    setVal('themeTitleH2FontSize',t.titleH2FontSize);
    setVal('themeKickerFontSize',t.kickerFontSize);
    setVal('themeLedeFontSize',t.ledeFontSize);
    setVal('themeBodyFontSize',t.bodyFontSize);
    setVal('themeBulletFontSize',t.bulletFontSize);
    setVal('themeBlockHeadingFontSize',t.blockHeadingFontSize);
    setVal('themeMathFontSize',t.mathFontSize);
    setVal('themeCodeFontSize',t.codeFontSize);
    setVal('themeCardFontSize',t.cardFontSize);
    setVal('themePlaceholderFontSize',t.placeholderFontSize);
    setVal('themeBeamerStyle',t.beamerStyle);
    setVal('themeChromeColor',t.chromeColor); setVal('themeChromeTextColor',t.chromeTextColor); setVal('themeSidebarWidth',t.sidebarWidth); setVal('themeTitleCaps',t.titleCaps);
    try{if(W.LuminaAppCommands){W.LuminaAppCommands.buildPreview&&W.LuminaAppCommands.buildPreview(); W.LuminaAppCommands.renderDeckList&&W.LuminaAppCommands.renderDeckList(); W.LuminaAppCommands.scheduleAutosave&&W.LuminaAppCommands.scheduleAutosave(reason||'Autosaved after JSON theme update.');}}catch(_e){}
    state.lastApplied=p.id; setStatus('Applied theme: '+p.name,false); toast('Applied theme: '+p.name); refreshThemeGallery();
    return p;
  }
  function applyThemeId(id){var t=getThemeSync(id); if(!t){setStatus('Theme not found: '+id,true);return null;} return applyThemePayload(t,'Autosaved after JSON theme preset change.');}
  function registerCustomTheme(payload){
    var p=normalizeThemePayload(payload, payload&&payload.id);
    state.themeMap[p.id]=p; state.themeMap[String(p.name||'').toLowerCase()]=p;
    var idx=state.themes.findIndex(function(x){return x.id===p.id});
    if(idx>=0)state.themes[idx]=p; else state.themes.push(p);
    refreshThemeGallery();
    return p;
  }
  W.LuminaThemeRegistry={stage:STAGE,source:state.source,getThemeSync:getThemeSync,themeIds:themeIds,list:function(){return state.themes.slice()},currentThemePayload:currentThemePayload,applyThemePayload:applyThemePayload,applyThemeId:applyThemeId,registerCustomTheme:registerCustomTheme,status:status};

  function downloadJson(filename,payload){
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    var a=D.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; D.body.appendChild(a); a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href); a.remove();},600);
  }
  function loadFileAsText(file){return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(){resolve(String(r.result||''))};r.onerror=function(){reject(r.error||new Error('Could not read '+(file&&file.name||'file')))};r.readAsText(file)})}
  function loadFileAsDataUrl(file){return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(){resolve(String(r.result||''))};r.onerror=function(){reject(r.error||new Error('Could not read '+(file&&file.name||'file')))};r.readAsDataURL(file)})}

  function themeThumb(t){
    var theme=t.theme||{};
    return '<button class="stage42a-theme-card" type="button" data-stage42a-theme="'+h(t.id)+'" style="--stage42a-bg:'+h(theme.bgColor)+';--stage42a-fg:'+h(theme.fontColor)+';--stage42a-chrome:'+h(theme.chromeColor)+';--stage42a-accent:'+h(theme.accentColor)+'"><span class="stage42a-theme-thumb '+h(theme.beamerStyle)+'"><span class="side"></span><span class="bar"></span><span class="accent"></span><span class="title"></span><span class="line a"></span><span class="line b"></span></span><span><b>'+h(t.name)+'</b><small>'+h(t.description||theme.beamerStyle)+'</small></span></button>';
  }
  function ensureThemeBuilderUi(){
    var pane=qs('[data-subpane="slides:theme"]');
    if(!pane || byId('stage42aThemePanel'))return !!pane;
    var sec=D.createElement('section');
    sec.id='stage42aThemePanel';
    sec.className='stage42a-panel';
    sec.innerHTML=[
      '<div class="stage42a-head"><div><div class="smallcaps">JSON theme library</div><h3>Reusable themes</h3><p>Built-in themes are now loaded from <code>/theme/*.json</code>. Save custom themes as JSON, load a JSON theme, or ask Theme Copilot to infer one from a reference presentation.</p></div><span class="stage42a-chip" id="stage42aThemeSourceChip">'+h(state.source)+'</span></div>',
      '<div class="stage42a-theme-grid" id="stage42aThemeGrid"></div>',
      '<div class="stage42a-actions"><button class="btn mini primary" type="button" id="stage42aSaveThemeJsonBtn">Save current theme JSON</button><label class="btn mini stage42a-file-btn">Load theme JSON<input id="stage42aLoadThemeJsonInput" type="file" accept=".json,application/json" hidden></label></div>',
      '<div class="stage42a-copilot"><div class="smallcaps">Theme Copilot</div><h3>Match a reference presentation theme</h3><p>Upload a source deck/PDF/HTML/text file or paste URL(s). Copilot returns one reusable theme JSON object using <code>prompts/theme_prompt.txt</code>.</p>',
      '<label>Reference URL(s)<textarea id="stage42aThemeUrls" placeholder="https://example.com/slides.pdf\nhttps://example.com/presentation.html"></textarea></label>',
      '<label>Upload reference presentation<input id="stage42aThemeFiles" type="file" multiple accept=".pdf,.html,.htm,.txt,.md,.json,.tex,.ppt,.pptx,application/pdf,text/html,text/plain,application/json"></label>',
      '<label>Additional instructions<textarea id="stage42aThemeUserPrompt" placeholder="Example: Match the Cornell lecture style, preserve white background and blue title chrome, avoid logos."></textarea></label>',
      '<div class="stage42a-actions"><button class="btn mini primary" type="button" id="stage42aGenerateThemeBtn">Generate theme from reference</button><button class="btn mini" type="button" id="stage42aApplyAiThemeBtn" disabled>Apply generated theme</button><button class="btn mini" type="button" id="stage42aSaveAiThemeBtn" disabled>Save generated theme JSON</button></div>',
      '<pre id="stage42aAiThemeJson" class="stage42a-json" aria-label="Generated theme JSON"></pre>',
      '</div><div id="stage42aThemeStatus" class="stage42a-status">Loaded '+state.themes.length+' JSON theme(s).</div>'
    ].join('');
    pane.appendChild(sec);
    byId('stage42aSaveThemeJsonBtn').addEventListener('click',function(){
      var p=currentThemePayload(); state.lastSaved=p.id; downloadJson(slug(p.name)+'.json',p); setStatus('Saved current theme JSON: '+p.name,false);
    },true);
    byId('stage42aLoadThemeJsonInput').addEventListener('change',async function(e){
      var f=e.target.files&&e.target.files[0]; if(!f)return;
      try{var p=normalizeThemePayload(JSON.parse(await loadFileAsText(f)), f.name.replace(/\.json$/i,'')); registerCustomTheme(p); applyThemePayload(p,'Autosaved after loading theme JSON.'); state.lastLoadedFile=f.name; e.target.value='';}
      catch(err){setStatus('Could not load theme JSON: '+(err&&err.message||err),true)}
    },true);
    byId('stage42aGenerateThemeBtn').addEventListener('click',generateThemeFromReference,true);
    byId('stage42aApplyAiThemeBtn').addEventListener('click',function(){if(state.aiTheme)applyThemePayload(state.aiTheme,'Autosaved after applying AI-generated theme.');},true);
    byId('stage42aSaveAiThemeBtn').addEventListener('click',function(){if(state.aiTheme){var p=normalizeThemePayload(state.aiTheme); downloadJson(slug(p.name)+'.json',p);}},true);
    refreshThemeGallery();
    return true;
  }
  function refreshThemeGallery(){
    var grid=byId('stage42aThemeGrid'); if(grid)grid.innerHTML=state.themes.map(themeThumb).join('');
    var chip=byId('stage42aThemeSourceChip'); if(chip)chip.textContent=state.source;
    qsa('[data-stage42a-theme]').forEach(function(btn){
      if(btn.dataset.stage42aBound)return; btn.dataset.stage42aBound='1';
      btn.addEventListener('click',function(){applyThemeId(btn.getAttribute('data-stage42a-theme'))},true);
    });
    // Keep the older visual theme gallery visually in sync while preserving its existing diagnostics.
    var old=byId('stage38dThemeGallery');
    if(old){
      old.innerHTML=state.themes.map(function(t){var th=t.theme||{};return '<button class="stage38d-theme-card" type="button" data-stage38d-theme="'+h(t.id)+'" style="--stage38d-bg:'+h(th.bgColor)+';--stage38d-fg:'+h(th.fontColor)+';--stage38d-chrome:'+h(th.chromeColor)+';--stage38d-accent:'+h(th.accentColor)+'"><span class="stage38d-theme-thumb '+h(th.beamerStyle)+'"><span class="side"></span><span class="bar"></span><span class="accent"></span><span class="title"></span><span class="line a"></span><span class="line b"></span></span><span class="stage38d-theme-copy"><b>'+h(t.name)+'</b><small>'+h(t.description||th.beamerStyle)+'</small></span></button>'}).join('');
      qsa('[data-stage38d-theme]',old).forEach(function(btn){if(btn.dataset.stage42aBound)return;btn.dataset.stage42aBound='1';btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();applyThemeId(btn.getAttribute('data-stage38d-theme'))},true)});
    }
  }

  function getSettings(){
    var endpoint=(byId('copilotEndpoint')&&byId('copilotEndpoint').value||DEFAULT_ENDPOINT).trim()||DEFAULT_ENDPOINT;
    var model=(byId('copilotModel')&&byId('copilotModel').value||'gpt-4.1-mini').trim()||'gpt-4.1-mini';
    var key=(byId('copilotApiKey')&&byId('copilotApiKey').value||'').trim();
    if(!key){try{key=localStorage.getItem(API_KEY_STORAGE)||''}catch(_e){}}
    return {endpoint:endpoint,model:model,key:key};
  }
  function isOpenAI(endpoint){try{return /(^|\.)api\.openai\.com$/i.test(new URL(endpoint).hostname)}catch(_e){return /api\.openai\.com/i.test(endpoint||'')}}
  function extractOutputText(data){
    if(data&&typeof data.output_text==='string')return data.output_text;
    var parts=[]; (data&&data.output||[]).forEach(function(item){(item.content||[]).forEach(function(c){if(c.type==='output_text'||c.type==='text')parts.push(c.text||'')})});
    return parts.join('').trim();
  }
  function themeSchema(){
    return {type:'object',additionalProperties:false,required:['id','name','description','theme'],properties:{
      id:{type:'string'},name:{type:'string'},description:{type:'string'},
      theme:{type:'object',additionalProperties:false,required:['name','bgColor','fontColor','accentColor','panelRadius','titleScale','titleH1FontSize','titleH2FontSize','kickerFontSize','ledeFontSize','bodyFontSize','bulletFontSize','blockHeadingFontSize','mathFontSize','codeFontSize','cardFontSize','placeholderFontSize','beamerStyle','chromeColor','chromeTextColor','sidebarWidth','titleCaps'],properties:{
        name:{type:'string'},bgColor:{type:'string'},fontColor:{type:'string'},accentColor:{type:'string'},panelRadius:{type:'integer'},titleScale:{type:'number'},titleH1FontSize:{type:'string'},titleH2FontSize:{type:'string'},kickerFontSize:{type:'string'},ledeFontSize:{type:'string'},bodyFontSize:{type:'string'},bulletFontSize:{type:'string'},blockHeadingFontSize:{type:'string'},mathFontSize:{type:'string'},codeFontSize:{type:'string'},cardFontSize:{type:'string'},placeholderFontSize:{type:'string'},beamerStyle:{type:'string',enum:['classic','berkeley','madrid','annarbor','cambridgeus','pittsburgh','notebook','chalkboard']},chromeColor:{type:'string'},chromeTextColor:{type:'string'},sidebarWidth:{type:'integer'},titleCaps:{type:'string',enum:['0','1']}
      }}
    }};
  }
  async function collectThemeRefs(){
    var files=Array.prototype.slice.call((byId('stage42aThemeFiles')&&byId('stage42aThemeFiles').files)||[]);
    var text=[],pdfs=[],unsupported=[];
    for(var i=0;i<files.length;i++){
      var f=files[i], name=f.name||('file-'+(i+1));
      if(/\.pdf$/i.test(name)||/application\/pdf/i.test(f.type||''))pdfs.push({filename:name,file_data:await loadFileAsDataUrl(f)});
      else if(/^text\//i.test(f.type||'')||/\.(html?|txt|md|json|tex|csv)$/i.test(name))text.push('--- REFERENCE FILE: '+name+' ---\n'+await loadFileAsText(f));
      else unsupported.push(name);
    }
    return {text:text.join('\n\n'),pdfs:pdfs,unsupported:unsupported};
  }
  async function loadPrompt(){
    try{var r=await fetch(THEME_PROMPT_PATH+'?v='+encodeURIComponent(STAGE),{cache:'no-store'}); if(r.ok)return await r.text();}catch(_e){}
    return 'Infer a Lumina theme from the supplied reference. Return only valid JSON matching the lumina_theme schema.';
  }
  async function generateThemeFromReference(){
    try{
      setStatus('Preparing theme reference…',false);
      var settings=getSettings();
      if(isOpenAI(settings.endpoint)&&!settings.key)throw new Error('Add an OpenAI API key in AI setup, or use a backend proxy endpoint.');
      var refs=await collectThemeRefs();
      var urls=(byId('stage42aThemeUrls')&&byId('stage42aThemeUrls').value||'').trim();
      var user=(byId('stage42aThemeUserPrompt')&&byId('stage42aThemeUserPrompt').value||'').trim();
      if(!urls&&!refs.text&&!refs.pdfs.length)throw new Error('Add a reference URL or upload a reference file first.');
      var system=await loadPrompt();
      var userText=['THEME_REFERENCE_URLS:\n'+(urls||'(none)'),'THEME_REFERENCE_TEXT:\n'+(refs.text||'(none)'),refs.unsupported.length?'UNSUPPORTED_BROWSER_FILES: '+refs.unsupported.join(', '):'',user?'ADDITIONAL_USER_INSTRUCTIONS:\n'+user:'ADDITIONAL_USER_INSTRUCTIONS:\nMatch the reusable visual design language as closely as possible.'].filter(Boolean).join('\n\n');
      var content=[{type:'input_text',text:userText}];
      if(isOpenAI(settings.endpoint)){
        (urls.match(/https?:\/\/\S+\.pdf(?:[?#]\S*)?/gi)||[]).forEach(function(url){content.push({type:'input_file',file_url:url})});
        refs.pdfs.forEach(function(p){content.push({type:'input_file',filename:p.filename,file_data:p.file_data})});
      }else if(refs.pdfs.length){
        content.push({type:'input_text',text:'PDF files were uploaded but not attached because the endpoint is not the default OpenAI Responses endpoint.'});
      }
      var body={model:settings.model,input:[{role:'system',content:system},{role:'user',content:content}],text:{format:{type:'json_schema',name:'lumina_theme',schema:themeSchema(),strict:true}},store:false};
      if(isOpenAI(settings.endpoint)&&urls)body.tools=[{type:'web_search'}],body.tool_choice='auto';
      var headers={'Content-Type':'application/json'}; if(settings.key)headers.Authorization='Bearer '+settings.key;
      setStatus('Theme Copilot is generating a JSON theme…',false);
      var res=await fetch(settings.endpoint,{method:'POST',headers:headers,body:JSON.stringify(body)});
      var raw=await res.text(), data={}; try{data=raw?JSON.parse(raw):{}}catch(_e){data={raw:raw}}
      if(!res.ok)throw new Error((data.error&&data.error.message)||raw||('Theme request failed with status '+res.status));
      var output=extractOutputText(data); if(!output)throw new Error('Theme Copilot returned an empty response.');
      var payload=normalizeThemePayload(JSON.parse(output));
      state.aiTheme=payload; state.lastAiThemeName=payload.name; registerCustomTheme(payload);
      var pre=byId('stage42aAiThemeJson'); if(pre)pre.textContent=JSON.stringify(payload,null,2);
      var apply=byId('stage42aApplyAiThemeBtn'),save=byId('stage42aSaveAiThemeBtn'); if(apply)apply.disabled=false; if(save)save.disabled=false;
      setStatus('Generated theme: '+payload.name+'. Review, apply, or save the JSON.',false);
    }catch(err){setStatus('Theme Copilot error: '+(err&&err.message||err),true)}
  }

  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics; if(!LD||LD.__stage42aThemeJsonPatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null)); if(!prev)return false;
    function wrap(){var r={}; try{r=prev()||{}}catch(e){r={stage:STAGE,stage42aPreviousReportError:String(e&&(e.stack||e.message)||e)}} r.stage=STAGE; r.diagnosticScriptStage=STAGE; r.stage42AThemeJsonStatus=status(); r.stage42AThemeJsonDiagnostics={themeIds:themeIds(),source:state.source,lastApplied:state.lastApplied,lastSaved:state.lastSaved,lastAiThemeName:state.lastAiThemeName,lastError:state.lastError}; if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{jsonThemeLibrary:true,themeSaveJson:true,themeCopilot:true,themePromptFile:true,themeTypographyDefaults:true}); return r}
    LD.collectReport=wrap; LD.getReport=wrap; LD.__stage42aThemeJsonPatched=true; return true;
  }
  function status(){
    var tests={registryLoaded:state.loaded,themeCount:state.themes.length>=8,manifestPath:MANIFEST_PATH,themePromptFile:THEME_PROMPT_PATH,themePaneUi:!!byId('stage42aThemePanel'),saveThemeJson:!!byId('stage42aSaveThemeJsonBtn'),themeCopilot:!!byId('stage42aGenerateThemeBtn'),oldGalleryPatched:!!byId('stage38dThemeGallery')};
    tests.pass=tests.registryLoaded&&tests.themeCount&&tests.themePaneUi&&tests.saveThemeJson&&tests.themeCopilot;
    state.tests=tests;
    return {stage:STAGE,jsonThemes:true,manifestPath:MANIFEST_PATH,themeDirectory:'/theme',themeCount:state.themes.length,source:state.source,themePromptFile:THEME_PROMPT_PATH,saveCustomThemeJson:true,loadThemeJson:true,themeCopilot:true,lastApplied:state.lastApplied,lastSaved:state.lastSaved,lastLoadedFile:state.lastLoadedFile,lastAiThemeName:state.lastAiThemeName,lastError:state.lastError,tests:tests,pass:!!tests.pass};
  }
  function init(){try{W.LUMINA_STAGE=STAGE; if(D.documentElement)D.documentElement.setAttribute('data-lumina-stage',STAGE)}catch(_e){} ensureThemeBuilderUi(); refreshThemeGallery(); patchDiagnostics(); W.__LUMINA_STAGE42A_THEME_JSON_STATUS=status();}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  [150,500,1200,2600,5000].forEach(function(ms){setTimeout(init,ms)});
})();
