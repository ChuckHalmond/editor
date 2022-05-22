import { MenuWidget } from "./MenuWidget";
import { Widget } from "./Widget";
declare type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";
export { MenuItemWidget };
export { menuItemWidgets };
interface MenuItemWidgetConstructor {
    readonly prototype: MenuItemWidget;
    new (init: {
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
declare var menuItemWidgets: WeakMap<Element, MenuItemWidget>;
declare var MenuItemWidget: MenuItemWidgetConstructor;
