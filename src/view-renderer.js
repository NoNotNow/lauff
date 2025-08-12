// View rendering and DOM updates
import { gameState } from './game-state.js';

export function updateView() {
  let avatar = document.getElementById("avatar");
  let transform = "translate(" + gameState.position.x + "em, " + gameState.position.y + "em)";
  transform += "rotate(" + gameState.direction * 90 + "deg) ";

  avatar.style.transform = transform;
}

export function updateStageView() {
  let stage = document.getElementById("stage");
  stage.style.width = gameState.stageSize.x + 2 + "em";
  stage.style.height = gameState.stageSize.y + 2 + "em";
  
  // Clear existing obstacles
  const existingObstacles = stage.querySelectorAll('.obstacle');
  existingObstacles.forEach(obstacle => obstacle.remove());
  
  // Clear existing target
  const existingTarget = stage.querySelector('.target');
  if (existingTarget) existingTarget.remove();
  
  // Add obstacles to the stage
  gameState.obstacles.forEach(obstacle => {
    const obstacleElement = document.createElement('div');
    obstacleElement.className = 'obstacle';
    obstacleElement.style.left = obstacle.x + 'em';
    obstacleElement.style.top = obstacle.y + 'em';
    stage.appendChild(obstacleElement);
  });
  
  // Add target to the stage
  const targetElement = document.createElement('div');
  targetElement.className = 'target';
  targetElement.style.width = '3em';
  targetElement.style.height = '3em';
  targetElement.style.left = gameState.target.x + 'em';
  targetElement.style.top = gameState.target.y + 'em';
  stage.appendChild(targetElement);
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
  const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
  const gridSize = fontSize;
  
  console.log('Grid size (1em):', gridSize, 'px');
  
  // Clear canvas
  ctx.clearRect(0, 0, rect.width, rect.height);
  
  // Set line style
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
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