/**
 * @typedef {Object} EditorInstance
 * @property {function(): string} getValue
 * @property {function(string): void} setValue
 * @property {function(string, Function): void} on
 * @property {function(string, Function): void} off
 * @property {function(): HTMLTextAreaElement} getTextArea
 * @property {function(): HTMLElement} getInputField
 * @property {function(string, *): void} setOption
 * @property {function((string|number), (string|number)): void} setSize
 */


/**
 * Editor module for initializing and managing the CodeMirror editor instance.
 * @type {{
 *   instance: (EditorInstance|undefined),
 *   init: function(boolean): void,
 *   getCode: function(): string,
 *   setCode: function(string): void,
 *   isActive: function(): boolean,
 *   onChange: function(function(any, any): void): void,
 *   reset: function(boolean): void
 * }}
 */
export const editor = {

    /**
     * Initializes the CodeMirror editor instance.
     * @param {boolean} isNightMode - Whether to use the dark theme.
     * @returns {void}
     */
    init: function (isNightMode) {

        /** @type {HTMLTextAreaElement} */
        const textAreaElement = document.getElementById("code");
        this.instance = /** @type {EditorInstance} */ (CodeMirror.fromTextArea(textAreaElement, {
            lineNumbers: true,
            mode: "javascript",
            theme: isNightMode ? "lauff-dark" : "default",


        }));
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
     * @param {function(any, any): void} callback - Callback invoked on content change.
     */
    onChange: function (callback) {
        if (this.instance) {
            this.instance.on('change', callback);
        }
    },
    /**
     * Updates theme-related options on the existing editor instance.
     * @param {boolean} isDark - Whether to use the dark theme.
     */
    reset: function (isDark) {
        if (this.instance){
            let theme = isDark ? "lauff-dark" : "default";
            // editor.setOption("theme", theme);
            let element=this.instance.getTextArea();
            this.instance.setOption("theme", theme);
            console.log(element);
            console.log(this.instance);
        }

    }

};
