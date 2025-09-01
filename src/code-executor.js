// Code execution and program control
import { go, left, right, free, getNextRight, getNextLeft } from './movement.js';
import { startTimer, stopTimer, resetTimer } from './timer.js';
import { countStatements } from './code-analyser.js';
import { applyRandomBackground } from './background-manager.js';

// Random number generator function
function random(x) {
  if (typeof x !== 'number' || x < 1) {
    throw new Error("random() requires a positive number");
  }
  return Math.floor(Math.random() * x) + 1;
}

// Global execution state
let isRunning = false;
let currentDelay = null;
let movementDelayTime = 300;
export function setMovementDelay(input) { movementDelayTime = input; }
// Non-blocking delay function
function delay(ms = 300) {
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

// Extensible delay function for movement commands
async function movementDelay() {
  const loopCheckbox = document.getElementById('loopCheckbox');
  const shouldLoop = loopCheckbox ? loopCheckbox.checked : true;
  const delayTime = shouldLoop ? 60 : 300;
  await delay(movementDelayTime);
}

// Explicit wrapped functions
async function wrappedGo(input) {
  await go(input);
  await movementDelay();
}

async function wrappedLeft(input) {
  left(input);
  await movementDelay();
}

async function wrappedRight(input) {
  right(input);
  await movementDelay();
}

// Transform user code to use wrapped functions
function transformCode(code) {
  // Replace function calls with wrapped versions
  let transformedCode = code
    .replace(/\bgo\(/g, 'await go(')
    .replace(/\bleft\(/g, 'await left(')
    .replace(/\bright\(/g, 'await right(');

  return transformedCode;
}

// Parse and prepare user code for execution
function parseUserCode(code) {
  if (!code.trim()) {
    throw new Error("No code to execute");
  }

  // Transform the user's code to use wrapped functions
  const transformedCode = transformCode(code);
  console.log("Transformed code:", transformedCode);

  try {
    // Create an async function from the transformed code
    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
    const userFunction = new AsyncFunction('go', 'left', 'right', 'free', 'random',
      'getNextRight', 'getNextLeft',
      `
      // User's transformed code with movement functions available as parameters
      ${transformedCode}
    `);
    return userFunction;
  } catch (error) {
    throw new Error("Syntax error: " + error.message);
  }
}

// Execute user function repeatedly until stopped
async function executeUntilStopped(userFunction) {
  try {
    await userFunction(wrappedGo, wrappedLeft, wrappedRight,
      free, random, getNextRight, getNextLeft);
  } catch (error) {
    if (error.message === "Execution stopped") {
      throw error; // Re-throw to be caught by start()
    } else {
      console.error("Runtime error:", error);
      throw error;
    }
  }
}

function showLineIndicator(lineNumber) {
  const indicator = document.getElementById('line-indicator');
  indicator.textContent = `Executing Line: ${lineNumber}`;
  indicator.style.display = 'block';
}

export async function start() {
  applyRandomBackground();
  doCodeAnalysisAndStats();
  parseMovementDelay();
  if (isRunning) {
    stop();
    return;
  }

  let textbox = document.getElementById("code");
  let code = textbox.value;

  try {
    // Parse the user's code
    const userFunction = parseUserCode(code);

    isRunning = true;
    startTimer();
    console.log("Starting execution...");

    // Add visual feedback for fast speeds
    const speedSelect = document.getElementById('speedSelect');
    const speed = speedSelect ? speedSelect.value : 'normal';
    const stage = document.getElementById('stage');
    if (stage && (speed === 'fast' || speed === 'superfast')) {
      stage.classList.add('loop-active');
    }

    // Execute user function repeatedly until stopped
    await executeUntilStopped(userFunction);

    console.log("Continuous execution completed");
  } catch (error) {
    if (error.message === "Execution stopped") {
      console.log("Program stopped by user.");
      stopTimer();
    } else {
      console.error("Runtime error in user code:", error);
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = error.message;
      stopTimer();
      resetTimer();
    }
  } finally {
    isRunning = false;
  }
}

export function stop() {
  isRunning = false;
  stopTimer();
  stopTimer();

  // Remove loop-active class when stopping
  const stage = document.getElementById('stage');
  if (stage) {
    stage.classList.remove('loop-active');
  }

  // Clear error messages when stopping
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';
  if (currentDelay) {
    currentDelay.cancel();
  }
  console.log("Execution stopped");
}

export function parseMovementDelay() {
  let option = document.getElementById('speedSelect');
  let avatar = document.getElementById('avatar');
  let result = option.value;
  avatar.classList.toggle('fast', result < 100);
  setMovementDelay(result);
}

function doCodeAnalysisAndStats() {
  let code = document.getElementById("code").value;
  let result = countStatements(code);
  console.log("Code Analysis Result:", result);

  // Show number of function calls below the stopwatch
  const statementCountDiv = document.getElementById('statementCount');
  if (statementCountDiv) {
    if (result.success) {
      // Try to extract the number from the details string
      const match = result.details.match(/Anzahl Statements: (\d+)/);
      const count = match ? match[1] : '?';
      statementCountDiv.textContent = `Anzahl Funktionsaufrufe: ${count}`;
      statementCountDiv.style.display = 'block';
    } else {
      statementCountDiv.textContent = '';
      statementCountDiv.style.display = 'none';
    }
  }
}
