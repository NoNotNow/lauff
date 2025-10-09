// Central JSDoc types for stage data structures.
// This module is type-only: reference via import('...') in JSDoc. Do not import at runtime.

/**
 * @typedef {{x: number, y: number}} Vec2
 */

/** @typedef {Vec2} Obstacle */

/**
 * Background gradient configuration for the grid.
 * - enabled: toggle gradient usage
 * - from: CSS color string for start
 * - to: CSS color string for end
 * - angle: degrees for linear-gradient (0..360)
 * @typedef {{enabled?: boolean, from?: string, to?: string, angle?: number}} BackgroundGradient
 */

/**
 * Core structural type for stage data used both as a template (blueprint)
 * and as a runtime snapshot. Fields not applicable in a given role are optional.
 * - Blueprints typically provide: name, startPosition, startDirection?, targetPosition, stageSize, obstacles
 * - Snapshots use: name, startPosition, startDirection, position, stageSize, direction, obstacles, target
 * @typedef {Object} StageModel
 * @property {string} name
 * @property {Vec2} startPosition
 * @property {number=} startDirection
 * @property {Vec2=} position
 * @property {Vec2} stageSize
 * @property {number=} direction
 * @property {Obstacle[]} obstacles
 * @property {Vec2=} targetPosition
 * @property {BackgroundGradient=} backgroundGradient
 */

/** @typedef {StageModel} StageBlueprint */
/** @typedef {StageModel} StageSnapshot */

// Intentionally no runtime exports to avoid coupling/cycles.
