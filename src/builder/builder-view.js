// BuilderView: binds DOM elements and forwards user actions to the Builder API
// No game-state mutations happen here; all updates go through builder methods.

import { builder } from './builder.js';

export class BuilderView {
  /** Bind UI controls and canvas interactions */
  init() {
    // Controls
    this.nameInput = document.getElementById('builder-name');
    this.widthInput = document.getElementById('gridWidth');
    this.heightInput = document.getElementById('gridHeight');
    this.toolSelect = document.getElementById('builderTool');
    this.clearBtn = document.getElementById('clearObstaclesBtn');
    this.canvas = document.getElementById('gridCanvas');
    this.stage = document.getElementById('stage');

    // Initialize inputs from builder state
    try {
      const s = builder.getSnapshot();
      if (this.nameInput) this.nameInput.value = s.name || '';
      if (this.widthInput) this.widthInput.value = String(s.stageSize.x ?? 0);
      if (this.heightInput) this.heightInput.value = String(s.stageSize.y ?? 0);
      if (this.toolSelect) this.toolSelect.value = s.tool;
    } catch {}

    // Wire events -> builder API
    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => builder.setName(this.nameInput.value));
    }

    const onSizeChange = () => {
      // Parse numbers; let builder validate and clamp
      const wx = parseInt(this.widthInput?.value ?? '', 10);
      const hy = parseInt(this.heightInput?.value ?? '', 10);
      builder.setStageSize({ x: wx, y: hy });
    };
    if (this.widthInput) this.widthInput.addEventListener('change', onSizeChange);
    if (this.heightInput) this.heightInput.addEventListener('change', onSizeChange);

    if (this.toolSelect) {
      this.toolSelect.addEventListener('change', () => builder.setTool(this.toolSelect.value));
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('pointerdown', () => builder.clearObstacles());
    }

    if (this.canvas) {
      this.canvas.addEventListener('click', (event) => this.#handleCanvasClick(event));
    }
  }

  /** Convert mouse click to grid coordinates and forward to builder */
  #handleCanvasClick(event) {
    if (!this.canvas || !this.stage) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridSize = parseFloat(getComputedStyle(this.stage).fontSize);
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);

    builder.applyGridClick(gridX, gridY);
  }
}
