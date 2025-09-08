import { applyRandomBackground, applyNightModeBackground } from './background-manager.js';
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
        if (this.isNightMode) {
            applyNightModeBackground();
            document.body.classList.add("night");
        } else {
            document.body.classList.remove("night");
            applyRandomBackground();

        }
    }
};
