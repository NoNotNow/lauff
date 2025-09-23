// Game state management
import {bluePrints} from '../data/obstacle-maps.js';
import {adjustSize, updateAvatar, updateStageView, drawGrid} from '../stage-effects/view-renderer.js';

/** @typedef {import('../types/stage-model.js').Vec2} Vec2 */
/** @typedef {import('../types/stage-model.js').Obstacle} Obstacle */
/** @typedef {import('../types/stage-model.js').StageModel} StageModel */
/** @typedef {import('../types/stage-model.js').StageBlueprint} StageBlueprint */
/** @typedef {import('../types/stage-model.js').StageSnapshot} StageSnapshot */

class StageState {
    /** @type {StageModel} */
    #state;

    constructor() {
        this.#state = bluePrints.getDefault();
    }

    getName() {return this.#state.name;}

    loadMapFromKey(key) {

        let selectedMap =  bluePrints.getBlueprint(key)
        if (!selectedMap) selectedMap = bluePrints.getDefault();
        this.loadGameState(selectedMap);
        adjustSize(selectedMap.stageSize);
        this.resetPosition();
        updateStageView();
        updateAvatar();
        setTimeout(() => {
            drawGrid();
        }, 100);
    }

    /**
     * @param {StageBlueprint} map
     */
    loadGameState(map) {
        this.#state.name = map.name;
        this.#state.startPosition.x = map.startPosition.x;
        this.#state.startPosition.y = map.startPosition.y;
        this.#state.startDirection = map.startDirection ?? 1;
        this.#state.obstacles = map.obstacles;
        this.#state.target = map.targetPosition;
        this.#state.stageSize = map.stageSize;
    }

    resetPosition() {
        console.log("Resetting position");
        this.#state.position.x = this.#state.startPosition.x ?? 0;
        this.#state.position.y = this.#state.startPosition.y ?? 0;
        let direction = 1;
        if (this.#state.startDirection !== undefined) {
            direction = this.#state.startDirection;
        }
        this.#state.direction = direction;
    }

    targetWithinBounds() {
        if (this.#state.position.x < 0 || this.#state.position.x > this.#state.stageSize.x) return false;
        return !(this.#state.position.y < 0 || this.#state.position.y > this.#state.stageSize.y);
    }

    setDirection(v) {
        this.#state.direction = v % 4;
        if (this.#state.direction < 0) this.#state.direction += 4;
    }

    // gets the current direction altered by input
    getDirection(v) {
        if (typeof v !== "number") return this.#state.direction;
        let result = this.#state.direction + v;
        result = result % 4;
        if (result < 0) result += 4;
        return result;
    }


    getPosition() {
        return this.#state.position;
    }

    getStageSize() {
        return this.#state.stageSize;
    }

    getObstacles() {
        return this.#state.obstacles;
    }

    getTarget() {
        return this.#state.target;
    }

    turnRight(input) {
        this.setDirection(this.#state.direction + input);
    }

    turnLeft(input) {
        this.setDirection(this.#state.direction - input);
    }
}

// Expose only a single global instance
export const stageState = new StageState();
