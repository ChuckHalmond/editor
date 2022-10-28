import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridRowElement } from "./GridRow";

export { HTMLEGridHeadElement };

interface HTMLEGridHeadElementConstructor {
    prototype: HTMLEGridHeadElement;
    new(): HTMLEGridHeadElement;
}

interface HTMLEGridHeadElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    cells(): HTMLEGridCellElement[];
    rows(): HTMLEGridRowElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridhead": HTMLEGridHeadElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-gridhead"
})
class HTMLEGridHeadElementBase extends HTMLElement implements HTMLEGridHeadElement {
    readonly shadowRoot!: ShadowRoot;

    cells(): HTMLEGridCellElement[] {
        return Array.from(this.querySelectorAll<HTMLEGridCellElement>(
            "e-gridcell"
        ));
    }

    rows(): HTMLEGridRowElement[] {
        return Array.from(this.querySelectorAll<HTMLEGridRowElement>(
            "e-gridrow"
        ));
    }

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table-header-group;
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
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedItems = <HTMLEGridCellElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEGridCellElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
}

var HTMLEGridHeadElement: HTMLEGridHeadElementConstructor = HTMLEGridHeadElementBase;