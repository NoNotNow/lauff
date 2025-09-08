
/**
 * @typedef {Object} EditorInstance
 * @property {Function} getValue
 * @property {Function} setValue
 * @property {Function} on
 * @property {Function} off
 * // Add more properties/methods as needed from CodeMirror
 */

/**
 * Editor module for initializing and managing the CodeMirror editor instance.
 * @type {{
 *   instance: EditorInstance | undefined,
 *   init: function(): void
 * }}
 */
export const editor = {
    /**
     * Initializes the CodeMirror editor instance.
     * @returns {void}
     */
    init: function (isNightMode) {
        /** @type {EditorInstance} */
        this.instance = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            mode: "javascript",
            theme: isNightMode ? "lauff-dark" : "default",

        });
    },

    /**
     * Gets the current code from the editor.
     * @returns {string}
     */
    getCode: function () {
        return this.instance ? this.instance.getValue() : "";
    },
    /**
     * Sets the code in the editor.
     * @param {string} code - The code to set in the editor.
     */
    setCode: function (code) {
        if (this.instance) {
            this.instance.setValue(code);
        }
    },

    /**
     * Checks if the editor is currently focused/active.
     * @returns {boolean}
     */
    isActive: function () {
        return document.activeElement === this.instance.getInputField();
    },

    /**
     * Registers a callback for when the editor content changes.
     * @param {Function} callback - The function to call on content change.
     */
    onChange: function (callback) {
        if (this.instance) {
            this.instance.on('change', callback);
        }
    }

};
