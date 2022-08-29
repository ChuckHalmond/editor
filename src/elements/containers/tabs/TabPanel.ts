import { CustomElement } from "../../Element";

export { HTMLETabPanelElement };

interface HTMLETabPanelElementConstructor {
    prototype: HTMLETabPanelElement;
    new(): HTMLETabPanelElement;
}

interface HTMLETabPanelElement extends HTMLElement {
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement,
    }
}

@CustomElement({
    name: "e-tabpanel"
})
class HTMLETabPanelElementBase extends HTMLElement implements HTMLETabPanelElement {

    constructor() {
        super();
    }
}

var HTMLETabPanelElement: HTMLETabPanelElementConstructor = HTMLETabPanelElementBase;
