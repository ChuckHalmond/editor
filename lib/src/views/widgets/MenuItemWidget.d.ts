import { ModelObject } from "../../..";
import { MenuWidget } from "./MenuWidget";
export declare class MenuItemModel extends ModelObject {
    label: string;
    type: "button" | "menu" | "submenu";
    constructor(init: {
        label: string;
        type: "button" | "submenu";
    });
}
export { MenuItemWidget };
interface MenuItemWidgetConstructor {
    readonly prototype: MenuItemWidget;
    new (model: MenuItemModel): MenuItemWidget;
}
interface MenuItemWidget {
    readonly itemElement: HTMLButtonElement;
    readonly menu: MenuWidget | null;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}
declare var MenuItemWidget: MenuItemWidgetConstructor;
