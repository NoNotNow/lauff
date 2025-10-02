import { localizer } from './localizer.js';
import {MessageTokens} from "./tokens.js";

class DomReplacer {
    /**
     * Traverse all text nodes searching for [MessageTokens.xxx] and replace with localized text
     * @param {Element|Document} [root=document.body]
     * @param {string} [locale]
     */
    run(root = document.body, locale) {

        this.replaceText(root, locale);
        // Also replace in attributes commonly used for user-visible messages
        this.replaceAttributes(root, locale);
    }


    /**
     * Replace MessageTokens in text nodes for all elements
     * @param {Element|Document} root
     * @param {string} [locale]
     */
    replaceText(root = document.body, locale) {
        const nodes = this.getNodesToReplace(root);
        const tokenRegex = /\[MessageTokens\.(\w+)]/g;
        for (const node of nodes) {
            let original = node.nodeValue;
            let match;
            // Use the RegExp again to extract all token names in the node
            const regexAll = /\[MessageTokens\.(\w+)]/g;
            while ((match = regexAll.exec(original)) !== null) {
                console.log("found: [MessageTokens." + match[1] + "]");
            }
            let replaced = original.replace(tokenRegex, (match, tokenName) => {
                if (Object.prototype.hasOwnProperty.call(MessageTokens, tokenName)) {
                    //get MessageToken from tokenName
                    const messageToken = MessageTokens[tokenName];
                    return localizer.localizeMessage(messageToken, locale);
                }
                return match;
            });
            if (replaced !== original) {
                node.nodeValue = replaced;
            }
        }
    }

    /**
     * Replace MessageTokens in common attributes (title, aria-label, placeholder, alt) for all elements
     * @param {Element|Document} root
     * @param {string} [locale]
     */
    replaceAttributes(root = document.body, locale) {
        const attrNames = ['title', 'aria-label', 'placeholder', 'alt'];
        const tokenRegex = /\[MessageTokens\.(\w+)]/g;

        // querySelectorAll('*') gets every element under root
        const allElements = root.querySelectorAll('*');
        for (const el of allElements) {
            for (const attr of attrNames) {
                if (el.hasAttribute(attr)) {
                    let val = el.getAttribute(attr);
                    let changed = false;
                    let replaced = val.replace(tokenRegex, (match, tokenName) => {
                        if (Object.prototype.hasOwnProperty.call(MessageTokens, tokenName)) {
                            changed = true;
                            const messageToken = MessageTokens[tokenName];
                            return localizer.localizeMessage(messageToken, locale);
                        }
                        return match;
                    });
                    if (changed) {
                        el.setAttribute(attr, replaced);
                    }
                }
            }
        }
    }

    /**
     * Return a list of DOM text nodes that contain MessageTokens patterns
     * @param {Element|Document} [root=document.body]
     * @returns {Text[]}
     */
    getNodesToReplace(root = document.body) {
        const nodes = [];
        const tokenRegex = /\[MessageTokens\.(\w+)\]/;
        // TreeWalker only returns text nodes, not attributes
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
        );
        let node;
        while ((node = walker.nextNode())) {
            if (tokenRegex.test(node.nodeValue)) {
                nodes.push(node);
            }
        }
        return nodes;
    }
}

export const domReplacer = new DomReplacer();