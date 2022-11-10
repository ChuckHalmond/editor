import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { AttributeProperty, CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";

import "./GridCell";

export { HTMLEGridRowElement };

interface HTMLEGridRowElementConstructor {
    prototype: HTMLEGridRowElement;
    new(): HTMLEGridRowElement;
}

interface HTMLEGridRowElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
    selected: boolean;
    posinset: number;
    cells(): HTMLEGridCellElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridrow": HTMLEGridRowElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-gridrow"
})
class HTMLEGridRowElementBase extends HTMLElement implements HTMLEGridRowElement {

    readonly shadowRoot!: ShadowRoot;

    cells(): HTMLEGridCellElement[] {
        return Array.from(this.querySelectorAll<HTMLEGridCellElement>("e-gridcell"));
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean})
    selected!: boolean;

    @AttributeProperty({type: Number})
    posinset!: number;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table-row;
            }
            
            :host(:hover):host-context(e-grid:is([selectby="row"])) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([active]):host-context(e-grid:focus-within:is([selectby="row"])) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([selected]):host-context(e-grid:is([selectby="row"])) {
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
        shadowRoot.addEventListener(
            "slotchange", this.#handleSlotChangeEvent.bind(this)
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

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedCells = <HTMLEGridCellElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEGridCellElement
            );
        assignedCells.forEach((cell_i, i) => {
            cell_i.posinset = i;
        });
    }
}

var HTMLEGridRowElement: HTMLEGridRowElementConstructor = HTMLEGridRowElementBase;