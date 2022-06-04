import { Fragment } from "../../../../lib";
import { CustomElement, element } from "../../Element";
import { HTMLETreeElement } from "./Tree";
import { HTMLETreeItemElement } from "./TreeItem";

export { HTMLETreeItemGroupElement };

interface HTMLETreeItemGroupElementConstructor {
    readonly prototype: HTMLETreeItemGroupElement;
    new(): HTMLETreeItemGroupElement;
}

interface HTMLETreeItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitemgroup": HTMLETreeItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-treeitemgroup"
})
class HTMLETreeItemGroupElementBase extends HTMLElement implements HTMLETreeItemGroupElement {

    readonly shadowRoot!: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: block;
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
        shadowRoot.addEventListener(
            "slotchange", this.#handleSlotChangeEvent.bind(this)
        );
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedItems = <HTMLETreeItemElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLETreeItemElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
            item_i.level = (() => {
                let level = -1;
                let closestItem: HTMLETreeItemElement | null = item_i;
                while (closestItem !== null && closestItem.matches("e-tree :scope")) {
                    closestItem = closestItem.parentElement?.closest("e-treeitem") ?? null;
                    level++;
                }
                return level;
            })();
        });
    }
}

var HTMLETreeItemGroupElement: HTMLETreeItemGroupElementConstructor = HTMLETreeItemGroupElementBase;