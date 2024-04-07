import { element, CustomElement, AttributeProperty } from "../../Element";
import { constructor } from "../../Snippets";
import { HTMLEMenuItemElement, EMenuItem } from "./MenuItem";

import "./MenuItem";

export { HTMLEMenuItemGroupElement };
export { EMenuItemGroup };

interface HTMLEMenuItemGroupElementConstructor {
    prototype: HTMLEMenuItemGroupElement;
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
var style: string;

@CustomElement({
    name: "e-menuitemgroup"
})
class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {

    @AttributeProperty({type: String})
    declare name: string;

    @AttributeProperty({type: String, observed: true})
    declare label: string;

    declare readonly shadowRoot: ShadowRoot;
    readonly internals: ElementInternals;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "label"
                }
            }),
            element("slot")
        );
        style = /*css*/`
            :host {
                display: flex;
                flex-direction: column;
            }
            
            [part="label"] {
                font-weight: bold;
            }
            
            :host([label]) [part="label"] {
                padding-bottom: 6px;
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
        const internals = this.attachInternals();
        internals.role = "group";
        this.internals = internals;
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        const {internals} = this;
        switch (name) {
            case "label":
                internals.ariaLabel = newValue;
                break;
        }
    }
}

var HTMLEMenuItemGroupElement: HTMLEMenuItemGroupElementConstructor = HTMLEMenuItemGroupElementBase;

interface EMenuItemGroupConstructor {
    prototype: HTMLEMenuItemGroupElement;
    new(init: {
        name?: string;
        items: HTMLEMenuItemElement[];
    }): HTMLEMenuItemGroupElement;
    radios(init: {name: string, items: {label: string, value: string}[]}): HTMLEMenuItemGroupElement;
}

var EMenuItemGroup: EMenuItemGroupConstructor = constructor(
    HTMLEMenuItemGroupElement.prototype,
    (init) => {
        const {name, items} = init;
        return element("e-menuitemgroup", {
            attributes: {
                name: name
            },
            children: items
        });
    }, {
        radios: (init) => {
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