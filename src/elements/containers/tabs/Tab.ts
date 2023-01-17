import { DEFAULT_THEME_HOVERED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLETabPanelElement } from "./TabPanel";

import "./TabPanel";

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
    declare name: string;

    @AttributeProperty({type: Boolean})
    declare disabled: boolean;

    @AttributeProperty({type: String, observed: true})
    declare controls: string;

    @AttributeProperty({type: Boolean})
    declare active: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    declare selected: boolean;
    
    get panel(): HTMLETabPanelElement | null {
        const {controls} = this;
        const rootNode = this.getRootNode();
        if (rootNode instanceof Document || rootNode instanceof ShadowRoot) {
            return rootNode.querySelector<HTMLETabPanelElement>(`e-tabpanel[id='${controls}']`);
        }
        return null;
    }

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: inline-block;
                user-select: none;
                white-space: nowrap;
                padding: 4px;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
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