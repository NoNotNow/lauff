// Main application entry point

import { updateStageView, updateAvatar, drawGrid } from './stage-effects/view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { getStoredSelectedMap, loadCode } from './data/save-load.js';
import { initRecorder } from './game-state/recorder.js';
import { fillMapSelectDropdown } from './data/blueprints.js';
import { designs } from './design/designs.js';
import {editor } from './code/code-editor.js';
import { stageState } from './game-state/stage-state.js';
import { mode } from './mode.js';

function main() {
  console.log("Main function called");
  designs.init();
  // Initialize mode state from DOM (e.g., body has 'builder' class?)
  mode.initFromDOM();
  // Dynamically populate mapSelect using function from blueprints.js
  const mapSelect = document.getElementById("mapSelect");
  const storedMapKey =  getStoredSelectedMap();
  fillMapSelectDropdown(mapSelect,storedMapKey);

  stageState.loadMapFromKey(storedMapKey);
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