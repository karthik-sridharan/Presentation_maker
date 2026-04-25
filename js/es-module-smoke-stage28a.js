/* Stage 28A: non-blocking ES module smoke/parity checks.
   Adds parser and import-helper ESM parity on top of Stage 27D utility/style checks.
   The classic Stage 24C runtime remains authoritative. */

import * as utils from './esm/utils-stage28a.js';
import { createApi as createBlockStyleApi } from './esm/block-style-stage28a.js';
import { createApi as createParserApi } from './esm/parser-stage28a.js';
import { createApi as createImportApi } from './esm/import-stage28a.js';

const W = window;
const STAGE = 'stage28a-20260425-1';
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

function sameJson(name, esmValue, classicValue){
  return check(name, json(esmValue) === json(classicValue), { esm: esmValue, classic: classicValue });
}

[
  'js/esm/utils-stage28a.js',
  'js/esm/block-style-stage28a.js',
  'js/esm/parser-stage28a.js',
  'js/esm/import-stage28a.js'
].forEach(markLoaded);

const classicUtils = W.LuminaUtils || {};
const classicBlockStyle = W.LuminaBlockStyle || {};
const classicParser = W.LuminaParser || {};
const classicImport = W.LuminaImport || {};
const rendererApi = W.LuminaRendererApi || {};
const figureInsert = W.LuminaFigureInsert || {};

check('module entry executed', true, { stage: STAGE });
check('classic LuminaUtils available', typeof classicUtils.escapeHtml === 'function');
check('classic LuminaBlockStyle available', typeof classicBlockStyle.createApi === 'function');
check('classic LuminaParser available', typeof classicParser.createApi === 'function');
check('classic LuminaImport available', typeof classicImport.createApi === 'function');

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
  sameJson('utils.preserveMathTokens parity', esmPreserved, classicPreserved);
  check('utils.restoreMathTokens parity', utils.restoreMathTokens(esmPreserved.out, esmPreserved.tokens) === classicUtils.restoreMathTokens(classicPreserved.out, classicPreserved.tokens));
}
if(typeof classicUtils.hexToRgb === 'function' && typeof classicUtils.rgbaFromHex === 'function'){
  ['#abc', '#123456', 'not-a-color'].forEach((value)=>{
    sameJson('utils.hexToRgb parity: ' + value, utils.hexToRgb(value), classicUtils.hexToRgb(value));
  });
  check('utils.rgbaFromHex parity', utils.rgbaFromHex('#336699', 0.42) === classicUtils.rgbaFromHex('#336699', 0.42));
}
if(typeof classicUtils.normalizeTheme === 'function'){
  const theme = { name:'Custom', panelRadius:'35', titleScale:'1.2', sidebarWidth:'144', titleCaps:1 };
  sameJson('utils.normalizeTheme parity', utils.normalizeTheme(theme), classicUtils.normalizeTheme(theme));
}

if(typeof classicBlockStyle.createApi === 'function'){
  const deps = { escapeAttr: utils.escapeAttr };
  const esmStyle = createBlockStyleApi(deps);
  const classicStyle = classicBlockStyle.createApi(deps);
  const styleSample = { fontScale: 3, fontFamily: 'Inter "Tight"', fontColor: '#445566', bulletType: 'square' };
  const animSample = { buildIn: 'fade', buildOut: 'disappear', stepMode: 'by-item', order: '2' };
  sameJson('block-style.normalizeBlockStyle parity', esmStyle.normalizeBlockStyle(styleSample), classicStyle.normalizeBlockStyle(styleSample));
  sameJson('block-style.normalizeAnimation parity', esmStyle.normalizeAnimation(animSample), classicStyle.normalizeAnimation(animSample));
  check('block-style.animationDataAttrs parity', esmStyle.animationDataAttrs(animSample) === classicStyle.animationDataAttrs(animSample));
  check('block-style.blockWrapperStyle parity', esmStyle.blockWrapperStyle({ style: styleSample }) === classicStyle.blockWrapperStyle({ style: styleSample }));
  check('block-style.titleWrapperStyle parity', esmStyle.titleWrapperStyle(styleSample, 'h1') === classicStyle.titleWrapperStyle(styleSample, 'h1'));
}

