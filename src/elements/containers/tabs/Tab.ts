import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLETabPanelElement } from "./TabPanel";

export { HTMLETabElement };

interface HTMLETabElementConstructor {
    prototype: HTMLETabElement;
    new(): HTMLETabElement;
}

interface HTMLETabElement extends HTMLElement {
    get panel(): HTMLETabPanelElement | null;
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    selected: boolean;
    select(): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tab": HTMLETabElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-tab"
})
class HTMLETabElementBase extends HTMLElement implements HTMLETabElement {

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: String, observed: true})
    controls!: string;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;
    
    get panel(): HTMLETabPanelElement | null {
        const {controls} = this;
        return (<Document | ShadowRoot>this.getRootNode()).querySelector<HTMLETabPanelElement>(`e-tabpanel[id='${controls}']`);
    }

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table-cell;
                user-select: none;
                white-space: nowrap;
                padding: 4px;
                border: 1px solid var(--section-border-color);
                border-bottom: none;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--hovered-item-color);
            }
            
            :host([selected]) {
                background-color: white;
            }
            
            :host(:not([selected])) {
                background-color: whitesmoke;
            }
            
            :host(:focus-visible):host-context(e-tablist:focus-within) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
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
    }
    
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
        }
    }

    select(): void {
        this.selected = true;
    }
}

var HTMLETabElement: HTMLETabElementConstructor = HTMLETabElementBase;