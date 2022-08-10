import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridCellCollection } from "./GridCellCollection";
import { HTMLEGridRowCollection } from "./GridRowCollection";

export { HTMLEGridHeadElement };

interface HTMLEGridHeadElementConstructor {
    prototype: HTMLEGridHeadElement;
    new(): HTMLEGridHeadElement;
}

interface HTMLEGridHeadElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridhead": HTMLEGridHeadElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-gridhead"
})
class HTMLEGridHeadElementBase extends HTMLElement implements HTMLEGridHeadElement {

    readonly shadowRoot!: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: table-row-group;
                        }
                    `
                    ]
            }),
            element("slot")
        );
    }
    
    constructor() {
        super();
        this.cells = new HTMLEGridCellCollection(this);
        this.rows = new HTMLEGridRowCollection(this);
        const shadowRoot = this.attachShadow({mode: "open"});
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