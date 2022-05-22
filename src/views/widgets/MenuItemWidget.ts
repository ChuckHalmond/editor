import { CustomWidget, element } from "../../elements/Element";
import { MenuWidget, menuWidgets } from "./MenuWidget";
import { Widget } from "./Widget";

type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";

export { MenuItemWidget };
export { menuItemWidgets };

interface MenuItemWidgetConstructor {
    readonly prototype: MenuItemWidget;
    new(init: {
        type: MenuItemType;
        label: string;
        menu?: MenuWidget;
    }): MenuItemWidget;
}

interface MenuItemWidget extends Widget {
    readonly menu: MenuWidget | null;
    type: MenuItemType;
    label: string;
    active: boolean;
    hasPopup: boolean;
    expanded: boolean;
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
    
    interface WidgetWritablePropertiesMap {
        "menuitem": Pick<MenuItemWidget, "type" | "label" | "hasPopup">;
    }
}

var widgetTemplate: HTMLTemplateElement;
var menuItemWidgets: WeakMap<Element, MenuItemWidget>;

@CustomWidget({
    name: "menuitem"
})
class MenuItemWidgetBase extends Widget implements MenuItemWidget {

    static {
        widgetTemplate = element("template", {
            content: [
                element("button", {
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
                })
            ]
        });
        menuItemWidgets = new WeakMap();
    }

    constructor() {
        super(<HTMLElement>widgetTemplate.content.cloneNode(true).firstChild);
        menuItemWidgets.set(this.element, this);
    }

    get #labelElement() {
        return this.element.querySelector(":scope > .content > .label")!;
    }

    get #menuElement() {
        return this.element.querySelector(":scope > .menu")!;
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

    get menu(): MenuWidget | null {
        return menuWidgets.get(this.#menuElement) ?? null;
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