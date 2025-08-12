// Game state management
export const gameState = {
  position: { x: 0, y: 0 },
  stageSize: { x: 20, y: 20 },
  direction: 1,
  obstacles: [
    // Scattered obstacles
    { x: 3, y: 2 },
    { x: 12, y: 3 },
    { x: 15, y: 4 },
    { x: 9, y: 6 },
    { x: 4, y: 11 },
    { x: 8, y: 13 },
    { x: 1, y: 15 },
    { x: 6, y: 18 },
    { x: 10, y: 10 },
    { x: 3, y: 14 },
    { x: 20, y: 10 },
    { x: 19, y: 10 },
  ],
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
    const obstacleRight = obstacle.x + 2;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + 2;
    
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
  const targetRight = gameState.target.x + 2;
  const targetTop = gameState.target.y;
  const targetBottom = gameState.target.y + 2;
  
  // Check for overlap in both x and y directions
  return !(avatarRight <= targetLeft || 
           avatarLeft >= targetRight || 
           avatarBottom <= targetTop || 
           avatarTop >= targetBottom);
}