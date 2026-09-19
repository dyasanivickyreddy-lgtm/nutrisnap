/**
 * NutriSnap - Smart Kitchen Companion & Nutrition Engine
 * Fast, neat, intuitive client-side application.
 */

document.addEventListener('DOMContentLoaded', () => {
  let veggiesData = {};
  let currentKey = 'spinach';
  let compareKey = 'broccoli';
  let activeTab = 'cook';
  let activeDietFilter = 'all';
  let nutritionPortion = 100; // grams
  let recipePortionScale = 1; // 1x, 2x, 4x
  
  // User Fridge / Crisper state
  let fridgeItems = ['spinach', 'tomato', 'bell_pepper', 'carrot'];
  let selectedFridgeForFusion = [];

  // Shopping list state
  let shoppingList = [];

  // Active cooking companion state
  let currentRecipe = null;
  let focusStepIndex = 0;
  let timerInterval = null;
  let timerSeconds = 600;
  let isTimerRunning = false;
  let speechSynth = window.speechSynthesis || null;

  // WebCam Stream state
  let webcamStream = null;

  // Common Substitutions Map
  const substitutions = {
    'paneer': 'Tofu or Halloumi Cheese',
    'feta': 'Goat Cheese or Crumbled Tofu',
    'butter': 'Olive Oil or Avocado Oil',
    'cream': 'Coconut Cream or Cashew Puree',
    'spinach': 'Baby Kale or Swiss Chard',
    'eggs': 'Flax Egg (1 tbsp flax + 3 tbsp water)',
    'chickpeas': 'Cannellini or White Beans',
    'mozzarella': 'Provolone or Vegan Cheese'
  };

  // DOM References
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabViews = document.querySelectorAll('.tab-view');
  const brandHomeBtn = document.getElementById('brandHomeBtn');
  const navFridgeCount = document.getElementById('navFridgeCount');

  // Produce Carousel & Spotlight
  const produceCarousel = document.getElementById('produceCarousel');
  const produceSearchInput = document.getElementById('produceSearchInput');
  const spotlightImage = document.getElementById('spotlightImage');
  const spotlightCategory = document.getElementById('spotlightCategory');
  const spotlightShelfLife = document.getElementById('spotlightShelfLife');
  const spotlightHealthScore = document.getElementById('spotlightHealthScore');
  const spotlightName = document.getElementById('spotlightName');
  const spotlightTagline = document.getElementById('spotlightTagline');
  const spotlightBioTip = document.getElementById('spotlightBioTip');
  const spotlightCookBtn = document.getElementById('spotlightCookBtn');
  const spotlightAddToFridgeBtn = document.getElementById('spotlightAddToFridgeBtn');

  // Recipes Section
  const recipesGrid = document.getElementById('recipesGrid');
  const dietaryFilterPills = document.getElementById('dietaryFilterPills');

  // Fridge Section
  const fridgeGrid = document.getElementById('fridgeGrid');
  const fusionPromptCard = document.getElementById('fusionPromptCard');
  const fusionStatusText = document.getElementById('fusionStatusText');
  const findFusionRecipesBtn = document.getElementById('findFusionRecipesBtn');
  const openAddFridgeModalBtn = document.getElementById('openAddFridgeModalBtn');

  // Nutrition Section
  const nutritionPortionSlider = document.getElementById('nutritionPortionSlider');
  const nutritionPortionBadge = document.getElementById('nutritionPortionBadge');
  const macroCaloriesVal = document.getElementById('macroCaloriesVal');
  const macroProteinVal = document.getElementById('macroProteinVal');
  const macroCarbsVal = document.getElementById('macroCarbsVal');
  const macroFatVal = document.getElementById('macroFatVal');
  const nutritionMicrosList = document.getElementById('nutritionMicrosList');
  const nutritionCompareSelect = document.getElementById('nutritionCompareSelect');
  const nutritionCompareContainer = document.getElementById('nutritionCompareContainer');

  // Scanner Modal
  const openScannerModalBtn = document.getElementById('openScannerModalBtn');
  const scannerModal = document.getElementById('scannerModal');
  const closeScannerModalBtn = document.getElementById('closeScannerModalBtn');
  const tabUploadTrigger = document.getElementById('tabUploadTrigger');
  const tabWebcamTrigger = document.getElementById('tabWebcamTrigger');
  const uploadBodyPanel = document.getElementById('uploadBodyPanel');
  const webcamBodyPanel = document.getElementById('webcamBodyPanel');
  const modalDropzone = document.getElementById('modalDropzone');
  const modalFileInput = document.getElementById('modalFileInput');
  const webcamStreamVideo = document.getElementById('webcamStreamVideo');
  const captureWebcamBtn = document.getElementById('captureWebcamBtn');
  const hiddenProcessingCanvas = document.getElementById('hiddenProcessingCanvas');

  // Cooking Companion Modal
  const cookingModal = document.getElementById('cookingModal');
  const closeCookingModalBtn = document.getElementById('closeCookingModalBtn');
  const cookingTagsRow = document.getElementById('cookingTagsRow');
  const cookingRecipeTitle = document.getElementById('cookingRecipeTitle');
  const cookingRecipeMeta = document.getElementById('cookingRecipeMeta');
  const cookingIngredientsList = document.getElementById('cookingIngredientsList');
  const cookingStepsList = document.getElementById('cookingStepsList');
  const cookingTimerDigits = document.getElementById('cookingTimerDigits');
  const cookingTimerStart = document.getElementById('cookingTimerStart');
  const cookingTimerPause = document.getElementById('cookingTimerPause');
  const cookingTimerReset = document.getElementById('cookingTimerReset');
  const cookingReadAllBtn = document.getElementById('cookingReadAllBtn');
  const addAllToCartBtn = document.getElementById('addAllToCartBtn');
  const enterFocusModeBtn = document.getElementById('enterFocusModeBtn');

  // Fullscreen Focus Mode
  const focusModeScreen = document.getElementById('focusModeScreen');
  const exitFocusModeBtn = document.getElementById('exitFocusModeBtn');
  const focusRecipeTitle = document.getElementById('focusRecipeTitle');
  const focusStepIndicator = document.getElementById('focusStepIndicator');
  const focusStepInstruction = document.getElementById('focusStepInstruction');
  const focusPrevStepBtn = document.getElementById('focusPrevStepBtn');
  const focusNextStepBtn = document.getElementById('focusNextStepBtn');
  const focusSpeakStepBtn = document.getElementById('focusSpeakStepBtn');

  // Shopping Drawer
  const openShoppingBtn = document.getElementById('openShoppingBtn');
  const shoppingDrawerOverlay = document.getElementById('shoppingDrawerOverlay');
  const closeShoppingDrawerBtn = document.getElementById('closeShoppingDrawerBtn');
  const shoppingListContainer = document.getElementById('shoppingListContainer');
  const copyShoppingListBtn = document.getElementById('copyShoppingListBtn');
  const clearShoppingListBtn = document.getElementById('clearShoppingListBtn');
  const cartDot = document.getElementById('cartDot');

  // Load Produce Database
  fetch('assets/data/veggies.json')
    .then(r => r.json())
    .then(data => {
      veggiesData = data;
      initApp();
    })
    .catch(err => console.error('Error loading veggies.json:', err));

  function initApp() {
    setupTabNavigation();
    renderProduceCarousel();
    setupSearchFilter();
    setupDietaryFilters();
    setupSpotlightActions();
    setupFridgeView();
    setupNutritionControls();
    setupScannerModal();
    setupCookingCompanion();
    setupFocusMode();
    setupShoppingDrawer();

    // Select initial produce
    selectProduce(currentKey);
    updateFridgeCount();
  }

  /* ==================== NAVIGATION & TABS ==================== */
  function setupTabNavigation() {
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    if (brandHomeBtn) {
      brandHomeBtn.addEventListener('click', () => switchTab('cook'));
    }
  }

  function switchTab(tabName) {
    activeTab = tabName;
    navTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
    tabViews.forEach(v => v.classList.toggle('active', v.id === `tab${capitalize(tabName)}`));

    if (tabName === 'fridge') renderFridgeItems();
    if (tabName === 'nutrition') renderNutritionTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ==================== PRODUCE CAROUSEL & SEARCH ==================== */
  function renderProduceCarousel(filterText = '') {
    const keys = Object.keys(veggiesData);
    const filteredKeys = filterText
      ? keys.filter(k => veggiesData[k].name.toLowerCase().includes(filterText.toLowerCase()))
      : keys;

    produceCarousel.innerHTML = filteredKeys.map(key => {
      const item = veggiesData[key];
      const isActive = key === currentKey;
      return `
        <div class="produce-chip-card ${isActive ? 'active' : ''}" data-key="${key}">
          <img src="${item.photoUrl}" alt="${item.name}" loading="lazy">
          <div class="produce-chip-name">${item.name}</div>
        </div>
      `;
    }).join('');

    produceCarousel.querySelectorAll('.produce-chip-card').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-key');
        selectProduce(key);
      });
    });
  }

  function setupSearchFilter() {
    if (produceSearchInput) {
      produceSearchInput.addEventListener('input', (e) => {
        renderProduceCarousel(e.target.value.trim());
      });
    }
  }

  /* ==================== ACTIVE PRODUCE SELECTION & SPOTLIGHT ==================== */
  function selectProduce(key) {
    if (!veggiesData[key]) return;
    currentKey = key;

    // Update active state in carousel
    produceCarousel.querySelectorAll('.produce-chip-card').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-key') === key);
    });

    const item = veggiesData[key];

    // Spotlight elements
    spotlightImage.src = item.photoUrl;
    spotlightCategory.textContent = item.category || 'Fresh Produce';
    spotlightShelfLife.textContent = `⏰ Fresh for ~${item.shelfLifeDays || 7} Days`;
    
    // Nutrient Density Score calculation (estimated 85-99 based on micros)
    const score = Math.min(99, Math.round(85 + ((item.minerals.vitaminC || 10) * 0.08) + ((item.minerals.potassium || 200) * 0.015)));
    spotlightHealthScore.textContent = `⭐ ${score}/100 Nutrient Score`;

    spotlightName.textContent = item.name;
    spotlightTagline.textContent = item.tagline;
    spotlightBioTip.textContent = item.bioavailabilityNote || 'Combines valuable dietary fiber with bioavailable micronutrients.';

    // Render corresponding recipes
    renderRecipes();

    // If on nutrition tab, re-render
    if (activeTab === 'nutrition') renderNutritionTab();
  }

  function setupSpotlightActions() {
    if (spotlightCookBtn) {
      spotlightCookBtn.addEventListener('click', () => {
        const recipesSec = document.getElementById('recipesSection');
        if (recipesSec) recipesSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (spotlightAddToFridgeBtn) {
      spotlightAddToFridgeBtn.addEventListener('click', () => {
        if (!fridgeItems.includes(currentKey)) {
          fridgeItems.push(currentKey);
          updateFridgeCount();
          showToast(`Saved ${veggiesData[currentKey].name} to My Fridge!`);
        } else {
          showToast(`${veggiesData[currentKey].name} is already in your fridge.`);
        }
      });
    }
  }

  /* ==================== RECIPES & DIETARY FILTERS ==================== */
  function setupDietaryFilters() {
    if (!dietaryFilterPills) return;
    dietaryFilterPills.querySelectorAll('.diet-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        dietaryFilterPills.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeDietFilter = pill.getAttribute('data-filter');
        renderRecipes();
      });
    });
  }

  function renderRecipes() {
    const item = veggiesData[currentKey];
    if (!item || !item.dishes) return;

    let dishes = item.dishes;

    if (activeDietFilter !== 'all') {
      dishes = dishes.filter(d => d.dietaryTags && d.dietaryTags.includes(activeDietFilter));
    }

    if (dishes.length === 0) {
      recipesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          No recipes found for "${activeDietFilter}". Showing all ${item.name} dishes instead.
        </div>
      `;
      dishes = item.dishes;
    }

    recipesGrid.innerHTML = dishes.map(dish => `
      <div class="recipe-hero-card" data-dish-id="${dish.id}">
        <div class="recipe-card-banner">
          <img src="${dish.photoUrl || item.photoUrl}" alt="${dish.title}" loading="lazy">
        </div>
        <div class="recipe-card-body">
          <div class="recipe-card-tags">
            ${(dish.dietaryTags || []).map(t => `<span class="tag-mini-pill">${t}</span>`).join('')}
          </div>
          <h4 class="recipe-card-heading">${dish.title}</h4>
          <div class="recipe-card-meta-line">
            <span>⏱️ ${dish.time} • 📊 ${dish.difficulty}</span>
            <span class="btn-card-start">Start Cooking ➔</span>
          </div>
        </div>
      </div>
    `).join('');

    recipesGrid.querySelectorAll('.recipe-hero-card').forEach(card => {
      card.addEventListener('click', () => {
        const dishId = card.getAttribute('data-dish-id');
        const found = item.dishes.find(d => d.id === dishId);
        if (found) openCookingModal(found);
      });
    });
  }

  /* ==================== FRIDGE / CRISPER DRAWER ==================== */
  function setupFridgeView() {
    if (openAddFridgeModalBtn) {
      openAddFridgeModalBtn.addEventListener('click', () => {
        switchTab('cook');
        showToast('Choose any produce above to save it to your fridge.');
      });
    }

    if (findFusionRecipesBtn) {
      findFusionRecipesBtn.addEventListener('click', () => {
        if (selectedFridgeForFusion.length > 0) {
          selectProduce(selectedFridgeForFusion[0]);
          switchTab('cook');
          showToast(`Displaying recipes matching your fridge ingredients!`);
        }
      });
    }
  }

  function renderFridgeItems() {
    fridgeGrid.innerHTML = fridgeItems.map(key => {
      const item = veggiesData[key];
      if (!item) return '';

      const isSelected = selectedFridgeForFusion.includes(key);

      return `
        <div class="fridge-item-card ${isSelected ? 'selected' : ''}" data-key="${key}">
          <img src="${item.photoUrl}" alt="${item.name}" class="fridge-item-img">
          <div class="fridge-item-content">
            <div class="fridge-item-top">
              <span class="fridge-item-title">${item.name}</span>
              <input type="checkbox" class="fusion-chk" data-key="${key}" ${isSelected ? 'checked' : ''}>
            </div>
            <div class="fridge-expiry-badge">⏰ Fresh for ~${item.shelfLifeDays || 7} Days</div>
            <div class="fridge-action-row">
              <button class="btn-secondary-sm cook-fridge-btn" data-key="${key}" style="flex: 1;">🍳 Cook</button>
              <button class="btn-secondary-sm remove-fridge-btn" data-key="${key}" style="color: var(--accent-rose);">✕</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Events
    fridgeGrid.querySelectorAll('.cook-fridge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-key');
        selectProduce(key);
        switchTab('cook');
      });
    });

    fridgeGrid.querySelectorAll('.remove-fridge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-key');
        fridgeItems = fridgeItems.filter(k => k !== key);
        selectedFridgeForFusion = selectedFridgeForFusion.filter(k => k !== key);
        updateFridgeCount();
        renderFridgeItems();
        showToast(`Removed from fridge.`);
      });
    });

    fridgeGrid.querySelectorAll('.fusion-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const key = chk.getAttribute('data-key');
        if (chk.checked) {
          if (!selectedFridgeForFusion.includes(key)) selectedFridgeForFusion.push(key);
        } else {
          selectedFridgeForFusion = selectedFridgeForFusion.filter(k => k !== key);
        }
        updateFusionBanner();
      });
    });

    updateFusionBanner();
  }

  function updateFusionBanner() {
    if (selectedFridgeForFusion.length >= 2) {
      const names = selectedFridgeForFusion.map(k => veggiesData[k]?.name).filter(Boolean).join(' + ');
      fusionStatusText.textContent = `Ready to combine: ${names}`;
      findFusionRecipesBtn.style.display = 'inline-flex';
    } else {
      fusionStatusText.textContent = 'Select 2 or more ingredients below to find combination recipes.';
      findFusionRecipesBtn.style.display = 'none';
    }
  }

  function updateFridgeCount() {
    if (navFridgeCount) navFridgeCount.textContent = fridgeItems.length;
  }

  /* ==================== NUTRITION & HEALTH DEEP-DIVE ==================== */
  function setupNutritionControls() {
    if (nutritionPortionSlider) {
      nutritionPortionSlider.addEventListener('input', (e) => {
        nutritionPortion = parseInt(e.target.value, 10);
        nutritionPortionBadge.textContent = `${nutritionPortion}g`;
        renderNutritionTab();
      });
    }

    if (nutritionCompareSelect) {
      nutritionCompareSelect.addEventListener('change', (e) => {
        compareKey = e.target.value;
        renderComparisonBars();
      });
    }
  }

  function renderNutritionTab() {
    const item = veggiesData[currentKey];
    if (!item) return;

    const factor = nutritionPortion / 100.0;

    // Macros
    macroCaloriesVal.textContent = Math.round(item.macros.calories * factor);
    macroProteinVal.textContent = `${(item.macros.protein * factor).toFixed(1)}g`;
    macroCarbsVal.textContent = `${(item.macros.carbs * factor).toFixed(1)}g`;
    macroFatVal.textContent = `${(item.macros.fat * factor).toFixed(1)}g`;

    // Micros Bars
    const micros = [
      { key: 'vitaminC', name: 'Vitamin C', unit: 'mg', daily: 90 },
      { key: 'iron', name: 'Iron', unit: 'mg', daily: 18 },
      { key: 'potassium', name: 'Potassium', unit: 'mg', daily: 3400 },
      { key: 'calcium', name: 'Calcium', unit: 'mg', daily: 1000 },
      { key: 'fiber', name: 'Dietary Fiber', unit: 'g', daily: 28 },
      { key: 'magnesium', name: 'Magnesium', unit: 'mg', daily: 420 }
    ];

    nutritionMicrosList.innerHTML = micros.map(m => {
      const val = ((item.minerals[m.key] || 0) * factor).toFixed(1);
      const percentRda = Math.min(100, Math.round((val / m.daily) * 100));

      return `
        <div class="micro-bar-item">
          <div class="micro-bar-labels">
            <span>${m.name}</span>
            <span style="color: var(--accent-emerald); font-family: var(--font-mono);">${val}${m.unit} (${percentRda}% Daily Value)</span>
          </div>
          <div class="micro-bar-track">
            <div class="micro-bar-fill" style="width: ${percentRda}%"></div>
          </div>
        </div>
      `;
    }).join('');

    // Benchmark Selector Options
    nutritionCompareSelect.innerHTML = Object.keys(veggiesData).map(k => `
      <option value="${k}" ${k === compareKey ? 'selected' : ''}>${veggiesData[k].name}</option>
    `).join('');

    renderComparisonBars();
  }

  function renderComparisonBars() {
    const itemA = veggiesData[currentKey];
    const itemB = veggiesData[compareKey];
    if (!itemA || !itemB) return;

    const factor = nutritionPortion / 100.0;
    const benchmarks = [
      { key: 'vitaminC', name: 'Vitamin C', unit: 'mg' },
      { key: 'iron', name: 'Iron', unit: 'mg' },
      { key: 'potassium', name: 'Potassium', unit: 'mg' },
      { key: 'calcium', name: 'Calcium', unit: 'mg' }
    ];

    nutritionCompareContainer.innerHTML = benchmarks.map(b => {
      const valA = ((itemA.minerals[b.key] || 0) * factor).toFixed(1);
      const valB = ((itemB.minerals[b.key] || 0) * factor).toFixed(1);
      const maxVal = Math.max(parseFloat(valA), parseFloat(valB), 0.1);

      const percentA = Math.round((valA / maxVal) * 100);
      const percentB = Math.round((valB / maxVal) * 100);

      return `
        <div class="micro-bar-item">
          <div class="micro-bar-labels">
            <span>${b.name}</span>
            <span style="font-size: 0.82rem;">
              <strong style="color: var(--accent-emerald);">${itemA.name}: ${valA}${b.unit}</strong> vs 
              <span style="color: var(--accent-cyan);">${itemB.name}: ${valB}${b.unit}</span>
            </span>
          </div>
          <div class="micro-bar-track" style="display: flex; gap: 2px;">
            <div style="width: ${percentA}%; background: var(--accent-emerald); height: 100%; border-radius: 4px;"></div>
            <div style="width: ${percentB}%; background: var(--accent-cyan); height: 100%; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==================== SCANNER & WEBCAM MODAL ==================== */
  function setupScannerModal() {
    if (openScannerModalBtn) {
      openScannerModalBtn.addEventListener('click', () => {
        scannerModal.classList.add('active');
        switchScannerTab('upload');
      });
    }

    if (closeScannerModalBtn) {
      closeScannerModalBtn.addEventListener('click', closeScannerModal);
    }

    if (tabUploadTrigger) {
      tabUploadTrigger.addEventListener('click', () => switchScannerTab('upload'));
    }

    if (tabWebcamTrigger) {
      tabWebcamTrigger.addEventListener('click', () => switchScannerTab('webcam'));
    }

    // Dropzone
    if (modalDropzone && modalFileInput) {
      modalDropzone.addEventListener('click', () => modalFileInput.click());

      modalFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) processScannerFile(e.target.files[0]);
      });

      modalDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        modalDropzone.style.borderColor = 'var(--accent-emerald)';
      });

      modalDropzone.addEventListener('dragleave', () => {
        modalDropzone.style.borderColor = 'var(--border-highlight)';
      });

      modalDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        modalDropzone.style.borderColor = 'var(--border-highlight)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processScannerFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (captureWebcamBtn) {
      captureWebcamBtn.addEventListener('click', snapWebcam);
    }
  }

  function switchScannerTab(tab) {
    if (tab === 'upload') {
      tabUploadTrigger.classList.add('active');
      tabWebcamTrigger.classList.remove('active');
      uploadBodyPanel.classList.add('active');
      webcamBodyPanel.classList.remove('active');
      stopWebcam();
    } else {
      tabWebcamTrigger.classList.add('active');
      tabUploadTrigger.classList.remove('active');
      webcamBodyPanel.classList.add('active');
      uploadBodyPanel.classList.remove('active');
      startWebcam();
    }
  }

  function startWebcam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('WebCam is not supported in this browser.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        webcamStream = stream;
        webcamStreamVideo.srcObject = stream;
      })
      .catch(err => {
        console.error('Camera access error:', err);
        showToast('Camera access blocked. You can upload a photo instead.');
        switchScannerTab('upload');
      });
  }

  function stopWebcam() {
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
      webcamStream = null;
    }
  }

  function closeScannerModal() {
    stopWebcam();
    scannerModal.classList.remove('active');
  }

  function processScannerFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid photo file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      classifyAndApply(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function snapWebcam() {
    if (!webcamStreamVideo) return;
    const canvas = hiddenProcessingCanvas;
    canvas.width = webcamStreamVideo.videoWidth || 400;
    canvas.height = webcamStreamVideo.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamStreamVideo, 0, 0, canvas.width, canvas.height);

    classifyAndApply(canvas.toDataURL('image/jpeg'));
  }

  function classifyAndApply(dataUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;

    img.onload = () => {
      const result = window.NutriImageProcessor.analyzeImage(img, hiddenProcessingCanvas, veggiesData);
      if (result && result.matchedKey) {
        closeScannerModal();
        selectProduce(result.matchedKey);
        showToast(`Identified ${veggiesData[result.matchedKey].name} (${result.confidence}% Match)!`);
      }
    };
  }

  /* ==================== COOKING COMPANION MODAL ==================== */
  function setupCookingCompanion() {
    if (closeCookingModalBtn) {
      closeCookingModalBtn.addEventListener('click', closeCookingModal);
    }

    if (cookingModal) {
      cookingModal.addEventListener('click', (e) => {
        if (e.target === cookingModal) closeCookingModal();
      });
    }

    // Servings Scaler Buttons (1x, 2x, 4x)
    document.querySelectorAll('.portion-scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.portion-scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        recipePortionScale = parseInt(btn.getAttribute('data-scale'), 10) || 1;
        if (currentRecipe) renderModalIngredientsAndSteps();
      });
    });

    // Step Timer
    if (cookingTimerStart) cookingTimerStart.addEventListener('click', startTimer);
    if (cookingTimerPause) cookingTimerPause.addEventListener('click', pauseTimer);
    if (cookingTimerReset) cookingTimerReset.addEventListener('click', resetTimer);

    // Read Aloud
    if (cookingReadAllBtn) {
      cookingReadAllBtn.addEventListener('click', () => {
        if (!currentRecipe) return;
        const text = `${currentRecipe.title}. Ingredients: ${currentRecipe.ingredients.join(', ')}. Steps: ${currentRecipe.steps.join('. ')}`;
        speakText(text);
      });
    }

    // Add ingredients to shopping cart
    if (addAllToCartBtn) {
      addAllToCartBtn.addEventListener('click', () => {
        if (!currentRecipe) return;
        currentRecipe.ingredients.forEach(ing => {
          const scaled = scaleIngredient(ing, recipePortionScale);
          if (!shoppingList.includes(scaled)) shoppingList.push(scaled);
        });
        updateShoppingListUI();
        showToast(`Added ${currentRecipe.ingredients.length} ingredients to Shopping List!`);
      });
    }

    // Enter Fullscreen Focus Mode
    if (enterFocusModeBtn) {
      enterFocusModeBtn.addEventListener('click', () => {
        if (currentRecipe) openFocusMode();
      });
    }
  }

  function openCookingModal(dish) {
    currentRecipe = dish;
    recipePortionScale = 1;
    document.querySelectorAll('.portion-scale-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.portion-scale-btn[data-scale="1"]')?.classList.add('active');

    // Header info
    cookingTagsRow.innerHTML = (dish.dietaryTags || []).map(t => `<span class="tag-mini-pill">${t}</span>`).join('');
    cookingRecipeTitle.textContent = dish.title;
    cookingRecipeMeta.textContent = `⏱️ ${dish.time} • 📊 ${dish.difficulty}`;

    renderModalIngredientsAndSteps();

    // Reset Timer to dish time
    const mins = parseInt(dish.time, 10) || 10;
    timerSeconds = mins * 60;
    updateTimerDisplay();

    cookingModal.classList.add('active');
  }

  function renderModalIngredientsAndSteps() {
    if (!currentRecipe) return;

    // Ingredients
    cookingIngredientsList.innerHTML = currentRecipe.ingredients.map(ing => {
      const scaled = scaleIngredient(ing, recipePortionScale);
      const sub = findSubstitute(ing);
      return `
        <label class="ingredient-row">
          <input type="checkbox">
          <div>
            <span>${scaled}</span>
            ${sub ? `<span class="sub-tag">💡 Substitute: ${sub}</span>` : ''}
          </div>
        </label>
      `;
    }).join('');

    // Steps
    cookingStepsList.innerHTML = currentRecipe.steps.map((step, idx) => `
      <div class="step-card-box">
        <div class="step-card-box-header">
          <span class="step-num-badge">STEP ${idx + 1}</span>
          <button class="btn-step-speak" data-step="${step}">🔊 Read</button>
        </div>
        <div>${step}</div>
      </div>
    `).join('');

    cookingStepsList.querySelectorAll('.btn-step-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        speakText(btn.getAttribute('data-step'));
      });
    });
  }

  function scaleIngredient(text, multiplier) {
    if (multiplier === 1) return text;
    return text.replace(/(\d+)/g, match => parseInt(match, 10) * multiplier);
  }

  function findSubstitute(ing) {
    const low = ing.toLowerCase();
    for (let key in substitutions) {
      if (low.includes(key)) return substitutions[key];
    }
    return null;
  }

  function closeCookingModal() {
    cookingModal.classList.remove('active');
    pauseTimer();
    stopSpeech();
  }

  /* ==================== FULLSCREEN FOCUS MODE ==================== */
  function setupFocusMode() {
    if (exitFocusModeBtn) exitFocusModeBtn.addEventListener('click', closeFocusMode);

    if (focusPrevStepBtn) {
      focusPrevStepBtn.addEventListener('click', () => {
        if (focusStepIndex > 0) {
          focusStepIndex--;
          renderFocusStep();
        }
      });
    }

    if (focusNextStepBtn) {
      focusNextStepBtn.addEventListener('click', () => {
        if (currentRecipe && focusStepIndex < currentRecipe.steps.length - 1) {
          focusStepIndex++;
          renderFocusStep();
        } else {
          showToast('🎉 Recipe completed! Bon appétit!');
          closeFocusMode();
        }
      });
    }

    if (focusSpeakStepBtn) {
      focusSpeakStepBtn.addEventListener('click', () => {
        if (currentRecipe) speakText(currentRecipe.steps[focusStepIndex]);
      });
    }
  }

  function openFocusMode() {
    focusStepIndex = 0;
    focusRecipeTitle.textContent = currentRecipe.title;
    renderFocusStep();
    focusModeScreen.classList.add('active');
  }

  function renderFocusStep() {
    if (!currentRecipe) return;
    focusStepIndicator.textContent = `STEP ${focusStepIndex + 1} OF ${currentRecipe.steps.length}`;
    focusStepInstruction.textContent = currentRecipe.steps[focusStepIndex];
    speakText(`Step ${focusStepIndex + 1}: ${currentRecipe.steps[focusStepIndex]}`);
  }

  function closeFocusMode() {
    focusModeScreen.classList.remove('active');
    stopSpeech();
  }

  /* ==================== SPEECH SYNTHESIS ==================== */
  function speakText(text) {
    if (!speechSynth) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    speechSynth.speak(u);
    showToast('🔊 Reading step...');
  }

  function stopSpeech() {
    if (speechSynth && speechSynth.speaking) speechSynth.cancel();
  }

  /* ==================== COOKING TIMER ==================== */
  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        pauseTimer();
        speakText('Your cooking step timer is complete!');
        showToast('🔔 Timer Finished!');
      }
    }, 1000);
  }

  function pauseTimer() {
    isTimerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    const mins = currentRecipe ? (parseInt(currentRecipe.time, 10) || 10) : 10;
    timerSeconds = mins * 60;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    cookingTimerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /* ==================== SHOPPING LIST DRAWER ==================== */
  function setupShoppingDrawer() {
    if (openShoppingBtn) {
      openShoppingBtn.addEventListener('click', () => {
        shoppingDrawerOverlay.classList.add('active');
      });
    }

    if (closeShoppingDrawerBtn) {
      closeShoppingDrawerBtn.addEventListener('click', () => {
        shoppingDrawerOverlay.classList.remove('active');
      });
    }

    if (shoppingDrawerOverlay) {
      shoppingDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === shoppingDrawerOverlay) shoppingDrawerOverlay.classList.remove('active');
      });
    }

    if (clearShoppingListBtn) {
      clearShoppingListBtn.addEventListener('click', () => {
        shoppingList = [];
        updateShoppingListUI();
        showToast('Shopping list cleared.');
      });
    }

    if (copyShoppingListBtn) {
      copyShoppingListBtn.addEventListener('click', () => {
        if (shoppingList.length === 0) return;
        navigator.clipboard.writeText(shoppingList.map(i => `• ${i}`).join('\n'))
          .then(() => showToast('Copied shopping list to clipboard!'));
      });
    }
  }

  function updateShoppingListUI() {
    if (cartDot) cartDot.style.display = shoppingList.length > 0 ? 'block' : 'none';

    if (shoppingList.length === 0) {
      shoppingListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          🛒 Your shopping list is empty. Add ingredients from any recipe!
        </div>
      `;
      return;
    }

    shoppingListContainer.innerHTML = shoppingList.map((item, idx) => `
      <div class="drawer-item-row">
        <input type="checkbox">
        <span>${item}</span>
      </div>
    `).join('');
  }

  /* ==================== TOAST NOTIFICATIONS ==================== */
  function showToast(message) {
    const rack = document.getElementById('toastRack');
    if (!rack) return;

    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    toast.textContent = message;
    rack.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

});
