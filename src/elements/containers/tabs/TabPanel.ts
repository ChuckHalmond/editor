import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";

export { HTMLETabPanelElement };

interface HTMLETabPanelElementConstructor {
    readonly prototype: HTMLETabPanelElement;
    new(): HTMLETabPanelElement;
}

interface HTMLETabPanelElement extends HTMLElement {
    name: string;
}

@RegisterCustomHTMLElement({
    name: "e-tabpanel"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"}
])
class HTMLETabPanelElementBase extends HTMLElement implements HTMLETabPanelElement {

    public name!: string;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
    }
}

var HTMLETabPanelElement: HTMLETabPanelElementConstructor = HTMLETabPanelElementBase;

declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement,
    }
}