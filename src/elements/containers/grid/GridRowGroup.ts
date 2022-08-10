import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";

export { HTMLEGridRowGroupElement };

interface HTMLEGridRowGroupElementConstructor {
    prototype: HTMLEGridRowGroupElement;
    new(): HTMLEGridRowGroupElement;
}

interface HTMLEGridRowGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridrowgroup": HTMLEGridRowGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-gridrowgroup"
})
class HTMLEGridRowGroupElementBase extends HTMLElement implements HTMLEGridRowGroupElement {

    readonly shadowRoot!: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: table-row-group;
                            /*display: flex;
                            flex-direction: column;*/
                        }
                    `
                ]
            }),
            element("slot")
        );
    }
    
    constructor() {
        super();
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

var HTMLEGridRowGroupElement: HTMLEGridRowGroupElementConstructor = HTMLEGridRowGroupElementBase;