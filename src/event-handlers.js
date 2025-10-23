// Event handlers for the application
import {go, left, right} from './game-state/movement.js';
import {start} from './code/code-executor.js';
import {loadCode, pasteCode, saveCode, saveSelectedMap, downloadEditorCode, uploadEditorCode, copyCode} from './data/save-load.js';
import {stageState} from './game-state/stage-state.js';
import {clearTrail, drawGrid, updateAvatar} from './stage-effects/view-renderer.js';
import {handleRecordedCommand} from './game-state/recorder.js';
import {editor} from './code/code-editor.js';
import {designs} from './design/designs.js';
import {builder} from './builder/builder.js';
import {mode} from './mode.js';
import {toFileName} from "./utility/helpers.js";
import {localizer} from "./localizer/localizer.js";


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
    clearTrail();
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
function swapLanguage() {
    localizer.swapLanguage();
}

export function setupEventListeners() {
  function handleMapChange(event) {
    const selectedMapKey = toFileName(event.target.value);
    saveSelectedMap(selectedMapKey);
    stageState.loadMapFromKey(selectedMapKey);
    loadCode(selectedMapKey);
  }

    // Set up button event listeners
    document.getElementById("goButton").addEventListener("pointerup", handleGoButton);
    document.getElementById("leftButton").addEventListener("pointerup", handleLeftButton);
    document.getElementById("rightButton").addEventListener("pointerup", handleRightButton);
    document.getElementById("resetButton").addEventListener("pointerup", handleReset);
    document.getElementById("startButton").addEventListener("pointerup", start);
    document.getElementById("saveButton").addEventListener("pointerup", saveCode);
    document.getElementById("clearButton").addEventListener("pointerup", handleClear);
    document.getElementById("copyCodeButton").addEventListener("pointerup", copyCode);
    document.getElementById("pasteCodeButton").addEventListener("pointerup", pasteCode);
    // Optional: download/upload editor code buttons
    const dlBtn = document.getElementById("downloadCodeButton");
    if (dlBtn) dlBtn.addEventListener("pointerup", downloadEditorCode);
    const ulBtn = document.getElementById("uploadCodeButton");
    if (ulBtn) ulBtn.addEventListener("pointerup", uploadEditorCode);
    document.getElementById("design-button").addEventListener("pointerup", handleDesignButton);



    document.getElementById("language-button").addEventListener("pointerup", swapLanguage);

    // Builder toggle button
    const builderBtn = document.getElementById("builder-button");
    if (builderBtn) {
        builderBtn.addEventListener("pointerup", () => mode.toggleBuilder());
        builderBtn.setAttribute('aria-pressed', String(builder.isEnabled()));
    }

    // Set up map selector
    document.getElementById("mapSelect").addEventListener("change", handleMapChange);



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