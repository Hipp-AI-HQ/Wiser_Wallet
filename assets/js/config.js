// Card Configuration Data
const CARD_CONFIGS = {
  blue: {
    name: 'Blue Card',
    annualFee: 0,
    everydayMultiplier: 1,
    description: '1x points on all everyday purchases'
  },
  obsidian: {
    name: 'Obsidian Card',
    annualFee: 95,
    everydayMultiplier: 1,
    categoryMultiplier: 3,
    travelMultiplier: 2,
    description: '3x on dining or grocery, 2x on travel, 1x on other everyday'
  },
  palladium: {
    name: 'Palladium Card',
    annualFee: 495,
    everydayMultiplier: 2,
    description: '2x points on all everyday purchases'
  }
};

// Tiered System Multipliers
const TIERED_THRESHOLDS = [
  { ratio: 100, multiplier: 1.25, label: '100%+' },
  { ratio: 75, multiplier: 1.0, label: '75%' },
  { ratio: 50, multiplier: 0.75, label: '50%' },
  { ratio: 25, multiplier: 0.5, label: '25%' }
];

// Constants
const BILT_CASH_RATE = 0.04; // 4% on everyday spending
const BILT_CASH_UNLOCK_RATIO = 30; // $30 in Bilt Cash = $1,000 rent points
const MONTHS_PER_YEAR = 12;

// Default Input Values
const DEFAULT_MONTHLY_RENT = 2000;
const DEFAULT_MONTHLY_SPEND = 1000;
const DEFAULT_CARD = 'blue';
const DEFAULT_OBSIDIAN_CATEGORY = 'dining';

// Obsidian Category Assumption
// Since we don't have detailed spending breakdown, we assume
// the user spends proportionally across categories.
// For the 3x category, we apply a weighted average.
const OBSIDIAN_CATEGORY_WEIGHT = 0.5; // Assume 50% of spending in 3x category
// This gives: (0.5 * 3) + (0.5 * 1) = 2.0 average multiplier
// But we'll be more conservative and use: (0.33 * 3) + (0.67 * 1) = 1.66
const OBSIDIAN_AVERAGE_MULTIPLIER = 1.66;
