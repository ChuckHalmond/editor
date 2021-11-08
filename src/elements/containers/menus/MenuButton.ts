import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuButtonElement };

interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new(): HTMLEMenuButtonElement;
    readonly observedAttributes: string[];
}

interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

@CustomElement({
    name: "e-menubutton"
})
class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "string"})
    public label!: string;

    @AttributeProperty({type: "boolean"})
    public disabled!: boolean;

    @AttributeProperty({type: "boolean"})
    public active!: boolean;

    public childMenu: HTMLEMenuElement | null;

    public readonly shadowRoot!: ShadowRoot;

    public static get observedAttributes(): string[] {
        return ["label"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
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
                    `
                }
            }),
            HTML("span", {
                part: ["toggle_arrow"]
            }),
            HTML("slot", {
                properties: {
                    name: "menu"
                }
            })
        );
        
        this.childMenu = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        this.shadowRoot.addEventListener("slotchange", this);

        this.addEventListener("keydown", this);
        this.addEventListener("click", this);
        this.addEventListener("focusout", this);
    }

    public handleEvent(event: Event) {
        const target = event.target;
        switch (event.type) {
            case "slotchange":
                const slottedMenu = (target as HTMLSlotElement).assignedElements()[0];
                this.childMenu = (slottedMenu instanceof HTMLEMenuElement) ? slottedMenu : null;
                break;
            case "click":
                if (target instanceof Element && this.childMenu && !this.childMenu.contains(target)) {
                    this.toggle();
                }
                break;
            case "focusout":
                const newTarget = (event as FocusEvent).relatedTarget;
                if (newTarget instanceof Element && !this.contains(newTarget)) {
                    this.active = false;
                }
                break;
            case "keydown":
                switch ((event as KeyboardEvent).key) {
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
                break;
        }
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