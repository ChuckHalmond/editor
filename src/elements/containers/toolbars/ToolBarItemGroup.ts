
import { element, CustomElement, AttributeProperty } from "../../Element";

export { HTMLEToolBarItemGroupElement };

interface HTMLEToolBarItemGroupElementConstructor {
    readonly prototype: HTMLEToolBarItemGroupElement;
    new(): HTMLEToolBarItemGroupElement;
}

type ToolBarOrientation = "horizontal" | "vertical";

interface HTMLEToolBarItemGroupElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritemgroup": HTMLEToolBarItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-toolbaritemgroup"
})
class HTMLEToolBarItemGroupElementBase extends HTMLElement implements HTMLEToolBarItemGroupElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: Boolean, observed: true})
    disabled!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: flex;
                            width: max-content;
                            flex-direction: row;
                        }

                        /*:host([orientation="vertical"]) {
                            flex-direction: column;
                        }

                        :host([orientation="horizontal"]) {
                            flex-direction: row;
                        }*/
                    `
                ]
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

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const label = this.shadowRoot.querySelector<HTMLLabelElement>("[part='label']");
                if (label) {
                    label.textContent = newValue;
                }
                break;
            }
            case "disabled": {
                /*this.items.forEach((item) => {
                    item.disabled = newValue !== null;
                });*/
                break;
            }
        }
    }
}

var HTMLEToolBarItemGroupElement: HTMLEToolBarItemGroupElementConstructor = HTMLEToolBarItemGroupElementBase;