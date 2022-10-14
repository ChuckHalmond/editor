import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";

export { HTMLEStatusItemElement };

interface HTMLEStatusItemElementConstructor {
    prototype: HTMLEStatusItemElement;
    new(): HTMLEStatusItemElement;
}

interface HTMLEStatusItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menubutton: HTMLEMenuButtonElement | null;
    readonly select: HTMLESelectElement | null;
    value: string;
    name: string;
    label: string;
    active: boolean;
    pressed: boolean;
    iconed: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;
var iconPart: HTMLElement;

@CustomElement({
    name: "e-statusitem"
})
class HTMLEStatusItemElementBase extends HTMLElement implements HTMLEStatusItemElement {
    
    readonly shadowRoot!: ShadowRoot;

    @QueryProperty({selector: ":scope > e-menubutton[slot=menubutton]"})
    readonly menubutton!: HTMLEMenuButtonElement | null;
    
    @QueryProperty({selector: ":scope > e-select[slot=select]"})
    readonly select!: HTMLESelectElement | null;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean})
    pressed!: boolean;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    iconed!: boolean;

    @AttributeProperty({type: String, observed: true})
    value!: string;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: String})
    type!: "button" | "checkbox" | "radio" | "menubutton" | "select";

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot"),
            element("slot", {
                attributes: {
                    name: "select"
                }
            }),
            element("slot", {
                attributes: {
                    name: "menubutton"
                }
            })
        );
        iconPart = element("span", {
            attributes: {
                part: "icon"
            }
        });
        style = /*css*/`
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
                line-height: 22px;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--hovered-item-color);
            }
            
            :host([pressed]) {
                background-color: var(--activated-item-color);
            }
            
            :host(:not([iconed])) [part="icon"] {
                display: none;
            }

            [part="icon"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                padding: 2px;
                overflow: hidden;
            }
            
            [part="icon"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: var(--icon-color, none);
                -webkit-mask-image: var(--icon-image, none);
                mask-image: var(--icon-image, none);
                filter: var(--icon-filter, none);
            }
            
            :host(:focus-within):host-context(e-toolbar:focus-within) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            :host([type="menubutton"]) ::slotted(e-menubutton):focus,
            :host([type="select"]) ::slotted(e-select):focus {
                outline: none;
                outline-offset: none;
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
    }

    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                //...
                break;
            }
            case "iconed": {
                const {shadowRoot} = this;
                if (newValue !== null) {
                    shadowRoot.prepend(iconPart.cloneNode(true));
                }
                else {
                    const iconPart = shadowRoot.querySelector<HTMLElement>("[part=icon]");
                    if (iconPart) {
                        iconPart.remove();
                    }
                }
                break;
            }
        }
    }
}

var HTMLEStatusItemElement: HTMLEStatusItemElementConstructor = HTMLEStatusItemElementBase;

interface EToolBarItemConstructor {
    prototype: HTMLEStatusItemElement;
    new(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }): HTMLEStatusItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEStatusItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEStatusItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEStatusItemElement;
    menubutton(init: {
        name: string;
        label: string;
        menubutton: HTMLEMenuButtonElement;
    }): HTMLEStatusItemElement;
    select(init: {
        name: string;
        label: string;
        select: HTMLESelectElement;
    }): HTMLEStatusItemElement;
}

var EToolBarItem = <EToolBarItemConstructor>Object.assign(
    <Function>function(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }) {
        const {label, name, type, value, trigger, menubutton, select} = init;
        if (menubutton) {
            menubutton.slot = "menubutton";
        }
        if (select) {
            select.slot = "select";
        }
        return element("e-toolbaritem", {
            attributes: {
                tabindex: -1,
                title: label,
                name: name,
                value: value,
                type: type
            },
            children: menubutton ? [menubutton] : select ? [select] : undefined,
            listeners: {
                click: trigger
            }
        });
    }, {
        prototype: HTMLEStatusItemElement.prototype,
        button(init: {
            name: string,
            label: string,
            value?: string,
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "button"
            });
        },
        checkbox(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "checkbox"
            });
        },
        radio(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "radio"
            });
        },
        menubutton(init: {
            name: string;
            label: string;
            menubutton: HTMLEMenuButtonElement;
        }) {
            return new EToolBarItem({
                ...init, type: "menubutton"
            });
        },
        select(init: {
            name: string;
            label: string;
            select: HTMLESelectElement;
        }) {
            return new EToolBarItem({
                ...init, type: "select"
            });
        },
    }
);