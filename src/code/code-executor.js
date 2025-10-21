// Code execution and program control
import {free, getNextLeft, getNextRight, go, left, right, say} from '../game-state/movement.js';
import {resetTimer, startTimer, stopTimer} from '../utility/timer.js';
import {analyseRuntimeError, analyseSyntaxError, countStatements} from './code-analyser.js';
import {editor} from './code-editor.js';
import {cancelDelay, delay} from '../utility/delay.js';
import {isRunning, setIsRunning} from '../global-state.js';
import {localizer} from "../localizer/localizer.js";
import {MessageTokens} from "../localizer/tokens.js";


// Random number generator function
/**
 * Returns a random integer between 1 and x (inclusive).
 * @param {number} x
 * @returns {number}
 */
function random(x) {
  if (typeof x !== 'number' || x < 1) {
    throw new Error("random() requires a positive number");
  }
  return Math.floor(Math.random() * x) + 1;
}

// Global execution state
/** @type {number} */
let movementDelayTime = 300;
/**
 * Set the movement delay in milliseconds.
 * @param {number} input
 */
export function setMovementDelay(input) { movementDelayTime = input; }
// Non-blocking delay function


// Extensible delay function for movement commands
/** @returns {Promise<void>} */
async function movementDelay(factor=1) {
  await delay(movementDelayTime*factor);
}

// Explicit wrapped functions
/** @param {number|string} input */
async function wrappedGo(input) {
  await go(input);
  await movementDelay(input);
}

/** @param {number|string} input */
async function wrappedLeft(input) {
  left(input);
  await movementDelay();
}

/** @param {number|string} input */
async function wrappedRight(input) {
  right(input);
  await movementDelay();
}

/**
 * @param {string} text
 * @param {number} delay
 * @param {boolean} stop
 */
async function wrappedSay(text, delay, stop) {
  await say(text, delay, stop);
}

// Transform user code to use wrapped functions
/**
 * @param {string} code
 * @returns {string}
 */
function transformCode(code) {
  // Replace movement calls with awaited versions.
  // The identifiers (go, left, right, say) refer to wrapped functions passed as parameters.
    return code
      .replace(/\bgo\(/g, 'await go(')
      .replace(/\bleft\(/g, 'await left(')
      .replace(/\bright\(/g, 'await right(')
      .replace(/\bsay\(/g, 'await say(');
}

// Parse and prepare user code for execution
/**
 * @param {string} code
 * @returns {(go:Function,left:Function,right:Function,free:Function,random:Function,getNextRight:Function,getNextLeft:Function,say:Function) => Promise<void>}
 */
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
      throw new Error(localizer.localizeUserCodeError(result));
    }
    throw new Error("Syntax error: " + error.message);
  }
}

// Execute the parsed user program once
/**
 * @param {Function} userFunction
 */
async function executeUserProgram(userFunction) {
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

/**
 * Start execution of user code.
 * @returns {Promise<void>}
 */
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

    setIsRunning(true);
    startTimer();
    window.document.body.classList.add('running');
    console.log("Starting execution...");


    // Execute user program once
    await executeUserProgram(userFunction);

    console.log("Execution completed");
  } catch (error) {
    if (error.message === "Execution stopped") {
      console.log("Program stopped by user.");
    } else {
      console.error("Runtime error in user code:", error);
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = localizer.localizeUserCodeError(analyseRuntimeError(error));
      resetTimer();
    }
  } finally {
    stopTimer();
    setIsRunning(false);
    document.body.classList.remove('running');

  }
}

/**
 * Stop execution and reset UI state.
 */
export function stop() {
  setIsRunning(false);
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

/** Clear the error message banner. */
function removeErrorMessage() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';
}

/**
 * Read UI and set movement delay, updating CSS animation class.
 */
export function parseMovementDelay() {
  /** @type {HTMLSelectElement} */
  // @ts-ignore next line: element exists on page
  let option = document.getElementById('speedSelect');
  /** @type {HTMLElement} */
  // @ts-ignore next line: element exists on page
  let avatar = document.getElementById('avatar');
  let result = option.value;
  avatar.classList.toggle('fast', result < 100);
  setMovementDelay(result);
}

/** Run static analysis and update UI stats. */
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
      statementCountDiv.textContent = localizer.localizeMessage(MessageTokens.numberOfFunctionCalls)+`: ${count}`;
      statementCountDiv.style.display = 'block';
    } else {
      statementCountDiv.textContent = '';
      statementCountDiv.style.display = 'none';
    }
  }
}
