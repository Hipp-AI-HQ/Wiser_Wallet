// State Management
let appState = {
  selectedCard: DEFAULT_CARD,
  monthlyRent: DEFAULT_MONTHLY_RENT,
  monthlySpending: DEFAULT_MONTHLY_SPEND,
  // Obsidian spending breakdown
  obsidianDining: Math.round(DEFAULT_MONTHLY_SPEND * 0.33),
  obsidianTravel: Math.round(DEFAULT_MONTHLY_SPEND * 0.33),
  obsidianEveryday: DEFAULT_MONTHLY_SPEND - Math.round(DEFAULT_MONTHLY_SPEND * 0.33) * 2
};

/**
 * Initialize the calculator
 */
function initializeCalculator() {
  setupEventListeners();
  updateCalculations();

  // Set initial slider track fills
  updateSliderTrackFill(document.getElementById('rent-slider'));
  updateSliderTrackFill(document.getElementById('spend-slider'));

  // Auto-size all inputs on load
  fitAllInputs();
}

/**
 * Update the --slider-value CSS variable for track fill color
 * @param {HTMLElement} slider - The range input element
 */
function updateSliderTrackFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  const percentage = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--slider-value', percentage + '%');
}

/**
 * Parse a formatted currency string like "2,500" into a number
 * @param {string} str - Currency string to parse
 * @returns {number} Parsed number
 */
function parseCurrencyInput(str) {
  const cleaned = str.replace(/[^0-9.]/g, '');
  return Math.round(parseFloat(cleaned)) || 0;
}

/**
 * Shrink font size to fit larger numbers inside fixed-width gray box.
 * Box is sized for 4-digit numbers (e.g. "2,000"). Larger values shrink.
 * @param {HTMLElement} input - The text input element
 */
function fitTextToBox(input) {
  const len = (input.value || '').length;
  const isSub = input.classList.contains('sub-value');
  const baseSize = isSub ? 1.5 : 2.25; // rem — matches CSS

  if (len <= 5) {
    input.style.fontSize = '';           // full size: "2,000"
  } else if (len <= 6) {
    input.style.fontSize = (baseSize * 0.92) + 'rem';  // "10,000"
  } else {
    input.style.fontSize = (baseSize * 0.82) + 'rem';  // "100,000"
  }
}

/**
 * Fit text in all currency inputs on the page
 */
function fitAllInputs() {
  document.querySelectorAll('.value-input').forEach(fitTextToBox);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Card selection buttons
  document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', handleCardSelection);
  });

  // Rent slider
  const rentSlider = document.getElementById('rent-slider');
  rentSlider.addEventListener('input', handleRentInput);

  // Spending slider
  const spendSlider = document.getElementById('spend-slider');
  spendSlider.addEventListener('input', handleSpendingInput);

  // Rent text input
  const rentInput = document.getElementById('rent-value');
  rentInput.addEventListener('input', handleRentTextInput);
  rentInput.addEventListener('blur', handleRentTextBlur);

  // Spending text input
  const spendInput = document.getElementById('spend-value');
  spendInput.addEventListener('input', handleSpendTextInput);
  spendInput.addEventListener('blur', handleSpendTextBlur);

  // Obsidian dining slider + text input
  const diningSlider = document.getElementById('obsidian-dining-slider');
  const diningInput = document.getElementById('obsidian-dining-value');
  if (diningSlider) {
    diningSlider.addEventListener('input', handleObsidianDiningSlider);
    diningInput.addEventListener('input', handleObsidianDiningText);
    diningInput.addEventListener('blur', handleObsidianDiningBlur);
  }

  // Obsidian travel slider + text input
  const travelSlider = document.getElementById('obsidian-travel-slider');
  const travelInput = document.getElementById('obsidian-travel-value');
  if (travelSlider) {
    travelSlider.addEventListener('input', handleObsidianTravelSlider);
    travelInput.addEventListener('input', handleObsidianTravelText);
    travelInput.addEventListener('blur', handleObsidianTravelBlur);
  }
}

