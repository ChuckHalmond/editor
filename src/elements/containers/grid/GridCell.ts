import { CustomElement, element, AttributeProperty } from "../../Element";

export { HTMLEGridCellElement };

interface HTMLEGridCellElementConstructor {
    prototype: HTMLEGridCellElement;
    new(): HTMLEGridCellElement;
}

interface HTMLEGridCellElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    type: "rowheader" | "columnheader" | "gridcell";
    headers: string;
    posinset: number;
    droptarget: boolean;
    selected: boolean;
    active: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridcell": HTMLEGridCellElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-gridcell"
})
class HTMLEGridCellElementBase extends HTMLElement implements HTMLEGridCellElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    headers!: string;

    @AttributeProperty({type: String})
    type!: "rowheader" | "columnheader" | "gridcell";

    @AttributeProperty({type: Number})
    posinset!: number;

    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table-cell;
                text-align: left;
            }
            
            :host([type="columnheader"]:hover) {
                background-color: var(--hovered-item-color);
            }
            
            :host(:hover):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
                background-color: var(--hovered-item-color);
            }
            
            :host([type="columnheader"][active]) {
                background-color: var(--focused-item-color);
            }
            
            :host([active]):host-context(e-grid:focus-within:is(:not([selectby]), [selectby="cell"])) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }

            :host(:focus-visible):host-context(e-grid:focus-within:is([selectby="row"])) {
                outline: none;
            }
            
            :host([selected]):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
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
}

var HTMLEGridCellElement: HTMLEGridCellElementConstructor = HTMLEGridCellElementBase;