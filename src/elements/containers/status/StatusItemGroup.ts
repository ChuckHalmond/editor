
import { element, CustomElement, AttributeProperty } from "../../Element";

import "./StatusItem";

export { HTMLEStatusItemGroupElement };

interface HTMLEStatusItemGroupElementConstructor {
    prototype: HTMLEStatusItemGroupElement;
    new(): HTMLEStatusItemGroupElement;
}

interface HTMLEStatusItemGroupElement extends HTMLElement {
    name: string;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusitemgroup": HTMLEStatusItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-statusitemgroup"
})
class HTMLEStatusItemGroupElementBase extends HTMLElement implements HTMLEStatusItemGroupElement {

    declare readonly shadowRoot: ShadowRoot;
    
    @AttributeProperty({type: String})
    declare name: string;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: flex;
                width: max-content;
                flex-direction: row;
            }
        `;
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const label = this.shadowRoot.querySelector<HTMLLabelElement>("[part='label']");
                if (label) {
                    label.textContent = newValue;
                }
                break;
            }
        }
    }
}

var HTMLEStatusItemGroupElement: HTMLEStatusItemGroupElementConstructor = HTMLEStatusItemGroupElementBase;