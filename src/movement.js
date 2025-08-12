// Movement and direction controls
import { gameState, setDirection, parseNumber, withinBounds, checkTargetReached, DIRECTIONS } from './game-state.js';
import { handleWallCollision } from './crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from './crash-handler.js';
import { checkObstacleCollision } from './game-state.js';
import { updateView } from './view-renderer.js';

// Check if the avatar can move forward without hitting an obstacle
export function free() {
  const x = gameState.position.x;
  const y = gameState.position.y;
  const direction = gameState.direction;
  
  let spaces = 0;
  let currentX = x;
  let currentY = y;
  
  // Keep checking spaces in the current direction until we hit something
  while (true) {
    // Calculate the next position
    let nextX = currentX;
    let nextY = currentY;
    
    switch (direction) {
      case DIRECTIONS.NORTH:
        nextY = currentY - 1;
        break;
      case DIRECTIONS.EAST:
        nextX = currentX + 1;
        break;
      case DIRECTIONS.SOUTH:
        nextY = currentY + 1;
        break;
      case DIRECTIONS.WEST:
        nextX = currentX - 1;
        break;
    }
    
    // Check bounds
    if (nextX < 0 || nextX > gameState.stageSize.x || nextY < 0 || nextY > gameState.stageSize.y) {
      break;
    }
    
    // Check for obstacles
    const avatarLeft = nextX;
    const avatarRight = nextX + 2;
    const avatarTop = nextY;
    const avatarBottom = nextY + 2;
    
    const hasObstacle = gameState.obstacles.some(obstacle => {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + 1;
      const obstacleTop = obstacle.y;
      const obstacleBottom = obstacle.y + 1;
      
      // Check for overlap in both x and y directions
      return !(avatarRight <= obstacleLeft || 
               avatarLeft >= obstacleRight || 
               avatarBottom <= obstacleTop || 
               avatarTop >= obstacleBottom);
    });
    
    if (hasObstacle) {
      break;
    }
    
    // This space is free, count it and move to the next position
    spaces++;
    currentX = nextX;
    currentY = nextY;
  }
  
  return spaces;
}

export function go(input) {
  let steps = parseNumber(input);
  let freeStepsCount = free(); // Get the number of free steps

  // If the requested steps exceed the available free steps,
  // set steps to one beyond the free count to trigger collision
  if (steps > freeStepsCount) {
    steps = freeStepsCount + 1;
  }

  switch (gameState.direction) {
    case DIRECTIONS.NORTH:
      gameState.position.y -= steps;
      break;
    case DIRECTIONS.EAST:
      gameState.position.x += steps;
      break;
    case DIRECTIONS.SOUTH:
      gameState.position.y += steps;
      break;
    case DIRECTIONS.WEST:
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