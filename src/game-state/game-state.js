// Game state management
import { defaultObstacleMap, obstacleMaps } from './obstacle-maps.js';
import { adjustSize, updateAvatar, updateStageView , drawGrid} from '../stage-effects/view-renderer.js';
export const gameState = {
  startPosition: { x: 0, y: 0 },
  startDirection: 1,
  position: { x: 0, y: 0 },
  stageSize: { x: 20, y: 20 },
  direction: 1,
  obstacles: [...defaultObstacleMap],
  target: { x: 20, y: 20 }
};

export function loadMapFromKey(key) {
  const selectedMap = key?obstacleMaps[key] :obstacleMaps.klein;
  loadGameState(selectedMap);
  adjustSize(selectedMap.stageSize);
  updateAvatar();
  resetPosition();
  updateStageView();
  setTimeout(() => { drawGrid() }, 100);
}

export function loadGameState(map) {
  gameState.startPosition.x = map.startPosition.x;
  gameState.startPosition.y = map.startPosition.y;
  gameState.startDirection = map.startDirection ?? 1;
  gameState.obstacles = map.obstacles;
  gameState.target = map.targetPosition;
  gameState.stageSize = map.stageSize;
}

export function resetPosition() {
  console.log("Resetting position");
  gameState.position.x = gameState.startPosition.x ?? 0;
  gameState.position.y = gameState.startPosition.y ?? 0;
  let direction = 1;
  if (gameState.startDirection !== undefined) {direction = gameState.startDirection;}
  gameState.direction = direction;
}

export function withinBounds() {
  if (gameState.position.x < 0 || gameState.position.x > gameState.stageSize.x) return false;
  if (gameState.position.y < 0 || gameState.position.y > gameState.stageSize.y) return false;
  return true;
}

export function setDirection(v) {
  gameState.direction = v % 4;
  if (gameState.direction < 0) gameState.direction += 4;
}

//gets the current direction altered by input
export function getDirection(v){
  if (typeof v !== "number") return gameState.direction;
  let result = gameState.direction + v
  result = result % 4;
  if (result < 0) result += 4;
  return result; 
}

export function parseNumber(input) {
  let steps = 1;
  if (typeof input === "number") steps = input;
  return steps;
}
