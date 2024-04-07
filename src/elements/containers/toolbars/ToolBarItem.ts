import { DEFAULT_THEME_ACTIVATED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { HTMLESelectElement } from "../../controls/select/Select";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { constructor } from "../../Snippets";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";

export { HTMLEToolBarItemElement };
export { EToolBarItem };

interface HTMLEToolBarItemElementConstructor {
    prototype: HTMLEToolBarItemElement;
    new(): HTMLEToolBarItemElement;
}

interface HTMLEToolBarItemElement extends HTMLElement {
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
        "e-toolbaritem": HTMLEToolBarItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;
var iconPartTemplate: HTMLElement;

@CustomElement({
    name: "e-toolbaritem"
})
class HTMLEToolBarItemElementBase extends HTMLElement implements HTMLEToolBarItemElement {
    
    declare readonly shadowRoot: ShadowRoot;

    @QueryProperty({selector: ":scope > e-menubutton[slot=menubutton]"})
    declare readonly menubutton: HTMLEMenuButtonElement | null;
    
    @QueryProperty({selector: ":scope > e-select[slot=select]"})
    declare readonly select: HTMLESelectElement | null;

    @AttributeProperty({type: Boolean})
    declare active: boolean;

    @AttributeProperty({type: Boolean})
    declare pressed: boolean;

    @AttributeProperty({type: Boolean})
    declare expanded: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    declare iconed: boolean;

    @AttributeProperty({type: String, observed: true})
    declare value: string;

    @AttributeProperty({type: String})
    declare name: string;

    @AttributeProperty({type: String, observed: true})
    declare label: string;

    @AttributeProperty({type: String})
    declare type: "button" | "checkbox" | "radio" | "menubutton" | "select";

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
        iconPartTemplate = element("span", {
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
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([pressed]),
            :host(:active) {
                background-color: var(--theme-activated-item-color, ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR});
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
                background-color: none;
                -webkit-mask-image: none;
                mask-image: none;
                filter: none;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([type="select"]:focus) ::slotted(e-select) {
                border-color: transparent;
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
                    shadowRoot.prepend(iconPartTemplate.cloneNode(true));
                }
                else {
                    const iconPart = this.#icon();
                    if (iconPart) {
                        iconPart.remove();
                    }
                }
                break;
            }
        }
    }

    #icon(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=icon]")!;
    }
}

var HTMLEToolBarItemElement: HTMLEToolBarItemElementConstructor = HTMLEToolBarItemElementBase;

interface EToolBarItemConstructor {
    readonly prototype: HTMLEToolBarItemElement;
    new(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    menubutton(init: {
        name: string;
        label: string;
        menubutton: HTMLEMenuButtonElement;
    }): HTMLEToolBarItemElement;
    select(init: {
        name: string;
        label: string;
        select: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
}

var EToolBarItem: EToolBarItemConstructor = constructor(
    HTMLEToolBarItemElement.prototype,
    (init) => {
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
        button(init) {
            return new EToolBarItem({
                ...init, type: "button"
            });
        },
        checkbox(init) {
            return new EToolBarItem({
                ...init, type: "checkbox"
            });
        },
        radio(init) {
            return new EToolBarItem({
                ...init, type: "radio"
            });
        },
        menubutton(init) {
            return new EToolBarItem({
                ...init, type: "menubutton"
            });
        },
        select(init) {
            return new EToolBarItem({
                ...init, type: "select"
            });
        }
    }
);