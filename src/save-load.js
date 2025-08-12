// Save and load functionality for the code editor

export function saveCode() {
  console.log("saveCode function called");
  const codeTextarea = document.getElementById('code');
  if (codeTextarea) {
    const code = codeTextarea.value;
    console.log("Saving code:", code);
    localStorage.setItem('savedCode', code);
    console.log("Code saved to localStorage");
  } else {
    console.error("Code textarea not found");
  }
}

export function loadCode() {
  console.log("loadCode function called");
  const savedCode = localStorage.getItem('savedCode');
  console.log("Retrieved saved code:", savedCode);
  
  if (savedCode) {
    const codeTextarea = document.getElementById('code');
    if (codeTextarea) {
      codeTextarea.value = savedCode;
      console.log("Code loaded into textarea");
    } else {
      console.error("Code textarea not found");
    }
  } else {
    console.log("No saved code found in localStorage");
  }
}