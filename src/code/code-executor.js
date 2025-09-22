// Code execution and program control
import {free, getNextLeft, getNextRight, go, left, right, say} from '../game-state/movement.js';
import {resetTimer, startTimer, stopTimer} from '../utility/timer.js';
import {analyseRuntimeError, analyseSyntaxError, countStatements} from './code-analyser.js';
import {localizeUserCodeError} from '../localizer.js';
import {editor} from './code-editor.js';
import {cancelDelay, delay} from '../utility/delay.js';
import {isRunning, setIsRunning} from '../global-state.js';


// Random number generator function
function random(x) {
  if (typeof x !== 'number' || x < 1) {
    throw new Error("random() requires a positive number");
  }
  return Math.floor(Math.random() * x) + 1;
}

// Global execution state
let movementDelayTime = 300;
export function setMovementDelay(input) { movementDelayTime = input; }
// Non-blocking delay function


// Extensible delay function for movement commands
async function movementDelay() {
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

async function wrappedSay(text, delay, stop) {
  await say(text, delay, stop);
}

// Transform user code to use wrapped functions
function transformCode(code) {
  // Replace function calls with wrapped versions
    return code
      .replace(/\bgo\(/g, 'await go(')
      .replace(/\bleft\(/g, 'await left(')
      .replace(/\bright\(/g, 'await right(')
      .replace(/\bsay\(/g, 'await say(');
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
      return new AsyncFunction('go', 'left', 'right', 'free', 'random',
        'getNextRight', 'getNextLeft', 'say',
        `
      // User's transformed code with movement functions available as parameters
      ${transformedCode}
    `);
  } catch (error) {
    let result = analyseSyntaxError(code); // Log detailed syntax error
    if (result && !result.success) {
      throw new Error(localizeUserCodeError(result));
    }
    throw new Error("Syntax error: " + error.message);
  }
}

// Execute user function repeatedly until stopped
async function executeUntilStopped(userFunction) {
  try {
    await userFunction(wrappedGo, wrappedLeft, wrappedRight,
      free, random, getNextRight, getNextLeft, wrappedSay);
  } catch (error) {
    if (error.message === "Execution stopped") {
      throw error; // Re-throw to be caught by start()
    } else {
      console.error("Runtime error:", error);
      throw error;
    }
  }
}

export async function start() {
  removeErrorMessage();
  doCodeAnalysisAndStats();
  parseMovementDelay();
  if (isRunning) {
    stop();
    return;
  }

  let code = editor.getCode();

  try {
    // Parse the user's code
    const userFunction = parseUserCode(code);
    const speedSelect = document.getElementById('speedSelect');
    const speed = speedSelect ? speedSelect.value : 'normal';
    const stage = document.getElementById('stage');

    setIsRunning(true);
    startTimer();
    window.document.body.classList.add('running');
    console.log("Starting execution...");


    // Execute user function repeatedly until stopped
    await executeUntilStopped(userFunction);

    console.log("Continuous execution completed");
  } catch (error) {
    if (error.message === "Execution stopped") {
      console.log("Program stopped by user.");
    } else {
      console.error("Runtime error in user code:", error);
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = localizeUserCodeError(analyseRuntimeError(error));
      resetTimer();
    }
  } finally {
    stopTimer();
    setIsRunning(false);
    document.body.classList.remove('running');

  }
}

export function stop() {
  setIsRunning(false);
  stopTimer();
  stopTimer();

  // Remove loop-active class when stopping
  const stage = document.getElementById('stage');
  if (stage) {
    stage.classList.remove('loop-active');
  }

  // Clear error messages when stopping
  removeErrorMessage();
  cancelDelay();
  console.log("Execution stopped");
}

function removeErrorMessage() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';
}

export function parseMovementDelay() {
  let option = document.getElementById('speedSelect');
  let avatar = document.getElementById('avatar');
  let result = option.value;
  avatar.classList.toggle('fast', result < 100);
  setMovementDelay(result);
}

function doCodeAnalysisAndStats() {
  let code = editor.getCode();
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
