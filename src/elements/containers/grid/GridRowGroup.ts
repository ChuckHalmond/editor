import { CustomElement, element } from "../../Element";
import { HTMLEGridRowElement } from "./GridRow";

import "./GridRow";

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
var style: string;

@CustomElement({
    name: "e-gridrowgroup"
})
class HTMLEGridRowGroupElementBase extends HTMLElement implements HTMLEGridRowGroupElement {

    declare readonly shadowRoot: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table-row-group;
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
        const assignedItems = <HTMLEGridRowElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEGridRowElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
}

var HTMLEGridRowGroupElement: HTMLEGridRowGroupElementConstructor = HTMLEGridRowGroupElementBase;