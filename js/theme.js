/**
 * theme.js - Pure theme helpers
 *
 * These functions do not read from or write to the DOM. The legacy
 * compatibility layer still owns the form fields for now.
 */

import { rgbaFromHex } from './utils.js';

export function normalizeTheme(theme){
  const t = theme || {};
  return {
    name: t.name || 'Default theme',
    bgColor: t.bgColor || '#ffffff',
    fontColor: t.fontColor || '#111111',
    accentColor: t.accentColor || '#2f6fed',
    panelRadius: Number.isFinite(Number(t.panelRadius)) ? Number(t.panelRadius) : 22,
    titleScale: Number.isFinite(Number(t.titleScale)) ? Number(t.titleScale) : 1,
    beamerStyle: t.beamerStyle || 'classic',
    chromeColor: t.chromeColor || '#17365d',
    chromeTextColor: t.chromeTextColor || '#ffffff',
    sidebarWidth: Number.isFinite(Number(t.sidebarWidth)) ? Number(t.sidebarWidth) : 118,
    titleCaps: String(t.titleCaps || '0')
  };
}

export function styleClassForTheme(theme){
  const t = normalizeTheme(theme);
  return 'style-' + String(t.beamerStyle || 'classic').replace(/[^a-z0-9_-]/gi,'').toLowerCase();
}

export function buildSlideStyleForTheme(slide, themeInput){
  const theme = normalizeTheme(themeInput);
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

export function beamerPresetTheme(name){
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
