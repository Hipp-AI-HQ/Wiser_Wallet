/**
 * Calculate points earned using the Tiered System
 * @param {number} monthlyRent - Monthly rent/mortgage payment
 * @param {number} monthlySpending - Monthly everyday spending
 * @param {number} cardMultiplier - Card's everyday spending multiplier
 * @param {number} annualFee - Card's annual fee
 * @returns {object} Tiered system results
 */
function calculateTieredSystem(monthlyRent, monthlySpending, cardMultiplier, annualFee) {
  // Handle edge case: no rent
  if (monthlyRent === 0) {
    return {
      spendRatio: 0,
      rentMultiplier: 0,
      rentPoints: 0,
      spendingPoints: monthlySpending * cardMultiplier,
      monthlyPoints: monthlySpending * cardMultiplier,
      annualPoints: (monthlySpending * cardMultiplier) * MONTHS_PER_YEAR,
      netAnnualPoints: ((monthlySpending * cardMultiplier) * MONTHS_PER_YEAR) - annualFee,
      tierLevel: 'None',
      message: 'Cannot calculate tier without rent/mortgage'
    };
  }

  // Calculate spend-to-rent ratio
  const spendRatio = (monthlySpending / monthlyRent) * 100;

  // Determine rent multiplier based on spend ratio
  let rentMultiplier = 0;
  let tierLevel = 'No Tier';

  if (spendRatio >= 100) {
    rentMultiplier = 1.25;
    tierLevel = '100%+ (1.25x)';
  } else if (spendRatio >= 75) {
    rentMultiplier = 1.0;
    tierLevel = '75%+ (1x)';
  } else if (spendRatio >= 50) {
    rentMultiplier = 0.75;
    tierLevel = '50%+ (0.75x)';
  } else if (spendRatio >= 25) {
    rentMultiplier = 0.5;
    tierLevel = '25%+ (0.5x)';
  } else {
    rentMultiplier = 0;
    tierLevel = 'Below 25% (0x)';
  }

  // Calculate points
  const rentPoints = monthlyRent * rentMultiplier;
  const spendingPoints = monthlySpending * cardMultiplier;
  const monthlyPoints = rentPoints + spendingPoints;
  const annualPoints = monthlyPoints * MONTHS_PER_YEAR;
  const netAnnualPoints = annualPoints - annualFee;

  return {
    spendRatio,
    rentMultiplier,
    rentPoints,
    spendingPoints,
    monthlyPoints,
    annualPoints,
    netAnnualPoints,
    tierLevel,
    message: `Spend ${spendRatio.toFixed(1)}% of rent to reach tier ${tierLevel}`
  };
}

/**
 * Calculate points earned using the Bilt Cash System
 * @param {number} monthlyRent - Monthly rent/mortgage payment
 * @param {number} monthlySpending - Monthly everyday spending
 * @param {number} cardMultiplier - Card's everyday spending multiplier
 * @param {number} annualFee - Card's annual fee
 * @returns {object} Bilt Cash system results
 */
function calculateBiltCashSystem(monthlyRent, monthlySpending, cardMultiplier, annualFee) {
  // Calculate Bilt Cash earned (4% on spending)
  const biltCashEarned = monthlySpending * BILT_CASH_RATE;

  // Calculate unlocked rent amount
  // $30 in Bilt Cash = $1,000 rent eligible for 1x points
  const rentBenitsPerThousand = 1; // 1 point per $1,000 of rent
  const biltCashNeededPer1000Rent = BILT_CASH_UNLOCK_RATIO; // $30

  const maxUnlockedRent = (biltCashEarned / biltCashNeededPer1000Rent) * 1000;
  const unlockedRentAmount = Math.min(maxUnlockedRent, monthlyRent);
  const unlockedPercentage = monthlyRent > 0 ? (unlockedRentAmount / monthlyRent) * 100 : 0;

  // Calculate points
  const rentPoints = unlockedRentAmount * rentBenitsPerThousand; // 1x on unlocked portion
  const spendingPoints = monthlySpending * cardMultiplier;
  const monthlyPoints = rentPoints + spendingPoints;
  const annualPoints = monthlyPoints * MONTHS_PER_YEAR;
  const netAnnualPoints = annualPoints - annualFee;

  return {
    biltCashEarned,
    unlockedRentAmount,
    unlockedPercentage,
    rentPoints,
    spendingPoints,
    monthlyPoints,
    annualPoints,
    netAnnualPoints,
    message: `Earning $${biltCashEarned.toFixed(2)} in Bilt Cash unlocks $${unlockedRentAmount.toFixed(0)} in rent`
  };
}

