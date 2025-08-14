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