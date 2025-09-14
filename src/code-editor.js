
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

        const textAreaElement = document.getElementById("code");
        /** @type {EditorInstance} */
        this.instance = CodeMirror.fromTextArea(textAreaElement, {
            lineNumbers: true,
            mode: "javascript",
            theme: isNightMode ? "lauff-dark" : "default",
            

        });
        /*set dependent on viewport size to 8em or 100% of parent container*/
        const setEditorSize = () => {
            const computedStyle = getComputedStyle(textAreaElement.parentElement.parentElement);
            console.warn(computedStyle.height);
            const height = window.document.body.innerHeight < 1000 ? "5em" : computedStyle.height
            this.instance.setSize("100%", height);
        };
        setEditorSize();
        window.addEventListener("resize", setEditorSize);
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
