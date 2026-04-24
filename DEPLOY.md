# Lumina Presenter - Deployment Instructions

## ⚡ Quick Deploy to GitHub Pages (2 minutes)

### Step 1: Use the Working Version

The zip file contains TWO versions:

1. **`index-working.html`** ← ✅ **USE THIS ONE** (fully functional, 5,355 lines)
2. **`index.html`** ← ⚠️ Modular skeleton (not working yet)

### Step 2: Deploy to GitHub

```bash
# Unzip the file
unzip lumina-presenter.zip
cd lumina-presenter

# Rename the working version to index.html
mv index-working.html index.html

# OR keep both and let users choose
# (index.html as main, keep index-working.html as backup)

# Initialize git (if new repo)
git init
git add .
git commit -m "Initial commit: Lumina Presenter"

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 1-2 minutes

Your site will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

## ✅ Verification

Visit your deployed site and check:
- [ ] Page loads properly
- [ ] You see the editor UI on the left
- [ ] You see the slide preview on the right
- [ ] You can click tabs (Files, Slides, Insert, Design, etc.)
- [ ] You can edit the slide title
- [ ] Preview updates when you make changes
- [ ] You can add blocks
- [ ] You can export HTML/PDF

If ANY of these don't work, you likely deployed the wrong file. Make sure you're using `index-working.html`!

## 🐛 Troubleshooting

### Problem: Blank page on GitHub Pages

**Solution:**
```bash
# Make sure you renamed the file correctly
ls -la index.html

# The file should be 5,355 lines
wc -l index.html

# Should output: 5355 index.html
```

### Problem: Buttons don't work

**Solution:** 
- Open browser console (F12)
- Check for JavaScript errors
- Make sure you deployed `index-working.html` (not `index.html`)

### Problem: Ugly/broken UI

**Solution:** The CSS might not have loaded. Check:
- File is served from the root of your repo
- No file path issues
- Console shows no 404 errors

## 📁 What's in the Zip

```
lumina-presenter/
├── index-working.html       ← ✅ WORKING VERSION (use this!)
├── index.html               ← Modular version (WIP, don't use yet)
├── QUICK_START.md          ← Read this first!
├── README.md               ← Full documentation
├── MIGRATION_GUIDE.md      ← How to modularize (advanced)
├── PROJECT_SUMMARY.md      ← Project status
├── js/                     ← Modular JS (incomplete)
├── css/                    ← Modular CSS (incomplete)
├── build/                  ← Build scripts
├── prompts/                ← AI prompts (empty)
└── server/                 ← Backend (empty)
```

## 🎯 Recommended Approach

### Option A: Simple (Recommended for Now)

1. Use `index-working.html` as your `index.html`
2. Deploy to GitHub Pages
3. Done! ✅

### Option B: Keep Both

1. Deploy `index-working.html` as is
2. Link to it from a landing page
3. Work on modular version separately

### Option C: Full Migration (Advanced)

Follow `MIGRATION_GUIDE.md` to extract code into modules.
Estimated time: 40-60 hours of development work.

## 🚀 Recommended: Just Use the Working Version!

The `index-working.html` file is **production-ready**. It has:

- ✅ Full working editor
- ✅ All features implemented
- ✅ No dependencies (single file)
- ✅ Works on GitHub Pages immediately
- ✅ No build step needed
- ✅ No server required

The modular version is a nice architecture goal, but **don't let perfect be the enemy of good**.

Ship the working version, get users, iterate later!

## 📞 Need Help?

1. Read `QUICK_START.md` for detailed setup
2. Check browser console (F12) for errors
3. Verify you're using `index-working.html`
4. Make sure file is at repo root
5. GitHub Pages can take 1-2 minutes to deploy

## ✨ Success!

Once deployed, you'll have a fully functional HTML presentation generator live on the web!

Features include:
- 🎨 Multiple slide layouts
- 📊 Math equations (MathJax)
- 💻 Code blocks with syntax highlighting
- 🖼️ Image and figure support
- 📥 Import from Markdown/Beamer
- 📤 Export to HTML/PDF
- 🤖 AI Copilot (with your API key)
- 🎬 Build-in/build-out animations
- And much more!

Enjoy your new presentation tool! 🎉
