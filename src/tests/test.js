import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateTotal } from '../code-analyser.js';

describe('App functions', () => {
    test('calculateTotal should sum item prices', () => {
        const items = [
            { name: 'Item 1', price: 10.50 },
            { name: 'Item 2', price: 25.99 },
            { name: 'Item 3', price: 5.00 }
        ];
        
        assert.strictEqual(calculateTotal(items), 41.49);
    });
    
    test('calculateTotal should return 0 for empty array', () => {
        assert.strictEqual(calculateTotal([]), 0);
    });
});