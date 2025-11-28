/**
 * A simple Grid class to manage a 2D grid of cells.
 */
export class Grid {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array(width).fill().map(() => Array(height).fill(0));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} value
     */
    setCell(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.cells[x][y] = value;
        }
    }
    /**
     * @param {number} x    
     * @param {number} y
     * @returns {number|undefined}
     */
    getCell(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.cells[x][y];
        }
        return undefined;
    }
    /**
     * increment the value at (x, y) by 1
     * @param {number} x
     * @param {number} y
     */
    increment(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.cells[x][y] += 1;
        }
    }

    /**
     * decrement the value at (x, y) by 1
     * @param {number} x
     * @param {number} y
     */
    decrement(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.cells[x][y] -= 1;
        }
    }
}