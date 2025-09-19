import {isRunning} from './global-state.js';
let currentDelay = null;

export function delay(ms = 300) {
  return new Promise((resolve, reject) => {
    if (!isRunning) {
      reject(new Error("Execution stopped"));
      return;
    }

    const timeoutId = setTimeout(() => {
      currentDelay = null;
      if (isRunning) {
        resolve();
      } else {
        reject(new Error("Execution stopped"));
      }
    }, ms);

    currentDelay = {
      cancel: () => {
        clearTimeout(timeoutId);
        currentDelay = null;
        reject(new Error("Execution stopped"));
      }
    };
  });
}

export function cancelDelay(){
   if(currentDelay){
    currentDelay.cancel();
   }
}