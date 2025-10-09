// BuilderView: binds DOM elements and forwards user actions to the Builder API
// No game-state mutations happen here; all updates go through builder methods.

import {builder} from './builder.js';
import {getStoredBluePrints} from "../data/save-load.js";
import {updateFullStage} from "../stage-effects/view-renderer.js";
import {localizer} from "../localizer/localizer.js";
import {MessageTokens} from "../localizer/tokens.js";
import {stageState} from "../game-state/stage-state.js";
import {parseNumber} from "../utility/helpers.js";
import {backgroundPresets} from "../design/background-manager.js";


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
        this.bgPreset = document.getElementById('bgGradientPreset');
        this.bgFrom = document.getElementById('bgGradientFrom');
        this.bgMid = document.getElementById('bgGradientMid');
        this.bgMidPos = document.getElementById('bgGradientMidPos');
        this.bgTo = document.getElementById('bgGradientTo');
        this.bgAngle = document.getElementById('bgGradientAngle');
        // Obstacle color controls
        this.obFill = document.getElementById('obstacleFillColor');
        this.obBorder = document.getElementById('obstacleBorderColor');
        // Initialize inputs from builder state
        this.updateViewFromSnapshot();
        this.populateLevelSelect();
        this.populateGradientPresets();

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
        if (this.bgPreset) {
            this.bgPreset.addEventListener('change', () => {
                const css = this.bgPreset.value;
                const parsed = this.#parseLinearGradient(css);
                if (parsed) {
                    // update inputs accordingly
                    this.bgAngle.value = String(parsed.angle);
                    this.bgFrom.value = parsed.colors[0] || '#ffffff';
                    if (parsed.colors[1]) {
                        this.bgMid.value = parsed.colors[1];
                        this.bgMidPos.value = '50';
                    }
                    this.bgTo.value = parsed.colors[parsed.colors.length - 1] || '#ffffff';
                    // apply as stops (evenly spaced if 3 colors)
                    const n = parsed.colors.length;
                    const stops = parsed.colors.map((c, i) => ({ offset: n === 1 ? 1 : i / (n - 1), color: c }));
                    builder.setBackgroundGradient({ angle: parsed.angle, stops });
                }
            });
        }
        const applyStopsFromInputs = () => {
            const stops = this.#buildStopsFromInputs();
            builder.setBackgroundGradient({ stops });
        };
        if (this.bgFrom) this.bgFrom.addEventListener('input', applyStopsFromInputs);
        if (this.bgMid) this.bgMid.addEventListener('input', applyStopsFromInputs);
        if (this.bgMidPos) this.bgMidPos.addEventListener('input', applyStopsFromInputs);
        if (this.bgTo) this.bgTo.addEventListener('input', applyStopsFromInputs);
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
            // angle
            if (this.bgAngle && typeof bg.angle === 'number') this.bgAngle.value = String(bg.angle);
            // stops -> from/mid/to
            let stops = Array.isArray(bg.stops) ? bg.stops.slice() : [];
            if (stops.length < 2) {
                stops = [
                    { offset: 0, color: bg.from || '#ffffff' },
                    { offset: 1, color: bg.to || '#ffffff' }
                ];
            }
            stops.sort((a,b) => a.offset - b.offset);
            if (this.bgFrom) this.bgFrom.value = stops[0]?.color || '#ffffff';
            if (this.bgTo) this.bgTo.value = stops[stops.length-1]?.color || '#ffffff';
            if (this.bgMid) this.bgMid.value = stops[1] && stops.length >= 3 ? stops[1].color : '';
            if (this.bgMidPos) this.bgMidPos.value = stops[1] && stops.length >= 3 ? String(Math.round((stops[1].offset || 0.5)*100)) : '50';
            // preset selection: try to match current to a preset string
            if (this.bgPreset) {
                let matched = '';
                try {
                    for (const css of backgroundPresets) {
                        const p = this.#parseLinearGradient(css);
                        if (!p) continue;
                        const cols = p.colors;
                        const curCols = [stops[0]?.color, stops[1] && stops.length>=3 ? stops[1].color : undefined, stops[stops.length-1]?.color].filter(Boolean);
                        if (cols.length === curCols.length && cols.every((c,i)=> c.toLowerCase() === curCols[i].toLowerCase())) {
                            matched = css;
                            break;
                        }
                    }
                } catch(e) {}
                this.bgPreset.value = matched;
            }
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

    populateGradientPresets() {
        if (!this.bgPreset) return;
        // First option: none
        this.bgPreset.innerHTML = '';
        const none = document.createElement('option');
        none.value = '';
        none.textContent = '— custom —';
        this.bgPreset.appendChild(none);
        for (const css of backgroundPresets) {
            const opt = document.createElement('option');
            opt.value = css;
            opt.textContent = css;
            this.bgPreset.appendChild(opt);
        }
    }

    #parseLinearGradient(css) {
        // Expect formats like: linear-gradient(-45deg, #a, #b, #c)
        if (!css || typeof css !== 'string') return null;
        const m = css.match(/linear-gradient\(([^,]+),\s*(.*)\)/i);
        if (!m) return null;
        const anglePart = m[1].trim();
        let angle = 0;
        const degMatch = anglePart.match(/(-?\d+(?:\.\d+)?)deg/i);
        if (degMatch) angle = parseFloat(degMatch[1]);
        const rest = m[2];
        // split by commas not inside parentheses (simple here: no functions in colors)
        const parts = rest.split(',').map(s => s.trim()).filter(Boolean);
        const colors = parts.map(p => p.split(/\s+/)[0]);
        return { angle, colors };
    }

    #buildStopsFromInputs() {
        const from = this.bgFrom?.value || '#ffffff';
        const to = this.bgTo?.value || '#ffffff';
        const mid = this.bgMid?.value || '';
        const midPos = Math.max(0, Math.min(100, parseInt(this.bgMidPos?.value || '50', 10))) / 100;
        /** @type {{offset:number,color:string}[]} */
        const stops = [];
        stops.push({ offset: 0, color: from });
        if (mid) {
            stops.push({ offset: midPos, color: mid });
        }
        stops.push({ offset: 1, color: to });
        // sort and unique offsets
        stops.sort((a,b) => a.offset - b.offset);
        return stops;
    }
}

export const builderView = new BuilderView();
builder.initView(builderView);
