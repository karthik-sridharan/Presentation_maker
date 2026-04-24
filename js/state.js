/**
 * state.js - Deck State Management & Persistence
 * 
 * Manages:
 * - Deck data structure (slides array, metadata)
 * - Current slide selection
 * - Undo/redo history
 * - LocalStorage persistence
 * - Auto-save functionality
 */

// Default empty deck
const DEFAULT_DECK = {
  deckTitle: 'My HTML Presentation',
  theme: {
    beamerStyle: 'classic',
    backgroundColor: '#ffffff',
    fontColor: '#111111',
    accentColor: '#61b4ff'
  },
  slides: [
    {
      id: generateUUID(),
      slideType: 'title-center',
      title: 'Welcome',
      headingLevel: 'h1',
      content: '',
      backgroundColor: '#ffffff',
      fontColor: '#111111',
      blocks: []
    }
  ]
};

// Application state
let state = {
  deck: null,
  currentSlideIndex: 0,
  history: [],
  historyIndex: -1,
  lastSaveTime: null
};

/**
 * Initialize state management
 */
export function initState() {
  console.log('Initializing state management...');
  
  // Try to load from localStorage
  const saved = loadFromLocalStorage();
  if (saved) {
    state.deck = saved;
  } else {
    state.deck = JSON.parse(JSON.stringify(DEFAULT_DECK));
  }
  
  // Initialize history
  pushHistory(state.deck);
  
  console.log('✓ State initialized with', state.deck.slides.length, 'slides');
}

/**
 * Get current deck payload
 */
export function getCurrentPayload() {
  return state.deck;
}

/**
 * Get current slide
 */
export function getCurrentSlide() {
  return state.deck.slides[state.currentSlideIndex] || null;
}

/**
 * Set current slide index
 */
export function setCurrentSlideIndex(index) {
  if (index >= 0 && index < state.deck.slides.length) {
    state.currentSlideIndex = index;
    return true;
  }
  return false;
}

/**
 * Update deck metadata
 */
export function updateDeck(updates) {
  state.deck = { ...state.deck, ...updates };
  pushHistory(state.deck);
  autoSave();
}

/**
 * Update current slide
 */
export function updateCurrentSlide(updates) {
  if (state.currentSlideIndex >= 0 && state.currentSlideIndex < state.deck.slides.length) {
    state.deck.slides[state.currentSlideIndex] = {
      ...state.deck.slides[state.currentSlideIndex],
      ...updates
    };
    pushHistory(state.deck);
    autoSave();
  }
}

/**
 * Add a new slide
 */
export function addSlide(slide, index = null) {
  const newSlide = {
    id: generateUUID(),
    ...DEFAULT_DECK.slides[0],
    ...slide
  };
  
  if (index === null) {
    state.deck.slides.push(newSlide);
    state.currentSlideIndex = state.deck.slides.length - 1;
  } else {
    state.deck.slides.splice(index, 0, newSlide);
    state.currentSlideIndex = index;
  }
  
  pushHistory(state.deck);
  autoSave();
  return newSlide;
}

/**
 * Delete slide at index
 */
export function deleteSlide(index) {
  if (state.deck.slides.length <= 1) {
    console.warn('Cannot delete the last slide');
    return false;
  }
  
  state.deck.slides.splice(index, 1);
  
  if (state.currentSlideIndex >= state.deck.slides.length) {
    state.currentSlideIndex = state.deck.slides.length - 1;
  }
  
  pushHistory(state.deck);
  autoSave();
  return true;
}

/**
 * Duplicate slide
 */
export function duplicateSlide(index) {
  const original = state.deck.slides[index];
  if (!original) return null;
  
  const duplicate = {
    ...JSON.parse(JSON.stringify(original)),
    id: generateUUID()
  };
  
  state.deck.slides.splice(index + 1, 0, duplicate);
  state.currentSlideIndex = index + 1;
  
  pushHistory(state.deck);
  autoSave();
  return duplicate;
}

/**
 * Move slide
 */
export function moveSlide(fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= state.deck.slides.length) return false;
  if (toIndex < 0 || toIndex >= state.deck.slides.length) return false;
  
  const [slide] = state.deck.slides.splice(fromIndex, 1);
  state.deck.slides.splice(toIndex, 0, slide);
  state.currentSlideIndex = toIndex;
  
  pushHistory(state.deck);
  autoSave();
  return true;
}

/**
 * Push state to history (for undo/redo)
 */
function pushHistory(deck) {
  // Remove any future states if we're not at the end
  state.history = state.history.slice(0, state.historyIndex + 1);
  
  // Add new state
  state.history.push(JSON.parse(JSON.stringify(deck)));
  state.historyIndex = state.history.length - 1;
  
  // Limit history size to 50 states
  if (state.history.length > 50) {
    state.history.shift();
    state.historyIndex--;
  }
}

/**
 * Undo
 */
export function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    state.deck = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
    autoSave();
    return true;
  }
  return false;
}

/**
 * Redo
 */
export function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    state.deck = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
    autoSave();
    return true;
  }
  return false;
}

/**
 * Save to localStorage
 */
export function saveToLocalStorage() {
  try {
    const data = {
      deck: state.deck,
      currentSlideIndex: state.currentSlideIndex,
      timestamp: Date.now()
    };
    localStorage.setItem('lumina_presentation', JSON.stringify(data));
    state.lastSaveTime = Date.now();
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Load from localStorage
 */
export function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('lumina_presentation');
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    if (data.deck && data.deck.slides && data.deck.slides.length > 0) {
      state.currentSlideIndex = data.currentSlideIndex || 0;
      return data.deck;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

/**
 * Clear localStorage
 */
export function clearLocalStorage() {
  localStorage.removeItem('lumina_presentation');
  localStorage.removeItem('lumina_autosave');
}

/**
 * Auto-save (debounced)
 */
let autoSaveTimeout = null;
export function autoSave() {
  if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveToLocalStorage();
  }, 1000);
}

/**
 * Generate UUID for slides
 */
function generateUUID() {
  return 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Export entire state (for debugging)
 */
export function getState() {
  return state;
}

/**
 * Load deck from JSON
 */
export function loadDeckFromJSON(json) {
  try {
    const deck = typeof json === 'string' ? JSON.parse(json) : json;
    
    // Validate deck structure
    if (!deck.slides || !Array.isArray(deck.slides) || deck.slides.length === 0) {
      throw new Error('Invalid deck structure: must have slides array');
    }
    
    state.deck = deck;
    state.currentSlideIndex = 0;
    pushHistory(state.deck);
    autoSave();
    return true;
  } catch (error) {
    console.error('Failed to load deck from JSON:', error);
    return false;
  }
}

/**
 * Export deck to JSON
 */
export function exportDeckToJSON() {
  return JSON.stringify(state.deck, null, 2);
}
