// BuilderView: binds DOM elements and forwards user actions to the Builder API
// No game-state mutations happen here; all updates go through builder methods.

import {builder} from './builder.js';
import {getStoredBluePrints} from "../data/save-load.js";
import {updateFullStage} from "../stage-effects/view-renderer.js";
import {localizer} from "../localizer/localizer.js";
import {MessageTokens} from "../localizer/tokens.js";
import {stageState} from "../game-state/stage-state.js";
import {parseNumber} from "../utility/helpers.js";


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
        // Background gradient controls
        this.bgEnabled = document.getElementById('bgGradientEnabled');
        this.bgFrom = document.getElementById('bgGradientFrom');
        this.bgTo = document.getElementById('bgGradientTo');
        this.bgAngle = document.getElementById('bgGradientAngle');
        // Obstacle color controls
        this.obFill = document.getElementById('obstacleFillColor');
        this.obBorder = document.getElementById('obstacleBorderColor');
        // Initialize inputs from builder state
        this.updateViewFromSnapshot();
        this.populateLevelSelect();

        // Wire events -> builder API
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => builder.setName(this.nameInput.value));
        }

        const onSizeChange = () => {
            // Parse numbers; let builder validate and clamp
            const wx = parseNumber(this.widthInput?.value ?? '', 10, 0, 200);
            const hy = parseNumber(this.heightInput?.value ?? '', 10, 0,200);
            console.log("stage size", wx, hy);
            builder.setStageSize({x: wx, y: hy});
            this.updateViewFromSnapshot();
        };
        if (this.widthInput) this.widthInput.addEventListener('change', onSizeChange);
        if (this.heightInput) this.heightInput.addEventListener('change', onSizeChange);

        if (this.toolSelect) {
            this.toolSelect.addEventListener('change', () => builder.setTool(this.toolSelect.value));
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('pointerdown', () => builder.clearObstacles());
        }

        // Background gradient bindings
        if (this.bgEnabled) {
            this.bgEnabled.addEventListener('change', () => builder.setBackgroundGradient({enabled: this.bgEnabled.checked}));
        }
        if (this.bgFrom) {
            this.bgFrom.addEventListener('input', () => builder.setBackgroundGradient({from: this.bgFrom.value}));
        }
        if (this.bgTo) {
            this.bgTo.addEventListener('input', () => builder.setBackgroundGradient({to: this.bgTo.value}));
        }
        if (this.bgAngle) {
            this.bgAngle.addEventListener('input', () => builder.setBackgroundGradient({angle: parseFloat(this.bgAngle.value) || 0}));
        }
        // Obstacle color bindings
        if (this.obFill) {
            this.obFill.addEventListener('input', () => builder.setObstacleStyle({fill: this.obFill.value}));
        }
        if (this.obBorder) {
            this.obBorder.addEventListener('input', () => builder.setObstacleStyle({border: this.obBorder.value}));
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
        if (this.loadButton) {
            this.loadButton.addEventListener('pointerdown', () => {
                    if(builder.isDirty()){
                        if(!window.confirm(localizer.localizeMessage(MessageTokens.unsavedChanges))){
                            return;
                        }
                    }

                    builder.setLevel(this.levelSelect.value);
                    stageState.resetPosition();
                    updateFullStage();
                    this.updateViewFromSnapshot();
                    document.getElementById('level-loader').classList.remove('open');
                }
            );
        }
        if (this.removeButton) {
            this.removeButton.addEventListener('pointerdown', () => {
                window.confirm(localizer.localizeMessage(MessageTokens.removeLevel));
                builder.remove(this.levelSelect.value);
                this.populateLevelSelect();
            });
        }

        if (this.levelLoaderOpener) {
            this.levelLoaderOpener.addEventListener('pointerdown', () => {
                document.getElementById('level-loader').classList.toggle('open');
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
            const bg = s.backgroundGradient || {};
            if (this.bgEnabled) this.bgEnabled.checked = !!bg.enabled;
            if (this.bgFrom && bg.from) this.bgFrom.value = bg.from;
            if (this.bgTo && bg.to) this.bgTo.value = bg.to;
            if (this.bgAngle && typeof bg.angle === 'number') this.bgAngle.value = String(bg.angle);
            const os = s.obstacleStyle || {};
            if (this.obFill && os.fill) this.obFill.value = os.fill;
            if (this.obBorder && os.border) this.obBorder.value = os.border;
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
