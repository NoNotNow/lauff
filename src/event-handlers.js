// Event handlers for the application
import { go, left, right } from './movement.js';
import { start, stop } from './code-executor.js';
import { saveCode } from './save-load.js';
import { loadCode } from './save-load.js';
import { loadGameState, resetPosition } from './game-state.js';
import { updateView, updateStageView, drawGrid } from './view-renderer.js';
import { gameState } from './game-state.js';
import { obstacleMaps } from './obstacle-maps.js';
import { handleRecordedCommand } from './recorder.js';


function handleKeydown(event) {
  // Check if textarea has focus - if so, don't handle keyboard shortcuts
  const codeTextarea = document.getElementById('code');
  if (codeTextarea && document.activeElement === codeTextarea) {
    return;
  }

  // Handle arrow key events
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      handleRecordedCommand('go');
      go();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      handleRecordedCommand('left');
      left();
      break;
    case 'ArrowRight':
      event.preventDefault();
      handleRecordedCommand('right');
      right();
      break;
    case 'ArrowDown':
      // Optional: could be used for going backwards or other functionality
      event.preventDefault();
      break;
  }
}

function handleGoButton() {
  handleRecordedCommand('go');
  go();
}

function handleLeftButton() {
  handleRecordedCommand('left');
  left();
}

function handleRightButton() {
  handleRecordedCommand('right');
  right();
}

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
  if (gridX < 0 || gridX > gameState.stageSize.x + 1 || gridY < 0 || gridY > gameState.stageSize.y + 1) {
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
  function handleMapChange(event) {
    const selectedMapKey = event.target.value;
    const selectedMap = obstacleMaps[selectedMapKey];
    loadGameState(selectedMap);
    updateView();
    resetPosition();
    updateView();
    updateStageView();
    loadCode(selectedMapKey);
  }

  // Set up button event listeners
  document.getElementById("goButton").addEventListener("pointerdown", handleGoButton);
  document.getElementById("leftButton").addEventListener("pointerdown", handleLeftButton);
  document.getElementById("rightButton").addEventListener("pointerdown", handleRightButton);
  document.getElementById("resetButton").addEventListener("pointerdown", handleReset);
  document.getElementById("startButton").addEventListener("pointerdown", start);
  document.getElementById("stopButton").addEventListener("pointerdown", stop);
  document.getElementById("saveButton").addEventListener("pointerdown", saveCode);
  document.getElementById("clearButton").addEventListener("pointerdown", handleClear);

  // Set up map selector
  document.getElementById("mapSelect").addEventListener("change", handleMapChange);

  // Set up grid click handler
  const canvas = document.getElementById('gridCanvas');
  if (canvas) {
    canvas.addEventListener('click', handleGridClick);
  }

  // Set up keyboard event handlers
  document.addEventListener('keydown', handleKeydown);

  document.getElementById('code').addEventListener('input', () => {
    document.getElementById('statementCount').textContent = '';
  });

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