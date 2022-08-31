import { CustomElement, AttributeProperty, QueryProperty, element } from "../../Element";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuItemElement };
export { EMenuItem };

interface HTMLEMenuItemElementConstructor {
    prototype: HTMLEMenuItemElement;
    new(): HTMLEMenuItemElement;
}

interface HTMLEMenuItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly internals: ElementInternals;
    get menu(): HTMLEMenuElement | null;
    name: string;
    label: string | null;
    value: string;
    hotkey: string;
    disabled: boolean;
    checked: boolean;
    expanded: boolean;
    type: "button" | "checkbox" | "radio" | "menu" | "submenu";
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-menuitem"
})
class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {

    readonly shadowRoot!: ShadowRoot;
    readonly internals: ElementInternals;
    
    @QueryProperty({selector: ":scope > e-menu[slot=menu]"})
    menu!: HTMLEMenuElement | null;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string | null;

    @AttributeProperty({type: String})
    value!: string;

    @AttributeProperty({type: String})
    hotkey!: string;

    @AttributeProperty({type: Boolean, observed: true})
    disabled!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    checked!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    expanded!: boolean;

    @AttributeProperty({type: Boolean})
    overflown!: boolean;

    @AttributeProperty({type: String, defaultValue: "button", observed: true})
    type!: "button" | "checkbox" | "radio" | "menu" | "submenu";

    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null) {
        const {internals} = this;
        switch (attributeName) {
            case "type": {
                switch (newValue) {
                    case "checkbox":
                    case "radio": {
                        internals.role = `menuitem${newValue}`;
                        break;
                    }
                    default: {
                        internals.role = "menuitem";
                        break;
                    }
                }
                break;
            }
            case "checked": {
                internals.ariaChecked = String(newValue !== null);
                break;
            }
            case "disabled": {
                internals.ariaDisabled = String(newValue !== null);
                break;
            }
            case "expanded": {
                internals.ariaExpanded = String(newValue !== null);
                break;
            }
            case "label": {
                internals.ariaLabel = newValue;
                break;
            }
        }
    }

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "icon"
                }
            }),
            element("span", {
                attributes: {
                    part: "label"
                },
                children: [
                    element("slot")
                ]
            }),
            element("span", {
                attributes: {
                    part: "arrow"
                }
            }),
            element("slot", {
                attributes: {
                    name: "menu"
                }
            })
        );
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const internals = this.attachInternals();
        this.internals = internals;
        internals.role = "menuitem";
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }
    
    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }

    toggle(force?: boolean): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const expand = force ?? !expanded;
                this.expanded = expand;
                if (expand) {
                    this.#positionMenu();
                }
                this.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
        }
    }

    expand(): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (!expanded) {
                    this.expanded = true;
                    this.#positionMenu();
                }
                break;
            }
        }
    }

    collapse(): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (expanded) {
                    this.expanded = false;
                }
                break;
            }
        }
    }

    #positionMenu(): void {
        const {menu} = this;
        if (menu !== null) {
            const {style: menuStyle} = menu;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = this.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
            const {type} = this;
            if (type == "menu") {
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${
                    overflowX > 0 ?
                    scrollX + itemRight - menuWidth :
                    scrollX + itemLeft
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom
                }px`);
            }
            else {
                const closestMenu = this.closest("e-menu");
                if (closestMenu !== null) {
                    const {top: closestMenuTop, left: closestMenuLeft} = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${
                        overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft
                    }px`);
                    menuStyle.setProperty("top", `${
                        overflowY > 0 ?
                        itemBottom  - menuHeight - closestMenuTop :
                        itemTop - closestMenuTop
                    }px`);
                }
            }
        }
    }
}

var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor = HTMLEMenuItemElementBase;

interface EMenuItemConstructor {
    prototype: HTMLEMenuItemElement;
    new(init: {
        name?: string;
        label: string;
        type?: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    button(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    checkbox(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    radio(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    menu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    submenu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
}

var EMenuItem = <EMenuItemConstructor>Object.assign(
    <Function>function(init: {
        name?: string;
        label: string;
        type?: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }) {
        const {label, name, type, value, trigger, menu} = init;
        if (menu) {
            menu.slot = "menu";
        }
        return element("e-menuitem", {
            attributes: {
                tabindex: -1,
                title: label,
                name: name,
                value: value,
                type: type
            },
            children: menu ? [
                label,
                menu
            ] : [
                label
            ],
            listeners: {
                trigger: trigger
            }
        });
    }, {
        prototype: HTMLEMenuItemElement.prototype,
        button(init: {
            name?: string,
            label: string,
            value?: string,
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "button"
            });
        },
        checkbox(init: {
            name?: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "checkbox"
            });
        },
        radio(init: {
            name?: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "radio"
            });
        },
        menu(init: {
            name?: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "menu"
            });
        },
        submenu(init: {
            name?: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "submenu"
            });
        }
    }
);