if(typeof classicParser.createApi === 'function'){
  const deps = {
    preserveMathTokens: utils.preserveMathTokens,
    restoreMathTokens: utils.restoreMathTokens,
    escapeHtml: utils.escapeHtml,
    escapeAttr: utils.escapeAttr
  };
  const esmParser = createParserApi(deps);
  const classicParserApi = classicParser.createApi(deps);
  const parserSamples = [
    'P: Hello <world> and $x^2$\n- first item\n- second item',
    '### Claim\n\\begin{itemize}\n\\item One\n\\item Two $z$\n\\end{itemize}',
    '\\begin{equation}\na &= b + c\n\\end{equation}',
    'CARD: Bias | Variance decreases under averaging',
    '\\begin{card}{Theorem}\nLine one\n\nLine two\n\\end{card}',
    '\\begin{figurehtml}\n<svg><circle r="10"></circle></svg>\n\\end{figurehtml}'
  ];
  parserSamples.forEach((sample, index)=>{
    const esmMeta = { column:'left', blockIndex:index, figureIndex:0 };
    const classicMeta = { column:'left', blockIndex:index, figureIndex:0 };
    check('parser.parseStructuredText parity sample ' + (index + 1),
      esmParser.parseStructuredText(sample, esmMeta) === classicParserApi.parseStructuredText(sample, classicMeta),
      { esm: esmParser.parseStructuredText(sample, { column:'left', blockIndex:index, figureIndex:0 }), classic: classicParserApi.parseStructuredText(sample, { column:'left', blockIndex:index, figureIndex:0 }) }
    );
  });
}

if(typeof classicImport.createApi === 'function' && typeof rendererApi.normalizeSlide === 'function' && typeof figureInsert.buildImageFigureHtml === 'function'){
  const deps = {
    normalizeSlide: rendererApi.normalizeSlide,
    escapeAttr: utils.escapeAttr,
    buildImageFigureHtml: figureInsert.buildImageFigureHtml
  };
  const esmImport = createImportApi(deps);
  const classicImportApi = classicImport.createApi(deps);
  const md = '# Slide One\nIntro paragraph\n- alpha\n- beta\n---\n## Slide Two\n1. first\n2. second';
  const beamer = '\\begin{frame}{Frame Title}\n\\framesubtitle{Sub}\n\\begin{itemize}\n\\item A\n\\item B\n\\end{itemize}\n\\end{frame}';
  const outline = JSON.stringify({ sections:[{ title:'Section A', lede:'Overview', slides:[{ title:'Inside', bullets:['one','two'] }] }] });
  const pptText = 'Title A\n- bullet\nbody line\n\nTitle B\n1. ordered';
  check('import.buildImportedContent parity', esmImport.buildImportedContent(['P'], ['B'], ['O']) === classicImportApi.buildImportedContent(['P'], ['B'], ['O']));
  sameJson('import.makeImportedSlide parity', esmImport.makeImportedSlide('Title', ['Para'], ['Bullet'], ['Ordered']), classicImportApi.makeImportedSlide('Title', ['Para'], ['Bullet'], ['Ordered']));
  sameJson('import.makeReferenceImageSlide parity', esmImport.makeReferenceImageSlide('data:image/png;base64,AAA', 'Image'), classicImportApi.makeReferenceImageSlide('data:image/png;base64,AAA', 'Image'));
  sameJson('import.makeReferencePdfSlide parity', esmImport.makeReferencePdfSlide('data:application/pdf;base64,AAA', 'PDF'), classicImportApi.makeReferencePdfSlide('data:application/pdf;base64,AAA', 'PDF'));
  sameJson('import.parseMarkdownToSlides parity', esmImport.parseMarkdownToSlides(md), classicImportApi.parseMarkdownToSlides(md));
  sameJson('import.parseBeamerToSlides parity', esmImport.parseBeamerToSlides(beamer), classicImportApi.parseBeamerToSlides(beamer));
  sameJson('import.parseJsonOutlineToSlides parity', esmImport.parseJsonOutlineToSlides(outline), classicImportApi.parseJsonOutlineToSlides(outline));
  sameJson('import.parsePowerPointTextToSlides parity', esmImport.parsePowerPointTextToSlides(pptText), classicImportApi.parsePowerPointTextToSlides(pptText));
}

const failed = checks.filter((item)=>!item.ok);
const report = Object.freeze({
  stage: STAGE,
  checkedAt: new Date().toISOString(),
  ok: failed.length === 0,
  status: failed.length === 0 ? 'passed' : 'parity-failed',
  failed,
  checks,
  checkCount: checks.length,
  exports: Object.freeze({
    utils: Object.keys(utils).sort(),
    blockStyle: ['createApi'],
    parser: ['createApi'],
    importHelpers: ['createApi']
  }),
  migrationMode: 'non-blocking ESM parity harness; classic runtime remains authoritative'
});

W.LuminaEsModuleDiagnostics = report;
markLoaded('js/es-module-smoke-stage28a.js');

if(!report.ok && W.LuminaDiagnostics && typeof W.LuminaDiagnostics.warn === 'function'){
  W.LuminaDiagnostics.warn('Stage 28A ES module smoke checks failed: ' + failed.map((item)=>item.name).join(', '));
}

export { report };
export default report;
