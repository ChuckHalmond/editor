import { element, CustomElement, AttributeProperty } from "../../Element";
import { HTMLEMenuItemElement, EMenuItem } from "./MenuItem";

export { HTMLEMenuItemGroupElement };
export { EMenuItemGroup };

interface HTMLEMenuItemGroupElementConstructor {
    readonly prototype: HTMLEMenuItemGroupElement;
    new(): HTMLEMenuItemGroupElement;
}

interface HTMLEMenuItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    label: string;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-menuitemgroup"
})
class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    readonly shadowRoot!: ShadowRoot;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: flex;
                            flex-direction: column;
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
        const assignedItems = <HTMLEMenuItemElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEMenuItemElement
            );
        assignedItems.forEach((item_i, i) => {
            //item_i.index = i;
        });
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label":
                const label = this.shadowRoot.querySelector("[part=label]");
                if (label) {
                    label.textContent = newValue;
                }
            break;
        }
    }
}

var HTMLEMenuItemGroupElement: HTMLEMenuItemGroupElementConstructor = HTMLEMenuItemGroupElementBase;

interface EMenuItemGroupConstructor {
    readonly prototype: HTMLEMenuItemGroupElement;
    new(init: {
        name?: string;
        items: HTMLEMenuItemElement[];
    }): HTMLEMenuItemGroupElement;
    radios(init: {name: string, items: {label: string, value: string}[]}): HTMLEMenuItemGroupElement;
}

var EMenuItemGroup = <EMenuItemGroupConstructor>Object.assign(
    <Function>function(init: {
        name?: string,
        items: HTMLEMenuItemElement[]
    }) {
        const {name, items} = init;
        return element("e-menuitemgroup", {
            attributes: {
                name: name
            },
            children: items
        });
    }, {
        prototype: HTMLEMenuItemGroupElement.prototype,
        radios: (init: {
            name: string,
            items: {
                label: string,
                value: string
            }[]
        }) => {
            const {name, items} = init;
            return element("e-menuitemgroup", {
                attributes: {
                    name: name
                },
                children: items.map(
                    ({label, value}) => new EMenuItem({name, label, type: "radio", value})
                )
            });
        }
    }
);