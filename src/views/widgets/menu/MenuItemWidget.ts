import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { menuItemWidget };

type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";

declare global {
    interface WidgetNameMap {
        "menuitem": MenuItemWidgetFactory
    }
}

interface MenuItemWidgetFactory extends WidgetFactory {
    create(properties?: {
        type?: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
    }): HTMLElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    getMenu(item: HTMLElement): HTMLElement | null;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): MenuItemType | null;
    setType(item: HTMLElement, type: MenuItemType): void;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getChecked(item: HTMLElement): boolean;
    setChecked(item: HTMLElement, value: boolean): void;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    trigger(item: HTMLElement): void;
    toggle(item: HTMLElement, force?: boolean): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
}

var menuItemWidget = new (Widget({
    name: "menuitem"
})(class MenuItemWidgetFactoryBase extends WidgetFactory implements MenuItemWidgetFactory {
    #iconPartTemplate: HTMLElement;
    #arrowPartTemplate : HTMLElement;
    #template: HTMLElement;
    #types: MenuItemType[];
    #typesFeatures: {
        [key in MenuItemType]: {
            role: string,
            hasIcon: boolean,
            hasArrow: boolean
        }
    };

    constructor() {
        super();
        this.#iconPartTemplate = element("span", {
            attributes: {
                class: "icon"
            }
        });
        this.#arrowPartTemplate = element("span", {
            attributes: {
                class: "arrow"
            }
        });
        this.#template = element("button", {
            attributes: {
                class: "menuitem",
                tabindex: -1,
                type: "button",
                role: "menuitem"
            },
            children: [
                this.#iconPartTemplate.cloneNode(true),
                element("span", {
                    attributes: {
                        class: "label"
                    }
                })
            ]
        });
        this.#types = ["checkbox", "radio", "menu", "submenu", "button"];
        this.#typesFeatures = {
            button: {
                role: "menuitem",
                hasIcon: true,
                hasArrow: false
            },
            checkbox: {
                role: "menuitemcheckbox",
                hasIcon: true,
                hasArrow: false
            },
            radio: {
                role: "menuitemradio",
                hasIcon: true,
                hasArrow: false
            },
            menu: {
                role: "menuitem",
                hasIcon: false,
                hasArrow: false
            },
            submenu: {
                role: "menuitem",
                hasIcon: true,
                hasArrow: true
            }
        }
    }

    create(properties?: {
        type: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
    }): HTMLElement {
        const item = <HTMLElement>this.#template.cloneNode(true);
        if (properties !== void 0) {
            const {keyshortcut, checked, type, label, name, value} = properties;
            if (keyshortcut !== void 0) {
                this.setKeyShortcut(item, keyshortcut);
            }
            if (checked !== void 0) {
                this.setChecked(item, checked);
            }
            if (type !== void 0) {
                this.setType(item, type);
            }
            if (label !== void 0) {
                this.setLabel(item, label);
            }
            if (name !== void 0) {
                this.setName(item, name);
            }
            if (value !== void 0) {
                this.setValue(item, value);
            }
        }
        return item;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement): void {
        const hasChildMenu = Array.from(slot.childNodes).some(
            childNode_i => childNode_i instanceof HTMLElement && childNode_i.classList.contains("menu")
        );
        item.setAttribute("aria-haspopup", hasChildMenu.toString());
    }

    #label(item: HTMLElement) {
        return item.querySelector<HTMLElement>(":scope > .label")!;
    }

    getMenu(item: HTMLElement) {
        return item.querySelector<HTMLElement>(":scope > .menu");
    }

    getKeyShortcut(item: HTMLElement) {
        return item.getAttribute("aria-keyshortcuts");
    }

    setKeyShortcut(item: HTMLElement, value: string | null) {
        if (value !== null) {
            item.setAttribute("aria-keyshortcuts", value);
        }
        else {
            item.removeAttribute("aria-keyshortcuts");
        }
    }

    getLabel(item: HTMLElement) {
        return this.#label(item).textContent ?? "";
    }

    setLabel(item: HTMLElement, value: string) {
        this.#label(item).textContent = value;
    }
    
    getType(item: HTMLElement) {
        const types = this.#types;
        const {classList} = item;
        for (let type_i of types) {
            if (classList.contains(`menuitem-${type_i}`)) {
                return type_i;
            }
        }
        return null;
    }

    setType(item: HTMLElement, type: MenuItemType) {
        const typesFeatures = this.#typesFeatures;
        const iconPartTemplate = this.#iconPartTemplate;
        const arrowPartTemplate = this.#arrowPartTemplate;
        const {role, hasIcon, hasArrow} = typesFeatures[type];
        const oldType = this.getType(item);
        const {classList} = item;
        if (oldType) {
            classList.remove(`menuitem-${oldType}`);
        }
        classList.add(`menuitem-${type}`);
        item.setAttribute("role", role);
        const labelPart = item.querySelector(":scope > .label");
        const iconPart = item.querySelector(":scope > .icon");
        const arrowPart = item.querySelector(":scope > .arrow");
        if (hasIcon) {
            if (!iconPart && labelPart) {
                labelPart.before(iconPartTemplate.cloneNode(true));
            }
        }
        else {
            if (iconPart) {
                iconPart.remove();
            }
        }
        if (hasArrow) {
            if (!arrowPart && labelPart) {
                labelPart.after(arrowPartTemplate.cloneNode(true));
            }
        }
        else {
            if (arrowPart) {
                arrowPart.remove();
            }
        }
    }

    getValue(item: HTMLElement) {
        return item.getAttribute("value") ?? "";
    }

    setValue(item: HTMLElement, value: string) {
        item.setAttribute("value", value);
    }
    
    getName(item: HTMLElement) {
        return item.getAttribute("name") ?? "";
    }

    setName(item: HTMLElement, value: string) {
        item.setAttribute("name", value);
    }

    getChecked(item: HTMLElement) {
        return JSON.parse(item.getAttribute("aria-checked") ?? false.toString());
    }

    setChecked(item: HTMLElement, value: boolean) {
        item.setAttribute("aria-checked", value.toString());
    }

    setDisabled(item: HTMLElement, value: boolean) {
        item.toggleAttribute("disabled", value);
    }

    getDisabled(item: HTMLElement) {
        return item.hasAttribute("disabled");
    }

    setExpanded(item: HTMLElement, value: boolean) {
        item.toggleAttribute("aria-expanded", value);
    }

    getExpanded(item: HTMLElement) {
        return item.hasAttribute("aria-expanded");
    }

    trigger(item: HTMLElement) {
        const type = this.getType(item);
        switch (type) {
            case "checkbox": {
                this.setChecked(item, !this.getChecked(item));
                break;
            }
            case "radio": {
                this.setChecked(item, true);
                break;
            }
            case "menu":
            case "submenu": {
                this.toggle(item);
                break;
            }
        }
        item.dispatchEvent(new Event("trigger", {
            bubbles: true
        }));
    }

    toggle(item: HTMLElement, force?: boolean) {
        const expand = force ?? !this.getExpanded(item);
        this.setExpanded(item, expand);
        if (expand) {
            this.#positionMenu(item);
        }
    }

    expand(item: HTMLElement) {
        const expanded = this.getExpanded(item);
        if (!expanded) {
            this.setExpanded(item, true);
            this.#positionMenu(item);
        }
    }

    collapse(item: HTMLElement) {
        const expanded = this.getExpanded(item);
        if (expanded) {
            this.setExpanded(item, false);
        }
    }

    #positionMenu(item: HTMLElement) {
        const menu = this.getMenu(item);
        if (menu !== null) {
            const {style: menuStyle} = menu;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = item.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
            const type = this.getType(item);
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
                const closestMenu = item.closest(".menu");
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
}));