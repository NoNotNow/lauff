// Wall collision handling and animations
import { gameState, resetPosition } from './game-state.js';
import { updateView } from './view-renderer.js';
import { stop } from './code-executor.js';
import { stopTimer, resetTimer } from './timer.js';
import { playCrashSound, playVictorySound } from './audio-player.js';

export function handleWallCollision() {
  let stage = document.getElementById("stage");
  let avatar = document.getElementById("avatar");
  
  // Play crash sound if sound is enabled
  const soundCheckbox = document.getElementById('soundCheckbox');
  const soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  if (soundEnabled) {
    playCrashSound();
  }
  
  avatar.classList.add("wall-collision");
  stage.classList.add("wall-collision");
  
  stopTimer();
  
  setTimeout(() => {
    avatar.classList.remove("wall-collision");
    stage.classList.remove("wall-collision");
    resetPosition();
    resetTimer();
    updateView();
  }, 500);
  
  stop();
}

export function handleObstacleCollision() {
  let stage = document.getElementById("stage");
  let avatar = document.getElementById("avatar");
  
  // Play crash sound if sound is enabled
  const soundCheckbox = document.getElementById('soundCheckbox');
  const soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  if (soundEnabled) {
    playCrashSound();
  }
  
  avatar.classList.add("obstacle-collision");
  stage.classList.add("obstacle-collision");
  
  stopTimer();
  
  setTimeout(() => {
    avatar.classList.remove("obstacle-collision");
    stage.classList.remove("obstacle-collision");
    resetPosition();
    resetTimer();
    updateView();
  }, 500);
  
  stop();
}

export function handleTargetReached() {
  let stage = document.getElementById("stage");
  let avatar = document.getElementById("avatar");
  
  // Play victory sound if sound is enabled
  const soundCheckbox = document.getElementById('soundCheckbox');
  const soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  if (soundEnabled) {
    playVictorySound();
  }
  
  avatar.classList.add("target-reached");
  stage.classList.add("target-reached");
  resetPosition();
  updateView();
  
  stopTimer();
  
  setTimeout(() => {
    avatar.classList.remove("target-reached");
    stage.classList.remove("target-reached");
    updateView();
  }, 2000);
  
  stop();
}