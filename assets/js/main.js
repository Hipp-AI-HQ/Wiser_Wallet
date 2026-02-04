// State Management
let appState = {
  selectedCard: DEFAULT_CARD,
  monthlyRent: DEFAULT_MONTHLY_RENT,
  monthlySpending: DEFAULT_MONTHLY_SPEND,
  obsidianCategory: DEFAULT_OBSIDIAN_CATEGORY
};

/**
 * Initialize the calculator
 */
function initializeCalculator() {
  setupEventListeners();
  updateCalculations();
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

  // Obsidian category toggle
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', handleCategoryChange);
  });
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

  // Recalculate
  updateCalculations();
}

/**
 * Handle rent/mortgage input
 * @param {event} e - Input event
 */
function handleRentInput(e) {
  appState.monthlyRent = parseFloat(e.target.value);
  updateSliderDisplay('rent-slider', 'rent-value', appState.monthlyRent);
  updateCalculations();
}

/**
 * Handle spending input
 * @param {event} e - Input event
 */
function handleSpendingInput(e) {
  appState.monthlySpending = parseFloat(e.target.value);
  updateSliderDisplay('spend-slider', 'spend-value', appState.monthlySpending);
  updateCalculations();
}

/**
 * Handle Obsidian category selection change
 * @param {event} e - Change event
 */
function handleCategoryChange(e) {
  appState.obsidianCategory = e.target.value;
  updateCalculations();
}

/**
 * Main calculation update function
 * Runs all calculations and updates UI
 */
function updateCalculations() {
  // Run full calculation
  const results = runFullCalculation(
    appState.selectedCard,
    appState.monthlyRent,
    appState.monthlySpending,
    appState.obsidianCategory
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
