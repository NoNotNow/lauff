// Background gradient presets and management
const backgroundPresets = [
  // Original-style backgrounds (ocean/teal themes)
  'linear-gradient(-45deg, #23a6d5, #23d5ab, #4ecdc4)',
  'linear-gradient(-45deg, #1e90ff, #00ced1, #48d1cc)',
  'linear-gradient(-45deg, #20b2aa, #40e0d0, #5f9ea0)',
  'linear-gradient(-45deg, #4682b4, #87ceeb, #b0e0e6)',
  'linear-gradient(-45deg, #008b8b, #20b2aa, #66cdaa)',
  
  // Warm sunset themes
  'linear-gradient(-45deg, #ff6b6b, #ffa726, #ffcc02)',
  'linear-gradient(-45deg, #ff8a65, #ffab40, #ffd54f)',
  'linear-gradient(-45deg, #f06292, #ff8a65, #ffb74d)',
  'linear-gradient(-45deg, #ff7043, #ffab40, #fff176)',
  
  // Purple/pink themes
  'linear-gradient(-45deg, #9c27b0, #e91e63, #ff5722)',
  'linear-gradient(-45deg, #673ab7, #9c27b0, #e91e63)',
  'linear-gradient(-45deg, #8e24aa, #ab47bc, #ce93d8)',
  'linear-gradient(-45deg, #7b1fa2, #ad1457, #d81b60)',
  
  // Green nature themes
  'linear-gradient(-45deg, #4caf50, #8bc34a, #cddc39)',
  'linear-gradient(-45deg, #2e7d32, #43a047, #66bb6a)',
  'linear-gradient(-45deg, #388e3c, #689f38, #9ccc65)',
  'linear-gradient(-45deg, #1b5e20, #2e7d32, #4caf50)',
  
  // Cool blue themes
  'linear-gradient(-45deg, #2196f3, #03a9f4, #00bcd4)',
  'linear-gradient(-45deg, #1976d2, #1e88e5, #42a5f5)',
  'linear-gradient(-45deg, #0d47a1, #1565c0, #1976d2)'
];

// Function to get a random background
function getRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundPresets.length);
  return backgroundPresets[randomIndex];
}

// Function to apply a random background
export function applyRandomBackground() {
  const randomBackground = getRandomBackground();
  document.body.style.background = randomBackground;
  console.log('Applied background:', randomBackground);
}

export function applyNightModeBackground() {
  document.body.style.background = 'linear-gradient(-45deg, #1e1e1e, #2e2e2e, #3e3e3e)';
  console.log('Applied night mode background');
}

// Function to get all available backgrounds (for potential future use)
export function getAllBackgrounds() {
  return [...backgroundPresets];
}

// Function to apply a specific background by index
export function applyBackgroundByIndex(index) {
  if (index >= 0 && index < backgroundPresets.length) {
    document.body.style.background = backgroundPresets[index];
    console.log('Applied background by index:', index, backgroundPresets[index]);
  } else {
    console.warn('Invalid background index:', index);
  }
}