/**
 * Compare two calculation methods and determine which is better
 * @param {object} tieredResults - Results from tiered system
 * @param {object} biltCashResults - Results from Bilt Cash system
 * @returns {object} Comparison results
 */
function compareMethods(tieredResults, biltCashResults) {
  const tieredPoints = tieredResults.netAnnualPoints;
  const biltCashPoints = biltCashResults.netAnnualPoints;

  if (tieredPoints > biltCashPoints) {
    return {
      winner: 'tiered',
      winnerName: 'Tiered System',
      pointsDifference: Math.round(tieredPoints - biltCashPoints),
      percentageBetter: ((tieredPoints / biltCashPoints - 1) * 100).toFixed(1)
    };
  } else if (biltCashPoints > tieredPoints) {
    return {
      winner: 'biltcash',
      winnerName: 'Bilt Cash System',
      pointsDifference: Math.round(biltCashPoints - tieredPoints),
      percentageBetter: ((biltCashPoints / tieredPoints - 1) * 100).toFixed(1)
    };
  } else {
    return {
      winner: 'tie',
      winnerName: 'Tie',
      pointsDifference: 0,
      percentageBetter: '0'
    };
  }
}

/**
 * Get card's everyday spending multiplier, handling Obsidian's category bonus
 * @param {string} card - Card type ('blue', 'obsidian', 'palladium')
 * @param {string} obsidianCategory - Selected category for Obsidian ('dining' or 'grocery')
 * @returns {number} Effective everyday spending multiplier
 */
function getCardMultiplier(card, obsidianCategory = 'dining') {
  const cardConfig = CARD_CONFIGS[card];

  if (card === 'obsidian') {
    // For Obsidian: Use weighted average since we don't have spending breakdown
    // Assume ~33% of spending in 3x category, ~67% in 1x category
    // This gives: (0.33 * 3) + (0.67 * 1) = 1.66 average
    return OBSIDIAN_AVERAGE_MULTIPLIER;
  }

  return cardConfig.everydayMultiplier;
}

/**
 * Run full calculation for a given card and input values
 * @param {string} card - Card type
 * @param {number} monthlyRent - Monthly rent/mortgage
 * @param {number} monthlySpending - Monthly everyday spending
 * @param {string} obsidianCategory - Obsidian category selection
 * @returns {object} Full calculation results
 */
function runFullCalculation(card, monthlyRent, monthlySpending, obsidianCategory = 'dining') {
  const cardConfig = CARD_CONFIGS[card];
  const cardMultiplier = getCardMultiplier(card, obsidianCategory);

  const tieredResults = calculateTieredSystem(
    monthlyRent,
    monthlySpending,
    cardMultiplier,
    cardConfig.annualFee
  );

  const biltCashResults = calculateBiltCashSystem(
    monthlyRent,
    monthlySpending,
    cardMultiplier,
    cardConfig.annualFee
  );

  const comparison = compareMethods(tieredResults, biltCashResults);

  return {
    card,
    cardConfig,
    monthlyRent,
    monthlySpending,
    cardMultiplier,
    tieredResults,
    biltCashResults,
    comparison
  };
}
