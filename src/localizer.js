// Error message templates for supported languages
const errorMessages = {
	de: {
		syntax: "Syntaxfehler in Zeile {line}, Spalte {column}: {error}",
		default: "Unbekannter Fehler: {error}",
		errorExplanations: {
            'Unexpected token {token}': `Ein unerwartetes Zeichen wurde gefunden: {token}\nGehört dieses Zeichen hier hin, oder hast du dich vertan?`,
		}
	},
	en: {
		syntax: "Syntax error at line {line}, column {column}: {error}",
		default: "Unknown error: {error}"
	}
};

/**
 * Returns the current locale (default: 'de').
 * You can expand this to use browser or app settings.
 */
function getCurrentLocale() {
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
		.replace('{error}', getErrorExplanation(result.error ?? ''));
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
        if (match && match.groups) {
            let explanation = explanations[patternKey];
            // Ersetze alle {name} Platzhalter im Value
            for (const [name, value] of Object.entries(match.groups)) {
                explanation = explanation.replace(`{${name}}`, value);            }
            return explanation;
        }
    }
    return errorMsg
}