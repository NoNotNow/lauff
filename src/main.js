// Main application entry point

import { updateStageView, updateAvatar, drawGrid } from './stage-effects/view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { getStoredSelectedMap, loadCode } from './data/save-load.js';
import { initRecorder } from './game-state/recorder.js';
import { fillMapSelectDropdown } from './data/obstacle-maps.js';
import { designs } from './design/designs.js';
import {editor } from './code/code-editor.js';
import { loadMapFromKey } from './game-state/game-state.js';

function main() {
  console.log("Main function called");
  designs.init();
  // Dynamically populate mapSelect using function from obstacle-maps.js
  const mapSelect = document.getElementById("mapSelect");
  const storedMapKey =  getStoredSelectedMap();
  fillMapSelectDropdown(mapSelect,storedMapKey);
  loadMapFromKey(storedMapKey);



  initRecorder();
  console.log("Recorder initialized");
  setupEventListeners();
  console.log("Event listeners set up");
  updateStageView();
  console.log("Stage view updated");
  updateAvatar();
  console.log("View updated");
  drawGrid();
  editor.init(designs.isNightMode);

  // Load code for the initially selected map
  if (mapSelect && mapSelect.value) {
    loadCode(mapSelect.value);
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", main);