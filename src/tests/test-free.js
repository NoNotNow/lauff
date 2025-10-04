import { test, describe } from 'node:test';
import assert from 'node:assert';
import { free } from '../game-state/movement.js';

function makeState({ pos = { x: 0, y: 0 }, dir = 1, size = { x: 9, y: 9 }, obstacles = [] } = {}) {
  return {
    _pos: { ...pos },
    _dir: dir,
    _size: { ...size },
    _obstacles: obstacles.map(o => ({ ...o })),
    getPosition() { return { ...this._pos }; },
    getDirection(offset = 0) {
      const off = Number.isFinite(offset) ? offset : 0;
      return (this._dir + ((off % 4) + 4) % 4) % 4;
    },
    getStageSize() { return { ...this._size }; },
    getObstacles() { return this._obstacles.map(o => ({ ...o })); }
  };
}

describe('movement.free', () => {
  // Baseline: empty stage, moving east from origin
  test('returns spaces to boundary on empty stage (east)', () => {
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [] });
    const result = free(undefined, undefined, undefined, state);
    assert.strictEqual(result, 9, 'From x=0 to boundary x=9 should be 9 free spaces');
  });

  // Obstacles: stops before obstacle accounting for avatar size (2x2)
  test('stops before obstacle in path (east, avatar width considered)', () => {
    // Obstacle at x=3,y=0 blocks when nextPos becomes x=2 (avatar width is 2)
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [{ x: 3, y: 0 }] });
    const result = free(undefined, undefined, undefined, state);
    assert.strictEqual(result, 1, 'Should only move to x=1 before colliding at next step');
  });

  // Immediate collision on first step (0 free spaces)
  test('immediate obstacle collision yields 0 free spaces', () => {
    // With obstacle at x=2,y=0, first nextPos is x=1; avatar spans [1,3) which overlaps [2,3)
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [{ x: 2, y: 0 }] });
    const result = free(undefined, undefined, undefined, state);
    assert.strictEqual(result, 0);
  });

  // Obstacles off the path do not block
  test('obstacle sufficiently far on Y-axis does not block horizontal movement', () => {
    // Avatar at y=0 spans [0,2) vertically; obstacle at y=2 spans [2,3) → no overlap
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [{ x: 2, y: 2 }] });
    const result = free(undefined, undefined, undefined, state);
    assert.strictEqual(result, 9);
  });

  // Starting coordinates override state position
  test('uses provided starting coordinates (inX, inY)', () => {
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [] });
    const result = free(undefined, 5, 0, state); // start from x=5, heading east
    assert.strictEqual(result, 4, 'From x=5 to boundary x=9 should be 4 free spaces');
  });

  // Direction offset handling
  test('respects directionOffset (left from east -> north hits boundary immediately)', () => {
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [] });
    const result = free(-1, undefined, undefined, state); // left turn from east is north
    assert.strictEqual(result, 0, 'North from y=0 immediately out of bounds');
  });

  test('directionOffset normalization with values > 4 and negative', () => {
    // Base dir = north (0). Offset 5 => east; from x=0 to boundary 9 → 9 steps (y unaffected)
    const eastState = makeState({ pos: { x: 0, y: 5 }, dir: 0, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(5, undefined, undefined, eastState), 9);

    // Offset -5 => -1 => west; from x=5 to boundary 0 → 5 steps
    const westState = makeState({ pos: { x: 5, y: 5 }, dir: 0, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(-5, undefined, undefined, westState), 5);
  });

  // All four directions to boundaries
  test('north to boundary', () => {
    const state = makeState({ pos: { x: 4, y: 5 }, dir: 0, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(undefined, undefined, undefined, state), 5);
  });

  test('south to boundary', () => {
    const state = makeState({ pos: { x: 4, y: 7 }, dir: 2, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(undefined, undefined, undefined, state), 2);
  });

  test('west to boundary', () => {
    const state = makeState({ pos: { x: 5, y: 0 }, dir: 3, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(undefined, undefined, undefined, state), 5);
  });

  // Starting near boundary yields 0 if the first step goes out of bounds
  test('0 spaces when immediately out of bounds (north at top edge)', () => {
    const state = makeState({ pos: { x: 4, y: 0 }, dir: 0, size: { x: 9, y: 9 }, obstacles: [] });
    assert.strictEqual(free(undefined, undefined, undefined, state), 0);
  });

  // Provided starting coordinates with directionOffset
  test('inX/inY combined with directionOffset (south from custom start)', () => {
    const state = makeState({ pos: { x: 0, y: 0 }, dir: 0, size: { x: 9, y: 9 }, obstacles: [] });
    // dir 0 (north) + offset 2 => south; start at y=6 → can go to 9 => 3 steps
    assert.strictEqual(free(2, 3, 6, state), 3);
  });

  // Non-finite offset (NaN/undefined) treated as 0 by mock state
  test('non-finite directionOffset treated as 0', () => {
    const state = makeState({ pos: { x: 2, y: 2 }, dir: 1, size: { x: 9, y: 9 }, obstacles: [] });
    // Pass NaN → should behave like offset 0 (east)
    const result = free(NaN, undefined, undefined, state);
    assert.strictEqual(result, 7);
  });

  // Non-square stage sizes
  test('respects non-square stage size for bounds', () => {
    const state = makeState({ pos: { x: 3, y: 1 }, dir: 2, size: { x: 4, y: 6 }, obstacles: [] });
    // South from y=1 to y=6 => steps for next y: 2,3,4,5,6 -> 5 steps
    assert.strictEqual(free(undefined, undefined, undefined, state), 5);
  });
});


// Additional scenario: obstacles left, right, behind, and ahead
// Only the obstacle ahead should stop movement; others must be ignored.
test('with obstacles left, right, behind, and ahead only ahead stops movement (east)', () => {
  const state = makeState({
    pos: { x: 3, y: 3 },
    dir: 1, // east
    size: { x: 12, y: 12 },
    obstacles: [
      { x: 8, y: 3 }, // ahead (will block when nextPos.x = 7)
      { x: 2, y: 3 }, // behind (west) — should not matter
      { x: 5, y: 1 }, // left (north of path) — no vertical overlap with avatar (y in [3,5))
      { x: 6, y: 6 }  // right (south of path) — no vertical overlap with avatar (y in [3,5))
    ]
  });
  const result = free(undefined, undefined, undefined, state);
  // Steps from x=3: to 4 (ok), 5 (ok), 6 (ok), next 7 would overlap with obstacle at x=8 (avatar [7,9) vs [8,9))
  assert.strictEqual(result, 3);
});
