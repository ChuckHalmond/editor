import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { MenuModel };
export { MenuItemModel };
export { MenuView };
declare class MenuModel extends ModelObject {
    readonly items: ModelList<MenuItemModel>;
    name?: string;
    constructor();
    constructor(init: {
        name?: string;
        items?: MenuItemModel[];
    });
}
declare class MenuItemModel extends ModelObject {
    name: string;
    label: string;
    type: "button" | "radio" | "checkbox" | "menu" | "submenu";
    menu?: MenuModel;
    constructor(init: {
        name: string;
        label: string;
        type: "button" | "radio" | "checkbox" | "menu" | "submenu";
        menu?: MenuModel;
    });
}
interface MenuViewConstructor {
    readonly prototype: MenuView;
    new (): MenuView;
    new (model: MenuModel): MenuView;
}
interface MenuView extends View {
    readonly model: MenuModel;
}
declare global {
    interface HTMLElementTagNameMap {
        "v-menu": MenuView;
    }
}
declare var MenuView: MenuViewConstructor;
