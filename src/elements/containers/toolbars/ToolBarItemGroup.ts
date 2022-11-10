
import { element, CustomElement, AttributeProperty } from "../../Element";

import "./ToolBarItem";

export { HTMLEToolBarItemGroupElement };

interface HTMLEToolBarItemGroupElementConstructor {
    prototype: HTMLEToolBarItemGroupElement;
    new(): HTMLEToolBarItemGroupElement;
}

interface HTMLEToolBarItemGroupElement extends HTMLElement {
    name: string;
    label: string;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritemgroup": HTMLEToolBarItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-toolbaritemgroup"
})
class HTMLEToolBarItemGroupElementBase extends HTMLElement implements HTMLEToolBarItemGroupElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

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

var HTMLEToolBarItemGroupElement: HTMLEToolBarItemGroupElementConstructor = HTMLEToolBarItemGroupElementBase;