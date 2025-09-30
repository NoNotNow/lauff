// Game state management
import {bluePrints} from '../data/blueprints.js';
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
        this.addDefaultMembers();
    }

    addDefaultMembers(){
        if(this.#state.name === undefined)  this.#state.name = "Default";
        if(this.#state.startPosition === undefined)  this.#state.startPosition = {x: 0, y: 0};
        if(this.#state.startDirection === undefined)  this.#state.startDirection = 1;
        if(this.#state.obstacles === undefined)  this.#state.obstacles = [];
        if(this.#state.targetPosition === undefined)  this.#state.targetPosition = {x: 0, y: 0};
        if(this.#state.stageSize === undefined)  this.#state.stageSize = {x: 0, y: 0};
        if(this.#state.position === undefined)  this.#state.position
            = {x: this.#state.startPosition.x, y: this.#state.startPosition.y};
        if(this.#state.direction === undefined)  this.#state.direction = 1;
    }

    getName() {return this.#state.name;}

    setName(name){
        this.#state.name = String(name ?? '');
    }

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
        this.#state.targetPosition = map.targetPosition;
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
        return this.#state.targetPosition;
    }

    /**
     * Update startPosition and current position together
     * @param {Vec2} pos
     */
    setStartAndPosition(pos){
        this.#state.startPosition.x = pos.x;
        this.#state.startPosition.y = pos.y;
        this.#state.position.x = pos.x;
        this.#state.position.y = pos.y;
    }

    /**
     * Update target position
     * @param {Vec2} pos
     */
    setTarget(pos){
        this.#state.targetPosition.x = pos.x;
        this.#state.targetPosition.y = pos.y;
    }

    /**
     * Update stage size
     * @param {Vec2} size
     */
    setStageSize(size){
        this.#state.stageSize.x = size.x;
        this.#state.stageSize.y = size.y;
    }

    turnRight(input) {
        this.setDirection(this.#state.direction + input);
    }

    turnLeft(input) {
        this.setDirection(this.#state.direction - input);
    }

    /**
     * return a copy of the state
     * @returns {StageBlueprint}
     */
    getState() {
        return JSON.parse(JSON.stringify(this.#state));
    }
}

export const stageState = new StageState();
