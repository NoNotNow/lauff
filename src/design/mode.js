// Centralized app mode controller
// Manages switching between 'editor' and 'builder' modes and notifies sub-systems

import { builder } from '../builder/builder.js';
import { editor } from '../code/code-editor.js';

class ModeController {
  /**
   * Current mode string: 'editor' or 'builder'
   * @returns {'editor'|'builder'}
   */
  get current() {
    return document.body.classList.contains('builder') ? 'builder' : 'editor';
  }

  /** Initialize mode state based on DOM at startup */
  initFromDOM() {
    // Ensure consistency (builder class drives the view)
    this.#announce();
  }

  /**
   * Set mode explicitly
   * @param {'editor'|'builder'} mode
   */
  setMode(mode) {
    if (mode === 'builder') {
      if (!builder.isEnabled()) builder.enable();
    } else {
      if (builder.isEnabled()) builder.disable();
    }
    this.#afterModeChanged(mode);
  }

  /** Toggle builder mode on/off */
  toggleBuilder() {
    const next = this.current === 'builder' ? 'editor' : 'builder';
    this.setMode(next);
  }

  /** Is builder mode active? */
  isBuilder() { return this.current === 'builder'; }

  #afterModeChanged(mode) {
    this.#announce();
    // Give layout a frame to update visibility, then let editor adjust itself
    requestAnimationFrame(() => requestAnimationFrame(() => editor.onModeChanged(mode)));
  }

  #announce() {
    // Keep the builder button state in sync if builder handled it already
    const btn = document.getElementById('builder-button');
    if (btn) {
      const isOn = this.isBuilder();
      btn.setAttribute('aria-pressed', String(isOn));
      btn.title = isOn ? 'Builder ausschalten' : 'Builder einschalten';
    }
  }
}

export const mode = new ModeController();
