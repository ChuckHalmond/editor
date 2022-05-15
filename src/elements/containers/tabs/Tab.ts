import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLETabPanelElement } from "./TabPanel";

export { ETabChangeEvent };
export { HTMLETabElement };

interface HTMLETabElementConstructor {
    readonly prototype: HTMLETabElement;
    new(): HTMLETabElement;
}

interface HTMLETabElement extends HTMLElement {
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

type ETabChangeEvent = CustomEvent<{
    tab: HTMLETabElement;
}>;

declare global {
    interface HTMLElementEventMap {
        "e_tabchange": ETabChangeEvent,
    }

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

    @AttributeProperty({type: Boolean, observed: true})
    active!: boolean;

    @AttributeProperty({type: String, observed: true})
    controls!: string;

    #panel: HTMLETabPanelElement | null;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            element("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: inline-block;
                            
                            user-select: none;
                            white-space: nowrap;

                            padding: 2px 6px;
                            cursor: pointer;
                        }
                        
                        :host([disabled]) {
                            color: lightgray;
                            pointer-events: none;
                        }
        
                        :host([active]) {
                            background-color: lightgray;
                        }
                    `
                }
            }),
            element("slot")
        );
        this.#panel = null;
    }

    get panel(): HTMLETabPanelElement | null {
        return this.#panel;
    }

    connectedCallback(): void {
        const panel = document.getElementById(this.controls);
        if (panel !== this.#panel && panel instanceof HTMLETabPanelElement) {
            this.#panel = panel;
        }
        if (panel)  {
            panel.hidden = !this.active;
        }
    }
    
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "active":
                if (this.active) {
                    this.dispatchEvent(new CustomEvent("e_tabchange", {detail: {tab: this}, bubbles: true}));
                }
                const panel = document.getElementById(this.controls);
                if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
                    this.#panel = panel;
                }
                if (panel)  {
                    panel.hidden = !this.active;
                }
                break;
        }
    }
}

var HTMLETabElement: HTMLETabElementConstructor = HTMLETabElementBase;