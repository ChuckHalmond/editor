import { CustomWidget, element } from "../../elements/Element";
import { MenuWidget } from "./MenuWidget";
import { Widget } from "./Widget";

type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";

export { MenuItemWidget };

interface MenuItemWidgetConstructor {
    readonly prototype: MenuItemWidget;
    new(init: {
        type: MenuItemType;
        label: string;
        menu?: MenuWidget;
    }): MenuItemWidget;
}

interface MenuItemWidget extends Widget {
    type: MenuItemType;
    label: string;
    active: boolean;
    hasPopup: boolean;
    expanded: boolean;
    menu: MenuWidget | null;
    checked: boolean;
    trigger(): void;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

declare global {
    interface WidgetNameMap {
        "menuitem": MenuItemWidget;
    }
}

@CustomWidget({
    name: "menuitem"
})
class MenuItemWidgetBase extends Widget implements MenuItemWidget {

    #menu: MenuWidget | null = null;

    render() {
        return element("button", {
            properties: {
                className: "menuitem"
            },
            attributes: {
                role: "menuitem"
            },
            children: [
                element("span", {
                    properties: {
                        className: "content"
                    },
                    children: [
                        element("span", {
                            properties: {
                                className: "icon"
                            }
                        }),
                        element("span", {
                            properties: {
                                className: "label"
                            }
                        }),
                        element("span", {
                            properties: {
                                className: "arrow"
                            }
                        })
                    ]
                })
            ]
        });
    }

    get #labelElement() {
        return this.element.querySelector(":scope > .content > .label")!;
    }

    get checked(): boolean {
        return this.element.hasAttribute("aria-checked");
    }

    set checked(value: boolean) {
        this.element.toggleAttribute("aria-checked", value);
    }

    get label(): string {
        return this.#labelElement.textContent ?? "";
    }

    set label(value: string) {
        this.#labelElement.textContent = value;
    }

    get type(): MenuItemType {
        return <MenuItemType>this.element.dataset.type ?? "button";
    }

    set type(value: MenuItemType) {
        this.element.dataset.type = value;
    }

    get menu(): MenuWidget | null {
        return this.#menu;
    }

    set menu(value: MenuWidget | null) {
        const menu = this.#menu;
        if (menu !== null && value !== null) {
            menu.element.replaceWith(value.element);
            this.hasPopup = true;
        }
        else {
            if (menu !== null) {
                menu.element.remove();
                this.hasPopup = false;
            }
            if (value !== null) {
                this.element.append(value.element);
                this.hasPopup = true;
            }
        }
        this.#menu = value;
    }

    get active(): boolean {
        return this.element.hasAttribute("aria-active");
    }

    set active(value: boolean) {
        this.element.toggleAttribute("aria-active", value);
    }

    get hasPopup(): boolean {
        return this.element.hasAttribute("aria-haspopup");
    }

    set hasPopup(value: boolean) {
        this.element.setAttribute("aria-haspopup", value.toString());
    }

    get expanded(): boolean {
        return this.element.hasAttribute("aria-expanded");
    }

    set expanded(value: boolean) {
        this.element.toggleAttribute("aria-expanded", value);
    }

    trigger(): void {
        const {type, element} = this;
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
        element.dispatchEvent(new Event("trigger", {
            bubbles: true
        }));
    }

    toggle(force?: boolean): void {
        const {element, type} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const expand = force ?? !this.expanded;
                this.expanded = expand;
                if (expand) {
                    this.#positionMenu();
                }
                element.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
        }
    }

    expand(): void {
        const {type} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const {expanded} = this;
                if (!expanded) {
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
                const {expanded} = this;
                if (expanded) {
                    this.expanded = false;
                }
                break;
            }
        }
    }

    #positionMenu(): void {
        const {element, menu} = this;
        if (menu !== null) {
            const {element: menuElement} = menu;
            const {style: menuStyle} = menuElement;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = element.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menuElement.getBoundingClientRect();
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
                const closestMenu = element.closest(".menu");
                if (closestMenu !== null) {
                    const {top: closestMenuTop, left: closestMenuLeft} = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${
                        overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft
                    }px`);
                    const menuComputedStyle = window.getComputedStyle(menuElement);
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
}

var MenuItemWidget: MenuItemWidgetConstructor = MenuItemWidgetBase;