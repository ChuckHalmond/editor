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
    type: MenuItemType;
    label: string;
    active: boolean;
    hasPopup: boolean;
    expanded: boolean;
    readonly menu: MenuWidget | null;
    setMenu(menu: MenuWidget | null): void;
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
declare var menuItemWidgets: WeakMap<Element, MenuItemWidget>;
declare var MenuItemWidget: MenuItemWidgetConstructor;
