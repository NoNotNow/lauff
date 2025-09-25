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
            const theme = isDark ? "lauff-dark" : "default";
            this.instance.setOption("theme", theme);
        }
    },

    /**
     * Recalculate and apply the editor size to fit its container.
     */
    recalculateSize: function () {
        if (!this.instance) return;
        try {
            const sizing = document.querySelector('.editor-sizing');
            let height = '5em';
            if (sizing) {
                const cs = getComputedStyle(sizing);
                const h = parseFloat(cs.height);
                if (!isNaN(h) && h > 0) {
                    height = cs.height;
                } else if (sizing.clientHeight > 0) {
                    height = sizing.clientHeight + 'px';
                }
            }
            this.instance.setSize('100%', height);
            if (typeof this.instance.refresh === 'function') {
                this.instance.refresh();
            }
        } catch (e) {
            // Best-effort; ignore errors
            console.warn('Editor resize failed:', e);
        }
    },

    /**
     * Notify editor that the app mode changed so it can adjust its view.
     * @param {('editor'|'builder')} mode
     */
    onModeChanged: function (mode) {
        if (mode === 'editor') {
            // Wait for layout after showing the editor
            requestAnimationFrame(() => requestAnimationFrame(() => this.recalculateSize()));
        }
    }

};
