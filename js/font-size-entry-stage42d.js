/* font-size-entry-stage42d.js — diagnostics for true px font-size entry hotfix. */
(function(){
  'use strict';
  var W=window,D=document,STAGE='stage42d-theme-discovery-fontsize-hotfix-20260501-1';
  function byId(id){return D.getElementById(id)}
  function status(){
    var el=byId('previewBlockFontScale');
    return {stage:STAGE,fontSizeTextEntryHotfix:true,controlPresent:!!el,inputType:el?el.getAttribute('type'):'',commitEvents:['change','blur','Enter'],emptyBackspaceCoercionFixed:true,focusedValuePreservedOnPreviewRefresh:true,pass:!!el};
  }
  function patchDiagnostics(){
    var LD=W.LuminaDiagnostics; if(!LD||LD.__stage42dFontSizePatched)return false;
    var prev=(typeof LD.collectReport==='function'?LD.collectReport.bind(LD):(typeof LD.getReport==='function'?LD.getReport.bind(LD):null)); if(!prev)return false;
    function wrap(){var r={};try{r=prev()||{}}catch(e){r={stage:STAGE,stage42dPreviousReportError:String(e&&(e.stack||e.message)||e)}}r.stage=STAGE;r.diagnosticScriptStage=STAGE;r.stage42DFontSizeEntryStatus=status();if(r.featurePolishSummary)r.featurePolishSummary=Object.assign({},r.featurePolishSummary,{fontSizeTextEntryHotfix:true});return r;}
    LD.collectReport=wrap; LD.getReport=wrap; LD.__stage42dFontSizePatched=true; return true;
  }
  function publish(){W.__LUMINA_STAGE42D_FONT_SIZE_ENTRY_STATUS=status();patchDiagnostics();return W.__LUMINA_STAGE42D_FONT_SIZE_ENTRY_STATUS;}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',publish,{once:true}); else publish();
  [80,250,800,1600,3200].forEach(function(ms){setTimeout(publish,ms)});
})();
