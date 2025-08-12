// Code execution and program control
import { go, left, right, free } from './movement.js';

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
  await delay();
}

// Explicit wrapped functions
async function wrappedGo(input) {
  go(input);
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
  
  // Create an async function from the transformed code
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  const userFunction = new AsyncFunction('go', 'left', 'right', 'free', 'random', `
    // User's transformed code with movement functions available as parameters
    ${transformedCode}
  `);
  
  return userFunction;
}

// Execute user function repeatedly until stopped
async function executeUntilStopped(userFunction) {

    try {
      await userFunction(wrappedGo, wrappedLeft, wrappedRight, free, random);
      // Small delay at the end of each execution cycle
      await delay(100);
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
    console.log("Starting execution...");
    
    // Execute user function repeatedly until stopped
    await executeUntilStopped(userFunction);
    
    console.log("Continuous execution completed");
  } catch (error) {
    if (error.message === "Execution stopped") {
      console.log("Program stopped by user.");
    } else {
      console.error("Parse error:", error);
    }
  } finally {
    isRunning = false;
  }
}

export function stop() {
  isRunning = false;
  if (currentDelay) {
    currentDelay.cancel();
  }
  console.log("Execution stopped");
}
