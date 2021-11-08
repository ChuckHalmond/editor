import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLETabPanelElement } from "./TabPanel";

export { ETabChangeEvent };
export { HTMLETabElement };

interface HTMLETabElementConstructor {
    readonly prototype: HTMLETabElement;
    new(): HTMLETabElement;
    readonly observedAttributes: string[];
}

interface HTMLETabElement extends HTMLElement {
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
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

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "boolean"})
    public disabled!: boolean;

    @AttributeProperty({type: "boolean"})
    public active!: boolean;

    @AttributeProperty({type: "string"})
    public controls!: string;

    public panel: HTMLETabPanelElement | null;

    public static get observedAttributes(): string[] {
        return ["active", "controls"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: inline-block;
                            position: relative;
                            
                            user-select: none;
                            white-space: nowrap;
                            padding: 2px 6px;
                            border-left: 3px solid transparent;
                            cursor: pointer;
                        }
                        
                        :host([disabled]) {
                            color: grey;
                            pointer-events: none;
                        }
        
                        :host([active]) {
                            border-left: 3px solid dimgray;
                            background-color: whitesmoke;
                        }
        
                        ::slotted(*) {
                            pointer-events: none;
                        }
                    `
                }
            }),
            HTML("slot")
        );

        this.panel = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        const panel = document.getElementById(this.controls);
        if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
            this.panel = panel;
        }
        if (this.panel)  {
            this.panel.hidden = !this.active;
        }
    }
    
    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "active":
                    if (this.active) {
                        this.dispatchEvent(new CustomEvent("e_tabchange", {detail: {tab: this}, bubbles: true}));
                    }
                    const panel = document.getElementById(this.controls);
                    if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
                        this.panel = panel;
                    }
                    if (this.panel)  {
                        this.panel.hidden = !this.active;
                    }
                    break;
            }
        }
    }
}

var HTMLETabElement: HTMLETabElementConstructor = HTMLETabElementBase;