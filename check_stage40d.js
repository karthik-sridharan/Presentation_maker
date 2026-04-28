const fs=require('fs');
const path=process.argv[2]||'/mnt/data/lumina-presenter-stage40d-clean-deploy/index.html';
const html=fs.readFileSync(path,'utf8');
function has(s){return html.includes(s)}
function count(re){const m=html.match(re);return m?m.length:0}
const report={
  stage:'stage40d-20260427-1',
  checkedAt:new Date().toISOString(),
  fileBytes:Buffer.byteLength(html),
  stageSignaturePresent:has('index-inline-stage40d-plan-board-ux-tightening-20260427-1'),
  topStagePresent:has("window.LUMINA_STAGE = 'stage40d-20260427-1'"),
  cssPresent:has('stage40d-plan-board-ux-css'),
  scriptPresent:has('stage40d-plan-board-ux-script'),
  planBoardRuntimePresent:has('stage40DPlanBoardUxStatus')&&has('LuminaStage40DPlanBoardUx'),
  uxElementsPresent:has('stage40dPlanBoard')&&has('stage40dStoryboard')&&has('stage40dEmptyStarter')&&has('stage40dJsonNote'),
  starterAndQuickAddsPresent:has('4-slide starter')&&has('data-stage40d-action="add-slide"')&&has('data-stage40d-action="add-section"')&&has('data-stage40d-action="add-demo"'),
  slideIntentPresent:has('stage40d-slide-intent')&&has('slideIntentSummaries'),
  jsonDeemphasized:has('jsonFirstReduced')&&has('Advanced JSON is still available'),
  previousStage40CPreserved:has('stage40c-prompt-action-dedup-script')&&has('stage40CPromptDedupStatus'),
  previousStage40BPreserved:has('stage40b-plan-hardening-script')&&has('stage40BPlanHardeningStatus'),
  previousStage40APreserved:has('stage40a-deck-planning-script')&&has('stage40ADeckPlanningStatus'),
  safePlanFlow:has('previewOnlyGenerationPreserved')&&has('applyOnlyMutationPreserved')&&has('Generate preview from plan'),
  noMutationObserverClaim:has('noMutationObserver:true')&&has('noCommandHooks:true'),
  loadedScriptCount:count(/<script\b/g),
  styleCount:count(/<style\b/g),
  tests:{}
};
report.tests={
  stage:report.stageSignaturePresent&&report.topStagePresent,
  inserted:report.cssPresent&&report.scriptPresent,
  runtime:report.planBoardRuntimePresent,
  ux:report.uxElementsPresent,
  actions:report.starterAndQuickAddsPresent,
  slideIntent:report.slideIntentPresent,
  jsonDeemphasis:report.jsonDeemphasized,
  preserves40C:report.previousStage40CPreserved,
  preserves40B:report.previousStage40BPreserved,
  preserves40A:report.previousStage40APreserved,
  safeFlow:report.safePlanFlow,
  safeHooks:report.noMutationObserverClaim,
};
report.pass=Object.values(report.tests).every(Boolean);
console.log(JSON.stringify(report,null,2));
process.exit(report.pass?0:1);
