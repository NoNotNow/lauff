// Main application entry point

import { updateStageView, updateView, drawGrid } from './view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { loadCode } from './save-load.js';
import { applyRandomBackground } from './background-manager.js';
import { initRecorder } from './recorder.js';
import { fillMapSelectDropdown } from './obstacle-maps.js';
import { designs } from './designs.js';


function main() {
  console.log("Main function called");
  designs.init();
  // Dynamically populate mapSelect using function from obstacle-maps.js
  const mapSelect = document.getElementById("mapSelect");
  fillMapSelectDropdown(mapSelect);

  // Apply random background on load

  initRecorder();
  console.log("Recorder initialized");
  setupEventListeners();
  console.log("Event listeners set up");
  updateStageView();
  console.log("Stage view updated");
  updateView();
  console.log("View updated");
  drawGrid();

  // Load code for the initially selected map
  if (mapSelect && mapSelect.value) {
    loadCode(mapSelect.value);
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", main);