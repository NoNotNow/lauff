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
    
    let consolidatedParam;
    let consolidatedName;
    
    if (prevParsed.name === newParsed.name) {
      // Same commands: add parameters
      consolidatedParam = prevParsed.param + newParsed.param;
      consolidatedName = prevParsed.name;
    } else if (areOppositeCommands(prevParsed.name, newParsed.name)) {
      // Opposite commands: subtract parameters
      const netParam = prevParsed.param - newParsed.param;
      
      if (netParam === 0) {
        // Commands cancel out completely
        return '';
      } else if (netParam > 0) {
        // Previous command wins
        consolidatedParam = netParam;
        consolidatedName = prevParsed.name;
      } else {
        // New command wins
        consolidatedParam = Math.abs(netParam);
        consolidatedName = newParsed.name;
      }
    } else {
      // Should not reach here due to canConsolidate check
      return false;
    }
    
    // Return consolidated command string
    return `${consolidatedName}(${consolidatedParam});`;
    
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
  // Define consolidatable command types
  const consolidatableCommands = ['go', 'left', 'right'];
  
  // Both commands must be consolidatable types
  if (!consolidatableCommands.includes(commandName1) || !consolidatableCommands.includes(commandName2)) {
    return false;
  }
  
  // Same commands can be consolidated (additive)
  if (commandName1 === commandName2) {
    return true;
  }
  
  // Opposite turning commands can be consolidated (cancellation)
  const oppositeCommands = ['left', 'right'];
  return oppositeCommands.includes(commandName1) && oppositeCommands.includes(commandName2);
}

// Check if two commands are opposites that cancel each other
function areOppositeCommands(commandName1, commandName2) {
  return (commandName1 === 'left' && commandName2 === 'right') ||
         (commandName1 === 'right' && commandName2 === 'left');
}

// Export for testing purposes