// Save and load functionality for the code editor
import { stageState } from '../game-state/stage-state.js';
import { editor } from '../code/code-editor.js';
import {toFileName} from "../utility/helpers.js";

// Get the current map name
function getCurrentMapName() {
  // Find which map matches the current obstacles
  return stageState.getName();
}

export function saveCode() {
  console.log("saveCode function called");
  const code = editor.getCode();
  const mapName = toFileName(getCurrentMapName());
  console.log("Saving code:", code);
  console.log("Saving code for map:", mapName);
  localStorage.setItem(`savedCode_${mapName}`, code);
  console.log("Code saved to localStorage for map:", mapName);

}

export function loadCode(mapName = null) {
  console.log("loadCode function called");
  const currentMapName = toFileName(mapName || getCurrentMapName());
  const savedCode = localStorage.getItem(`savedCode_${currentMapName}`);
  console.log("Retrieved saved code:", savedCode);
  console.log("For map:", currentMapName);
  
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

export function saveSelectedMap(selected) {
  localStorage.setItem(`selectedMap`, selected);
}

export function getStoredSelectedMap() {
  return localStorage.getItem('selectedMap');
}