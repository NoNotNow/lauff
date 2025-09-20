// Movement and direction controls
import { gameState, setDirection, getDirection, parseNumber, withinBounds, checkTargetReached } from './game-state.js';
import { handleWallCollision } from './stage-effects/crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from './stage-effects/crash-handler.js';
import { checkObstacleCollision } from './game-state.js';
import { updateView } from './stage-effects/view-renderer.js';
import { beep } from './stage-effects/audio-player.js';
import { delay } from './delay.js';

// Calculate new coordinates by moving from a starting position by a number of steps in a given direction
function moveBy(startCoordinates, steps, direction) {
  const result = {
    x: startCoordinates.x,
    y: startCoordinates.y
  };

  switch (direction) {
    case 0: // North
      result.y -= steps;
      break;
    case 1: // East
      result.x += steps;
      break;
    case 2: // South
      result.y += steps;
      break;
    case 3: // West
      result.x -= steps;
      break;
  }

  return result;
}

export function getNextRight() { return getNextTurn(1); }
export function getNextLeft() { return getNextTurn(-1); }

function getNextTurn(directionOffset) {
  let startFree = free(directionOffset);
  let currentFree;
  let pos = gameState.position;
  for (let n = 0; n < free(); n++) {
    pos = moveBy(pos, 1, getDirection());
    currentFree = free(directionOffset, pos.x, pos.y);
    if (currentFree > startFree) return n + 1;//check free to the side return n when > startFree
  }
  return 0;
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
    // Calculate the next position using moveBy function
    const nextPos = moveBy(currentPos, 1, direction);

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
let timeout=null;
export async function say(text, seconds) {
  if (seconds == undefined) seconds = 1;
  let bubble = document.getElementById("speech-bubble");
  try {
    bubble.classList.add("visible");
    bubble.innerText = text;
    //await delay(seconds * 1000);
  } finally {
    if(timeout) clearTimeout(timeout)
    setTimeout(() => {
          bubble.classList.remove("visible");

    }, seconds*1000);
  }
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
