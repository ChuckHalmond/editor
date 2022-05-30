import { CustomElement, element } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";

export { HTMLEListItemGroupElement };

interface HTMLEListItemGroupElementConstructor {
    readonly prototype: HTMLEListItemGroupElement;
    new(): HTMLEListItemGroupElement;
}

interface HTMLEListItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-listitemgroup": HTMLEListItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-listitemgroup"
})
class HTMLEListItemGroupElementBase extends HTMLElement implements HTMLEListItemGroupElement {

    readonly shadowRoot!: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        shadowRoot.addEventListener(
            "slotchange", this.#handleSlotChangeEvent.bind(this)
        );
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedItems = <HTMLEListItemElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEListItemElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
}

var HTMLEListItemGroupElement: HTMLEListItemGroupElementConstructor = HTMLEListItemGroupElementBase;