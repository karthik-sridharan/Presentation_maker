/* Stage 8: block/title style and animation helpers extracted from legacy-app.js.
   Classic-script module: exposes window.LuminaBlockStyle.
*/
(function(){
  function createApi(deps){
    deps = deps || {};
    const escapeAttr = deps.escapeAttr || function(str){
      return String(str == null ? '' : str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\n/g,'&#10;');
    };

    function normalizeBlockStyle(style){
      const s = style || {};
      const fontScale = Number.isFinite(Number(s.fontScale)) ? Number(s.fontScale) : 1;
      return {
        fontScale: Math.max(0.6, Math.min(2.5, fontScale)),
        fontFamily: s.fontFamily || 'inherit',
        fontColor: s.fontColor || '#111111',
        bulletType: s.bulletType || 'disc'
      };
    }
    function normalizeAnimation(anim){
      const a = anim || {};
      const buildIn = ['none','appear','fade'].includes(a.buildIn) ? a.buildIn : 'none';
      const buildOut = ['none','disappear','fade'].includes(a.buildOut) ? a.buildOut : 'none';
      const stepMode = ['all','by-item'].includes(a.stepMode) ? a.stepMode : 'all';
      const order = Number.isFinite(Number(a.order)) ? Number(a.order) : 0;
      return { buildIn, buildOut, stepMode, order };
    }
    function animationDataAttrs(anim){
      const a = normalizeAnimation(anim);
      return ' data-build-in="' + escapeAttr(a.buildIn) + '" data-build-out="' + escapeAttr(a.buildOut) + '" data-step-mode="' + escapeAttr(a.stepMode) + '" data-anim-order="' + escapeAttr(String(a.order)) + '"';
    }
    function blockWrapperStyle(block){
      const s = normalizeBlockStyle((block && block.style) || {});
      return '--block-font-scale:' + s.fontScale + ';--block-font-family:' + escapeAttr(s.fontFamily) + ';--block-font-color:' + s.fontColor + ';--block-bullet-type:' + s.bulletType + ';';
    }
    function titleWrapperStyle(style, heading){
      const s = normalizeBlockStyle(style || {});
      const baseMap = { h1:'5.6rem', h2:'3.1rem', h3:'2.45rem', h4:'2.1rem', h5:'1.8rem', h6:'1.55rem' };
      return '--block-font-scale:' + s.fontScale + ';--block-font-family:' + escapeAttr(s.fontFamily) + ';--block-font-color:' + s.fontColor + ';--title-base-size:' + (baseMap[String(heading || 'h2').toLowerCase()] || '3.1rem') + ';';
    }
    return { normalizeBlockStyle, normalizeAnimation, animationDataAttrs, blockWrapperStyle, titleWrapperStyle };
  }
  window.LuminaBlockStyle = { createApi };
})();
