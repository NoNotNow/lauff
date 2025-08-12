// Main application entry point
import { updateStageView, updateView, drawGrid } from './view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { loadCode } from './save-load.js';

function main() {
  console.log("Main function called");
  setupEventListeners();
  console.log("Event listeners set up");
  updateStageView();
  console.log("Stage view updated");
  updateView();
  console.log("View updated");
  
  // Draw grid after a short delay to ensure stage is rendered
  setTimeout(() => {
    drawGrid();
    console.log("Grid drawn");
  }, 100);
  
  loadCode();
  console.log("Code loaded");
  
  // Redraw grid on window resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      drawGrid();
      console.log("Grid redrawn after resize");
    }, 100);
  });
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", main);