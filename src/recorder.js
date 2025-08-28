// Recorder functionality for capturing keyboard commands
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
  
  // Add command with proper formatting
  const commandText = `${command}();`;
  
  // If textarea is empty or ends with whitespace, add command directly
  // Otherwise add a newline first
  if (currentCode.trim() === '') {
    codeTextarea.value = commandText;
  } else if (currentCode.endsWith('\n')) {
    codeTextarea.value = currentCode + commandText;
  } else {
    codeTextarea.value = currentCode + '\n' + commandText;
  }
  
  // Scroll to bottom of textarea to show new command
  codeTextarea.scrollTop = codeTextarea.scrollHeight;
  
  console.log(`Recorded command: ${commandText}`);
}