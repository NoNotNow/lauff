// Audio playback module for generating beep sounds
let audioContext = null;

// Initialize audio context (reuse if already created)
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Generate a beep sound at the specified frequency
export async function beep(frequency) {
  try {
    const context = getAudioContext();
    
    // Resume audio context if it's suspended (required by some browsers)
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    // Create oscillator for the tone
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    // Configure gain for smooth fade out to prevent clicking
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Play the beep for 0.1 seconds
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
    
    // Return a promise that resolves when the beep is done
    return new Promise((resolve) => {
      oscillator.onended = resolve;
    });
  } catch (error) {
    console.warn('Audio playback failed:', error);
    // Don't throw error to avoid breaking the game if audio fails
  }
}

// Play a crash sound (low frequency descending tone)
export async function playCrashSound() {
  try {
    const context = getAudioContext();
    
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Configure oscillator for crash sound
    oscillator.type = 'sawtooth'; // Harsher sound for crash
    oscillator.frequency.setValueAtTime(300, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.5);
    
    // Configure gain with fade out
    gainNode.gain.setValueAtTime(0.2, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Play the crash sound for 0.5 seconds
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
    
  } catch (error) {
    console.warn('Crash sound playback failed:', error);
  }
}

// Play a victory sound (ascending melody)
export async function playVictorySound() {
  try {
    const context = getAudioContext();
    
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    // Play a sequence of ascending notes
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const noteDuration = 0.2;
    
    for (let i = 0; i < notes.length; i++) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(notes[i], context.currentTime);
      
      // Configure gain with envelope
      const startTime = context.currentTime + (i * noteDuration);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Play the note
      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    }
    
  } catch (error) {
    console.warn('Victory sound playback failed:', error);
  }
}