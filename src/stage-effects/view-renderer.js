// View rendering and DOM updates
import {stageState} from '../game-state/stage-state.js';
import {designs} from '../design/designs.js';

export function updateFullStage(){
    adjustSize(stageState.getStageSize());
    updateStageView();
    drawGrid();
}

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
    let transform = "translate(" + stageState.getPosition().x + "em, "
        + stageState.getPosition().y + "em)";
    transform += "rotate(" + stageState.getDirection() * 90 + "deg) ";
    let maxX = stageState.getStageSize().x - (stageState.getStageSize().x / 3);
    let bubbleX = stageState.getPosition().x;
    if (bubbleX > maxX) bubbleX = maxX;
    speech.style.transform = "translate(" + (bubbleX - .5)
        + "em, " + (stageState.getPosition().y - 3) + "em)";
    avatar.style.transform = transform;
}

export function updateStageView() {
    let stage = document.getElementById("stage");
    stage.style.width = stageState.getStageSize().x + 2 + "em";
    stage.style.height = stageState.getStageSize().y + 2 + "em";

    const obstacleArray = Array.from(stage.querySelectorAll('.obstacle'));

    let delta = obstacleArray.length - stageState.getObstacles().length;
    if (delta > 0) {
        //remove excess obstacles
        for (let i = 0; i < delta; i++) {
            let obstacle = obstacleArray.pop();
            obstacle.remove();
        }
    }

    for (let i = 0; i < stageState.getObstacles().length; i++) {
        const obstacle = stageState.getObstacles()[i];
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
    target.style.left = stageState.getTarget().x + 'em';
    target.style.top = stageState.getTarget().y + 'em';

    updateAvatar();
}

export function drawGrid() {
    setTimeout(() => drawGridImpl(), 200);
    setTimeout(() => drawGridImpl(), 1000);
}

function drawGridImpl() {
    const canvas = document.getElementById('gridCanvas');
    const stage = document.getElementById('stage');

    if (!canvas || !stage) {
        console.log('Canvas or stage not found:', {canvas: !!canvas, stage: !!stage});
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
    const gridSize = parseFloat(getComputedStyle(stage).fontSize);

    console.log('Grid size (1em):', gridSize, 'px');

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Fill background gradient if enabled
    const bg = stageState.getBackgroundGradient ? stageState.getBackgroundGradient() : null;
    if (bg && bg.enabled) {
        const angleRad = ((bg.angle || 0) % 360) * Math.PI / 180;
        // Compute gradient vector endpoints across the rect
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const len = Math.sqrt(halfW * halfW + halfH * halfH);
        const dx = Math.cos(angleRad) * len;
        const dy = Math.sin(angleRad) * len;
        const x0 = halfW - dx;
        const y0 = halfH - dy;
        const x1 = halfW + dx;
        const y1 = halfH + dy;
        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, bg.from || '#ffffff');
        grad.addColorStop(1, bg.to || '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, rect.height);
    }

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