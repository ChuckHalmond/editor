import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEOptionElement };

interface HTMLEOptionElementConstructor {
    prototype: HTMLEOptionElement;
    new(): HTMLEOptionElement;
}

interface HTMLEOptionElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    value: string;
    label: string;
    disabled: boolean;
    selected: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-option": HTMLEOptionElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-option"
})
class HTMLEOptionElementBase extends HTMLElement implements HTMLEOptionElement {

    readonly shadowRoot!: ShadowRoot;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    value!: string;
    
    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "label"
                }
            })
        );
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector<HTMLElement>("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
        }
    }
}

var HTMLEOptionElement: HTMLEOptionElementConstructor = HTMLEOptionElementBase;