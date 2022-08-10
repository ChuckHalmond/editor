import { HTMLEListElement } from "./List";
import { HTMLEListItemElement } from "./ListItem";
export { HTMLEListItemCollection };
interface HTMLEListItemCollectionConstructor {
    prototype: HTMLEListItemCollection;
    new (root: HTMLEListElement): HTMLEListItemCollection;
}
interface HTMLEListItemCollection {
    length: number;
    item(index: number): HTMLEListItemElement | null;
    namedItem(name: string): HTMLEListItemElement | null;
    values(): IterableIterator<HTMLEListItemElement>;
}
declare var HTMLEListItemCollection: HTMLEListItemCollectionConstructor;
