# Lumina Presenter

A powerful, modular HTML-based presentation generator with AI-powered copilot features.

## Features

- 🎨 Beautiful, customizable slide templates
- 📊 Support for math (MathJax), code blocks, diagrams
- 🤖 AI Copilot for generating and improving slides
- 🎬 Animation system with build-in/build-out effects
- 📦 Export to standalone HTML or PDF
- 📝 Import from Markdown, Beamer LaTeX, or JSON
- 🎯 Interactive figure placement and editing
- 🖼️ Rich media support (images, SVG, iframe embeds)
- 💾 Auto-save and persistence

## Project Structure

```
/lumina-presenter
│   index.html              # Main HTML shell
│   README.md               # This file
│
├── css/
│   ├── styles.css          # App shell + editor UI
│   ├── slides.css          # Slide rendering styles
│   └── copilot.css         # Chat/copilot panel styling
│
├── js/
│   ├── main.js             # App bootstrapper
│   ├── state.js            # Deck state, autosave, persistence
│   ├── renderer.js         # Preview + exported slide rendering
│   ├── editor.js           # Blocks, figures, drawing tools
│   ├── animate.js          # Build-in/build-out logic
│   ├── import.js           # Markdown / Beamer / JSON / asset import
│   ├── export.js           # Standalone HTML / PDF helpers
│   ├── copilot.js          # Chat UI, prompt assembly, command dispatch
│   └── utils.js            # Shared utilities
│
├── prompts/
│   ├── deck.txt            # System prompt for "make a whole deck"
│   ├── slide.txt           # System prompt for "make one slide"
│   ├── revise.txt          # System prompt for "improve this slide"
│   └── theme.txt           # System prompt for "restyle this deck"
│
├── server/
│   ├── app.js              # Backend proxy to OpenAI/Claude/Gemini
│   └── routes/
│       ├── copilot.js      # /api/copilot/chat
│       ├── deck.js         # /api/copilot/deck
│       └── slide.js        # /api/copilot/slide
│
└── build/
    └── bundle.py           # Script to create single-file version
```

## Quick Start

### Development Mode

1. Open `index.html` directly in a browser (no build step required)
2. All JavaScript modules are loaded via ES6 imports
3. Optionally run the backend server for AI features:

```bash
cd server
npm install
npm start
```

### Using AI Features

Set up your API keys in the Copilot tab:
- OpenAI API key for GPT-4
- Anthropic API key for Claude
- Google API key for Gemini

Or configure the backend server with environment variables:

```bash
export OPENAI_API_KEY=your_key_here
export ANTHROPIC_API_KEY=your_key_here
```

### Building Single-File Version

To create a standalone single-file HTML (like the original):

```bash
cd build
python bundle.py
```

This will generate `lumina-presenter-bundle.html` with all CSS and JS inlined.

## Usage

### Creating Slides

1. **Manual Editing**: Use the "Slides" tab to edit slide content, layout, and styling
2. **Templates**: Use the "Insert" tab to add pre-built slide templates
3. **AI Generation**: Use the "Copilot" tab to generate slides with AI

### Organizing Content

- **Slide Rail**: Quick navigation between slides at the bottom of the left panel
- **Organize Tab**: Reorder, duplicate, or delete slides
- **Preview**: Real-time preview on the right side

### Exporting

1. **Standalone HTML**: Export self-contained HTML file
2. **PDF**: Export via browser print or html2canvas
3. **JSON**: Save deck as JSON for version control

### Importing

- **Markdown**: Paste markdown and convert to slides
- **Beamer LaTeX**: Import LaTeX beamer presentations
- **JSON**: Load previously saved decks

## Customization

### Themes

Built-in themes include:
- Classic (default)
- Stanford
- Berkeley
- MIT
- Cambridge
- Pittsburgh
- And more...

### Custom Styles

Edit CSS variables in `css/slides.css`:

```css
:root {
  --slide-bg: #ffffff;
  --slide-text: #111111;
  --accent: #61b4ff;
  --radius: 22px;
}
```

## Architecture

### State Management

All deck state is managed in `state.js`:
- Slides array
- Current slide index
- Undo/redo history
- Auto-save to localStorage

### Rendering Pipeline

1. **State** → JSON representation of deck
2. **Renderer** → Converts JSON to HTML DOM
3. **Preview** → Scaled viewport with interactive elements
4. **Export** → Static HTML or PDF generation

### AI Integration

- **Frontend**: Copilot UI in `copilot.js`
- **Backend**: Proxy server in `server/app.js`
- **Prompts**: System prompts in `prompts/` directory

## Browser Support

- Modern browsers with ES6 module support
- Chrome/Edge 90+
- Firefox 89+
- Safari 15+

## Dependencies

### Frontend

- MathJax 3 (loaded from CDN)
- html2canvas (for PDF export)
- jsPDF (for PDF generation)

### Backend

- Express.js
- Node.js 18+
- OpenAI SDK / Anthropic SDK

## Development

### Running Locally

No build step needed! Just open `index.html` in your browser.

### Backend Development

```bash
cd server
npm install
npm run dev  # Uses nodemon for auto-reload
```

### Testing

```bash
# Frontend (open in browser)
open index.html

# Backend
cd server
npm test
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Built with ❤️ using modern web technologies and AI assistance.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
