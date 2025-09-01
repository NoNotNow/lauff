import { applyRandomBackground, applyNightModeBackground } from './background-manager.js';
export const designs = {
    isNightMode: false,
    init: function () {
        console.log("Designs initialized");
        this.decideMode();
    },
    decideMode: function () {
        const hour = new Date().getHours();
        this.isNightMode = hour < 6 || hour > 18;
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
