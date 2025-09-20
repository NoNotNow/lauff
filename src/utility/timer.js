// Timer functionality
let startTime = null;
let timerInterval = null;
let running = false;

export function startTimer() {
  running = true;
  startTime = Date.now();
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    updateTimerDisplay();
  }, 250);
}

export function stopTimer() {
  updateTimerDisplay(); //end time should be exact 
  running = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function resetTimer() {
  stopTimer();
  startTime = null;
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = '0.00';
  }
}

function updateTimerDisplay() {
  if (!running || startTime === null) return;
  
  const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
  const timerElement = document.getElementById('timer');
  
  if (timerElement) {
    timerElement.textContent = elapsed.toFixed(2);
  }
}
