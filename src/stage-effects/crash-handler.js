// Wall collision handling and animations
import { stageState, resetPosition } from '../game-state/stage-state.js';
import { updateAvatar } from './view-renderer.js';
import { stop } from '../code/code-executor.js';
import { stopTimer, resetTimer } from '../utility/timer.js';
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
    updateAvatar();
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
    updateAvatar();
  }, 500);

  stop();
}

export function handleTargetReached() {
  stopTimer();
  let stage = document.getElementById("stage");
  let avatar = document.getElementById("avatar");

  // Play victory sound if sound is enabled
  const soundCheckbox = document.getElementById('soundCheckbox');
  const soundEnabled = soundCheckbox ? soundCheckbox.checked : true;
  if (soundEnabled) {
    playVictorySound();
  }
  updateAvatar();
  setTimeout(() => {
    avatar.classList.add("target-reached");
    stage.classList.add("target-reached");
    requestAnimationFrame(() => {
      avatar.style.transform = `translate(${stageState.position.x}em, ${stageState.position.y}em) rotate(${stageState.direction * 90*4}deg) scale(8)`;
      setTimeout(() => {
        avatar.style.transform = `translate(${0}em, ${stageState.position.y}em) rotate(${stageState.direction * 90 * 3}deg) scale(8)`;
        setTimeout(() => {
          avatar.style.transform = `translate(${stageState.stageSize.x}em, ${0}em) rotate(${stageState.direction * 90 * 2}deg) scale(8)`;
          setTimeout(() => {
            avatar.style.transform = `translate(${stageState.stageSize.x/2}em, ${stageState.stageSize.y/2}em) rotate(${0}deg) scale(8)`;
          }, 300);

        }, 300);
      }, 300);
    });
  }, 200);

  setTimeout(() => {
    avatar.classList.remove("target-reached");
    stage.classList.remove("target-reached");
    resetPosition();
    updateAvatar();
  }, 3000);

  stop();
}