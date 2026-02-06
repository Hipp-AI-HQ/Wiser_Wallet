/**
 * Format numbers with thousands separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return Math.round(num).toLocaleString('en-US');
}

/**
 * Format currency with 2 decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted currency
 */
function formatCurrency(num) {
  return num.toFixed(2);
}

/**
 * Update the tier indicator progress bar
 * @param {number} spendRatio - Spend-to-rent ratio percentage
 */
function updateTierIndicator(spendRatio) {
  const fillPercent = Math.min(spendRatio, 100); // Cap at 100%
  const tieredFill = document.getElementById('tiered-fill');
  const currentTier = document.getElementById('current-tier');

  // Update fill percentage
  tieredFill.style.width = fillPercent + '%';

  // Update current tier text
  let tierText = '';
  if (spendRatio >= 100) {
    tierText = '100%+ (1.25x on rent)';
  } else if (spendRatio >= 75) {
    tierText = '75%+ (1x on rent)';
  } else if (spendRatio >= 50) {
    tierText = '50%+ (0.75x on rent)';
  } else if (spendRatio >= 25) {
    tierText = '25%+ (0.5x on rent)';
  } else {
    tierText = 'Below 25% (0x on rent)';
  }

  currentTier.textContent = tierText;
}

/**
 * Render Tiered System results
 * @param {object} results - Tiered system calculation results
 */
function renderTieredResults(results) {
  document.getElementById('tiered-rent-points').textContent = formatNumber(results.rentPoints);
  document.getElementById('tiered-spend-points').textContent = formatNumber(results.spendingPoints);
  document.getElementById('tiered-monthly-points').textContent = formatNumber(results.monthlyPoints);
  document.getElementById('tiered-annual-points').textContent = formatNumber(results.annualPoints);

  // Update tier progress indicator
  updateTierIndicator(results.spendRatio);
}

/**
 * Render Bilt Cash System results
 * @param {object} results - Bilt Cash system calculation results
 */
function renderBiltCashResults(results) {
  document.getElementById('biltcash-earned').textContent = `$${formatCurrency(results.biltCashEarned)}`;
  document.getElementById('biltcash-unlocked').textContent = `$${formatNumber(results.unlockedRentAmount)}`;
  document.getElementById('biltcash-rent-points').textContent = formatNumber(results.rentPoints);
  document.getElementById('biltcash-spend-points').textContent = formatNumber(results.spendingPoints);
  document.getElementById('biltcash-monthly-points').textContent = formatNumber(results.monthlyPoints);
  document.getElementById('biltcash-annual-points').textContent = formatNumber(results.annualPoints);
}

/**
 * Highlight the better earning option
 * @param {object} comparison - Comparison results
 */
function highlightBetterOption(comparison) {
  const tieredPanel = document.getElementById('tiered-panel');
  const biltcashPanel = document.getElementById('biltcash-panel');
  const tieredBadge = tieredPanel.querySelector('.winner-badge');
  const biltcashBadge = biltcashPanel.querySelector('.winner-badge');

  // Remove winner/loser classes
  tieredPanel.classList.remove('winner', 'loser');
  biltcashPanel.classList.remove('winner', 'loser');
  tieredBadge.classList.add('hidden');
  biltcashBadge.classList.add('hidden');

  // Apply appropriate classes
  if (comparison.winner === 'tiered') {
    tieredPanel.classList.add('winner');
    biltcashPanel.classList.add('loser');
    tieredBadge.classList.remove('hidden');
  } else if (comparison.winner === 'biltcash') {
    biltcashPanel.classList.add('winner');
    tieredPanel.classList.add('loser');
    biltcashBadge.classList.remove('hidden');
  } else {
    // Tie - no winner/loser styling
    tieredPanel.classList.remove('winner', 'loser');
    biltcashPanel.classList.remove('winner', 'loser');
  }
}

/**
 * Update the recommendation banner
 * @param {object} comparison - Comparison results
 */
function updateRecommendationBanner(comparison) {
  const banner = document.getElementById('recommendation-banner');

  if (comparison.winner === 'tie') {
    banner.textContent = 'Both methods earn the same points for your spending pattern.';
    banner.classList.remove('hidden');
  } else {
    const message = `For your spending pattern, the ${comparison.winnerName} earns ${formatNumber(comparison.pointsDifference)} more points per year (${comparison.percentageBetter}% better).`;
    banner.textContent = message;
    banner.classList.remove('hidden');
  }
}

/**
 * Update slider display value (works with input elements)
 * @param {string} sliderId - ID of the slider element
 * @param {string} displayId - ID of the display element
 * @param {number} value - Value to display
 */
function updateSliderDisplay(sliderId, displayId, value) {
  const display = document.getElementById(displayId);
  display.value = formatNumber(value);
  if (typeof fitTextToBox === 'function') fitTextToBox(display);
}

/**
 * Show or hide the Obsidian category selector
 * @param {boolean} show - Whether to show the selector
 */
function toggleObsidianCategory(show) {
  const obsidianCategory = document.getElementById('obsidian-category');
  if (show) {
    obsidianCategory.classList.remove('hidden');
  } else {
    obsidianCategory.classList.add('hidden');
  }
}

/**
 * Update card button active state
 * @param {string} activeCard - Card type that should be active
 */
function updateCardButtonStates(activeCard) {
  const buttons = document.querySelectorAll('.card-btn');
  buttons.forEach(btn => {
    if (btn.dataset.card === activeCard) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
