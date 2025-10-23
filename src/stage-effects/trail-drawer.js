import {designs} from "../design/designs.js";

class TrailDrawer{
    canvas=null;
    stage=null;
    ctx=null;
    rect=null;
    constructor() {
         this.canvas = document.getElementById('trailCanvas');
         this.stage = document.getElementById('stage');
         this.ctx = this.canvas.getContext('2d');
         setTimeout(() => this.init(), 1000);
    }

    init(){
        this.rect = this.stage.getBoundingClientRect();
        if(!this.rect){ 
            setTimeout(() => this.init(), 1000);    
            return;
        }
        this.gridSize = parseFloat(getComputedStyle(stage).fontSize);

        // Force a reflow to ensure we get accurate dimensions
        this.stage.offsetHeight;

        // Set high-resolution canvas size (2x for retina displays)
        const pixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = this.rect.width * pixelRatio;
        this.canvas.height = this.rect.height * pixelRatio;

        // Scale the canvas back down using CSS
        this.canvas.style.width = this.rect.width + 'px';
        this.canvas.style.height = this.rect.height + 'px';

        // Scale the drawing context to match the device pixel ratio
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any previous transform
        this.ctx.scale(pixelRatio, pixelRatio);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    }

    /**
     *
     * @param {Vec2} startPos
     * @param {Vec2} newPosition
     * @param {Vec2} stageSize
     * @param {string} color
     * @returns {void}
     */
    drawLine(oldPosition, newPosition, stageSize, color) {
        if (!this.canvas || !this.stage || !this.ctx) return;
        const offset= [1,1];
        const startPos = {x: oldPosition.x + offset[0], y: oldPosition.y + offset[1]};
        const endPos = {x: newPosition.x + offset[0], y: newPosition.y + offset[1]};
        const fromX = startPos.x * this.gridSize;
        const fromY = startPos.y * this.gridSize;
        const toX = endPos.x * this.gridSize;
        const toY = endPos.y * this.gridSize;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 5;

        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
    }
}

export const trailDrawer = new TrailDrawer();