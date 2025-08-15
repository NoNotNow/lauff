// Movement and direction controls
import { gameState, setDirection, getDirection, parseNumber, withinBounds, checkTargetReached } from './game-state.js';
import { handleWallCollision } from './crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from './crash-handler.js';
import { checkObstacleCollision } from './game-state.js';
import { updateView } from './view-renderer.js';
import { beep } from './audio-player.js';

export function nextRight(){
  let startFreeRight=free(1);
  for(let n=1; n<free();n++){
    //todo get Position and add one in the direction 
    //check free to the right return n when > startFreeRight
  }
}

// Check how many steps the avatar can move from a pint to a direction without hitting an obstacle
export function free(directionOffset, inX, inY) {
  // Initialize starting position using coordinate object
  let currentPos = {
    x: (typeof inX === 'number') ? inX : gameState.position.x,
    y: (typeof inY === 'number') ? inY : gameState.position.y
  };
  
  const direction = getDirection(directionOffset);
  
  let spaces = 0;
  
  // Keep checking spaces in the current direction until we hit something
  while (true) {
    // Calculate the next position using coordinate object
    let nextPos = {
      x: currentPos.x,
      y: currentPos.y
    };
    
    switch (direction) {
      case 0: // North
        nextPos.y = currentPos.y - 1;
        break;
      case 1: // East
        nextPos.x = currentPos.x + 1;
        break;
      case 2: // South
        nextPos.y = currentPos.y + 1;
        break;
      case 3: // West
        nextPos.x = currentPos.x - 1;
        break;
    }
    
    // Check bounds
    if (nextPos.x < 0 || nextPos.x > gameState.stageSize.x || nextPos.y < 0 || nextPos.y > gameState.stageSize.y) {
      break;
    }
    
    // Check for obstacles
    const avatarLeft = nextPos.x;
    const avatarRight = nextPos.x + 2;
    const avatarTop = nextPos.y;
    const avatarBottom = nextPos.y + 2;
    
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
    currentPos = nextPos;
  }
  
  return spaces;
}

export async function go(input) {
  let steps = parseNumber(input);
  let freeStepsCount = free(); // Get the number of free steps

  // Play beep sound with frequency based on steps if sound is enabled
  const soundCheckbox = document.getElementById('soundCheckbox');
  const soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  
  if (soundEnabled) {
    beep(440 * steps);
  }

  // If the requested steps exceed the available free steps,
  // set steps to one beyond the free count to trigger collision
  if (steps > freeStepsCount) {
    steps = freeStepsCount + 1;
  }

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
