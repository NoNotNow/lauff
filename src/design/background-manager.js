// Background gradient presets and management
// Each preset has a speaking name and the corresponding CSS string
export const backgroundPresets = [
  // Original-style backgrounds (ocean/teal themes)
  { name: 'Deep Ocean', css: 'linear-gradient(-45deg, #1e3c72, #2a5298, #4facfe)' },
  { name: 'Teal Breeze', css: 'linear-gradient(-45deg, #134e5e, #71b280, #b2fefa)' },
  { name: 'Midnight Coast', css: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364)' },
  { name: 'Blue Horizon', css: 'linear-gradient(-45deg, #004e92, #000428, #004e92)' },

  // Warm sunset themes
  { name: 'Sunset Glow', css: 'linear-gradient(-45deg, #ff6b6b, #ffa726, #ffcc02)' },
  { name: 'Warm Ember', css: 'linear-gradient(-45deg, #ff8a65, #ffab40, #ffd54f)' },
  { name: 'Rose Gold', css: 'linear-gradient(-45deg, #f06292, #ff8a65, #ffb74d)' },
  { name: 'Golden Hour', css: 'linear-gradient(-45deg, #ff7043, #ffab40, #fff176)' },
  
  // Purple/pink themes
  { name: 'Neon Dusk', css: 'linear-gradient(-45deg, #9c27b0, #e91e63, #ff5722)' },
  { name: 'Purple Haze', css: 'linear-gradient(-45deg, #673ab7, #9c27b0, #e91e63)' },
  { name: 'Lavender Dream', css: 'linear-gradient(-45deg, #8e24aa, #ab47bc, #ce93d8)' },
  { name: 'Magenta Night', css: 'linear-gradient(-45deg, #7b1fa2, #ad1457, #d81b60)' },
  
  // Green nature themes
  { name: 'Fresh Meadow', css: 'linear-gradient(-45deg, #4caf50, #8bc34a, #cddc39)' },
  { name: 'Forest Trail', css: 'linear-gradient(-45deg, #2e7d32, #43a047, #66bb6a)' },
  { name: 'Spring Leaf', css: 'linear-gradient(-45deg, #388e3c, #689f38, #9ccc65)' },
  { name: 'Evergreen', css: 'linear-gradient(-45deg, #1b5e20, #2e7d32, #4caf50)' },
  
  // Cool blue themes
  { name: 'Skyline', css: 'linear-gradient(-45deg, #2196f3, #03a9f4, #00bcd4)' },
  { name: 'Azure Flow', css: 'linear-gradient(-45deg, #1976d2, #1e88e5, #42a5f5)' },
  { name: 'Deep Blue', css: 'linear-gradient(-45deg, #0d47a1, #1565c0, #1976d2)' }
];

// Function to get a random background
function getRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundPresets.length);
  return backgroundPresets[randomIndex];
}

// Function to apply a random background
export function applyRandomBackground() {
  const preset = getRandomBackground();
  const css = typeof preset === 'string' ? preset : preset.css;
  document.body.style.background = css;
  console.log('Applied background:', css);
}

export function applyNightModeBackground() {
  document.body.style.background = 'linear-gradient(-45deg, #1e1e1e, #2e2e2e, #3e3e3e)';
  console.log('Applied night mode background');
}

