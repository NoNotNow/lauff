import { applyRandomBackground, applyNightModeBackground } from './background-manager.js';
import { editor } from '../code/code-editor.js';
import { drawGrid } from '../stage-effects/view-renderer.js';
export const designs = {
    isNightMode: false,
    init: function () {
        console.log("Designs initialized");
        this.decideMode();
        document.body.style.display = 'block';
    },
    decideMode: function () {
        const hour = new Date().getHours();
        this.isNightMode = hour < 9 || hour > 16;
        console.log("Design mode set to:", this.isNightMode ? "Night" : "Day");
        this.applyMode();
    },
    swap: function () {
        this.isNightMode = !this.isNightMode;
        this.applyMode();
    },
    applyMode() {
        if (this.isNightMode) {
            applyNightModeBackground();
            document.body.classList.add("night");
        } else {
            document.body.classList.remove("night");
            applyRandomBackground();
        }
        editor.reset(this.isNightMode);
        drawGrid();
    }
};
