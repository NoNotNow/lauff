/**
 * Axis-aligned rectangle.
 * @typedef {{left: number, right: number, top: number, bottom: number}} Rect
 */

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
  const avatar = {
    left: state.getPosition().x,
    right: state.getPosition().x + 2,
    top: state.getPosition().y,
    bottom: state.getPosition().y + 2
  };

  return state.getObstacles().some(obstacle => {
    const rect = {
      left: obstacle.x,
      right: obstacle.x + 1,
      top: obstacle.y,
      bottom: obstacle.y + 1
    };
    return rectanglesOverlap(avatar, rect);
  });
}

/**
 * Check if the avatar reached the target.
 * @param {{getPosition: () => {x:number,y:number}, getTarget: () => {x:number,y:number}}} gameState
 * @returns {boolean}
 */
export function checkTargetReached(gameState) {
  const avatar = {
    left: gameState.getPosition().x,
    right: gameState.getPosition().x + 2,
    top: gameState.getPosition().y,
    bottom: gameState.getPosition().y + 2
  };

  const target = {
    left: gameState.getTarget().x,
    right: gameState.getTarget().x + 2,
    top: gameState.getTarget().y,
    bottom: gameState.getTarget().y + 2
  };

  return rectanglesOverlap(avatar, target);
}
/**
 * Check if a point is within the bounds of a stage of given size.
 * @param {{x: number, y: number}} point
 * @param {{x: number, y: number}} size
 * @returns {boolean}
 */
export function checkWithinBounds(point,size){
    return  !(point.x < 0 || point.x > size.x || point.y < 0 || point.y > size.y)
}
