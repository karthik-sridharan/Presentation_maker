/* Stage 34J: browser-compatible ES module version of theme/style-builder workflow.
   Runtime note: optional parity diagnostics; selected modules may also be used by guarded live ESM runtime. */

var ROOT = (typeof window !== 'undefined') ? window : globalThis;

function createApi(deps){
    deps = deps || {};
    const themeFields = deps.themeFields || {};
    const normalizeTheme = deps.normalizeTheme;
    const rgbaFromHex = deps.rgbaFromHex;
    const showToast = deps.showToast || function(){};
    const getDocument = deps.getDocument || function(){ return ROOT.document; };
    const buildPreview = deps.buildPreview || function(){};
    const renderDeckList = deps.renderDeckList || function(){};
    const scheduleAutosave = deps.scheduleAutosave || function(){};

    if(typeof normalizeTheme !== 'function'){
      throw new Error('LuminaTheme requires normalizeTheme.');
    }
    if(typeof rgbaFromHex !== 'function'){
      throw new Error('LuminaTheme requires rgbaFromHex.');
    }

    function themeFieldValue(name, fallback=''){
      const el = themeFields[name];
      return el ? el.value : fallback;
    }
    function setThemeFieldValue(name, value){
      const el = themeFields[name];
      if(el) el.value = value;
    }
    function currentThemeFromFields(){
      return normalizeTheme({
        name: themeFieldValue('name', 'Default theme'),
        bgColor: themeFieldValue('bgColor', '#ffffff'),
        fontColor: themeFieldValue('fontColor', '#111111'),
        accentColor: themeFieldValue('accentColor', '#2f6fed'),
        panelRadius: themeFieldValue('panelRadius', '22'),
        titleScale: themeFieldValue('titleScale', '1'),
        beamerStyle: themeFieldValue('beamerStyle', 'classic'),
        chromeColor: themeFieldValue('chromeColor', '#17365d'),
        chromeTextColor: themeFieldValue('chromeTextColor', '#ffffff'),
        sidebarWidth: themeFieldValue('sidebarWidth', '118'),
        titleCaps: themeFieldValue('titleCaps', '0')
      });
    }
    function applyThemeToForm(theme){
      const t = normalizeTheme(theme);
      setThemeFieldValue('name', t.name);
      setThemeFieldValue('bgColor', t.bgColor);
      setThemeFieldValue('fontColor', t.fontColor);
      setThemeFieldValue('accentColor', t.accentColor);
      setThemeFieldValue('panelRadius', String(t.panelRadius));
      setThemeFieldValue('titleScale', String(t.titleScale));
      setThemeFieldValue('beamerStyle', t.beamerStyle);
      setThemeFieldValue('chromeColor', t.chromeColor);
      setThemeFieldValue('chromeTextColor', t.chromeTextColor);
      setThemeFieldValue('sidebarWidth', String(t.sidebarWidth));
      setThemeFieldValue('titleCaps', String(t.titleCaps));
    }
    function currentPresentationOptions(){
      const doc = getDocument();
      const liveDrawEl = doc && doc.getElementById ? doc.getElementById('enableLiveDrawExport') : null;
      return {
        enableLiveDraw: !!(liveDrawEl && liveDrawEl.checked)
      };
    }
    function applyPresentationOptions(options){
      const doc = getDocument();
      const liveDrawEl = doc && doc.getElementById ? doc.getElementById('enableLiveDrawExport') : null;
      if(liveDrawEl) liveDrawEl.checked = !!(options && options.enableLiveDraw);
    }
    function currentStyleClass(){
      const t = currentThemeFromFields();
      return 'style-' + String(t.beamerStyle || 'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();
    }
    function buildSlideStyle(slide){
      const theme = currentThemeFromFields();
      const useTheme = slide.inheritTheme !== false;
      const bg = useTheme ? theme.bgColor : (slide.bgColor || theme.bgColor);
      const font = useTheme ? theme.fontColor : (slide.fontColor || theme.fontColor);
      const muted = rgbaFromHex(font, 0.72);
      const line = rgbaFromHex(font, 0.14);
      const titleTransform = String(theme.titleCaps) === '1' ? 'uppercase' : 'none';
      const titleLetterSpacing = String(theme.titleCaps) === '1' ? '.04em' : 'normal';
      let extra = '';
      const styleId = String(theme.beamerStyle || 'classic').toLowerCase();
      if(styleId === 'berkeley'){
        extra += 'padding-left:calc(3.3rem + ' + theme.sidebarWidth + 'px);';
        extra += 'background-image:linear-gradient(90deg,' + theme.chromeColor + ' 0 ' + theme.sidebarWidth + 'px, transparent ' + theme.sidebarWidth + 'px 100%),linear-gradient(180deg,' + theme.accentColor + ' 0 18px, transparent 18px 100%);';
        extra += 'background-repeat:no-repeat;';
      } else if(styleId === 'madrid'){
        extra += 'padding-top:5rem;padding-bottom:5.2rem;';
        extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 58px, transparent 58px calc(100% - 24px),' + theme.accentColor + ' calc(100% - 24px) 100%);';
        extra += 'background-repeat:no-repeat;';
      } else if(styleId === 'annarbor'){
        extra += 'padding-top:4.8rem;padding-bottom:5rem;';
        extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 64px, transparent 64px calc(100% - 18px),' + theme.accentColor + ' calc(100% - 18px) 100%);';
        extra += 'background-repeat:no-repeat;';
      } else if(styleId === 'cambridgeus'){
        extra += 'padding-top:4.7rem;padding-bottom:5rem;';
        extra += 'background-image:linear-gradient(180deg,transparent 0 56px, transparent 56px calc(100% - 18px),' + theme.chromeColor + ' calc(100% - 18px) 100%),linear-gradient(90deg,' + theme.accentColor + ' 0 18px,' + theme.chromeColor + ' 18px 100%);';
        extra += 'background-size:100% 100%,100% 56px;background-repeat:no-repeat;';
      } else if(styleId === 'pittsburgh'){
        extra += 'padding-top:4.2rem;';
        extra += 'background-image:linear-gradient(180deg,' + theme.chromeColor + ' 0 16px, transparent 16px 100%);';
        extra += 'background-repeat:no-repeat;';
      }
      return 'background-color:' + bg + ';color:' + font + ';--text:' + font + ';--muted:' + muted + ';--line:' + line + ';--accent:' + theme.accentColor + ';--radius:' + theme.panelRadius + 'px;--title-scale:' + theme.titleScale + ';--chrome-fill:' + theme.chromeColor + ';--chrome-text:' + theme.chromeTextColor + ';--sidebar-width:' + theme.sidebarWidth + 'px;--title-transform:' + titleTransform + ';--title-letter-spacing:' + titleLetterSpacing + ';' + extra;
    }
    function beamerPresetTheme(name){
      const id = String(name || 'classic').toLowerCase();
      const presets = {
        classic: {name:'Classic', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:22, titleScale:1, beamerStyle:'classic', chromeColor:'#17365d', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
        berkeley: {name:'Berkeley', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#d4a017', panelRadius:18, titleScale:1, beamerStyle:'berkeley', chromeColor:'#17365d', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
        madrid: {name:'Madrid', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:20, titleScale:1, beamerStyle:'madrid', chromeColor:'#1f4e79', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'0'},
        annarbor: {name:'AnnArbor', bgColor:'#fffaf0', fontColor:'#2f2410', accentColor:'#7a4f01', panelRadius:18, titleScale:1, beamerStyle:'annarbor', chromeColor:'#c99a06', chromeTextColor:'#111111', sidebarWidth:118, titleCaps:'0'},
        cambridgeus: {name:'CambridgeUS', bgColor:'#ffffff', fontColor:'#10233b', accentColor:'#c53030', panelRadius:16, titleScale:1, beamerStyle:'cambridgeus', chromeColor:'#0f4c81', chromeTextColor:'#ffffff', sidebarWidth:118, titleCaps:'1'},
        pittsburgh: {name:'Pittsburgh', bgColor:'#ffffff', fontColor:'#111111', accentColor:'#2f6fed', panelRadius:22, titleScale:1.02, beamerStyle:'pittsburgh', chromeColor:'#2f6fed', chromeTextColor:'#ffffff', sidebarWidth:96, titleCaps:'0'}
      };
      return normalizeTheme(presets[id] || presets.classic);
    }
    function applyStylePreset(name){
      const merged = normalizeTheme({...currentThemeFromFields(), ...beamerPresetTheme(name)});
      applyThemeToForm(merged);
      buildPreview();
      renderDeckList();
      scheduleAutosave('Autosaved after style preset change.');
      showToast('Applied ' + merged.name + ' style.');
    }
    function randomHexColor(){
      const n = Math.floor(Math.random() * 0xffffff);
      return '#' + n.toString(16).padStart(6, '0');
    }
    function applyStyleBuilder(){
      const merged = currentThemeFromFields();
      applyThemeToForm(merged);
      buildPreview();
      renderDeckList();
      scheduleAutosave('Autosaved after style builder update.');
      showToast('Updated master style.');
    }
    function randomizeStyleBuilder(){
      const styles = ['classic','berkeley','madrid','annarbor','cambridgeus','pittsburgh'];
      setThemeFieldValue('beamerStyle', styles[Math.floor(Math.random() * styles.length)]);
      setThemeFieldValue('chromeColor', randomHexColor());
      setThemeFieldValue('accentColor', randomHexColor());
      setThemeFieldValue('titleCaps', Math.random() > 0.5 ? '1' : '0');
      buildPreview();
      renderDeckList();
      scheduleAutosave('Autosaved after generating style variant.');
      showToast('Generated style variant.');
    }

    return {
      themeFieldValue,
      setThemeFieldValue,
      currentThemeFromFields,
      applyThemeToForm,
      currentPresentationOptions,
      applyPresentationOptions,
      currentStyleClass,
      buildSlideStyle,
      beamerPresetTheme,
      applyStylePreset,
      randomHexColor,
      applyStyleBuilder,
      randomizeStyleBuilder
    };
  }

export { createApi };
export default Object.freeze({ createApi: createApi });
