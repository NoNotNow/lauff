import { stageState } from './stage-state.js';
import {checkTargetReached, checkObstacleCollision, checkWithinBounds, collidesAtPosition} from './collision-detection.js';
import { handleWallCollision } from '../stage-effects/crash-handler.js';
import { handleObstacleCollision, handleTargetReached } from '../stage-effects/crash-handler.js';
import { updateAvatar } from '../stage-effects/view-renderer.js';
import { beep } from '../stage-effects/audio-player.js';
import { delay } from '../utility/delay.js';
import {parseNumber} from "../utility/helpers.js";

/** @typedef {{x:number,y:number}} Vec2 */

// Calculate new coordinates by moving from a starting position by a number of steps in a given direction
/**
 * @param {Vec2} startCoordinates
 * @param {number} steps
 * @param {0|1|2|3} direction
 * @returns {Vec2}
 */
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

/**
 * @returns {number}
 */
export function getNextRight() { return getNextTurn(1); }
/**
 * @returns {number}
 */
export function getNextLeft() { return getNextTurn(-1); }

/**
 * Returns how many steps forward until turning by directionOffset yields more free space than at start.
 * @param {number} directionOffset
 * @returns {number}
 */
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
/**
 * @param {number} [directionOffset]
 * @param {number} [inX]
 * @param {number} [inY]
 * @param {{getPosition: () => Vec2, getDirection: (offset?: number) => 0|1|2|3, getStageSize: () => Vec2, getObstacles: () => Array<Vec2>}} [state=stageState]
 * @returns {number}
 */
export function free(directionOffset, inX, inY, state = stageState) {
  // Initialize the starting position using a coordinate object
  let currentPos = {
    x: (typeof inX === 'number') ? inX : state.getPosition().x,
    y: (typeof inY === 'number') ? inY : state.getPosition().y
  };

  const direction = state.getDirection(directionOffset);

  let spaces = 0;

  // Keep checking spaces in the current direction until we hit something
  while (true) {
    // Calculate the next position using moveBy function
    const nextPos = moveBy(currentPos, 1, direction);

    if (!checkWithinBounds(nextPos, state.getStageSize())) break;

    if (collidesAtPosition(state, nextPos)) break;

    // This space is free, count it and move to the next position
    spaces++;
    currentPos = nextPos;
  }

  return spaces;
}
/** @type {number|null} */
let timeout = null;
/**
 * Show a speech bubble with text for a number of seconds.
 * When stop=true, waits synchronously and hides immediately after.
 * @param {string} text
 * @param {number} [seconds=1]
 * @param {boolean} [stop=false]
 * @returns {Promise<void>}
 */
export async function say(text, seconds, stop = false) {
  if (seconds === undefined) seconds = 1;
  /** @type {HTMLElement|null} */
  let bubble = document.getElementById("speech-bubble");
  try {
    if (bubble) {
      bubble.classList.add("visible");
      bubble.innerText = text;
    }
    if (stop) await delay(seconds * 1000);
  } finally {
    if (timeout) clearTimeout(timeout);
    if (!stop) {
      timeout = setTimeout(() => {
        if (bubble) bubble.classList.remove("visible");
        timeout = null;
      }, seconds * 1000);
    } else {
      if (bubble) bubble.classList.remove("visible");
    }
  }
}
/**
 * Move forward by the given input steps, handling collisions and view updates.
 * @param {number|string} input
 * @returns {Promise<void>}
 */
export async function go(input) {
  let steps = parseNumber(input);
  let freeStepsCount = free(); // Get the number of free steps

  // Play beep sound with frequency based on steps if sound is enabled
  /** @type {HTMLInputElement|null} */
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
  updateAvatar(Math.sqrt(steps));
}

/**
 * Turn right by the given number of quarter turns.
 * @param {number|string} input
 */
export function right(input) {
  stageState.turnRight(parseNumber(input));
  updateAvatar();
}

/**
 * Turn left by the given number of quarter turns.
 * @param {number|string} input
 */
export function left(input) {
  stageState.turnLeft(parseNumber(input));
  updateAvatar();
}
