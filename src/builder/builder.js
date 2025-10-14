// Builder mode controller
// Provides methods to toggle the 'builder' CSS class on <body>

import {stageState} from '../game-state/stage-state.js';
import {adjustSize, updateAvatar, updateStageView, drawGrid} from '../stage-effects/view-renderer.js';
import {loadBluePrint, removeBluePrintEntry, saveBluePrint} from "../data/save-load.js";

class Builder {
    constructor() {
        /** @type {'obstacles'|'start'|'target'|'line'} */
        this._tool = 'obstacles';
        /** optional back-reference to view if needed */
        this._view = null;
        /** @type {{x:number,y:number}|null} first click for line tool */
        this._pendingLineStart = null;
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
            tool: this._tool,
            backgroundGradient: stageState.getBackgroundGradient ? stageState.getBackgroundGradient() : undefined,
            obstacleStyle: stageState.getObstacleStyle ? stageState.getObstacleStyle() : undefined
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
        if (tool === 'obstacles' || tool === 'start' || tool === 'targetPosition' || tool === 'line') {
            this._tool = tool;
            // reset any in-progress line when switching tools
            if (tool !== 'line') this._pendingLineStart = null;
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

    setBackgroundGradient(partial) {
        if (stageState.updateBackgroundGradient) {
            stageState.updateBackgroundGradient(partial);
            // Re-render background/grid
            drawGrid();
        }
    }

    setObstacleStyle(partial) {
        if (stageState.updateObstacleStyle) {
            stageState.updateObstacleStyle(partial);
            // Re-render obstacles with new style
            updateStageView();
        }
    }

    /** Handle a click on the grid in grid coordinates */
    applyGridClick(gridX, gridY) {
        // Bounds check
        const size = stageState.getStageSize();
        if (gridX < 0 || gridX > size.x + 1 || gridY < 0 || gridY > size.y + 1) return;

        if (this._tool === 'obstacles') {
            if (!stageState.hasObstacle(gridX, gridY)) {
                stageState.addObstacle(gridX, gridY);
            } else {
                stageState.removeObstacle(gridX, gridY);
            }
            updateStageView();
        } else if (this._tool === 'start') {
            stageState.setStartAndPosition({x: gridX, y: gridY});
            updateAvatar();
            updateStageView();
        } else if (this._tool === 'targetPosition') {
            stageState.setTarget({x: gridX, y: gridY});
            updateStageView();
        } else if (this._tool === 'line') {
            if (!this._pendingLineStart) {
                const has = stageState.hasObstacle(gridX, gridY);
                this._pendingLineStart = { x: gridX, y: gridY, remove: has };
            } else {
                this.drawLine(this._pendingLineStart, { x: gridX, y: gridY }, this._pendingLineStart.remove === true);
                this._pendingLineStart = null;
                updateStageView();
            }
        }
    }

    /** Draw a line of obstacles between two grid points (inclusive)
     * @param {{x:number,y:number}} startPoint
     * @param {{x:number,y:number}} endPoint
     * @param {boolean} [remove=false] when true, remove obstacles along the line instead of adding
     */
    drawLine(startPoint, endPoint, remove = false) {
        if (!startPoint || !endPoint) return;
        const size = stageState.getStageSize();
        const maxX = size.x + 1;
        const maxY = size.y + 1;
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
        let x0 = clamp(Math.round(startPoint.x), 0, maxX);
        let y0 = clamp(Math.round(startPoint.y), 0, maxY);
        let x1 = clamp(Math.round(endPoint.x), 0, maxX);
        let y1 = clamp(Math.round(endPoint.y), 0, maxY);

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        // Bresenham's line algorithm
        while (true) {
            if (remove) {
                if (stageState.hasObstacle(x0, y0)) {
                    stageState.removeObstacle(x0, y0);
                }
            } else {
                if (!stageState.hasObstacle(x0, y0)) {
                    stageState.addObstacle(x0, y0);
                }
            }
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
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
        stageState.notifySaved();
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
        stageState.loadGameState(level);
    }

    remove(value) {
        removeBluePrintEntry(value);
    }

    isDirty() {
        return stageState.isDirty()
    }
}

export const builder = new Builder();
