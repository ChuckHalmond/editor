import { MenuItemWidget } from "./MenuItemWidget";
import { Widget } from "./Widget";
export { MenuWidget };
interface MenuWidgetConstructor {
    readonly prototype: MenuWidget;
    new (items: MenuItemWidget[]): MenuWidget;
}
interface MenuWidget extends Widget {
    readonly items: MenuItemWidget[];
    readonly activeItem: MenuItemWidget | null;
    readonly activeIndex: number;
    insertItem(index: number, ...items: MenuItemWidget[]): void;
}
declare global {
    interface WidgetNameMap {
        "menu": MenuWidget;
    }
}
declare var MenuWidget: MenuWidgetConstructor;
