// Save and load functionality for the code editor
import { stageState } from '../game-state/stage-state.js';
import { editor } from '../code/code-editor.js';
import {toFileName} from "../utility/helpers.js";
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
  console.log("Retrieved saved code for "+currentMapName+":\n", savedCode);
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
    localStorage.removeItem(`blueprint_${bluePrint.name}`);
    localStorage.setItem(`blueprint_${bluePrint.name}`, JSON.stringify(bluePrint), );
}


/**
 * @param {string} mapName
 * @returns {StageBlueprint|null}
 */
export function loadBluePrint(mapName) {
    mapName = toFileName(mapName);
    const blueprint = localStorage.getItem(`blueprint_${toFileName(mapName)}`);
    if (blueprint) {
        return JSON.parse(blueprint);
    }
    return null;
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
