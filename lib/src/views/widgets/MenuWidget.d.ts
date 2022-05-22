import { MenuItemWidget } from "./MenuItemWidget";
import { Widget } from "./Widget";
export { MenuWidget };
export { menuWidgets };
interface MenuWidgetConstructor {
    readonly prototype: MenuWidget;
    new (items: MenuItemWidget[]): MenuWidget;
}
interface MenuWidget extends Widget {
    readonly items: MenuItemWidget[];
    readonly activeItem: MenuItemWidget | null;
    insertItems(index: number, ...items: MenuItemWidget[]): void;
}
declare global {
    interface WidgetNameMap {
        "menu": MenuWidget;
    }
    interface WidgetWritablePropertiesMap {
        "menu": Pick<MenuWidget, never>;
    }
}
declare var menuWidgets: WeakMap<Element, MenuWidget>;
declare var MenuWidget: MenuWidgetConstructor;
