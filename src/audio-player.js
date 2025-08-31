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
    // Create a simple impulse response for reverb
    function createImpulseResponse(context, duration = 1.5, decay = 2) {
      const rate = context.sampleRate;
      const length = rate * duration;
      const impulse = context.createBuffer(2, length, rate);
      for (let i = 0; i < 2; i++) {
        const channel = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
          channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
        }
      }
      return impulse;
    }

  
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }
    let startPitch = 40;
    let endPitch = 300;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
  // Spaceship start: rising frequency, triangle wave for a smooth sci-fi sound
  oscillator.type = 'triangle';
  // Start slow, then accelerate pitch rise, then hold

  oscillator.frequency.setValueAtTime(startPitch, context.currentTime);
  oscillator.frequency.linearRampToValueAtTime(120, context.currentTime + 0.5); // slow start
  oscillator.frequency.exponentialRampToValueAtTime(endPitch, context.currentTime + 1.1); // accelerate
  oscillator.frequency.setValueAtTime(endPitch, context.currentTime + 1.1); // start hold

  // Add vibrato as soon as plateau is reached, less deep
  const vibrato = context.createOscillator();
  const vibratoGain = context.createGain();
  vibrato.type = 'sine';
  vibrato.frequency.setValueAtTime(1.5, context.currentTime + 1.1); 
  vibratoGain.gain.setValueAtTime(0, context.currentTime + 1.1);
  vibratoGain.gain.linearRampToValueAtTime(2, context.currentTime + 1.3); // fade in vibrato, less deep
  vibratoGain.gain.linearRampToValueAtTime(4, context.currentTime + 2.8);
  vibratoGain.gain.linearRampToValueAtTime(0, context.currentTime + 3.0); // fade out vibrato
  vibrato.connect(vibratoGain);
  vibratoGain.connect(oscillator.frequency);

  oscillator.frequency.setValueAtTime(endPitch, context.currentTime + 3.0); // hold pitch with vibrato

  // Gain: fade in and out, much longer duration
  gainNode.gain.setValueAtTime(0.01, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.18, context.currentTime + 0.12);
  gainNode.gain.linearRampToValueAtTime(0.18, context.currentTime + 1.1); // hold steady until vibrato starts
  gainNode.gain.linearRampToValueAtTime(0.01, context.currentTime + 3.0); // fade out evenly during vibrato

  // Add reverb (convolver)
  const convolver = context.createConvolver();
  convolver.buffer = createImpulseResponse(context, 1.5, 2);
  // Create gain nodes for wet (reverb) and dry (direct) mix
  const wetGain = context.createGain();
  const dryGain = context.createGain();
  wetGain.gain.value = 0.3; // 30% reverb
  dryGain.gain.value = 0.7; // 70% direct
  oscillator.connect(gainNode);
  // Dry path
  gainNode.connect(dryGain);
  dryGain.connect(context.destination);
  // Wet path (reverb)
  gainNode.connect(convolver);
  convolver.connect(wetGain);
  wetGain.connect(context.destination);

  oscillator.start(context.currentTime);
  vibrato.start(context.currentTime + 1.1);
  oscillator.stop(context.currentTime + 3.0);
  vibrato.stop(context.currentTime + 3.0);
  } catch (error) {
    console.warn('Victory sound playback failed:', error);
  }
}