import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuButtonElement };

interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new(): HTMLEMenuButtonElement;
}

interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    trigger(): void
}

@RegisterCustomHTMLElement({
    name: "e-menubutton",
    observedAttributes: ["icon", "label", "checked"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
    {name: "label", type: "string"},
    {name: "disabled", type: "boolean"},
])
class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {

    public name!: string;
    public label!: string;
    public disabled!: boolean;
    public active!: boolean;

    public childMenu: HTMLEMenuElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;
                    cursor: pointer;
                    padding: 2px;
                }

                :host(:hover) {
                    background-color: gainsboro;
                }

                :host(:focus-within:not(:focus)) {
                    background-color: gainsboro;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }
                
                ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="toggle_arrow"] {
                    position: relative;
                    display: inline-block;
                    flex: auto;
                    width: 18px;
                    height: 18px;
                }

                [part~="toggle_arrow"]::after {
                    display: inline-block;
                    text-align: center;
                    width: 18px;
                    position: absolute;
                    content: "▼";
                    color: dimgray;
                }
            </style>
            <span part="toggle_arrow"></span>
            <slot name="menu"></slot>
        `);
        
        this.childMenu = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        const menuSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=menu]");
        if (menuSlot) {
            menuSlot.addEventListener("slotchange", () => {
                const menuElem = menuSlot.assignedElements()[0];
                if (menuElem instanceof HTMLEMenuElement) {
                    this.childMenu = menuElem;
                }
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Enter":
                    if (!this.active) {
                        this.active = true;
                        if (this.childMenu) {
                            this.childMenu.focusItemAt(0);
                        }
                    }
                    break;
                case "Escape":
                    this.focus();
                    this.active = false;
                    break;
            }
        });

        this.addEventListener("click", (event: MouseEvent) => {
            let target = event.target as Element;
            if (this.childMenu && !this.childMenu.contains(target)) {
                this.toggle();
            }
        });

        this.addEventListener("blur", (event: FocusEvent) => {
            let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget as Node);
            if (!containsNewFocus) {
                this.active = false;
            }
        }, {capture: true});
    }

    public toggle(): void {
        if (!this.active) {
            this.active = true;
            if (this.childMenu) {
                this.childMenu.focusItemAt(0);
            }
        }
        else {
            this.active = false;
        }
    }

    public trigger(): void {
        alert();
        if (!this.disabled) {
            this.dispatchEvent(new CustomEvent("trigger", {bubbles: true}));
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
}

var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor = HTMLEMenuButtonElementBase;