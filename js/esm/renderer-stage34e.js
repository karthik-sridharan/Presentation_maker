/* Stage 34E: browser-compatible ES module version of renderer helpers.
   Runtime note: optional parity diagnostics; selected modules may also be used by guarded live ESM runtime. */

function required(deps, name){
  var value = deps && deps[name];
  if(typeof value !== 'function') throw new Error('LuminaRenderer ESM missing dependency: ' + name);
  return value;
}

export function createApi(deps){
  deps = deps || {};
  var escapeAttr = required(deps, 'escapeAttr');
  var escapeHtml = required(deps, 'escapeHtml');
  var preserveMathTokens = required(deps, 'preserveMathTokens');
  var restoreMathTokens = required(deps, 'restoreMathTokens');
  var parseStructuredText = required(deps, 'parseStructuredText');
  var normalizeBlockStyle = required(deps, 'normalizeBlockStyle');
  var normalizeAnimation = required(deps, 'normalizeAnimation');
  var animationDataAttrs = required(deps, 'animationDataAttrs');
  var blockWrapperStyle = required(deps, 'blockWrapperStyle');
  var titleWrapperStyle = required(deps, 'titleWrapperStyle');
  var currentStyleClass = required(deps, 'currentStyleClass');
  var buildSlideStyle = required(deps, 'buildSlideStyle');
  var clone = deps.clone || function(value){ return JSON.parse(JSON.stringify(value == null ? {} : value)); };
  var expandDiagramSnippetChecked = deps.expandDiagramSnippetChecked || function(){ return false; };

  function diagramMarkup(){
    return '<div class="diag"><svg class="diagram" viewBox="0 0 760 430" role="img" aria-label="Tiny neural network diagram placeholder"><line x1="145" y1="145" x2="355" y2="125" class="edge"/><line x1="145" y1="145" x2="355" y2="295" class="edge"/><line x1="145" y1="285" x2="355" y2="125" class="edge"/><line x1="145" y1="285" x2="355" y2="295" class="edge"/><line x1="405" y1="125" x2="615" y2="215" class="edge"/><line x1="405" y1="295" x2="615" y2="215" class="edge"/><circle cx="115" cy="145" r="34" class="node"/><circle cx="115" cy="285" r="34" class="node"/><circle cx="375" cy="125" r="34" class="node"/><circle cx="375" cy="295" r="34" class="node"/><circle cx="645" cy="215" r="34" class="node"/><text x="88" y="153" class="label">x₁</text><text x="88" y="293" class="label">x₂</text><text x="350" y="133" class="label">h₁</text><text x="350" y="303" class="label">h₂</text><text x="632" y="223" class="label">ŷ</text></svg></div>';
  }
  function customFrameMarkup(raw){
    var html = String(raw || '').trim();
    if(!html) return '<div class="placeholder">Paste custom HTML here.</div>';
    return '<div class="custom-frame-wrap"><iframe class="custom-frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads" referrerpolicy="no-referrer" srcdoc="' + escapeAttr(html) + '"></iframe></div>';
  }
  function diagramStandaloneDocument(innerHtml){
    var body = String(innerHtml || '').trim() || diagramMarkup();
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Inter,Arial,sans-serif}*{box-sizing:border-box}.diag{display:grid;place-items:center;padding:.9rem}.diagram{width:100%;max-width:680px;height:auto}.diagram .edge{stroke:currentColor;stroke-opacity:.32;stroke-width:6;stroke-linecap:round}.diagram .node{fill:none;stroke:currentColor;stroke-width:6}.diagram .label{fill:currentColor;font:700 28px Inter,system-ui,sans-serif}</style></head><body>' + body + '</body></html>';
  }
  function expandDiagramBlocksForSnippet(slide){
    var s = normalizeSlide(slide);
    function convert(block){
      if((block.mode || 'panel') !== 'diagram') return clone(block);
      return {
        mode: 'custom',
        title: block.title || '',
        content: diagramStandaloneDocument(block.content || diagramMarkup())
      };
    }
    s.leftBlocks = (s.leftBlocks || []).map(convert);
    s.rightBlocks = (s.rightBlocks || []).map(convert);
    return s;
  }
  function slideForSnippet(slide){
    return expandDiagramSnippetChecked() ? expandDiagramBlocksForSnippet(slide) : normalizeSlide(slide);
  }
  function normalizeBlock(block){
    block = block || {};
    var mode = block.mode || 'panel';
    if(mode === 'diagram'){
      return {
        mode: 'custom',
        title: block.title || 'Legacy diagram',
        content: diagramStandaloneDocument(block.content || diagramMarkup()),
        style: normalizeBlockStyle(block.style),
        animation: normalizeAnimation(block.animation)
      };
    }
    return {
      mode: mode,
      title: block.title || '',
      content: block.content || '',
      style: normalizeBlockStyle(block.style),
      animation: normalizeAnimation(block.animation)
    };
  }
  function normalizeSlide(slide){
    var out = clone(slide || {});
    var leftBlocks = Array.isArray(out.leftBlocks) ? out.leftBlocks.map(normalizeBlock) : null;
    var rightBlocks = Array.isArray(out.rightBlocks) ? out.rightBlocks.map(normalizeBlock) : null;
    if(!leftBlocks){
      leftBlocks = [{ mode: out.leftMode || 'panel', title: '', content: out.leftHtml || '' }];
    }
    if(!rightBlocks){
      rightBlocks = out.slideType === 'two-col'
        ? [{ mode: out.rightMode || 'panel', title: '', content: out.rightHtml || '' }]
        : [];
    }
    out.leftBlocks = leftBlocks;
    out.rightBlocks = rightBlocks;
    out.titleStyle = normalizeBlockStyle(out.titleStyle);
    out.titleAnimation = normalizeAnimation(out.titleAnimation);
    return out;
  }
  function renderBlock(block, placeholderText, meta){
    block = block || {};
    var resolvedMode = block.mode || 'panel';
    var raw = block.content || '';
    var inner = '';
    if(resolvedMode === 'diagram') inner = diagramMarkup();
    else if(resolvedMode === 'custom') inner = customFrameMarkup(raw);
    else if(resolvedMode === 'placeholder') inner = '<div class="placeholder">' + escapeHtml(raw || placeholderText || 'Placeholder') + '</div>';
    else if(resolvedMode === 'pseudocode') inner = '<pre class="pseudo-block">' + escapeHtml(raw) + '</pre>';
    else if(resolvedMode === 'pseudocode-latex'){
      var p = preserveMathTokens(raw);
      inner = '<div class="pseudo-latex-block">' + restoreMathTokens(escapeHtml(p.out), p.tokens) + '</div>';
    } else {
      var richMeta = meta ? { column: meta.column, blockIndex: meta.blockIndex, figureIndex: 0 } : null;
      inner = '<div class="rich">' + parseStructuredText(raw, richMeta) + '</div>';
    }
    var attrs = meta ? ' data-column="' + escapeAttr(meta.column || 'left') + '" data-block-index="' + meta.blockIndex + '" data-block-mode="' + escapeAttr(resolvedMode) + '"' : '';
    return '<div class="preview-block"' + attrs + animationDataAttrs(block.animation) + ' style="' + blockWrapperStyle(block) + '">' + inner + '</div>';
  }
  function renderBlocks(blocks, placeholder, columnName){
    var list = blocks && blocks.length ? blocks : [{ mode:'placeholder', content: placeholder || 'Add a block' }];
    return '<div class="col-stack">' + list.map(function(block, idx){ return renderBlock(block, placeholder, { column: columnName || 'left', blockIndex: idx }); }).join('') + '</div>';
  }
  function buildSlideInner(slide){
    slide = slide || {};
    var heading = slide.headingLevel || 'h2';
    var titleHtml = '<div class="preview-title" data-preview-role="title"' + animationDataAttrs(slide.titleAnimation) + ' style="' + titleWrapperStyle(slide.titleStyle, heading) + '"><' + heading + '>' + escapeHtml(slide.title || 'Untitled slide').replace(/\n/g,'<br>') + '</' + heading + '></div>';
    var kickerHtml = slide.kicker ? '<div class="kicker">' + escapeHtml(slide.kicker) + '</div>' : '';
    var ledeHtml = slide.lede ? '<div class="lede">' + escapeHtml(slide.lede) + '</div>' : '';
    var s = normalizeSlide(slide);
    if(s.slideType === 'title-center') return '<div class="title-center">' + titleHtml + kickerHtml + '</div>';
    if(s.slideType === 'two-col'){
      return titleHtml + kickerHtml + ledeHtml + '<div class="slide-body"><div class="col">' + renderBlocks(s.leftBlocks, 'Left column', 'left') + '</div><div class="col">' + renderBlocks(s.rightBlocks, 'Right column', 'right') + '</div></div>';
    }
    return titleHtml + kickerHtml + ledeHtml + '<div class="slide-body"><div class="col">' + renderBlocks(s.leftBlocks, 'Main content', 'left') + '</div></div>';
  }
  function buildSlideMarkup(slide){
    slide = slide || {};
    var cls = slide.slideType === 'title-center' ? 'slide title-center' : (slide.slideType === 'two-col' ? 'slide two-col' : 'slide single');
    return '<section class="' + cls + ' ' + currentStyleClass() + '" style="' + buildSlideStyle(slide) + '">' + buildSlideInner(slide).trim() + '</section>';
  }

  return {
    diagramMarkup: diagramMarkup,
    customFrameMarkup: customFrameMarkup,
    diagramStandaloneDocument: diagramStandaloneDocument,
    expandDiagramBlocksForSnippet: expandDiagramBlocksForSnippet,
    slideForSnippet: slideForSnippet,
    normalizeBlock: normalizeBlock,
    normalizeSlide: normalizeSlide,
    renderBlock: renderBlock,
    renderBlocks: renderBlocks,
    buildSlideInner: buildSlideInner,
    buildSlideMarkup: buildSlideMarkup
  };
}

export default Object.freeze({ createApi: createApi });
