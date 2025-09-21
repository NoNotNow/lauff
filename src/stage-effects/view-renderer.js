// View rendering and DOM updates
import { gameState } from '../game-state/game-state.js';
import { designs } from '../design/designs.js';
/**
 * 
 * @param {{x,y}} size 
 */
export function adjustSize(size) {
  const maxSize = size.x > size.y ? size.x : size.y;
  let em = 22 / (maxSize + 2);

  let stageElement = document.getElementById("stage");
  stageElement.style.fontSize = em + "em";
}

export function updateAvatar() {
  let avatar = document.getElementById("avatar");
  let speech = document.getElementById("speech-bubble");
  let transform = "translate(" + gameState.position.x + "em, "
    + gameState.position.y + "em)";
  transform += "rotate(" + gameState.direction * 90 + "deg) ";
  let maxX =  gameState.stageSize.x - (gameState.stageSize.x/3);
  let bubbleX= gameState.position.x;
  if(bubbleX>maxX) bubbleX = maxX;
  speech.style.transform = "translate(" + (bubbleX - .5)
    + "em, " + (gameState.position.y - 3) + "em)";
  avatar.style.transform = transform;
}

export function updateStageView() {
  let stage = document.getElementById("stage");
  stage.style.width = gameState.stageSize.x + 2 + "em";
  stage.style.height = gameState.stageSize.y + 2 + "em";

  const obstacleArray = Array.from(stage.querySelectorAll('.obstacle'));

  let delta = obstacleArray.length - gameState.obstacles.length;
  if (delta > 0) {
    //remove excess obstacles
    for (let i = 0; i < delta; i++) {
      let obstacle = obstacleArray.pop();
      obstacle.remove();
    }
  }

  for (let i = 0; i < gameState.obstacles.length; i++) {
    const obstacle = gameState.obstacles[i];
    if (obstacleArray[i]) {
      //update existing obstacle position if it exists
      obstacleArray[i].style.left = obstacle.x + 'em';
      obstacleArray[i].style.top = obstacle.y + 'em';
    } else {
      const obstacleElement = document.createElement('div');
      obstacleElement.className = 'obstacle';
      obstacleElement.style.left = obstacle.x + 'em';
      obstacleElement.style.top = obstacle.y + 'em';
      stage.appendChild(obstacleElement);
    }
  }


  const target = stage.querySelector('.target');
  target.style.left = gameState.target.x + 'em';
  target.style.top = gameState.target.y + 'em';
}

export function drawGrid() {
  const canvas = document.getElementById('gridCanvas');
  const stage = document.getElementById('stage');

  if (!canvas || !stage) {
    console.log('Canvas or stage not found:', { canvas: !!canvas, stage: !!stage });
    return;
  }

  const ctx = canvas.getContext('2d');
  const rect = stage.getBoundingClientRect();

  console.log('Stage rect:', rect);

  // Force a reflow to ensure we get accurate dimensions
  stage.offsetHeight;

  // Set high-resolution canvas size (2x for retina displays)
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = rect.width * pixelRatio;
  canvas.height = rect.height * pixelRatio;

  // Scale the canvas back down using CSS
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  // Scale the drawing context to match the device pixel ratio
  ctx.scale(pixelRatio, pixelRatio);

  console.log('Canvas size set to:', canvas.width, 'x', canvas.height, 'with pixel ratio:', pixelRatio);

  // Calculate grid size in pixels (1em)
  const fontSize = parseFloat(getComputedStyle(stage).fontSize);
  const gridSize = fontSize;

  console.log('Grid size (1em):', gridSize, 'px');

  // Clear canvas
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Set line style
  if (designs.isNightMode) {
    ctx.strokeStyle = 'rgba(243, 208, 9, 0.12)';
  } else {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  }
  ctx.lineWidth = 0.5;

  let lineCount = 0;

  // Draw vertical lines
  for (let x = gridSize; x < rect.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rect.height);
    ctx.stroke();
    lineCount++;
  }

  // Draw horizontal lines
  for (let y = gridSize; y < rect.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(rect.width, y);
    ctx.stroke();
    lineCount++;
  }

  console.log('Drew', lineCount, 'grid lines');

  // Add click event listener to canvas for grid interaction
  canvas.style.pointerEvents = 'auto';
}