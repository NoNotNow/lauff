// Builder mode controller
// Provides methods to toggle the 'builder' CSS class on <body>

import {stageState} from '../game-state/stage-state.js';
import {adjustSize, updateAvatar, updateStageView, drawGrid} from '../stage-effects/view-renderer.js';
import {loadBluePrint, removeBluePrintEntry, saveBluePrint} from "../data/save-load.js";

class Builder {
    constructor() {
        /** @type {'obstacles'|'start'|'target'} */
        this._tool = 'obstacles';
        /** optional back-reference to view if needed */
        this._view = null;
    }

    isEnabled() {
        return document.body.classList.contains('builder');
    }

    enable() {
        document.body.classList.add('builder');
        this.#announce();
    }

    disable() {
        document.body.classList.remove('builder');
        this.#announce();
    }

    toggle() {
        if (this.isEnabled()) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /** Register a view instance that handles DOM wiring */
    initView(view) {
        this._view = view;
        if (this._view && typeof this._view.init === 'function') {
            this._view.init();
        }
    }

    /** Get a lightweight snapshot for initializing the view */
    getSnapshot() {
        return {
            name: stageState.getName ? stageState.getName() : '',
            stageSize: stageState.getStageSize(),
            tool: this._tool
        };
    }

    setName(name) {
        if (stageState.setName) stageState.setName(name);
    }

    /**
     * Set current builder tool
     * @param {'obstacles'|'start'|'target'} tool
     */
    setTool(tool) {
        if (tool === 'obstacles' || tool === 'start' || tool === 'target') {
            this._tool = tool;
        }
    }

    getTool() {
        return this._tool;
    }

    /** Clear all obstacles and refresh view */
    clearObstacles() {
        const obs = stageState.getObstacles();
        obs.length = 0;
        updateStageView();
        drawGrid();
    }

    /** Validate and apply new stage size, clamp entities, and refresh view */
    setStageSize(size) {
        let wx = parseInt(size?.x, 10);
        let hy = parseInt(size?.y, 10);
        if (!isFinite(wx) || wx < 1) wx = 1;
        if (!isFinite(hy) || hy < 1) hy = 1;
        stageState.setStageSize({x: wx, y: hy});
        adjustSize(stageState.getStageSize());
        this.#clampEntitiesToBounds();
        updateStageView();
        updateAvatar();
        setTimeout(() => drawGrid(), 300);
    }

    /** Handle a click on the grid in grid coordinates */
    applyGridClick(gridX, gridY) {
        // Bounds check
        const size = stageState.getStageSize();
        if (gridX < 0 || gridX > size.x + 1 || gridY < 0 || gridY > size.y + 1) return;

        if (this._tool === 'obstacles') {
            const idx = stageState.getObstacles().findIndex(o => o.x === gridX && o.y === gridY);
            if (idx !== -1) {
                stageState.getObstacles().splice(idx, 1);
            } else {
                stageState.getObstacles().push({x: gridX, y: gridY});
            }
            updateStageView();
            // Copy obstacle map to clipboard as JSON (best-effort)
            try {
                const obstacleJson = JSON.stringify(stageState.getObstacles());
                navigator.clipboard?.writeText(obstacleJson).catch(() => {
                });
            } catch {
            }
        } else if (this._tool === 'start') {
            stageState.setStartAndPosition({x: gridX, y: gridY});
            updateAvatar();
            updateStageView();
        } else if (this._tool === 'target') {
            stageState.setTarget({x: gridX, y: gridY});
            updateStageView();
        }
    }

    /** Clamp positions/obstacles into current bounds */
    #clampEntitiesToBounds() {
        const size = stageState.getStageSize();
        const maxX = size.x + 1;
        const maxY = size.y + 1;
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
        // Clamp start & current position together via setter
        const pos = stageState.getPosition();
        stageState.setStartAndPosition({
            x: clamp(pos.x, 0, maxX),
            y: clamp(pos.y, 0, maxY)
        });
        // Clamp target
        const t = stageState.getTarget();
        t.x = clamp(t.x, 0, maxX);
        t.y = clamp(t.y, 0, maxY);
        // Remove out-of-bounds obstacles
        const obs = stageState.getObstacles();
        for (let i = obs.length - 1; i >= 0; i--) {
            const o = obs[i];
            if (o.x < 0 || o.y < 0 || o.x > maxX || o.y > maxY) {
                obs.splice(i, 1);
            }
        }
    }

    /** Notify controls to reflect current state (e.g., aria-pressed) */
    #announce() {
        const btn = document.getElementById('builder-button');
        if (btn) {
            btn.setAttribute('aria-pressed', String(this.isEnabled()));
            btn.title = this.isEnabled() ? 'Builder ausschalten' : 'Builder einschalten';
        }
    }

    saveGrid() {
        saveBluePrint(stageState.getState())
    }

    copyGrid() {
        //copy to clipboard
        navigator.clipboard.writeText(JSON.stringify(stageState.getState()));
    }

    setLevel(value) {
        let level = loadBluePrint(value);
        if (level == null) {
            alert("Das level " + value + " konnte nicht gefunden/geladen werden");
            return;
        }
        stageState.loadGameState(loadBluePrint(value));

    }

    remove(value) {
        removeBluePrintEntry(value);
    }
}

export const builder = new Builder();
