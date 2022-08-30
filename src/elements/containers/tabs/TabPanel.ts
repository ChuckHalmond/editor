import { CustomElement } from "../../Element";
import { HTMLETabElement } from "./Tab";

export { HTMLETabPanelElement };

interface HTMLETabPanelElementConstructor {
    prototype: HTMLETabPanelElement;
    new(): HTMLETabPanelElement;
}

interface HTMLETabPanelElement extends HTMLElement {
    get tab(): HTMLETabElement | null;
    connectedCallback(): void;
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

    get tab(): HTMLETabElement | null {
        const {id} = this;
        return (<Document | ShadowRoot>this.getRootNode()).querySelector<HTMLETabElement>(`e-tab[controls=${id}]`);
    }

    constructor() {
        super();
    }

    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
        const {tab} = this;
        if (tab) {
            customElements.upgrade(tab);
            const {selected} = tab;
            this.hidden = !selected;
        }
    }
}

var HTMLETabPanelElement: HTMLETabPanelElementConstructor = HTMLETabPanelElementBase;
