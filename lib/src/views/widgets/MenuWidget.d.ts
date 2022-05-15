import { ModelList, ModelObject } from "../../models/Model";
import { MenuItemModel } from "./MenuItemWidget";
export declare class MenuModel extends ModelObject {
    readonly childItems: ModelList<MenuItemModel>;
    constructor();
    constructor(init: {
        items: MenuItemModel[];
    });
}
export declare class MenuWidget {
    #private;
    readonly menuElement: HTMLElement;
    readonly model: MenuModel;
    readonly items: MenuItemCollection;
    get activeItem(): HTMLElement | null;
    get activeIndex(): number;
    static readonly map: WeakMap<HTMLElement, MenuWidget>;
    constructor(model: MenuModel);
    getWidget(menuElement: HTMLElement): MenuWidget | null;
    render(): HTMLUListElement;
}
export { MenuItemRadioList };
export { MenuItemCollection };
interface MenuItemCollectionConstructor {
    readonly prototype: MenuItemCollection;
    new (root: HTMLElement): MenuItemCollection;
}
interface MenuItemCollection {
    length: number;
    item(index: number): HTMLElement | null;
    namedItem(name: string): HTMLElement | MenuItemRadioList | null;
    values(): IterableIterator<HTMLElement>;
}
interface MenuItemRadioListConstructor {
    readonly prototype: MenuItemRadioList;
    new (root: HTMLElement, name: string): MenuItemRadioList;
}
interface MenuItemRadioList {
    value: string;
    values(): IterableIterator<HTMLElement>;
}
declare var MenuItemCollection: MenuItemCollectionConstructor;
declare var MenuItemRadioList: MenuItemRadioListConstructor;
