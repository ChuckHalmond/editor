import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
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

@RegisterCustomHTMLElement({
    name: "e-tab",
    observedAttributes: ["active", "controls"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
    {name: "disabled", type: "boolean"},
    {name: "controls", type: "string"},
])
class HTMLETabElementBase extends HTMLElement implements HTMLETabElement {

    public name!: string;
    public disabled!: boolean;
    public active!: boolean;
    public controls!: string;

    public panel: HTMLETabPanelElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
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
            </style>
            <slot></slot>
        `);
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