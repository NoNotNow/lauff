// Save and load functionality for the code editor
import { stageState } from '../game-state/stage-state.js';
import { editor } from '../code/code-editor.js';
import { toFileName } from "../utility/helpers.js";
import { localizer } from '../localizer/localizer.js';
import { MessageTokens } from '../localizer/tokens.js';
/** @typedef {import('../types/stage-model.js').StageBlueprint} StageBlueprint */


// Get the current map name
/** @returns {string} */
function getCurrentMapName() {
  // Find which map matches the current obstacles
  return stageState.getName();
}

/** @returns {void} */
export function saveCode() {
  console.log("saveCode function called");
  const code = editor.getCode();
  const mapName = toFileName(getCurrentMapName());
  console.log("Saving code:", code);
  console.log("Saving code for map:", mapName);
  localStorage.setItem(`savedCode_${mapName}`, code);
  console.log("Code saved to localStorage for map:", mapName);

}

/**
 * @param {string|null} mapName
 * @returns {void}
 */
export function loadCode(mapName = null) {
  console.log("loadCode function called");
  const currentMapName = toFileName(mapName || getCurrentMapName());
  const savedCode = localStorage.getItem(`savedCode_${currentMapName}`);
  console.log("Retrieved saved code for " + currentMapName + ":\n", savedCode);
  if (savedCode) {
    editor.setCode(savedCode);
    console.log("Code loaded into editor for map:", currentMapName);
  } else {
    console.log("No saved code found in localStorage for map:", currentMapName);
    // Set default code if no saved code exists
    if (!editor.getCode().trim()) {
      editor.setCode('go();');
    }
  }
}

/**
 * Download the current editor code to a .lauff file. Prompts for a name.
 */
export function downloadEditorCode() {
  try {
    const code = editor.getCode() || '';
    const defaultName = toFileName(getCurrentMapName() || 'program');
    let name = window.prompt('File name for your code (without extension):', defaultName);
    if (name == null) return; // cancel
    name = toFileName(String(name).trim() || defaultName);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.lauff`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  } catch (e) {
    console.error('Code download failed', e);
    alert('Download failed.');
  }
}

/**
 * Open a .lauff file and load its contents into the editor.
 */
export function uploadEditorCode() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.lauff,text/plain';
  input.style.display = 'none';
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) { input.remove(); return; }
    try {
      const text = await file.text();
      editor.setCode(text);
    } catch (e) {
      console.error('Code upload failed', e);
      alert('Invalid code file.');
    } finally {
      input.remove();
    }
  }, { once: true });
  document.body.appendChild(input);
  input.click();
}

/**
 * @param {string} selected
 * @returns {void}
 */
export function saveSelectedMap(selected) {
  localStorage.setItem(`selectedMap`, toFileName(selected));
}

/** @returns {string} */
export function getStoredSelectedMap() {
  return toFileName(localStorage.getItem('selectedMap'));
}

/**
 * @param {StageBlueprint} bluePrint
 */
export function saveBluePrint(bluePrint) {
  let fileName = toFileName(bluePrint.name);
  localStorage.setItem(`blueprint_${fileName}`, JSON.stringify(bluePrint),);
}


/**
 * @param {string} mapName
 * @returns {StageBlueprint|null}
 */
export function loadBluePrint(mapName) {
  const blueprint = localStorage.getItem(`blueprint_${toFileName(mapName)}`);
  if (blueprint) {
    return JSON.parse(blueprint);
  }
  return null;
}

/**
 * Handle the copy action for the editor.
 * Copies the current code to the clipboard.
 */
export function copyCode() {
  const code = editor.getCode(); // Get the current code from the editor
  navigator.clipboard.writeText(code) // Copy to clipboard
    .then(() => {
      console.log('Code copied to clipboard!');
      alert('Code copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

/**
 * Handle the paste action for the editor.
 * Pastes the copied code from the clipboard into the editor.
 */
export function pasteCode() {
  // ask before pasting
  if (editor.getCode().trim().length > 0) {
    if (!confirm(localizer.localizeMessage(MessageTokens.confirmPasteCode))) {
      return;
    }
  }
  navigator.clipboard.readText()
    .then(text => {
      editor.setCode(text);
      console.log('Code pasted from clipboard!');
    })
    .catch(err => {
      console.error('Failed to paste: ', err);
    });
}

/**
 * Remove blueprint from storage
 * @param mapName
 */
export function removeBluePrintEntry(mapName) {
  localStorage.removeItem(`blueprint_${toFileName(mapName)}`);
  localStorage.removeItem(`blueprint_${mapName}`);
}

/**
 * Get all stored blueprints
 * @returns {StageBlueprint[]}
 */
export function getStoredBluePrints() {
  const blueprints = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('blueprint_')) {
      blueprints.push(JSON.parse(localStorage.getItem(key)));
    }
  }
  return blueprints;
}

export function saveLocale(locale) {
  localStorage.setItem('locale', locale);
}
export function loadLocale() {
  return localStorage.getItem('locale');
}

