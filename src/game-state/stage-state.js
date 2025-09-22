// Game state management
import { defaultObstacleMap, obstacleMaps } from '../data/obstacle-maps.js';
import { adjustSize, updateAvatar, updateStageView, drawGrid } from '../stage-effects/view-renderer.js';

class StageState {
  constructor() {
    this.state = {
      startPosition: { x: 0, y: 0 },
      startDirection: 1,
      position: { x: 0, y: 0 },
      stageSize: { x: 20, y: 20 },
      direction: 1,
      obstacles: [...defaultObstacleMap],
      target: { x: 20, y: 20 }
    };
  }

  loadMapFromKey(key) {
    const selectedMap = key ? obstacleMaps[key] : obstacleMaps.klein;
    this.loadGameState(selectedMap);
    adjustSize(selectedMap.stageSize);
    this.resetPosition();
    updateStageView();
    updateAvatar();
    setTimeout(() => { drawGrid(); }, 100);
  }

  loadGameState(map) {
    this.state.startPosition.x = map.startPosition.x;
    this.state.startPosition.y = map.startPosition.y;
    this.state.startDirection = map.startDirection ?? 1;
    this.state.obstacles = map.obstacles;
    this.state.target = map.targetPosition;
    this.state.stageSize = map.stageSize;
  }

  resetPosition() {
    console.log("Resetting position");
    this.state.position.x = this.state.startPosition.x ?? 0;
    this.state.position.y = this.state.startPosition.y ?? 0;
    let direction = 1;
    if (this.state.startDirection !== undefined) {
      direction = this.state.startDirection;
    }
    this.state.direction = direction;
  }

  targetWithinBounds() {
    if (this.state.position.x < 0 || this.state.position.x > this.state.stageSize.x) return false;
    return !(this.state.position.y < 0 || this.state.position.y > this.state.stageSize.y);

  }

  setDirection(v) {
    this.state.direction = v % 4;
    if (this.state.direction < 0) this.state.direction += 4;
  }

  // gets the current direction altered by input
  getDirection(v) {
    if (typeof v !== "number") return this.state.direction;
    let result = this.state.direction + v;
    result = result % 4;
    if (result < 0) result += 4;
    return result;
  }



    getPosition() {
        return this.state.position;
    }

    getStageSize() {
        return this.state.stageSize;
    }

    getObstacles() {
        return this.state.obstacles;
    }

    getTarget() {
        return this.state.target;
    }

    turnRight(input) {
        this.setDirection(this.state.direction + input);
    }

    turnLeft(input) {
        this.setDirection(this.state.direction - input);
    }
}

// Expose only a single global instance
export const stageState = new StageState();
