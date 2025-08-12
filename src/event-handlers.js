// Event handling and user interactions
import { go, left, right } from './movement.js';
import { start, stop } from './code-executor.js';

export function setupEventListeners() {
  // Add event listeners to buttons
  document.getElementById("goButton").addEventListener("pointerdown", () => go());
  document.getElementById("leftButton").addEventListener("pointerdown", () => left());
  document.getElementById("rightButton").addEventListener("pointerdown", () => right());
  document.getElementById("startButton").addEventListener("pointerdown", start);
  document.getElementById("stopButton").addEventListener("pointerdown", stop);
}