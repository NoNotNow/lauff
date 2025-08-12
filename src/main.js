// Main application entry point
import { updateStageView, updateView } from './view-renderer.js';
import { setupEventListeners } from './event-handlers.js';
import { loadCode } from './save-load.js';

function main() {
  setupEventListeners();
  updateStageView();
  updateView();
  loadCode();
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", main);