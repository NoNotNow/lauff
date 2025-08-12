// Game state management
export const gameState = {
  position: { x: 0, y: 0 },
  stageSize: { x: 20, y: 20 },
  direction: 1,
  obstacles: [{"x":3,"y":2},{"x":4,"y":11},{"x":3,"y":14},{"x":3,"y":7},{"x":3,"y":8},{"x":3,"y":9},{"x":3,"y":10},{"x":3,"y":11},{"x":5,"y":11},{"x":6,"y":11},{"x":7,"y":11},{"x":8,"y":11},{"x":6,"y":0},{"x":3,"y":0},{"x":3,"y":1},{"x":2,"y":6},{"x":0,"y":6},{"x":1,"y":6},{"x":3,"y":6},{"x":6,"y":8},{"x":7,"y":8},{"x":8,"y":8},{"x":9,"y":8},{"x":11,"y":8},{"x":12,"y":8},{"x":14,"y":8},{"x":13,"y":8},{"x":10,"y":8},{"x":12,"y":9},{"x":12,"y":10},{"x":12,"y":11},{"x":12,"y":12},{"x":12,"y":13},{"x":10,"y":14},{"x":9,"y":14},{"x":11,"y":14},{"x":12,"y":14},{"x":8,"y":14},{"x":7,"y":14},{"x":6,"y":14},{"x":5,"y":14},{"x":4,"y":14},{"x":3,"y":19},{"x":3,"y":18},{"x":3,"y":17},{"x":3,"y":15},{"x":3,"y":16},{"x":6,"y":17},{"x":6,"y":18},{"x":6,"y":19},{"x":6,"y":20},{"x":6,"y":21},{"x":10,"y":15},{"x":11,"y":16},{"x":10,"y":17},{"x":11,"y":18},{"x":11,"y":19},{"x":16,"y":14},{"x":16,"y":15},{"x":16,"y":18},{"x":16,"y":16},{"x":16,"y":17},{"x":16,"y":19},{"x":16,"y":20},{"x":16,"y":21},{"x":17,"y":14},{"x":17,"y":13},{"x":17,"y":12},{"x":17,"y":11},{"x":17,"y":5},{"x":17,"y":6},{"x":17,"y":10},{"x":17,"y":9},{"x":17,"y":8},{"x":17,"y":7},{"x":17,"y":4},{"x":17,"y":3},{"x":14,"y":6},{"x":14,"y":4},{"x":14,"y":2},{"x":14,"y":0},{"x":18,"y":7},{"x":19,"y":7},{"x":20,"y":10},{"x":21,"y":10}],
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