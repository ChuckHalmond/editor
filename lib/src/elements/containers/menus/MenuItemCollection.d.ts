import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuItemRadioList };
export { HTMLEMenuItemCollection };
interface HTMLEMenuItemCollectionConstructor {
    readonly prototype: HTMLEMenuItemCollection;
    new (root: HTMLEMenuElement | HTMLEMenuBarElement): HTMLEMenuItemCollection;
}
interface HTMLEMenuItemCollection {
    length: number;
    item(index: number): HTMLEMenuItemElement | null;
    namedItem(name: string): HTMLEMenuItemElement | HTMLEMenuItemRadioList | null;
    values(): IterableIterator<HTMLEMenuItemElement>;
}
interface HTMLEMenuItemRadioListConstructor {
    readonly prototype: HTMLEMenuItemRadioList;
    new (root: HTMLEMenuElement | HTMLEMenuBarElement, name: string): HTMLEMenuItemRadioList;
}
interface HTMLEMenuItemRadioList {
    value: string;
    values(): IterableIterator<HTMLEMenuItemElement>;
}
declare var HTMLEMenuItemCollection: HTMLEMenuItemCollectionConstructor;
declare var HTMLEMenuItemRadioList: HTMLEMenuItemRadioListConstructor;
