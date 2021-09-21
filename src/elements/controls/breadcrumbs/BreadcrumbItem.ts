import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";

export { HTMLEBreadcrumbItemElement };
export { HTMLEBreadcrumbItemElementBase };

interface HTMLEBreadcrumbItemElement extends HTMLElement {
    label: string;
    active: boolean;
}

@RegisterCustomHTMLElement({
    name: "e-breadcrumbitem",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "label", type: "string"},
    {name: "active", type: "boolean"}
])
class HTMLEBreadcrumbItemElementBase extends HTMLElement implements HTMLEBreadcrumbItemElement {
    
    public label!: string;
    public active!: boolean;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host([active]) [part~="container"]::after {
                    display: none;
                }

                [part~="container"]::after {
                    content: "►";
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="container"] {
                    display: flex;
                }
            </style>
            <div part="container">
                <span part="label"></span>
                <slot></slot>
            </div>
        `);
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-breadcrumbitem": HTMLEBreadcrumbItemElement,
    }
}