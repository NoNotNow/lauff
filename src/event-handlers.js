// Event handlers for the application
import { go, left, right } from './movement.js';
import { start, stop } from './code-executor.js';
import { saveCode } from './save-load.js';
import { resetPosition } from './game-state.js';
import { updateView, updateStageView } from './view-renderer.js';
import { gameState } from './game-state.js';

function handleReset() {
  resetPosition();
  updateView();
  
  // Clear the code textarea and reset to default
  const codeTextarea = document.getElementById('codeTextarea');
  if (codeTextarea) {
    codeTextarea.value = 'go();';
  }
  
  // Remove saved code from localStorage
  localStorage.removeItem('savedCode');
}

function handleClear() {
  const codeTextarea = document.getElementById('code');
  if (codeTextarea) {
    codeTextarea.value = '';
  }
  
  // Clear error message
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = '';
  }
}

function handleGridClick(event) {
  const canvas = document.getElementById('gridCanvas');
  const stage = document.getElementById('stage');
  
  if (!canvas || !stage) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Calculate grid size in pixels (1em)
  const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
  const gridSize = fontSize;
  
  // Convert pixel coordinates to grid coordinates
  const gridX = Math.floor(x / gridSize);
  const gridY = Math.floor(y / gridSize);
  
  // Check if click is within reasonable grid bounds (be generous)
  if (gridX < 0 || gridX > 25 || gridY < 0 || gridY > 25) {
    return;
  }
  
  // Check if there's already an obstacle at this position
  const existingObstacleIndex = gameState.obstacles.findIndex(
    obstacle => obstacle.x === gridX && obstacle.y === gridY
  );
  
  if (existingObstacleIndex !== -1) {
    // Remove existing obstacle
    gameState.obstacles.splice(existingObstacleIndex, 1);
  } else {
    // Add new obstacle
    gameState.obstacles.push({ x: gridX, y: gridY });
  }
  
  // Update the stage view to reflect changes
  updateStageView();
  
  // Copy obstacle map to clipboard as JSON
  const obstacleJson = JSON.stringify(gameState.obstacles);
  navigator.clipboard.writeText(obstacleJson).then(() => {
    console.log('Obstacle map copied to clipboard:', obstacleJson);
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
  });
}
export function setupEventListeners() {
  // Set up button event listeners
  document.getElementById("goButton").addEventListener("pointerdown", go);
  document.getElementById("leftButton").addEventListener("pointerdown", left);
  document.getElementById("rightButton").addEventListener("pointerdown", right);
  document.getElementById("resetButton").addEventListener("pointerdown", handleReset);
  document.getElementById("startButton").addEventListener("pointerdown", start);
  document.getElementById("stopButton").addEventListener("pointerdown", stop);
  document.getElementById("saveButton").addEventListener("pointerdown", saveCode);
  document.getElementById("clearButton").addEventListener("pointerdown", handleClear);
  
  // Set up grid click handler
  const canvas = document.getElementById('gridCanvas');
  if (canvas) {
    canvas.addEventListener('click', handleGridClick);
  }
}