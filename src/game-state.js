// Game state management
import { defaultObstacleMap } from './obstacle-maps.js';

export const gameState = {
  position: { x: 0, y: 0 },
  stageSize: { x: 20, y: 20 },
  direction: 1,
  obstacles: [...defaultObstacleMap],
  target: { x: 18, y: 18 }
};

export function resetPosition() {
  gameState.position.x = 0;
  gameState.position.y = 0;
  gameState.direction = 1;
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

export function checkObstacleCollision() {
  const avatarLeft = gameState.position.x;
  const avatarRight = gameState.position.x + 2;
  const avatarTop = gameState.position.y;
  const avatarBottom = gameState.position.y + 2;
  
  return gameState.obstacles.some(obstacle => {
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + 1;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + 1;
    
    // Check for overlap in both x and y directions
    return !(avatarRight <= obstacleLeft || 
             avatarLeft >= obstacleRight || 
             avatarBottom <= obstacleTop || 
             avatarTop >= obstacleBottom);
  }
  );
}

export function checkTargetReached() {
  const avatarLeft = gameState.position.x;
  const avatarRight = gameState.position.x + 2;
  const avatarTop = gameState.position.y;
  const avatarBottom = gameState.position.y + 2;
  
  const targetLeft = gameState.target.x;
  const targetRight = gameState.target.x + 3;
  const targetTop = gameState.target.y;
  const targetBottom = gameState.target.y + 3;
  
  // Check for overlap in both x and y directions
  return !(avatarRight <= targetLeft || 
           avatarLeft >= targetRight || 
           avatarBottom <= targetTop || 
           avatarTop >= targetBottom);
}
