import { ModelObject, ModelProperty } from "../../..";
import { element } from "../../elements/Element";
import { MenuWidget } from "./MenuWidget";

export class MenuItemModel extends ModelObject {
    @ModelProperty()
    label: string;
    
    @ModelProperty()
    type: "button" | "menu" | "submenu";

    constructor(init: {label: string, type: "button" | "submenu"}) {
        super();
        const {label, type} = init;
        this.label = label;
        this.type = type;
    }
}

export { MenuItemWidget };

interface MenuItemWidgetConstructor {
    readonly prototype: MenuItemWidget;
    new(model: MenuItemModel): MenuItemWidget;
}

interface MenuItemWidget {
    readonly itemElement: HTMLButtonElement;
    readonly menu: MenuWidget | null;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

class MenuItemWidgetBase implements MenuItemWidget {

    readonly shadowRoot!: ShadowRoot;
    readonly model: MenuItemModel;
    readonly itemElement: HTMLButtonElement;

    constructor(model: MenuItemModel) {
        this.model = model;
        this.itemElement = this.render();
    }

    render() {
        const {model} = this;
        return element("button", {
            properties: {
                className: "menuwidget",
                textContent: model.label
            },
            attributes: {
                role: "menuitem"
            }
        });
    }

    get menu(): MenuWidget | null {
        const menuElement = this.itemElement.querySelector<HTMLElement>("[role='menu']");
        return menuElement ? MenuWidget.map.get(menuElement) ?? null : null;
    }

    toggle(force?: boolean): void {
        const {itemElement, model} = this;
        const {type} = model;
        switch (type) {
            case "menu":
            case "submenu": {
                const expand = force ?? !itemElement.ariaExpanded;
                itemElement.ariaExpanded = expand.toString();
                if (expand) {
                    this.#positionMenu();
                }
                itemElement.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
        }
    }

    expand(): void {
        const {itemElement, model} = this;
        const {type} = model;
        switch (type) {
            case "menu":
            case "submenu": {
                const expanded = !!itemElement.ariaExpanded;
                if (!expanded) {
                    itemElement.ariaExpanded = "true";
                    this.#positionMenu();
                }
                break;
            }
        }
    }

    collapse(): void {
        const {itemElement, model} = this;
        const {type} = model;
        switch (type) {
            case "menu":
            case "submenu": {
                const expanded = !!itemElement.ariaExpanded;
                if (expanded) {
                    itemElement.ariaExpanded = "false";
                }
                break;
            }
        }
    }

    #positionMenu(): void {
        const {itemElement, menu} = this;
        if (menu !== null) {
            const {menuElement} = menu;
            const {style: menuStyle} = menuElement;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = itemElement.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menuElement.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
            const {model} = this;
            const {type} = model;
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
                const closestMenu = itemElement.closest("[role=menu]");
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