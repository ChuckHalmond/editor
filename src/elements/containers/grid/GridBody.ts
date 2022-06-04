import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridCellCollection } from "./GridCellCollection";
import { HTMLEGridRowCollection } from "./GridRowCollection";

export { HTMLEGridBodyElement };

interface HTMLEGridBodyElementConstructor {
    readonly prototype: HTMLEGridBodyElement;
    new(): HTMLEGridBodyElement;
}

interface HTMLEGridBodyElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridbody": HTMLEGridBodyElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-gridbody"
})
class HTMLEGridBodyElementBase extends HTMLElement implements HTMLEGridBodyElement {

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

var HTMLEGridBodyElement: HTMLEGridBodyElementConstructor = HTMLEGridBodyElementBase;