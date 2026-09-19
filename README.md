# NutriSnap — Snap Produce, Discover Dishes & Mineral Power

> Pitch page & interactive prototype for a frontend internship application targeting health-tech and nutrition product decision-makers.

---

## 📌 Project Overview

**NutriSnap** bridges the gap between raw fridge ingredients, culinary inspiration, and nutrition awareness. By photographing a vegetable, users receive:
1. **Instant Dish Ideas**: 3 real, tailored recipes to eliminate food waste.
2. **Mineral Benchmarking**: Horizontal bar chart comparing key minerals (Iron, Calcium, Vitamin C) against smart vegetable alternatives.

This site is built as a zero-dependency static pitch page designed to load in under a second and communicate core product value in ~30 seconds.

---

## 🛠️ Tech Stack & Key Decisions

- **Framework-free**: Plain HTML5, CSS3 (CSS Variables & Grid), and Vanilla JavaScript (ES6+).
- **Zero Build Step**: Runs directly via any static Web Server or by opening `index.html` in browser. Fully deployable to Vercel, Netlify, or GitHub Pages.
- **Design Tokens**: Warm food-grounded palette featuring Deep Vegetable Green (`#1b3b2b`), Warm Tomato Red (`#d9381e`), and Soft Warm Neutral background (`#fdfbf7`).
- **Accessibility & Motion**: Fully keyboard-navigable (`tabindex="0"`, Enter/Space trigger handlers), ARIA labels, and `prefers-reduced-motion` compliance.

---

## 💡 Important Transparency Note: Preset Demo Data vs. Vision ML

> [!IMPORTANT]
> This prototype uses a preset set of **6 real vegetables** (Tomato, Spinach, Carrot, Beetroot, Pumpkin, Bell Pepper) with real USDA nutrition data stored in `assets/data/veggies.json`. It does **not** call a live computer vision or machine learning API.
> 
> **Why?** A production version would swap the thumbnail selection trigger for a vision model endpoint (`POST /api/v1/classify-image`). For a 30-second pitch demo, utilizing high-quality preset assets eliminates latency, removes API key friction, and guarantees 100% reliable execution.

---

## ⚠️ AI Failure Story: Hallucinated Mineral Values

When prompting LLMs for raw nutrition values, models frequently hallucinate plausible-sounding but completely inaccurate figures (e.g., claiming raw carrots contain 8.5mg of iron per 100g, or tomatoes contain 150mg of calcium). 

During development, we caught this vulnerability and audited all mineral figures against official **USDA FoodData Central** figures per 100g raw produce:
- **Spinach**: 2.7 mg Iron, 99 mg Calcium, 28.1 mg Vitamin C
- **Bell Pepper**: 0.4 mg Iron, 7 mg Calcium, 127.7 mg Vitamin C
- **Carrot**: 0.3 mg Iron, 33 mg Calcium, 5.9 mg Vitamin C
- **Beetroot**: 0.8 mg Iron, 16 mg Calcium, 4.9 mg Vitamin C
- **Tomato**: 0.3 mg Iron, 10 mg Calcium, 13.7 mg Vitamin C
- **Pumpkin**: 0.8 mg Iron, 21 mg Calcium, 9.0 mg Vitamin C

---

## 🎯 Target Decision-Maker & Strategic Pitch Choice

- **Target Audience**: Product Lead in Health-Tech or Nutrition Platforms.
- **Key Design Choice**: Leading with **Mineral Benchmarking** rather than just recipe search. Skeptical health-tech leaders see hundreds of recipe search tools; highlighting micronutrient visibility directly targets consumer health outcomes and meal planning differentiation.

---

## 🚀 Deployment Instructions

### Deploy to Vercel / Netlify
1. Drag and drop the root project folder into Vercel or Netlify web dashboard.
2. Or run CLI:
   ```bash
   npx vercel
   ```

### Local Testing
Simply open `index.html` in any modern web browser or serve static files:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
