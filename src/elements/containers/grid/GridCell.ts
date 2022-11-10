import { DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
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
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host(:hover):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([type="columnheader"][active]) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host([active]):host-context(e-grid:focus-within:is(:not([selectby]), [selectby="cell"])) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([selected]):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
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