import { CustomElement, AttributeProperty } from "../../Element";
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
        return document.querySelector<HTMLETabPanelElement>(`e-tabpanel#${controls}`);
    }

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.tabIndex = this.tabIndex;
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