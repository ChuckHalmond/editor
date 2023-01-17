import { CustomElement, element } from "../../Element";

export { HTMLEOptionGroupElement };

interface HTMLEOptionGroupElementConstructor {
    prototype: HTMLEOptionGroupElement;
    new(): HTMLEOptionGroupElement;
}

interface HTMLEOptionGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-optiongroup": HTMLEOptionGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-optiongroup"
})
class HTMLEOptionGroupElementBase extends HTMLElement implements HTMLEOptionGroupElement {

    declare readonly shadowRoot: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: block;
            }
        `;
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }
}

var HTMLEOptionGroupElement: HTMLEOptionGroupElementConstructor = HTMLEOptionGroupElementBase;