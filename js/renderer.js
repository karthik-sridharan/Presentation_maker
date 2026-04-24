import { currentTheme, slides, activeIndex } from './state.js';

export function getSlideStyle(slide) {
    const theme = slide.inheritTheme ? currentTheme : slide;
    let css = `background-color: ${theme.bgColor}; color: ${theme.fontColor};`;
    
    // Apply Beamer-specific layout offsets
    if (theme.beamerStyle === 'berkeley') {
        css += `padding-left: calc(3.3rem + ${theme.sidebarWidth || 118}px);`;
    } else if (theme.beamerStyle === 'madrid') {
        css += `padding-top: 5rem; padding-bottom: 5.2rem;`;
    }
    
    return css;
}

export function renderActiveSlide() {
    const stage = document.getElementById('previewStage');
    if (activeIndex === -1 || !slides[activeIndex]) {
        stage.innerHTML = '<div class="placeholder">Create a slide to begin</div>';
        return;
    }

    const slide = slides[activeIndex];
    stage.innerHTML = `
        <section class="slide" style="${getSlideStyle(slide)}">
            <h1>${slide.title || 'Untitled Slide'}</h1>
            <div class="slide-body">
                ${renderBlocks(slide.leftBlocks)}
            </div>
        </section>
    `;

    if (window.MathJax) window.MathJax.typesetPromise();
}

function renderBlocks(blocks = []) {
    return blocks.map(b => `<div class="rich">${b.content}</div>`).join('');
}
