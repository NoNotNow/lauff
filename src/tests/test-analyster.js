import esprima from 'esprima';
globalThis.esprima = esprima;
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { analyseSyntaxError } from '../code/code-analyser.js';
import {getErrorExplanation, localizeUserCodeError} from '../localizer.js';
describe('code-analyser', () => {

	// test('countStatements should count function calls in code', () => {
	// 	// esprima must be available globally for this test to work
	// 	const code = 'foo(); bar();';
	// 	const result = countStatements(code);
	// 	assert.strictEqual(result.success, true);
	// 	assert.match(result.details, /Anzahl Statements: 2/);
	// });

	// test('countStatements should count function calls in code', () => {
	// 	// esprima must be available globally for this test to work
	// 	const code = 'foo(); bar();';
	// 	const result = countStatements(code);
	// 	assert.strictEqual(result.success, true);
	// 	assert.match(result.details, /Anzahl Statements: 2/);
	// });

	// //add tests to try out different syntax errors
	// test('analyseSyntaxError should detect missing parenthesis', () => {
	// 	const code = 'function test( { console.log("Hello"); }';
	// 	const result = countStatements(code);
	// 	console.log(result);
	// 	assert.strictEqual(result.success, false);
	// 	assert.match(result.error, /.*Unexpected token \./);
	// 	assert.strictEqual(result.line, 1);
	// 	assert.strictEqual(result.column, 16);
	// });
	// //add test for missing curly brace
	// test('analyseSyntaxError should detect missing curly brace', () => {
	// 	const code = 'function test() { console.log("Hello"); ';
	// 	const result = countStatements(code);
	// 	console.log(result.error);
	// 	assert.strictEqual(result.success, false);
	// 	assert.match(result.error, /.*Unexpected end of input.*/);
	// 	assert.strictEqual(result.line, 1);
	// 	assert.strictEqual(result.column, 39);
	// });	
	// //add test for missing semicolon
	// test('analyseSyntaxError should detect missing semicolon', () => {
	// 	const code = 'let a = 5 console.log(a);';
	// 	const result = countStatements(code);
	// 	console.log(result.error);
	// 	assert.strictEqual(result.success, false);
	// 	assert.match(result.error, /.*Unexpected identifier.*/);
	// 	assert.strictEqual(result.line, 1);
	// 	assert.strictEqual(result.column, 11);
	// });
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
			console.log(localizeUserCodeError(result, 'de'));
			console.log(localizeUserCodeError(result, 'en'));
			console.log('---');
		});
	});

	test('get error explanation for Unexpected end of input', () => {
		let result=getErrorExplanation('Unexpected end of input', 'de');
		console.log(result);
	});

});

