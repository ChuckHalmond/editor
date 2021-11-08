import { CustomElement, AttributeProperty, HTML } from "../../Element";

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

    @AttributeProperty({type: "string"})
    public name!: string;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            HTML("style", {
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
            HTML("slot")
        );
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