/**
 * Handle card selection
 * @param {event} e - Click event
 */
function handleCardSelection(e) {
  const selectedCard = e.currentTarget.dataset.card;
  appState.selectedCard = selectedCard;

  // Update UI
  updateCardButtonStates(selectedCard);
  toggleObsidianCategory(selectedCard === 'obsidian');

  // Update spending label based on card type
  const spendLabel = document.getElementById('spend-label');
  spendLabel.textContent = selectedCard === 'obsidian' ? 'Monthly Spending' : 'Monthly Everyday Spending';

  if (selectedCard === 'obsidian') {
    enforceObsidianConstraints();
    syncObsidianBreakdownUI();
  }

  // Recalculate
  updateCalculations();
}

/**
 * Handle rent/mortgage slider input
 * @param {event} e - Input event
 */
function handleRentInput(e) {
  appState.monthlyRent = parseFloat(e.target.value);
  updateSliderDisplay('rent-slider', 'rent-value', appState.monthlyRent);
  updateSliderTrackFill(e.target);
  updateCalculations();
}

/**
 * Handle rent text input
 * @param {event} e - Input event
 */
function handleRentTextInput(e) {
  const rawValue = parseCurrencyInput(e.target.value);
  const clamped = Math.min(Math.max(rawValue, 0), 100000);
  appState.monthlyRent = clamped;

  // Sync slider position (capped at slider's max of 10k)
  const slider = document.getElementById('rent-slider');
  slider.value = Math.min(clamped, 10000);
  updateSliderTrackFill(slider);
  fitTextToBox(e.target);
  updateCalculations();
}

/**
 * On blur, reformat the rent input with commas
 */
function handleRentTextBlur(e) {
  e.target.value = formatNumber(appState.monthlyRent);
  fitTextToBox(e.target);
}

/**
 * Handle spending slider input
 * @param {event} e - Input event
 */
function handleSpendingInput(e) {
  appState.monthlySpending = parseFloat(e.target.value);
  updateSliderDisplay('spend-slider', 'spend-value', appState.monthlySpending);
  updateSliderTrackFill(e.target);
  rescaleObsidianBreakdown();
  updateCalculations();
}

/**
 * Handle spending text input
 * @param {event} e - Input event
 */
function handleSpendTextInput(e) {
  const rawValue = parseCurrencyInput(e.target.value);
  const clamped = Math.min(Math.max(rawValue, 0), 100000);
  appState.monthlySpending = clamped;

  // Sync slider position (capped at slider's max of 10k)
  const slider = document.getElementById('spend-slider');
  slider.value = Math.min(clamped, 10000);
  updateSliderTrackFill(slider);
  fitTextToBox(e.target);
  rescaleObsidianBreakdown();
  updateCalculations();
}

/**
 * On blur, reformat the spending input with commas
 */
function handleSpendTextBlur(e) {
  e.target.value = formatNumber(appState.monthlySpending);
  fitTextToBox(e.target);
}

/**
 * Proportionally rescale obsidian breakdown when total spending changes
 */
function rescaleObsidianBreakdown() {
  const oldTotal = appState.obsidianDining + appState.obsidianTravel + appState.obsidianEveryday;
  if (oldTotal > 0) {
    const ratio = appState.monthlySpending / oldTotal;
    appState.obsidianDining = Math.round(appState.obsidianDining * ratio);
    appState.obsidianTravel = Math.round(appState.obsidianTravel * ratio);
  } else {
    appState.obsidianDining = Math.round(appState.monthlySpending * 0.33);
    appState.obsidianTravel = Math.round(appState.monthlySpending * 0.33);
  }
  enforceObsidianConstraints();
  if (appState.selectedCard === 'obsidian') {
    syncObsidianBreakdownUI();
  }
}

/**
 * Enforce constraints: dining + travel cannot exceed totalSpending.
 * Everyday is always the remainder.
 */
