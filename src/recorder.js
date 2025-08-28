// Recorder functionality for capturing keyboard commands
import { consolidate } from './command-consolidator.js';

let isRecording = false;
let recordButton = null;
let codeTextarea = null;

export function initRecorder() {
  recordButton = document.getElementById('recordButton');
  codeTextarea = document.getElementById('code');
  
  if (!recordButton || !codeTextarea) {
    console.error('Recorder elements not found');
    return;
  }
  
  // Ensure button starts in off state
  recordButton.classList.remove('record-on');
  
  // Set up click event listener
  recordButton.addEventListener('click', toggleRecording);
  
  console.log('Recorder initialized - default state: OFF');
}

function toggleRecording() {
  isRecording = !isRecording;
  
  if (isRecording) {
    recordButton.classList.add('record-on');
    recordButton.textContent = 'Recording';
    console.log('Recording started');
  } else {
    recordButton.classList.remove('record-on');
    recordButton.textContent = 'Record';
    console.log('Recording stopped');
  }
}

export function handleRecordedCommand(command) {
  if (!isRecording || !codeTextarea) {
    return;
  }
  
  // Get current textarea content
  let currentCode = codeTextarea.value;
  
  // Prepare the new command text
  const commandText = `${command}();`;
  
  // Try to consolidate with the last line if possible
  const lines = currentCode.split('\n');
  const lastLine = lines[lines.length - 1];
  
  // Attempt consolidation with the last line
  const consolidated = consolidate(lastLine, commandText);
  
  if (currentCode.trim() === '') {
    // Textarea is empty, add command directly
    codeTextarea.value = commandText;
  } else if (consolidated) {
    // Consolidation successful, replace the last line
    lines[lines.length - 1] = consolidated;
    codeTextarea.value = lines.join('\n');
    console.log(`Consolidated commands: ${lastLine} + ${commandText} = ${consolidated}`);
  } else {
    // No consolidation possible, add as new line
    if (currentCode.endsWith('\n')) {
      codeTextarea.value = currentCode + commandText;
    } else {
      codeTextarea.value = currentCode + '\n' + commandText;
    }
  }
  
  // Scroll to bottom of textarea to show new command
  codeTextarea.scrollTop = codeTextarea.scrollHeight;
  
  console.log(`Recorded command: ${commandText}${consolidated ? ' (consolidated)' : ''}`);
}