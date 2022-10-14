import { CustomElement, element } from "../../Element";
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

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-tabpanel"
})
class HTMLETabPanelElementBase extends HTMLElement implements HTMLETabPanelElement {

    get tab(): HTMLETabElement | null {
        const {id} = this;
        return (<Document | ShadowRoot>this.getRootNode()).querySelector<HTMLETabElement>(`e-tab[controls=${id}]`);
    }

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: block;
                padding: 4px;
                border: 1px solid transparent;
            }
            
            :host([hidden]) {
                display: none;
            }
        `;
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
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
