/**
 * Axis-aligned rectangle.
 * @typedef {{left: number, right: number, top: number, bottom: number}} Rect
 */

// Centralized geometry
export const AVATAR_SIZE = { w: 2, h: 2 };
export const OBSTACLE_SIZE = { w: 1, h: 1 };

/**
 * Build a rectangle from a top-left position and size.
 * @param {{x:number,y:number}} pos
 * @param {{w:number,h:number}} size
 * @returns {Rect}
 */
export function rectFromPos(pos, size) {
  return { left: pos.x, top: pos.y, right: pos.x + size.w, bottom: pos.y + size.h };
}

/** @param {{x:number,y:number}} pos */
export function avatarRectAt(pos) { return rectFromPos(pos, AVATAR_SIZE); }
/** @param {{x:number,y:number}} pos */
export function obstacleRectAt(pos) { return rectFromPos(pos, OBSTACLE_SIZE); }

/**
 * Test if two axis-aligned rectangles overlap.
 * @param {Rect} a
 * @param {Rect} b
 * @returns {boolean}
 */
export function rectanglesOverlap(a, b) {
  return !(a.right <= b.left ||
           a.left >= b.right ||
           a.bottom <= b.top ||
           a.top >= b.bottom);
}

/**
 * Check whether the avatar collides with any obstacles in the given state.
 * @param {{getPosition: () => {x:number,y:number}, getObstacles: () => Array<{x:number,y:number}>}} state
 * @returns {boolean}
 */
export function checkObstacleCollision(state) {
  const avatar = avatarRectAt(state.getPosition());
  return state.getObstacles().some(obstacle => {
    return rectanglesOverlap(avatar, obstacleRectAt(obstacle));
  });
}

/**
 * Check if the avatar reached the target.
 * @param {{getPosition: () => {x:number,y:number}, getTarget: () => {x:number,y:number}}} gameState
 * @returns {boolean}
 */
export function checkTargetReached(gameState) {
  const avatar = avatarRectAt(gameState.getPosition());
  const target = avatarRectAt(gameState.getTarget());
  return rectanglesOverlap(avatar, target);
}

/**
 * Check if a point is within the bounds of a stage of given size.
 * @param {{x: number, y: number}} point
 * @param {{x: number, y: number}} size
 * @returns {boolean}
 */
export function checkWithinBounds(point, size){
  return !(point.x < 0 || point.x > size.x || point.y < 0 || point.y > size.y);
}

/**
 * Prospective collision check: would avatar collide at the given position?
 * @param {{getObstacles: () => Array<{x:number,y:number}>}} state
 * @param {{x:number,y:number}} pos
 * @returns {boolean}
 */
export function collidesAtPosition(state, pos) {
  const avatar = avatarRectAt(pos);
  return state.getObstacles().some(o => rectanglesOverlap(avatar, obstacleRectAt(o)));
}
