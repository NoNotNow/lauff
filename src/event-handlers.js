// Event handlers for the application
import {go, left, right} from './game-state/movement.js';
import {start} from './code/code-executor.js';
import {loadCode, saveCode, saveSelectedMap} from './data/save-load.js';
import {stageState} from './game-state/stage-state.js';
import {drawGrid, updateAvatar, updateStageView} from './stage-effects/view-renderer.js';
import {handleRecordedCommand} from './game-state/recorder.js';
import {editor} from './code/code-editor.js';
import {designs} from './design/designs.js';
import {toFileName} from "./utility/helpers.js";


async function handleKeydown(event) {
    // Check if textarea has focus - if so, don't handle keyboard shortcuts
    if (editor.isActive()) {
        return;
    }

    // Handle arrow key events
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            handleRecordedCommand('go');
            await go();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            handleRecordedCommand('left');
            await left();
            break;
        case 'ArrowRight':
            event.preventDefault();
            handleRecordedCommand('right');
            await right();
            break;
        case 'ArrowDown':
            // Optional: could be used for going backwards or other functionality
            event.preventDefault();
            break;
    }
}

async function handleGoButton() {
    handleRecordedCommand('go');
    await go();
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
    stageState.resetPosition();
    updateAvatar();

    // Remove saved code from localStorage
    localStorage.removeItem('savedCode');
}

function handleDesignButton() {
    designs.swap();
}

function handleClear() {
    editor.setCode('');

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
    const gridSize = parseFloat(getComputedStyle(stage).fontSize);

    // Convert pixel coordinates to grid coordinates
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);

    // Check if click is within reasonable grid bounds (be generous)
    if (gridX < 0 || gridX > stageState.getStageSize().x + 1 || gridY < 0 || gridY > stageState.getStageSize().y + 1) {
        return;
    }

    // Check if there's already an obstacle at this position
    const existingObstacleIndex = stageState.getObstacles().findIndex(
        obstacle => obstacle.x === gridX && obstacle.y === gridY
    );

    if (existingObstacleIndex !== -1) {
        // Remove existing obstacle
        stageState.getObstacles().splice(existingObstacleIndex, 1);
    } else {
        // Add new obstacle
        stageState.getObstacles().push({x: gridX, y: gridY});
    }

    // Update the stage view to reflect changes
    updateStageView();

    // Copy obstacle map to clipboard as JSON
    const obstacleJson = JSON.stringify(stageState.getObstacles());
    navigator.clipboard.writeText(obstacleJson).then(() => {
        console.log('Obstacle map copied to clipboard:', obstacleJson);
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
    });
}

export function setupEventListeners() {
  function handleMapChange(event) {
    const selectedMapKey = toFileName(event.target.value);
    saveSelectedMap(selectedMapKey);
    stageState.loadMapFromKey(selectedMapKey);
    loadCode(selectedMapKey);
  }

    // Set up button event listeners
    document.getElementById("goButton").addEventListener("pointerdown", handleGoButton);
    document.getElementById("leftButton").addEventListener("pointerdown", handleLeftButton);
    document.getElementById("rightButton").addEventListener("pointerdown", handleRightButton);
    document.getElementById("resetButton").addEventListener("pointerdown", handleReset);
    document.getElementById("startButton").addEventListener("pointerdown", start);
    document.getElementById("saveButton").addEventListener("pointerdown", saveCode);
    document.getElementById("clearButton").addEventListener("pointerdown", handleClear);
    document.getElementById("design-button").addEventListener("pointerdown", handleDesignButton);

    // Set up map selector
    document.getElementById("mapSelect").addEventListener("change", handleMapChange);

    // Set up grid click handler
    const canvas = document.getElementById('gridCanvas');
    if (canvas) {
        canvas.addEventListener('click', handleGridClick);
    }

    // Set up keyboard event handlers
    document.addEventListener('keydown', handleKeydown);

    editor.onChange(() => {
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