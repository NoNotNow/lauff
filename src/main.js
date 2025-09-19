// Main application entry point

import { updateStageView, updateView, drawGrid } from './view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { getStoredSelectedMap, loadCode } from './save-load.js';
import { initRecorder } from './recorder.js';
import { fillMapSelectDropdown } from './obstacle-maps.js';
import { designs } from './designs.js';
import {editor } from './code-editor.js';
import { loadMapFromKey } from './game-state.js';

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
  updateView();
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