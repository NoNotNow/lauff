// Save and load functionality for the code editor
import { gameState } from './game-state.js';
import { obstacleMaps } from './obstacle-maps.js';

// Get the current map name
function getCurrentMapName() {
  // Find which map matches the current obstacles
  for (const [key, mapData] of Object.entries(obstacleMaps)) {
    if (JSON.stringify(mapData.obstacles) === JSON.stringify(gameState.obstacles)) {
      return key;
    }
  }
  return 'default'; // fallback if no match found
}

export function saveCode() {
  console.log("saveCode function called");
  const codeTextarea = document.getElementById('code');
  if (codeTextarea) {
    const code = codeTextarea.value;
    const mapName = getCurrentMapName();
    console.log("Saving code:", code);
    console.log("Saving code for map:", mapName);
    localStorage.setItem(`savedCode_${mapName}`, code);
    console.log("Code saved to localStorage for map:", mapName);
  } else {
    console.error("Code textarea not found");
  }
}

export function loadCode(mapName = null) {
  console.log("loadCode function called");
  const currentMapName = mapName || getCurrentMapName();
  const savedCode = localStorage.getItem(`savedCode_${currentMapName}`);
  console.log("Retrieved saved code:", savedCode);
  console.log("For map:", currentMapName);
  
  if (savedCode) {
    const codeTextarea = document.getElementById('code');
    if (codeTextarea) {
      codeTextarea.value = savedCode;
      console.log("Code loaded into textarea for map:", currentMapName);
    } else {
      console.error("Code textarea not found");
    }
  } else {
    console.log("No saved code found in localStorage for map:", currentMapName);
    // Set default code if no saved code exists
    const codeTextarea = document.getElementById('code');
    if (codeTextarea && !codeTextarea.value.trim()) {
      codeTextarea.value = 'go();';
    }
  }
}