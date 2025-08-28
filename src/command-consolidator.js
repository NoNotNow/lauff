// Command consolidation system for merging consecutive commands
export function consolidate(prev, newCommand) {
  // Validate inputs
  if (typeof prev !== 'string' || typeof newCommand !== 'string') {
    return false;
  }
  
  // Trim whitespace
  prev = prev.trim();
  newCommand = newCommand.trim();
  
  if (!prev || !newCommand) {
    return false;
  }
  
  try {
    // Parse previous command
    const prevParsed = parseCommand(prev);
    if (!prevParsed) return false;
    
    // Parse new command
    const newParsed = parseCommand(newCommand);
    if (!newParsed) return false;
    
    // Check if commands are consolidatable
    if (!canConsolidate(prevParsed.name, newParsed.name)) {
      return false;
    }
    
    // Consolidate commands by summing their parameters
    const consolidatedParam = prevParsed.param + newParsed.param;
    
    // Return consolidated command string
    return `${prevParsed.name}(${consolidatedParam});`;
    
  } catch (error) {
    console.warn('Command consolidation error:', error);
    return false;
  }
}

// Parse a command string into name and parameter
function parseCommand(commandStr) {
  // Remove trailing semicolon if present
  commandStr = commandStr.replace(/;$/, '');
  
  // Match command pattern: commandName() or commandName(number)
  const match = commandStr.match(/^(\w+)\((\d*)\)$/);
  
  if (!match) {
    return null;
  }
  
  const name = match[1];
  const paramStr = match[2];
  
  // Default parameter is 1 if not specified
  const param = paramStr === '' ? 1 : parseInt(paramStr, 10);
  
  if (isNaN(param) || param < 1) {
    return null;
  }
  
  return { name, param };
}

// Check if two command types can be consolidated
function canConsolidate(commandName1, commandName2) {
  // Commands must be the same type
  if (commandName1 !== commandName2) {
    return false;
  }
  
  // Define consolidatable command types
  const consolidatableCommands = ['go', 'left', 'right'];
  
  return consolidatableCommands.includes(commandName1);
}

// Export for testing purposes
export { parseCommand, canConsolidate };