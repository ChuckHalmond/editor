import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLETabPanelElement };

interface HTMLETabPanelElementConstructor {
    readonly prototype: HTMLETabPanelElement;
    new(): HTMLETabPanelElement;
}

interface HTMLETabPanelElement extends HTMLElement {
    name: string;
}

@CustomElement({
    name: "e-tabpanel"
})
class HTMLETabPanelElementBase extends HTMLElement implements HTMLETabPanelElement {

    @AttributeProperty({type: String})
    name!: string;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            element("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                        }
        
                        :host([hidden]) {
                            display: none;
                        }
                    `
                }
            }),
            element("slot")
        );
    }
}

var HTMLETabPanelElement: HTMLETabPanelElementConstructor = HTMLETabPanelElementBase;

declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement,
    }
}