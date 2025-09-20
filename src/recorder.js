// Recorder functionality for capturing keyboard commands
import { editor } from './code/code-editor.js';
import { consolidate } from './code/command-consolidator.js';

let isRecording = false;
let recordButton = null;

export function initRecorder() {
  recordButton = document.getElementById('recordButton');
  
  if (!recordButton) {
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
  if (!isRecording) {
    return;
  }
  
  // Get current textarea content
  let currentCode = editor.getCode();

  // Prepare the new command text
  const commandText = `${command}();`;
  
  // Try to consolidate with the last line if possible
  const lines = currentCode.split('\n');
  const lastLine = lines[lines.length - 1];
  
  // Attempt consolidation with the last line
  const consolidated = consolidate(lastLine, commandText);
  
  console.log('Consolidation result:', JSON.stringify(consolidated), 'Type:', typeof consolidated);
  
  if (currentCode.trim() === '') {
    // Textarea is empty, add command directly
    editor.setCode(commandText);
  } else if (consolidated !== false) {
    if (consolidated === '' || consolidated.trim() === '') {
      // Commands cancelled out completely, remove the last line
      lines.pop();
      editor.setCode(lines.join('\n'));
      console.log(`Commands cancelled out: ${lastLine} + ${commandText} = (removed)`);
    } else {
      // Consolidation successful, replace the last line
      lines[lines.length - 1] = consolidated;
      editor.setCode(lines.join('\n'));
      console.log(`Consolidated commands: ${lastLine} + ${commandText} = ${consolidated}`);
    }
  } else {
    // No consolidation possible, add as new line
    if (currentCode.endsWith('\n')) {
      editor.setCode(currentCode + commandText);
    } else {
      editor.setCode(currentCode + '\n' + commandText);
    }
  }
  
  // Scroll to bottom of textarea to show new command
  editor.instance.scrollTo(0, editor.instance.getDoc().height);
  
  console.log(`Recorded command: ${commandText}${consolidated ? ' (consolidated)' : ''}`);
}