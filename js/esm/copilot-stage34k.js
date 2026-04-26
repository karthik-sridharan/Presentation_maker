/* Stage 36Q: thin ESM wrapper around the classic Copilot core.
   The classic core in js/legacy-app-stage24c.js contains the full implementation.
   This module simply returns that implementation so the guarded ESM loader continues to work. */
function buildFallback(deps){
  deps = deps || {};
  const alertFn = typeof deps.alert === 'function' ? deps.alert : (msg => { if(typeof alert !== 'undefined') alert(msg); });
  const fail = async ()=>{
    const message = 'Lumina Copilot core is unavailable. Check that js/legacy-app-stage24c.js loaded successfully.';
    try{ alertFn(message); }catch(_){ }
    throw new Error(message);
  };
  return Object.freeze({
    __stage:'stage36q-20260426-1',
    __source:'esm-wrapper-fallback',
    setCopilotStatus: ()=>{},
    loadCopilotSettings: ()=>{},
    saveCopilotSettings: ()=>false,
    validateCopilotApiKey: ()=>'',
    updateCopilotKeyWarning: ()=>true,
    friendlyCopilotHttpError: (status, message)=> String(message || ('Copilot request failed with status ' + status)),
    recordCopilotError: err => (err && err.message) || String(err || 'Copilot failed.'),
    recordCopilotSuccess: ()=>{},
    copilotRuntimeStatus: deps.copilotRuntimeStatus || {},
    copilotBlockSchema: ()=>({ type:'object', additionalProperties:false, properties:{}, required:[] }),
    copilotSlideSchema: ()=>({ type:'object', additionalProperties:false, properties:{}, required:[] }),
    copilotDeckSchema: ()=>({ type:'object', additionalProperties:false, properties:{}, required:[] }),
    copilotSystemPrompt: ()=>'',
    compactDeckForCopilot: ()=>({}),
    buildCopilotUserPrompt: async ()=>'',
    loadDeckPromptPrefix: async ()=>'',
    collectCopilotStyleContext: ()=>'',
    capturePreviewScreenshotDataUrl: async ()=>'',
    enrichCopilotDeckAssets: async deck => deck,
    extractResponsesOutputText: ()=>'',
    callCopilot: fail,
    normalizeCopilotDeck: deck => deck,
    normalizeCopilotSlide: slide => slide,
    parseCopilotResult: ()=>({ slides:[] }),
    applyCopilotFirstSlide: ()=>{},
    appendCopilotSlides: ()=>{},
    replaceDeckWithCopilot: ()=>{},
    generateCopilotSlide: fail,
    generateCopilotDeck: fail
  });
}
function createApi(deps){
  deps = deps || {};
  const classic = deps.classicCore || (typeof window !== 'undefined' ? (window.LuminaClassicCopilotCoreStage34K || window.LuminaCopilotCore || null) : null);
  if(classic) return classic;
  return buildFallback(deps);
}
export { createApi };
export default { createApi };
