// Movement and direction controls
import { gameState, setDirection, parseNumber, withinBounds, checkTargetReached } from './game-state.js';
import { handleWallCollision } from './crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from './crash-handler.js';
import { checkObstacleCollision } from './game-state.js';
import { updateView } from './view-renderer.js';

// Check if the avatar can move forward without hitting an obstacle
export function free() {
  const x = gameState.position.x;
  const y = gameState.position.y;
  const direction = gameState.direction;
  
  // Calculate the position one step ahead
  let nextX = x;
  let nextY = y;
  
  switch (direction) {
    case 0: // North
      nextY = y - 1;
      break;
    case 1: // East
      nextX = x + 1;
      break;
    case 2: // South
      nextY = y + 1;
      break;
    case 3: // West
      nextX = x - 1;
      break;
  }
  
  // Check bounds
  if (nextX < 0 || nextX > gameState.stageSize.x || nextY < 0 || nextY > gameState.stageSize.y) {
    return false;
  }
  
  // Check for obstacles
  const avatarLeft = nextX;
  const avatarRight = nextX + 2;
  const avatarTop = nextY;
  const avatarBottom = nextY + 2;
  
  return !gameState.obstacles.some(obstacle => {
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + 2;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + 2;
    
    // Check for overlap in both x and y directions
    return !(avatarRight <= obstacleLeft || 
             avatarLeft >= obstacleRight || 
             avatarBottom <= obstacleTop || 
             avatarTop >= obstacleBottom);
  });
}

export function go(input) {
  let steps = parseNumber(input);
  switch (gameState.direction) {
    case 0:
      gameState.position.y -= steps;
      break;
    case 1:
      gameState.position.x += steps;
      break;
    case 2:
      gameState.position.y += steps;
      break;
    case 3:
      gameState.position.x -= steps;
      break;
  }

  if (!withinBounds()) handleWallCollision();
  if (checkObstacleCollision()) handleObstacleCollision();
  if (checkTargetReached()) handleTargetReached();
  updateView();
}

export function right(input) {
  setDirection(gameState.direction + parseNumber(input));
  updateView();
}

export function left(input) {
  setDirection(gameState.direction - parseNumber(input));
  updateView();
}