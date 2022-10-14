import { CustomElement, element, AttributeProperty } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEToolBarElement } from "../toolbars/ToolBar";

export { HTMLEListItemElement };

interface HTMLEListItemElementConstructor {
    prototype: HTMLEListItemElement;
    new(): HTMLEListItemElement;
}

interface HTMLEListItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly badge: HTMLSpanElement | null;
    readonly toolbar: HTMLEToolBarElement | null;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    posinset: number;
    label: string;
    droptarget: boolean;
    selected: boolean;
    active: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-listitem": HTMLEListItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-listitem"
})
class HTMLEListItemElementBase extends HTMLElement implements HTMLEListItemElement {

    readonly shadowRoot!: ShadowRoot;
    
    get badge(): HTMLElement | null {
        return this.#badge;
    }

    get toolbar(): HTMLEToolBarElement | null {
        return this.#toolbar;
    }

    get menu(): HTMLEMenuElement | null {
        return this.#menu;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Number})
    posinset!: number;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;

    #badge: HTMLElement | null;
    #toolbar: HTMLEToolBarElement | null;
    #menu: HTMLEMenuElement | null;
    
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: flex;
                user-select: none;
                line-height: 22px;
            }
            
            :host([droptarget]) {
                background-color: var(--droptarget-item-color);
            }
            
            :host(:hover) {
                background-color: var(--hovered-item-color);
            }
            
            :host([active]) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            :host(:focus) {
                background-color: var(--focus-background-color);
            }
            
            :host([selected]) {
                background-color: var(--selected-item-color);
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
        this.#badge = null;
        this.#menu = null;
        this.#toolbar = null;
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this))
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
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const {name: slotName} = <HTMLSlotElement>target ;
        switch (slotName) {
            case "toolbar": {
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                this.#toolbar = element instanceof HTMLEToolBarElement ? element : null;
                break;
            }
            case "badge": {
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                this.#badge = element instanceof HTMLSpanElement ? element : null;
                break;
            }
            case "menu": {
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                this.#menu = element instanceof HTMLEMenuElement ? element : null;
                break;
            }
        }
    }
}

var HTMLEListItemElement: HTMLEListItemElementConstructor = HTMLEListItemElementBase;