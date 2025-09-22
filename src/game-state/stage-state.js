// Game state management
import { defaultObstacleMap, obstacleMaps } from '../data/obstacle-maps.js';
import { adjustSize, updateAvatar, updateStageView, drawGrid } from '../stage-effects/view-renderer.js';

export const stageState = {
  startPosition: { x: 0, y: 0 },
  startDirection: 1,
  position: { x: 0, y: 0 },
  stageSize: { x: 20, y: 20 },
  direction: 1,
  obstacles: [...defaultObstacleMap],
  target: { x: 20, y: 20 }
};

export function loadMapFromKey(key) {
  const selectedMap = key ? obstacleMaps[key] : obstacleMaps.klein;
  loadGameState(selectedMap);
  adjustSize(selectedMap.stageSize);
  resetPosition();
  updateStageView();
  updateAvatar();
  setTimeout(() => { drawGrid() }, 100);
}

export function loadGameState(map) {
  stageState.startPosition.x = map.startPosition.x;
  stageState.startPosition.y = map.startPosition.y;
  stageState.startDirection = map.startDirection ?? 1;
  stageState.obstacles = map.obstacles;
  stageState.target = map.targetPosition;
  stageState.stageSize = map.stageSize;
}

export function resetPosition() {
  console.log("Resetting position");
  stageState.position.x = stageState.startPosition.x ?? 0;
  stageState.position.y = stageState.startPosition.y ?? 0;
  let direction = 1;
  if (stageState.startDirection !== undefined) { direction = stageState.startDirection; }
  stageState.direction = direction;
}

export function withinBounds() {
  if (stageState.position.x < 0 || stageState.position.x > stageState.stageSize.x) return false;
  if (stageState.position.y < 0 || stageState.position.y > stageState.stageSize.y) return false;
  return true;
}

export function setDirection(v) {
  stageState.direction = v % 4;
  if (stageState.direction < 0) stageState.direction += 4;
}

//gets the current direction altered by input
export function getDirection(v) {
  if (typeof v !== "number") return stageState.direction;
  let result = stageState.direction + v
  result = result % 4;
  if (result < 0) result += 4;
  return result;
}

export function parseNumber(input) {
  let steps = 1;
  if (typeof input === "number") steps = input;
  return steps;
}
