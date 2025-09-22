
export function checkObstacleCollision(state) {
  const avatarLeft = state.getPosition().x;
  const avatarRight = state.getPosition().x + 2;
  const avatarTop = state.getPosition().y;
  const avatarBottom = state.getPosition().y + 2;
  
  return state.getObstacles().some(obstacle => {
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
}

export function checkTargetReached(gameState) {
  const avatarLeft = gameState.getPosition().x;
  const avatarRight = gameState.getPosition().x + 2;
  const avatarTop = gameState.getPosition().y;
  const avatarBottom = gameState.getPosition().y + 2;
  
  const targetLeft = gameState.getTarget().x;
  const targetRight = gameState.getTarget().x + 2;
  const targetTop = gameState.getTarget().y;
  const targetBottom = gameState.getTarget().y + 2;
  
  // Check for overlap in both x and y directions
  return !(avatarRight <= targetLeft || 
           avatarLeft >= targetRight || 
           avatarBottom <= targetTop || 
           avatarTop >= targetBottom);
}
