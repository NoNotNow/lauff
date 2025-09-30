// BuilderView: binds DOM elements and forwards user actions to the Builder API
// No game-state mutations happen here; all updates go through builder methods.

import {builder} from './builder.js';
import {getStoredBluePrints} from "../data/save-load.js";
import {updateFullStage} from "../stage-effects/view-renderer.js";

export class BuilderView {
    /** Bind UI controls and canvas interactions */
    init() {
        // Controls
        this.nameInput = document.getElementById('builder-name');
        this.widthInput = document.getElementById('gridWidth');
        this.heightInput = document.getElementById('gridHeight');
        this.toolSelect = document.getElementById('builderTool');
        this.clearBtn = document.getElementById('clearObstaclesBtn');
        this.canvas = document.getElementById('gridCanvas');
        this.stage = document.getElementById('stage');
        this.saveGridButton = document.getElementById('saveGridButton');
        this.copyGridButton = document.getElementById('copyGridButton');
        this.levelSelect = document.getElementById('builder-level-select');
        this.loadButton = document.getElementById('load-blueprint');
        this.removeButton = document.getElementById('remove-blueprint');
        this.levelLoaderOpener = document.getElementById('level-loader-title');
        // Initialize inputs from builder state
        this.updateViewFromSnapshot();
        this.populateLevelSelect();

        // Wire events -> builder API
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => builder.setName(this.nameInput.value));
        }

        const onSizeChange = () => {
            // Parse numbers; let builder validate and clamp
            const wx = parseInt(this.widthInput?.value ?? '', 10);
            const hy = parseInt(this.heightInput?.value ?? '', 10);
            builder.setStageSize({x: wx, y: hy});
        };
        if (this.widthInput) this.widthInput.addEventListener('change', onSizeChange);
        if (this.heightInput) this.heightInput.addEventListener('change', onSizeChange);

        if (this.toolSelect) {
            this.toolSelect.addEventListener('change', () => builder.setTool(this.toolSelect.value));
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('pointerdown', () => builder.clearObstacles());
        }

        if (this.canvas) {
            this.canvas.addEventListener('click', (event) => this.#handleCanvasClick(event));
        }

        if (this.saveGridButton) {
            this.saveGridButton.addEventListener('pointerdown', () => {
                builder.saveGrid();
                this.populateLevelSelect();
            });
        }
        if (this.copyGridButton) {
            this.copyGridButton.addEventListener('pointerdown', () => builder.copyGrid());
        }
        if (this.levelSelect) {
            this.levelSelect.addEventListener('change', () => {

            });
        }
        if (this.loadButton) {
            this.loadButton.addEventListener('pointerdown', () => {
                    builder.setLevel(this.levelSelect.value);
                    updateFullStage();
                    this.updateViewFromSnapshot();
                    document.getElementById('level-loader').classList.remove('open');
                }
            );
        }
        if (this.removeButton) {
            this.removeButton.addEventListener('pointerdown', () => {
                builder.remove(this.levelSelect.value);
                this.populateLevelSelect();
            });
        }

        if (this.levelLoaderOpener) {
            this.levelLoaderOpener.addEventListener('pointerdown', () => {
                document.getElementById('level-loader').classList.add('open');
            });
        }

        /*copy values to ui*/
        this.#copyValuesToUI();
    }

    updateViewFromSnapshot() {
        try {
            const s = builder.getSnapshot();
            if (this.nameInput) this.nameInput.value = s.name || '';
            if (this.widthInput) this.widthInput.value = String(s.stageSize.x ?? 0);
            if (this.heightInput) this.heightInput.value = String(s.stageSize.y ?? 0);
            if (this.toolSelect) this.toolSelect.value = s.tool;
        } catch (e) {
            console.error('Unable to save view', e);
        }
    }

    /** Convert mouse click to grid coordinates and forward to builder */
    #handleCanvasClick(event) {
        if (!builder.isEnabled()) return;
        if (!this.canvas || !this.stage) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const gridSize = parseFloat(getComputedStyle(this.stage).fontSize);
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);

        builder.applyGridClick(gridX, gridY);
    }

    #copyValuesToUI() {
        builder.getSnapshot();
    }

    populateLevelSelect() {
        const stored = getStoredBluePrints();
        this.levelSelect.innerHTML = '';
        for (const bp of stored) {
            const option = document.createElement('option');
            option.value = bp.name;
            option.textContent = bp.name;
            this.levelSelect.appendChild(option);
        }
    }
}

export const builderView = new BuilderView();
builder.initView(builderView);
