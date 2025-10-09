import esprima from 'esprima';
globalThis.esprima = esprima;
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {analyseSyntaxError, countStatements} from '../code/code-analyser.js';
import {localizer} from '../localizer/localizer.js';
describe('code-analyser', () => {


	test('output different errors to the console', () => {
		const codes = [
			'foo());', // Extra closing parenthesis
			'function test( { console.log("Hello"); }', // Missing closing parenthesis for function parameters
			'function test() { console.log("Hello"); ', // Missing closing brace for function body
			'let a = 5 console.log(a);', // Missing semicolon
			'let if = 5;', // Using reserved keyword as variable name
			'let arr = [1, 2 3];', // Missing comma in array literal
			'let x = 5 + * 3;', // Incorrect use of operator
			'let x 5;', // Missing assignment operator
			'go();6k }', // Invalid token
		];
		codes.forEach(code => {
			const result = analyseSyntaxError(code);
			console.log(result.error);
			console.log(localizer.localizeUserCodeError(result, 'de'));
			console.log(localizer.localizeUserCodeError(result, 'en'));
			console.log('---');
		});
	});

	test('get error explanation for Unexpected end of input', () => {
		let result=localizer.getErrorExplanation('Unexpected end of input', 'de');
		console.log(result);
	});


    test('testCountStatements with async code', () => {
        const result = countStatements("await delay(200);");
        console.log(result);
        assert.strictEqual( result.success, true, 'countStatements should return success: true\n'+ result.error);
    })

});

