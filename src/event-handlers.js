// Event handlers for the application
import {go, left, right} from './game-state/movement.js';
import {start} from './code/code-executor.js';
import {loadCode, saveCode, saveSelectedMap} from './data/save-load.js';
import {stageState} from './game-state/stage-state.js';
import {drawGrid, updateAvatar} from './stage-effects/view-renderer.js';
import {handleRecordedCommand} from './game-state/recorder.js';
import {editor} from './code/code-editor.js';
import {designs} from './design/designs.js';
import {builder} from './builder/builder.js';
import {mode} from './design/mode.js';
import {toFileName} from "./utility/helpers.js";
import { BuilderView } from './builder/builder-view.js';


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

    // Builder toggle button
    const builderBtn = document.getElementById("builder-button");
    if (builderBtn) {
        builderBtn.addEventListener("pointerdown", () => mode.toggleBuilder());
        builderBtn.setAttribute('aria-pressed', String(builder.isEnabled()));
    }

    // Set up map selector
    document.getElementById("mapSelect").addEventListener("change", handleMapChange);

    // ==== Builder controls wiring moved into BuilderView ====
    // Initialize the BuilderView which binds DOM and delegates to Builder methods.
    const builderView = new BuilderView();
    builder.initView(builderView);

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