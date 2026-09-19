# 🌿 NutriSnap — Smart Kitchen Companion & Nutrition Guide

> **Cook smarter with what you have.** NutriSnap is a zero-dependency, client-side web application that turns your fridge ingredients into step-by-step recipes with voice guidance, nutrition insights, and a smart cooking workflow — all in one clean interface.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🍳 **Cook Today** | Browse 12 produce items, search & filter by dietary tags (Vegan, Keto, Quick, etc.), and jump into detailed recipes |
| 📸 **Smart Scanner** | Upload a photo or use your webcam — client-side image classification identifies produce using canvas pixel analysis |
| 🗣️ **Voice-Guided Cooking** | Web Speech API reads each recipe step aloud; hands-free operation while you cook |
| 🎯 **Focus Mode** | Fullscreen distraction-free cooking view with large-text step cards and voice controls |
| 🔄 **Ingredient Substitutions** | Instant swap suggestions for common ingredients (e.g., butter → coconut oil) |
| 📏 **Portion Scaling** | One-tap 1×, 2×, or 4× ingredient scaling for any recipe |
| 🥬 **My Fridge** | Track what produce you have on hand, see expiry-based freshness, and get recipe suggestions |
| 📊 **Nutrition & Health** | USDA-validated nutrition data with mineral comparison bars and bioavailability notes |
| 🛒 **Shopping List** | Add missing ingredients to a persistent shopping list drawer |
| ⏱️ **Cooking Timer** | Built-in countdown timer with audio alert |

---

## 🖥️ Live Demo

**Local:** Clone and open `index.html` in any browser — no build step, no server required.

```bash
# Option 1: Direct open
open index.html

# Option 2: Node.js server (included)
node server.js
# → http://localhost:3000
```

---

## 🏗️ Architecture

```
protofine/
├── index.html              # App shell — 3 tab views, modals, overlays
├── style.css               # Complete design system (CSS Variables, Grid, responsive)
├── script.js               # Application controller — all features & state management
├── imageProcessor.js       # Canvas-based produce classifier (RGB histogram matching)
├── server.js               # Zero-dependency Node.js static server
├── assets/
│   ├── data/
│   │   └── veggies.json    # 12 produce items with USDA nutrition + recipes
│   └── images/
│       └── *.svg           # Vector produce illustrations (fallback assets)
└── README.md
```

### How It Works

1. **Browse or Scan** — Users select produce from the carousel or scan via camera/upload
2. **Image Classification** — `imageProcessor.js` extracts RGB color histograms from uploaded images and computes Euclidean distance against known color signatures to identify produce
3. **Recipe Discovery** — Matched produce reveals 3 tailored recipes with full ingredients and step-by-step instructions
4. **Cook with Guidance** — The cooking companion provides voice narration, portion scaling, ingredient substitutions, and a focused cooking mode
5. **Track & Plan** — Fridge management tracks freshness; nutrition tab compares minerals across produce

---

## 🛠️ Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | Vanilla HTML5, CSS3, ES6+ | Zero dependencies = instant load, no build tooling, trivial deployment |
| **Typography** | Plus Jakarta Sans + JetBrains Mono | Clean modern readability; monospace for nutrition data |
| **Image Analysis** | Canvas 2D API | Client-side pixel sampling — no API keys, no latency, works offline |
| **Voice** | Web Speech API (`speechSynthesis`) | Native browser TTS — no third-party service needed |
| **Camera** | `getUserMedia` API | Direct webcam access for real-time produce scanning |
| **Data** | Static JSON (USDA FoodData Central) | Verified nutrition figures, no backend dependency |
| **Design** | Dark serene palette (`#0c1219`) | Reduces eye strain during cooking; food photos pop against dark backgrounds |

---

## 🎨 Design Decisions

- **Tab-based navigation** (Cook Today / My Fridge / Nutrition & Health) instead of page routing — keeps all features one tap away
- **Horizontal produce carousel** with live search — fast scanning without overwhelming the viewport
- **Spotlight hero card** — when a produce item is selected, a large card with photo, shelf life, and bioavailability notes appears before recipes
- **Dark UI** — designed for kitchen use where screens are often viewed at a distance; high contrast ensures readability
- **No frameworks** — deliberate choice for this project scope; eliminates bundle size, build complexity, and framework-specific knowledge requirements

---

## 🔬 AI Transparency & Data Integrity

> [!IMPORTANT]
> **Honest disclosure:** The image classifier uses client-side canvas pixel analysis with pre-defined color signatures — not a cloud ML model. This is a deliberate engineering decision: for a demo with 12 known produce items, deterministic color matching is more reliable and eliminates API dependencies.

### USDA-Validated Nutrition Data

All mineral and nutrition figures were manually verified against **USDA FoodData Central** (per 100g raw produce). During development, LLM-generated nutrition values were found to contain hallucinated figures (e.g., claiming carrots contain 8.5mg iron/100g when the actual figure is 0.3mg). Every value was cross-referenced and corrected:

| Produce | Iron (mg) | Calcium (mg) | Vitamin C (mg) |
|---|---|---|---|
| Spinach | 2.7 | 99 | 28.1 |
| Bell Pepper | 0.4 | 7 | 127.7 |
| Carrot | 0.3 | 33 | 5.9 |
| Beetroot | 0.8 | 16 | 4.9 |
| Tomato | 0.3 | 10 | 13.7 |
| Pumpkin | 0.8 | 21 | 9.0 |

---

## 🚀 Deployment

### Vercel / Netlify (Recommended)
Drag and drop the project folder into the Vercel or Netlify dashboard. No configuration needed.

```bash
# Or via CLI
npx vercel
```

### GitHub Pages
Enable GitHub Pages in repo settings → Source: `main` branch, root `/`.

### Local Development
```bash
node server.js
# Serves on http://localhost:3000
```

Or simply open `index.html` directly in any modern browser.

---

## 📱 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅ (responsive design with touch-optimized controls)

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">
  Built with 🌿 for the <strong>Protofine Frontend Engineering Internship</strong>
</p>
