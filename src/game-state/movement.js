import { stageState } from './stage-state.js';
import {checkTargetReached, checkObstacleCollision, checkWithinBounds} from './collision-detection.js';
import { handleWallCollision } from '../stage-effects/crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from '../stage-effects/crash-handler.js';
import { updateAvatar } from '../stage-effects/view-renderer.js';
import { beep } from '../stage-effects/audio-player.js';
import { delay } from '../utility/delay.js';
import {parseNumber} from "../utility/helpers.js";

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
  let pos = stageState.getPosition();
  for (let n = 0; n < free(); n++) {
    pos = moveBy(pos, 1, stageState.getDirection());
    currentFree = free(directionOffset, pos.x, pos.y);
    if (currentFree > startFree) return n + 1;//check free to the side return n when > startFree
  }
  return 0;
}
// Check how many steps the avatar can move from a point to a direction without hitting an obstacle
export function free(directionOffset, inX, inY) {
  // Initialize the starting position using a coordinate object
  let currentPos = {
    x: (typeof inX === 'number') ? inX : stageState.getPosition().x,
    y: (typeof inY === 'number') ? inY : stageState.getPosition().y
  };

  const direction = stageState.getDirection(directionOffset);

  let spaces = 0;

  // Keep checking spaces in the current direction until we hit something
  while (true) {
    // Calculate the next position using moveBy function
    const nextPos = moveBy(currentPos, 1, direction);

    if(!checkWithinBounds(nextPos,stageState.getStageSize())) break;

    // Check for obstacles
    const avatarLeft = nextPos.x;
    const avatarRight = nextPos.x + 2;
    const avatarTop = nextPos.y;
    const avatarBottom = nextPos.y + 2;

    const hasObstacle = stageState.getObstacles().some(obstacle => {
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
let timeout = null;
export async function say(text, seconds, stop = false) {
  if (seconds === undefined) seconds = 1;
  let bubble = document.getElementById("speech-bubble");
  try {
    bubble.classList.add("visible");
    bubble.innerText = text;
    if (stop) await delay(seconds * 1000);
  } finally {
    if (timeout) clearTimeout(timeout)
    if (!stop) {
      setTimeout(() => {
        bubble.classList.remove("visible");
      }, seconds * 1000);
    } else {
      bubble.classList.remove("visible");
    }
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

  switch (stageState.getDirection()) {
    case 0:
      stageState.getPosition().y -= steps;
      break;
    case 1:
      stageState.getPosition().x += steps;
      break;
    case 2:
      stageState.getPosition().y += steps;
      break;
    case 3:
      stageState.getPosition().x -= steps;
      break;
  }

  if (!stageState.targetWithinBounds()) handleWallCollision();
  if (checkObstacleCollision(stageState)) handleObstacleCollision();
  if (checkTargetReached(stageState)) handleTargetReached();
  updateAvatar();
}

export function right(input) {
  stageState.turnRight(parseNumber(input));
  updateAvatar();
}

export function left(input) {
  stageState.turnLeft(parseNumber(input));
  updateAvatar();
}
