import { HTMLEToolBarElement } from "./ToolBar";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
export { HTMLEToolBarItemRadioList };
export { HTMLEToolBarItemCollection };
interface HTMLEToolBarItemCollectionConstructor {
    readonly prototype: HTMLEToolBarItemCollection;
    new (root: HTMLEToolBarElement): HTMLEToolBarItemCollection;
}
interface HTMLEToolBarItemCollection {
    length: number;
    item(index: number): HTMLEToolBarItemElement | null;
    namedItem(name: string): HTMLEToolBarItemElement | HTMLEToolBarItemRadioList | null;
    values(): IterableIterator<HTMLEToolBarItemElement>;
}
interface HTMLEToolBarItemRadioListConstructor {
    readonly prototype: HTMLEToolBarItemRadioList;
    new (root: HTMLEToolBarElement, name: string): HTMLEToolBarItemRadioList;
}
interface HTMLEToolBarItemRadioList {
    value: string;
    values(): IterableIterator<HTMLEToolBarItemElement>;
}
declare var HTMLEToolBarItemCollection: HTMLEToolBarItemCollectionConstructor;
declare var HTMLEToolBarItemRadioList: HTMLEToolBarItemRadioListConstructor;
