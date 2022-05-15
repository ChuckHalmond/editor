import { HTMLETreeElement } from "./Tree";
import { HTMLETreeItemElement } from "./TreeItem";
export { HTMLETreeItemCollection };
interface HTMLETreeItemCollectionConstructor {
    readonly prototype: HTMLETreeItemCollection;
    new (root: HTMLETreeElement): HTMLETreeItemCollection;
}
interface HTMLETreeItemCollection {
    length: number;
    item(index: number): HTMLETreeItemElement | null;
    namedItem(name: string): HTMLETreeItemElement | null;
    values(): IterableIterator<HTMLETreeItemElement>;
}
declare var HTMLETreeItemCollection: HTMLETreeItemCollectionConstructor;
