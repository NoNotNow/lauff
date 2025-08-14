# Lauff - Interactive Programming Game

**Live Demo:** https://nonotnow.github.io/lauff/

Lauff is an engaging educational programming game where players control a colorful spaceship avatar through various obstacle courses using JavaScript commands. Perfect for learning programming concepts in a fun, interactive way!

## Features

- **Visual Programming Environment**: Control a spaceship avatar with simple commands like `go()`, `left()`, and `right()`
- **Multiple Challenge Maps**: Choose from 9 different obstacle courses including Labyrinth, Streifen, Figuren, and custom maps
- **Real JavaScript**: Write actual JavaScript code with loops, conditions, and functions
- **Interactive Grid**: Click to add/remove obstacles and create custom maps
- **Timer System**: Track your completion times for each challenge
- **Code Persistence**: Your code is automatically saved for each map
- **Responsive Design**: Works great on desktop and mobile devices

## How to Play

1. Select a map from the dropdown menu
2. Write JavaScript code in the editor to navigate your spaceship
3. Use commands like:
   - `go()` - Move forward one step
   - `go(3)` - Move forward 3 steps
   - `left()` - Turn left
   - `right()` - Turn right
   - `free()` - Check how many spaces are free ahead
   - `random(6)` - Generate random number between 1-6

4. Click "Start" to run your program
5. Reach the green target without hitting obstacles or walls!

## Example Code

```javascript
// Simple movement
go(3);
left();
go(2);
right();
go();

// Using loops and conditions
for (let i = 0; i < 3; i++) {
  go();
}

if (free() > 2) {
  go(2);
}
```

Perfect for students, educators, and anyone wanting to learn programming through interactive gameplay!