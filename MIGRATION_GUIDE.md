# Migration Guide: Single-File to Modular Structure

This guide explains how to complete the modularization of your HTML presentation generator.

## ✅ What's Been Done

The project structure has been created with:

1. **Directory structure** following your specified layout
2. **README.md** with comprehensive documentation
3. **JavaScript modules** with ES6 module structure:
   - `main.js` - Application bootstrapper
   - `state.js` - State management (COMPLETE)
   - `renderer.js` - Preview rendering (STARTED)
   - `editor.js` - Content editing (STUB)
   - `animate.js` - Animation system (STUB)
   - `import.js` - Import handlers (STUB)
   - `export.js` - Export handlers (STUB)
   - `copilot.js` - AI integration (STUB)
   - `utils.js` - Utility functions (COMPLETE)

4. **CSS files** separated by concern:
   - `styles.css` - App shell and editor UI
   - `slides.css` - Slide rendering styles
   - `copilot.css` - Copilot panel styles

5. **index.html** - Main HTML shell with module loading
6. **build/bundle.py** - Script to create single-file version

## 🔧 What Needs To Be Done

### Step 1: Extract Remaining JavaScript from Original File

The original `Bun.html` is **5,355 lines**. You need to extract and categorize the JavaScript:

```bash
# View the JavaScript section (starts around line 416)
sed -n '416,5355p' /mnt/user-data/uploads/Bun.html > original_javascript.js
```

Then manually split the functions into appropriate modules:

#### For `renderer.js`:
- `renderPreview()` - Main preview rendering
- `renderSlideHTML()` - Generate slide HTML
- `updatePreview()` - Update preview on changes
- All slide rendering helper functions

#### For `editor.js`:
- `addBlock()`, `editBlock()`, `deleteBlock()`
- `setupFigureEditor()`
- Block type handlers
- Figure placement and editing
- Drawing tools

#### For `animate.js`:
- Animation configuration
- Build-in/build-out logic
- Timeline management
- Animation presets

#### For `import.js`:
- `importFromMarkdown()`
- `importFromBeamer()`
- `importFromJSON()`
- Parsing functions

#### For `export.js`:
- `buildStandaloneViewer()`
- `buildPrintableViewer()`
- `exportPDF()`
- `renderSlideForPdf()`

#### For `copilot.js`:
- API calling logic
- Prompt assembly
- Response parsing
- Chat UI management

### Step 2: Convert to ES6 Modules

For each function, convert from global scope to ES6 exports:

**Before (global):**
```javascript
function renderSlideHTML(slide) {
  // ...
}
```

**After (module):**
```javascript
export function renderSlideHTML(slide) {
  // ...
}
```

**Import dependencies:**
```javascript
import { getCurrentSlide } from './state.js';
import { escapeHtml } from './utils.js';
```

### Step 3: Extract Complete CSS

The original file has CSS in lines 7-414. Extract into the three CSS files:

```bash
# Extract all CSS
sed -n '7,414p' /mnt/user-data/uploads/Bun.html > all_styles.css
```

Then categorize:

**styles.css** should include:
- CSS variables (`:root`)
- `.page`, `.panel`, `.stack`
- `.btn`, `.toolbar`, `.field`
- `.left-tab`, `.subtab`
- All editor UI styles

**slides.css** should include:
- `.slide` and all slide variants
- `.slide-body`, `.rich`, `.placeholder`
- `.preview-frame`, `.preview-scale`
- Beamer theme styles (`.style-*`)

**copilot.css** should include:
- `.copilot-panel`
- `.copilot-status`
- `.copilot-actions`

### Step 4: Create Prompt Templates

Create these files in `prompts/`:

#### `prompts/deck.txt`:
```
You are an AI assistant helping create presentation slides.

Generate a complete deck with {num_slides} slides on the topic: {topic}

Requirements:
- Each slide should have a clear title
- Include appropriate content blocks (paragraphs, lists, code, math)
- Use appropriate slide types (title, single-column, two-column)
- Follow academic presentation best practices

Return JSON format:
{
  "deckTitle": "...",
  "slides": [...]
}
```