function enforceObsidianConstraints() {
  const total = appState.monthlySpending;

  // Clamp dining to [0, total]
  appState.obsidianDining = Math.min(Math.max(appState.obsidianDining, 0), total);

  // Clamp travel to [0, total - dining]
  const remainingAfterDining = total - appState.obsidianDining;
  appState.obsidianTravel = Math.min(Math.max(appState.obsidianTravel, 0), remainingAfterDining);

  // Everyday is the remainder
  appState.obsidianEveryday = Math.max(total - appState.obsidianDining - appState.obsidianTravel, 0);
}

/**
 * Sync all obsidian sub-UI elements with current state
 */
function syncObsidianBreakdownUI() {
  const total = appState.monthlySpending;

  // Update slider max values
  const diningSlider = document.getElementById('obsidian-dining-slider');
  const travelSlider = document.getElementById('obsidian-travel-slider');

  if (!diningSlider || !travelSlider) return;

  diningSlider.max = total;
  travelSlider.max = Math.max(total - appState.obsidianDining, 0);

  // Update slider positions
  diningSlider.value = appState.obsidianDining;
  travelSlider.value = appState.obsidianTravel;

  // Update text inputs
  const diningInput = document.getElementById('obsidian-dining-value');
  const travelInput = document.getElementById('obsidian-travel-value');
  diningInput.value = formatNumber(appState.obsidianDining);
  travelInput.value = formatNumber(appState.obsidianTravel);
  fitTextToBox(diningInput);
  fitTextToBox(travelInput);

  // Update everyday display
  document.getElementById('obsidian-everyday-value').textContent = formatNumber(appState.obsidianEveryday);

  // Update everyday visual bar
  const everydayFill = document.getElementById('obsidian-everyday-fill');
  const everydayPct = total > 0 ? (appState.obsidianEveryday / total) * 100 : 0;
  everydayFill.style.width = everydayPct + '%';

  // Update track fills for sub-sliders
  updateSliderTrackFill(diningSlider);
  updateSliderTrackFill(travelSlider);
}

// Obsidian Dining Handlers
function handleObsidianDiningSlider(e) {
  appState.obsidianDining = parseFloat(e.target.value);
  enforceObsidianConstraints();
  syncObsidianBreakdownUI();
  updateCalculations();
}

function handleObsidianDiningText(e) {
  const rawValue = parseCurrencyInput(e.target.value);
  appState.obsidianDining = Math.min(Math.max(rawValue, 0), 100000);
  enforceObsidianConstraints();
  syncObsidianBreakdownUI();
  fitTextToBox(e.target);
  updateCalculations();
}

function handleObsidianDiningBlur(e) {
  e.target.value = formatNumber(appState.obsidianDining);
  fitTextToBox(e.target);
}

// Obsidian Travel Handlers
function handleObsidianTravelSlider(e) {
  appState.obsidianTravel = parseFloat(e.target.value);
  enforceObsidianConstraints();
  syncObsidianBreakdownUI();
  updateCalculations();
}

function handleObsidianTravelText(e) {
  const rawValue = parseCurrencyInput(e.target.value);
  appState.obsidianTravel = Math.min(Math.max(rawValue, 0), 100000);
  enforceObsidianConstraints();
  syncObsidianBreakdownUI();
  fitTextToBox(e.target);
  updateCalculations();
}

function handleObsidianTravelBlur(e) {
  e.target.value = formatNumber(appState.obsidianTravel);
  fitTextToBox(e.target);
}

/**
 * Main calculation update function
 * Runs all calculations and updates UI
 */
function updateCalculations() {
  // Build obsidian breakdown object
  const obsidianBreakdown = {
    dining: appState.obsidianDining,
    travel: appState.obsidianTravel,
    everyday: appState.obsidianEveryday
  };

  // Run full calculation
  const results = runFullCalculation(
    appState.selectedCard,
    appState.monthlyRent,
    appState.monthlySpending,
    obsidianBreakdown
  );

  // Update UI with results
  renderTieredResults(results.tieredResults);
  renderBiltCashResults(results.biltCashResults);
  highlightBetterOption(results.comparison);
  updateRecommendationBanner(results.comparison);
}

/**
 * Initialize on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', initializeCalculator);
