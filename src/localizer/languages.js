// Error message templates for supported languages
import {MessageTokens} from "./tokens.js";

export const errorMessages = {
    de: {
        syntax: "Syntaxfehler in Zeile {line}, Spalte {column}: {error}",
        default: "{error}",
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
            'Invalid left-hand side in assignment': 'Der linke Teil einer Zuweisung ist ungültig. Überprüfe, ob du eine Variable korrekt zuweist.',
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
 * @typedef {MessageTokens} token
 */

export const messagesEn =
    {
        [MessageTokens.unsavedChanges]: 'You have unsaved changes. Are you sure you want to load a new level?',
        [MessageTokens.removeLevel]: 'Are you sure you want to delete this level?',
        [MessageTokens.loadLevel]: 'Load level',
        [MessageTokens.turnOnBuilder]: 'Turn on builder',
        [MessageTokens.swapDesign]: 'Swap design',
        [MessageTokens.obstacles]: 'Obstacles',
        [MessageTokens.startPosition]: 'Start position',
        [MessageTokens.targetPosition]: 'Target position',
        [MessageTokens.tool]: 'Tool',
        [MessageTokens.language]: 'Language',
        [MessageTokens.height]: 'Height',
        [MessageTokens.width]: 'Width',
        [MessageTokens.slow]: 'Slow',
        [MessageTokens.normal]: 'Normal',
        [MessageTokens.fast]: 'Fast',
        [MessageTokens.superFast]: 'Super Fast',
        [MessageTokens.numberOfFunctionCalls]: 'Number of function calls'
    }

export const messagesDe =
    {
        [MessageTokens.unsavedChanges]: 'Du hast nicht gespeicherte Änderungen. Bist du sicher, dass du das Level laden möchtenst?',
        [MessageTokens.removeLevel]: 'Bist du sicher, dass du dieses Level löschen möchtest?',
        [MessageTokens.loadLevel]: 'Level laden',
        [MessageTokens.turnOnBuilder]: 'Builder einschalten',
        [MessageTokens.swapDesign]: 'Design wechseln',
        [MessageTokens.obstacles]: 'Hindernisse',
        [MessageTokens.startPosition]: 'Startposition',
        [MessageTokens.targetPosition]: 'Zielposition',
        [MessageTokens.tool]: 'Werkzeug',
        [MessageTokens.language]: 'Sprache',
        [MessageTokens.height]: 'Höhe',
        [MessageTokens.width]: 'Breite',
        [MessageTokens.slow]: 'Langsam',
        [MessageTokens.normal]:'Normal',
        [MessageTokens.fast]:'Schnell',
        [MessageTokens.superFast]:'Sehr schnell',
        [MessageTokens.numberOfFunctionCalls]: 'Anzahl der Funktionenaufrufe'




    }

