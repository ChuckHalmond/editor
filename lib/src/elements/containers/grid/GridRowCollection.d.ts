import { HTMLEGridRowElement } from "./GridRow";
export { HTMLEGridRowCollection };
interface HTMLEGridRowCollectionConstructor {
    readonly prototype: HTMLEGridRowCollection;
    new (root: HTMLElement): HTMLEGridRowCollection;
}
interface HTMLEGridRowCollection {
    length: number;
    item(index: number): HTMLEGridRowElement | null;
    namedItem(name: string): HTMLEGridRowElement | null;
    values(): IterableIterator<HTMLEGridRowElement>;
}
declare var HTMLEGridRowCollection: HTMLEGridRowCollectionConstructor;
