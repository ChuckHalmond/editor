import { HTMLEGridCellElement } from "./GridCell";
export { HTMLEGridCellCollection };
interface HTMLEGridCellCollectionConstructor {
    prototype: HTMLEGridCellCollection;
    new (root: HTMLElement): HTMLEGridCellCollection;
}
interface HTMLEGridCellCollection {
    length: number;
    item(index: number): HTMLEGridCellElement | null;
    namedItem(name: string): HTMLEGridCellElement | null;
    values(): IterableIterator<HTMLEGridCellElement>;
}
declare var HTMLEGridCellCollection: HTMLEGridCellCollectionConstructor;
