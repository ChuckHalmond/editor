import { MenuWidget } from "./MenuWidget";
import { Widget } from "./Widget";
declare type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";
export { MenuItemWidget };
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
declare var MenuItemWidget: MenuItemWidgetConstructor;
