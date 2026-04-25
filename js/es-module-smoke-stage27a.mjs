/* Stage 27A: non-blocking ES module smoke/parity checks.
   This is loaded after the classic runtime. It proves that leaf helpers can be
   represented as ESM exports without changing the production boot path yet. */

import * as utils from './esm/utils-stage27a.mjs';
import { createApi as createBlockStyleApi } from './esm/block-style-stage27a.mjs';

const W = window;
const STAGE = 'stage27a-20260425-1';
const checks = [];

function json(value){
  return JSON.stringify(value);
}

function check(name, ok, details = {}){
  const record = { name, ok: Boolean(ok), details };
  checks.push(record);
  return record.ok;
}

function markLoaded(asset){
  if(W.LuminaDiagnostics && typeof W.LuminaDiagnostics.markLoaded === 'function'){
    W.LuminaDiagnostics.markLoaded(asset);
  }
}

function markFailed(message){
  if(typeof W.luminaBootError === 'function') W.luminaBootError(message);
}

markLoaded('js/esm/utils-stage27a.mjs');
markLoaded('js/esm/block-style-stage27a.mjs');

const classicUtils = W.LuminaUtils || {};
const classicBlockStyle = W.LuminaBlockStyle || {};

check('module entry executed', true, { stage: STAGE });
check('classic LuminaUtils available', typeof classicUtils.escapeHtml === 'function');
check('classic LuminaBlockStyle available', typeof classicBlockStyle.createApi === 'function');

const sampleHtml = '<section title="A&B">\n\'quote\'</section>';
if(typeof classicUtils.escapeHtml === 'function'){
  check('utils.escapeHtml parity', utils.escapeHtml(sampleHtml) === classicUtils.escapeHtml(sampleHtml), {
    esm: utils.escapeHtml(sampleHtml),
    classic: classicUtils.escapeHtml(sampleHtml)
  });
}
if(typeof classicUtils.escapeAttr === 'function'){
  check('utils.escapeAttr parity', utils.escapeAttr(sampleHtml) === classicUtils.escapeAttr(sampleHtml), {
    esm: utils.escapeAttr(sampleHtml),
    classic: classicUtils.escapeAttr(sampleHtml)
  });
}
if(typeof classicUtils.preserveMathTokens === 'function' && typeof classicUtils.restoreMathTokens === 'function'){
  const mathSample = 'Alpha $x_1$ and $$y=x^2$$ plus \\(z\\).';
  const esmPreserved = utils.preserveMathTokens(mathSample);
  const classicPreserved = classicUtils.preserveMathTokens(mathSample);
  check('utils.preserveMathTokens parity', json(esmPreserved) === json(classicPreserved), { esm: esmPreserved, classic: classicPreserved });
  check('utils.restoreMathTokens parity', utils.restoreMathTokens(esmPreserved.out, esmPreserved.tokens) === classicUtils.restoreMathTokens(classicPreserved.out, classicPreserved.tokens));
}
if(typeof classicUtils.hexToRgb === 'function' && typeof classicUtils.rgbaFromHex === 'function'){
  ['#abc', '#123456', 'not-a-color'].forEach((value)=>{
    check('utils.hexToRgb parity: ' + value, json(utils.hexToRgb(value)) === json(classicUtils.hexToRgb(value)), {
      esm: utils.hexToRgb(value),
      classic: classicUtils.hexToRgb(value)
    });
  });
  check('utils.rgbaFromHex parity', utils.rgbaFromHex('#336699', 0.42) === classicUtils.rgbaFromHex('#336699', 0.42));
}
if(typeof classicUtils.normalizeTheme === 'function'){
  const theme = { name:'Custom', panelRadius:'35', titleScale:'1.2', sidebarWidth:'144', titleCaps:1 };
  check('utils.normalizeTheme parity', json(utils.normalizeTheme(theme)) === json(classicUtils.normalizeTheme(theme)), {
    esm: utils.normalizeTheme(theme),
    classic: classicUtils.normalizeTheme(theme)
  });
}

if(typeof classicBlockStyle.createApi === 'function'){
  const deps = { escapeAttr: utils.escapeAttr };
  const esmStyle = createBlockStyleApi(deps);
  const classicStyle = classicBlockStyle.createApi(deps);
  const styleSample = { fontScale: 3, fontFamily: 'Inter "Tight"', fontColor: '#445566', bulletType: 'square' };
  const animSample = { buildIn: 'fade', buildOut: 'disappear', stepMode: 'by-item', order: '2' };
  check('block-style.normalizeBlockStyle parity', json(esmStyle.normalizeBlockStyle(styleSample)) === json(classicStyle.normalizeBlockStyle(styleSample)), {
    esm: esmStyle.normalizeBlockStyle(styleSample),
    classic: classicStyle.normalizeBlockStyle(styleSample)
  });
  check('block-style.normalizeAnimation parity', json(esmStyle.normalizeAnimation(animSample)) === json(classicStyle.normalizeAnimation(animSample)), {
    esm: esmStyle.normalizeAnimation(animSample),
    classic: classicStyle.normalizeAnimation(animSample)
  });
  check('block-style.animationDataAttrs parity', esmStyle.animationDataAttrs(animSample) === classicStyle.animationDataAttrs(animSample));
  check('block-style.blockWrapperStyle parity', esmStyle.blockWrapperStyle({ style: styleSample }) === classicStyle.blockWrapperStyle({ style: styleSample }));
  check('block-style.titleWrapperStyle parity', esmStyle.titleWrapperStyle(styleSample, 'h1') === classicStyle.titleWrapperStyle(styleSample, 'h1'));
}

const failed = checks.filter((item)=>!item.ok);
const report = Object.freeze({
  stage: STAGE,
  checkedAt: new Date().toISOString(),
  ok: failed.length === 0,
  failed,
  checks,
  exports: Object.freeze({
    utils: Object.keys(utils).sort(),
    blockStyle: ['createApi']
  }),
  migrationMode: 'non-blocking ESM parity harness; classic runtime remains authoritative'
});

W.LuminaEsModuleDiagnostics = report;
markLoaded('js/es-module-smoke-stage27a.mjs');

if(!report.ok){
  markFailed('Stage 27A ES module smoke checks failed: ' + failed.map((item)=>item.name).join(', '));
}
