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
    readonly menu: HTMLEMenuElement | null;
    name: string;
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

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    value!: string;

    @AttributeProperty({type: String})
    hotkey!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean})
    checked!: boolean;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    @AttributeProperty({type: String, defaultValue: "button", observed: true})
    type!: "button" | "checkbox" | "radio" | "menu" | "submenu";

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
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
    }

    @QueryProperty({selector: ":scope > e-menu[slot=menu]"})
    readonly menu!: HTMLEMenuElement | null;

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
        const {type} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (!this.expanded) {
                    this.expanded = true;
                    this.#positionMenu();
                }
                break;
            }
        }
    }

    collapse(): void {
        const {type} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (this.expanded) {
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
                    scrollX + itemLeft - menuWidth :
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
                    const menuComputedStyle = window.getComputedStyle(menu);
                    const {paddingTop, paddingBottom} = menuComputedStyle;
                    const menuPaddingTop = parseFloat(paddingTop);
                    const menuPaddingBottom = parseFloat(paddingBottom);
                    menuStyle.setProperty("top", `${
                        overflowY > 0 ?
                        itemBottom - menuHeight - closestMenuTop + menuPaddingBottom :
                        itemTop - closestMenuTop - menuPaddingTop
                    }px`);
                }
            }
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target == this) {
            const {type} = this;
            switch (type) {
                case "checkbox": {
                    this.checked = !this.checked;
                    break;
                }
                case "radio": {
                    this.checked = true;
                    break;
                }
                case "menu":
                case "submenu": {
                    this.toggle();
                    break;
                }
            }
        }
    }
}

var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor = HTMLEMenuItemElementBase;

interface EMenuItemConstructor {
    prototype: HTMLEMenuItemElement;
    new(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    menu(init: {
        name: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    submenu(init: {
        name: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
}

var EMenuItem = <EMenuItemConstructor>Object.assign(
    <Function>function(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menu" | "submenu";
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
            name: string,
            label: string,
            value?: string,
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "button"
            });
        },
        checkbox(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "checkbox"
            });
        },
        radio(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "radio"
            });
        },
        menu(init: {
            name: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "menu"
            });
        },
        submenu(init: {
            name: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "submenu"
            });
        }
    }
);