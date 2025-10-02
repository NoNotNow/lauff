import {errorMessages, messagesDe, messagesEn} from "./languages.js";

class Localizer{
    /**
     * Returns the current locale (default: 'de').
     */
    getCurrentLocale() {
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
     localizeUserCodeError(result, lang=undefined) {
        let locale = lang;
        if (!locale) {
            locale = this.getCurrentLocale();
        }
        const messages = errorMessages[locale] || errorMessages['de'];

        let template;
        if (result && result.line && result.column) {
            template = messages.syntax;
        } else {
            template = messages.default;
        }

        // Replace placeholders
        return template.replace('{line}', result.line ?? '?')
            .replace('{column}', result.column ?? '?')
            .replace('{error}', this.getErrorExplanation(result.error ?? '', locale));
    }

    /**
     * Dynamisch: Sucht nach passenden Error-Patterns und ersetzt Platzhalter.
     * @param {string} errorMsg
     * @param {string} locale
     * @returns {string|null}
     */
     getErrorExplanation(errorMsg, locale = 'de') {
        const explanations = errorMessages[locale]?.errorExplanations || {};
        for (const patternKey in explanations) {
            // Pattern-Key z.B. 'Unexpected-token{token}'
            // Umwandlung in Regex: 'Unexpected-token{token}' => /Unexpected token (\S+)/
            const regexStr = patternKey.replace(/\{(\w+)}/g, (_, name) => `(?<${name}>\\S+)`).replace(/-/g, ' ');
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

    /**
     * Localizes a message for the current language.
     * @param {MessageTokens} token - The message key.
     * @param {string} locale - Language code ('de', 'en', etc.), or null/empty for auto-detect.
     * @returns {string} Localized message.
     */
     localizeMessage(token, locale = undefined) {
        if (!locale) {
            locale = this.getCurrentLocale();
        }
        if (locale === 'de') return messagesDe[token];
        if (locale === 'en') return messagesEn[token];
        return messagesDe[token];
    }

}
export const localizer = new Localizer();
