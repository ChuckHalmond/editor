import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { menuItemWidget };

type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";

declare global {
    interface WidgetNameMap {
        "menuitem": MenuItemWidgetFactory
    }
}

interface MenuItemWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        type?: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
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
    toggle(item: HTMLElement, force?: boolean): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
}

var menuItemWidget = new(
Widget({
    name: "menuitem"
})(
class MenuItemWidgetFactoryBase extends WidgetFactory implements MenuItemWidgetFactory {
    #iconPartTemplate: HTMLElement;
    #arrowPartTemplate : HTMLElement;
    #keyshortcutsPartTemplate: HTMLElement;
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
        this.#keyshortcutsPartTemplate = element("span", {
            attributes: {
                class: "keyshortcuts"
            }
        });
        this.#template = element("button", {
            attributes: {
                class: "menuitem",
                role: "menuitem",
                type: "button",
                tabindex: -1
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

    create(init?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        type: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement {
        const item = <HTMLElement>this.#template.cloneNode(true);
        item.addEventListener("click", this.#handleClickEvent.bind(this));
        if (init !== undefined) {
            const {id, classList, tabIndex, keyshortcut, checked, type, label, name, value, disabled} = init;
            if (id !== undefined) {
                item.id = id;
            }
            if (classList !== undefined) {
                item.classList.add(...classList);
            }
            if (tabIndex !== undefined) {
                item.tabIndex = tabIndex;
            }
            if (keyshortcut !== undefined) {
                this.setKeyShortcut(item, keyshortcut);
            }
            if (checked !== undefined) {
                this.setChecked(item, checked);
            }
            if (type !== undefined) {
                if (type == "menu" || type == "submenu") {
                    this.setExpanded(item, false);
                }
                this.setType(item, type);
            }
            if (label !== undefined) {
                this.setLabel(item, label);
            }
            if (name !== undefined) {
                this.setName(item, name);
            }
            if (value !== undefined) {
                this.setValue(item, value);
            }
            if (disabled !== undefined) {
                this.setDisabled(item, disabled);
            }
        }
        return item;
    }

    slot(item: HTMLElement): HTMLElement | null {
        return item;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement): void {
        const hasChildMenu = Array.from(slot.childNodes).some(
            childNode_i => childNode_i instanceof HTMLElement && childNode_i.classList.contains("menu")
        );
        item.setAttribute("aria-haspopup", String(hasChildMenu));
    }

    #label(item: HTMLElement): HTMLElement {
        return item.querySelector<HTMLElement>(":scope > .label")!;
    }

    getMenu(item: HTMLElement): HTMLElement | null {
        return item.querySelector<HTMLElement>(":scope > .menu");
    }

    getKeyShortcut(item: HTMLElement): string | null {
        return item.getAttribute("aria-keyshortcuts");
    }

    setKeyShortcut(item: HTMLElement, value: string | null): void {
        let keyshortcutsPart = item.querySelector(":scope > .keyshortcuts");
        if (value !== null) {
            item.setAttribute("aria-keyshortcuts", value);
            if (!keyshortcutsPart) {
                const labelPart = this.#label(item);
                const keyshortcutsPartTemplate = this.#keyshortcutsPartTemplate;
                keyshortcutsPart = <HTMLElement>keyshortcutsPartTemplate.cloneNode(true);
                labelPart.after(keyshortcutsPart);
            }
            keyshortcutsPart.textContent = value;
        }
        else {
            item.removeAttribute("aria-keyshortcuts");
            if (keyshortcutsPart) {
                keyshortcutsPart.remove();
            }
        }
    }

    getLabel(item: HTMLElement): string {
        return this.#label(item).textContent ?? "";
    }

    setLabel(item: HTMLElement, value: string): void {
        this.#label(item).textContent = value;
    }
    
    getType(item: HTMLElement): MenuItemType | null {
        const types = this.#types;
        const {classList} = item;
        for (let type_i of types) {
            if (classList.contains(`menuitem-${type_i}`)) {
                return type_i;
            }
        }
        return null;
    }

    setType(item: HTMLElement, type: MenuItemType): void {
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
        const labelPart = this.#label(item);
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

    getValue(item: HTMLElement): string {
        return item.getAttribute("value") ?? "";
    }

    setValue(item: HTMLElement, value: string): void {
        item.setAttribute("value", value);
    }
    
    getName(item: HTMLElement): string {
        return item.getAttribute("name") ?? "";
    }

    setName(item: HTMLElement, value: string): void {
        item.setAttribute("name", value);
    }

    getChecked(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("aria-checked") ?? String(false));
    }

    setChecked(item: HTMLElement, value: boolean): void {
        item.setAttribute("aria-checked", String(value));
    }

    getDisabled(item: HTMLElement): boolean {
        return item.hasAttribute("aria-disabled");
    }

    setDisabled(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-disabled", value);
    }

    setExpanded(item: HTMLElement, value: boolean): void {
        item.setAttribute("aria-expanded", String(value));
    }

    getExpanded(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("aria-expanded") ?? String(false));
    }

    toggle(item: HTMLElement, force?: boolean): void {
        const expand = force ?? !this.getExpanded(item);
        this.setExpanded(item, expand);
        if (expand) {
            this.#positionMenu(item);
        }
    }

    expand(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (!expanded) {
            this.setExpanded(item, true);
            this.#positionMenu(item);
        }
    }

    collapse(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (expanded) {
            this.setExpanded(item, false);
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".menuitem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            switch (type) {
                case "checkbox": {
                    this.setChecked(targetItem, !this.getChecked(targetItem));
                    break;
                }
                case "radio": {
                    this.setChecked(targetItem, true);
                    break;
                }
                case "menu":
                case "submenu": {
                    this.toggle(targetItem);
                    if (this.getExpanded(targetItem)) {
                        this.getMenu(targetItem)?.focus({preventScroll: true});
                    }
                    break;
                }
            }
        }
    }

    #positionMenu(item: HTMLElement): void {
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