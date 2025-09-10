
// Error message templates for supported languages
const errorMessages = {
	de: {
		syntax: "Syntaxfehler in Zeile {line}, Spalte {column}: {error}",
		default: "Ein Fehler ist aufgetreten: {error}",
		errorExplanations: {
			'Unexpected end of input': 'Der Code endet unerwartet. Fehlt vielleicht eine schließende Klammer, ein Anführungszeichen oder ein Semikolon?',
			'Unexpected identifier': 'Ein Bezeichner (z.B. Variablenname) wurde an einer unerwarteten Stelle gefunden. Vielleicht fehlt ein Operator oder ein Komma?',
			'Unexpected number': 'Eine Zahl wurde an einer unerwarteten Stelle gefunden. Vielleicht fehlt ein Operator?',
			'Unexpected token if': 'Das Wort "if" wurde an einer unerwarteten Stelle gefunden. Vielleicht fehlt eine öffnende Klammer oder ein Operator?',
			'Unexpected token else': 'Das Wort "else" wurde an einer unerwarteten Stelle gefunden. Vielleicht fehlt eine öffnende Klammer oder ein Operator?',
			'Unexpected token var': 'Das Wort "var" wurde an einer unerwarteten Stelle gefunden. Vielleicht fehlt eine öffnende Klammer oder ein Operator?',
			'Unexpected token ILLEGAL': 'Ein illegales Zeichen wurde gefunden. Dies kann durch einen Syntaxfehler oder ein nicht unterstütztes Zeichen verursacht werden.',
            'Unexpected token {token}': `Ein unerwartetes Zeichen wurde gefunden: {token}\nGehört dieses Zeichen hier hin, oder hast du dich vertan?`,
			'{token} is not defined': `Die Variable oder Funktion {token} ist nicht definiert.\nHast du sie vorher deklariert oder richtig geschrieben?`,
			'No code to execute': 'Der Code kann nicht ausgeführt werden, da er leer ist.',
		}
	},
	en: {
		syntax: "Syntax error at line {line}, column {column}: {error}",
		default: "Unknown error: {error}",
		errorExplanations: {
			'Unexpected token {token}': `An unexpected character was found: {token}\nDoes this character belong here, or did you make a mistake?`,
			'Unexpected end of input': 'The code ends unexpectedly. Maybe a closing bracket, quotation mark, or semicolon is missing?',
			'Unexpected identifier': 'An identifier (e.g. variable name) was found in an unexpected place. Maybe an operator or comma is missing?',
			'Unexpected number': 'A number was found in an unexpected place. Maybe an operator is missing?',
			'Unexpected token if': 'The word "if" was found in an unexpected place. Maybe an opening bracket or operator is missing?',
			'Unexpected token else': 'The word "else" was found in an unexpected place. Maybe an opening bracket or operator is missing?',
			'Unexpected token var': 'The word "var" was found in an unexpected place. Maybe an opening bracket or operator is missing?',
			'Unexpected token ILLEGAL': 'An illegal token was found. This may be due to a syntax error or unsupported character.',
			'{token} is not defined': `The variable or function {token} is not defined.\nDid you declare it beforehand or spell it correctly?`
		}
	},
};

/**
 * Returns the current locale (default: 'de').
 */
function getCurrentLocale() {
	return 'de'; //todo later: have user choose language
	// Example: use browser language if available, fallback to 'de'
	if (typeof navigator !== 'undefined' && navigator.language) {
		if (navigator.language.startsWith('de')) return 'de';
		if (navigator.language.startsWith('en')) return 'en';
	}
	return 'de';
}



/**
 * Localizes a user code error result.
 * @param {object} result - The error result from analyseSyntaxError.
 * @param {string|null} lang - Language code ('de', 'en', etc.), or null/empty for auto-detect.
 * @returns {string} Localized error message.
 */
export function localizeUserCodeError(result, lang) {
	let locale = lang;
	if (!locale) {
		locale = getCurrentLocale();
	}
	const messages = errorMessages[locale] || errorMessages['de'];

	let template;
	if (result && result.line && result.column) {
		template = messages.syntax;
	} else {
		template = messages.default;
	}

	// Replace placeholders
	let msg = template.replace('{line}', result.line ?? '?')
		.replace('{column}', result.column ?? '?')
		.replace('{error}', getErrorExplanation(result.error ?? '', locale));
	return msg;
}

/**
 * Dynamisch: Sucht nach passenden Error-Patterns und ersetzt Platzhalter.
 * @param {string} errorMsg
 * @param {string} locale
 * @returns {string|null}
 */
export function getErrorExplanation(errorMsg, locale = 'de') {
	const explanations = errorMessages[locale]?.errorExplanations || {};
	for (const patternKey in explanations) {
		// Pattern-Key z.B. 'Unexpected-token{token}'
		// Umwandlung in Regex: 'Unexpected-token{token}' => /Unexpected token (\S+)/
		const regexStr = patternKey.replace(/\{(\w+)\}/g, (_, name) => `(?<${name}>\\S+)`).replace(/-/g, ' ');
		const regex = new RegExp('^' + regexStr + '$');
		const match = errorMsg.match(regex);
		if (match) {
			let explanation = explanations[patternKey];
			// If there are groups, replace placeholders
			if (match.groups) {
				for (const [name, value] of Object.entries(match.groups)) {
					explanation = explanation.replace(`{${name}}`, value);
				}
			}
			return explanation;
		}
	}
	return errorMsg;
}