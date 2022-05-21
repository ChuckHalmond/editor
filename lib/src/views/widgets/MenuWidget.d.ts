import { MenuItemWidget } from "./MenuItemWidget";
import { Widget } from "./Widget";
export { MenuWidget };
interface MenuWidgetConstructor {
    readonly prototype: MenuWidget;
    new (items: MenuItemWidget[]): MenuWidget;
}
interface MenuWidget extends Widget {
    readonly activeItem: MenuItemWidget | null;
    insertItem(index: number, ...items: MenuItemWidget[]): void;
}
declare global {
    interface WidgetNameMap {
        "menu": MenuWidget;
    }
}
declare var MenuWidget: MenuWidgetConstructor;
