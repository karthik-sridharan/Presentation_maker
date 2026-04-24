export let slides = [];
export let activeIndex = -1;
export let currentTheme = {
    beamerStyle: 'classic',
    bgColor: '#ffffff',
    fontColor: '#111111',
    accentColor: '#2f6fed',
    panelRadius: 22,
    titleScale: 1
};

export const updateState = (newSlides, newIndex) => {
    slides = newSlides;
    activeIndex = newIndex;
};

export function saveToLocalStorage() {
    const data = {
        slides,
        activeIndex,
        deckTitle: document.getElementById('deckTitle')?.value || 'Untitled'
    };
    localStorage.setItem('lumina_autosave', JSON.stringify(data));
}

export function loadFromLocalStorage() {
    const raw = localStorage.getItem('lumina_autosave');
    if (!raw) return false;
    const data = JSON.parse(raw);
    slides = data.slides || [];
    activeIndex = data.activeIndex ?? -1;
    return true;
}
