import { CustomElement, element } from "../../Element";

export { HTMLEOptionGroupElement };

interface HTMLEOptionGroupElementConstructor {
    readonly prototype: HTMLEOptionGroupElement;
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

@CustomElement({
    name: "e-optiongroup"
})
class HTMLEOptionGroupElementBase extends HTMLElement implements HTMLEOptionGroupElement {

    readonly shadowRoot!: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                properties: {
                    textContent: /*css*/`
                        :host {
                            display: block;
                        }
                    `
                }
            }),
            element("slot")
        );
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