#### `prompts/slide.txt`:
```
Generate a single presentation slide.

Topic: {topic}
Slide type: {slideType}

Return JSON format:
{
  "title": "...",
  "slideType": "...",
  "blocks": [...]
}
```

#### `prompts/revise.txt`:
```
Improve the following slide:

{currentSlide}

User request: {userRequest}

Return improved slide in JSON format.
```

#### `prompts/theme.txt`:
```
Restyle the presentation deck with theme: {theme}

Current deck:
{currentDeck}

Return updated deck with new colors, fonts, and styling.
```

### Step 5: Create Backend Server

#### `server/package.json`:
```json
{
  "name": "lumina-presenter-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "openai": "^4.20.0",
    "@anthropic-ai/sdk": "^0.9.0"
  },
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

#### `server/app.js`:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import copilotRouter from './routes/copilot.js';
import deckRouter from './routes/deck.js';
import slideRouter from './routes/slide.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/copilot', copilotRouter);
app.use('/api/deck', deckRouter);
app.use('/api/slide', slideRouter);

app.listen(PORT, () => {
  console.log(`🚀 Lumina Presenter server running on port ${PORT}`);
});
```

#### `server/routes/copilot.js`:
```javascript
import express from 'express';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { messages, provider = 'openai' } = req.body;
    
    if (provider === 'openai') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages
      });
      
      res.json({ response: completion.choices[0].message.content });
    } else if (provider === 'anthropic') {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages
      });
      
      res.json({ response: message.content[0].text });
    }
  } catch (error) {
    console.error('Copilot error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 6: Test the Modular Version

1. **Open index.html directly** in a modern browser
2. **Check the console** for any module loading errors
3. **Test basic functionality**:
   - Can you switch tabs?
   - Does the preview render?
   - Can you edit slide properties?

4. **Start the backend** (if using AI features):
```bash
cd server
npm install
npm start
```

### Step 7: Create Single-File Bundle

Once everything works:

```bash
cd build
python bundle.py
```

This creates `lumina-presenter-bundle.html` with everything inlined.

## 📋 Checklist

- [ ] Extract all JavaScript from original file
- [ ] Categorize functions into appropriate modules
- [ ] Convert to ES6 module syntax
- [ ] Extract all CSS and categorize
- [ ] Test modular version in browser
- [ ] Create prompt templates
- [ ] Set up backend server (optional)
- [ ] Test AI features
- [ ] Generate single-file bundle
- [ ] Compare with original functionality

## 🔍 Debugging Tips

### Module Loading Issues

If modules don't load:
1. Check browser console for errors
2. Ensure all `import` paths are correct
3. Use relative paths (`./module.js` not `module.js`)
4. Serve via HTTP if CORS issues occur

### Missing Functions

If functions are undefined:
1. Check they're exported: `export function myFunc()`
2. Check they're imported: `import { myFunc } from './module.js'`
3. Check circular dependencies

### Styling Issues

If styles don't apply:
1. Check CSS files are linked in index.html
2. Check CSS selector specificity
3. Check for conflicting styles

## 🎯 Priority Order

1. **High Priority** (core functionality):
   - `renderer.js` - Must render slides correctly
   - `state.js` - Already complete
   - `editor.js` - Must edit slide content

2. **Medium Priority** (important features):
   - `export.js` - Must export HTML/PDF
   - `import.js` - Must import JSON/Markdown

3. **Low Priority** (nice to have):
   - `animate.js` - Animations can be added later
   - `copilot.js` - AI features are optional
   - Backend server - Can work without it initially

## 💡 Tips

- Start with the working single file as reference
- Test frequently as you modularize
- Keep the original file as backup
- Use browser DevTools to debug
- Check the console for errors constantly

## 🤝 Need Help?

The structure is in place. The main work is:
1. **Extracting the 5000+ lines of JavaScript** from the original
2. **Categorizing** into the right modules  
3. **Converting** to ES6 syntax
4. **Testing** thoroughly

Good luck with the migration!
