// @ts-check
/**
 * @typedef {Object} StatementDetail
 * @property {string} type
 * @property {number|string} line
 * @property {string} code
 */

/**
 * @typedef {Object} AnalyseResult
 * @property {boolean} success
 * @property {string} details
 * @property {string} error
 */

/**
 * Zählt Funktionsaufrufe im gegebenen JavaScript-Code und zeigt Details an.
 * @param {string} code - Der zu analysierende JavaScript-Code.
 * @returns {AnalyseResult} Das Ergebnis der Analyse.
 */
export function countStatements(code) {
    var result = {
        success: false,
        details: '',
        error: ''
    };
    try {
        // Parse den Code mit Esprima
        // @ts-ignore
        const ast = esprima.parseScript(code, {
            tolerant: true,
            range: true,
            loc: true
        });

        /** @type {number} */
        let statementCount = 0;
        /** @type {StatementDetail[]} */
        const statements = [];

        // Traverse durch den AST
        /**
         * Traversiert rekursiv den AST und sammelt Funktionsaufrufe.
         * @param {any} node
         * @param {number} [depth=0]
         * @returns {void}
         */
        function traverse(node, depth = 0) {
            if (!node || typeof node !== 'object') return;

            // Nur Funktionsaufrufe zählen
            if (node.type === 'CallExpression') {
                statementCount++;
                statements.push({
                    type: 'FunctionCall',
                    line: node.loc ? node.loc.start.line : '?',
                    code: getNodeCode(node, code)
                });
            }
            // ExpressionStatements zählen (aber nur wenn sie Funktionsaufrufe sind)
            else if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'CallExpression') {
                // Wird bereits durch CallExpression oben abgedeckt, also skip
            }

            // Recursiv durch alle Child-Nodes
            for (const key in node) {
                if (key === 'parent') continue; // Vermeide Zyklen

                const child = node[key];
                if (Array.isArray(child)) {
                    child.forEach(item => traverse(item, depth + 1));
                } else if (typeof child === 'object' && child !== null) {
                    traverse(child, depth + 1);
                }
            }
        }

        /**
         * Gibt den Quellcode eines AST-Knotens zurück.
         * @param {any} node
         * @param {string} sourceCode
         * @returns {string}
         */
        function getNodeCode(node, sourceCode) {
            if (node.range) {
                return sourceCode.substring(node.range[0], node.range[1]);
            }
            return node.type;
        }

        // Starte Traversierung
        traverse(ast);
        result.success = true;
        result.details = `Anzahl Statements: ${statementCount}\nDetails:\n` + statements.map((stmt, index) => {
            return `${index + 1}. ${stmt.type} (Zeile ${stmt.line}): ${stmt.code.substring(0, 50)}${stmt.code.length > 50 ? '...' : ''}`;
        }).join('\n');
        return result;
    } catch (error) {
        return {
            success: false,
            details: '',
            error: error.message
        };
    }
}