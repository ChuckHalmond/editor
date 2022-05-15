import { HTMLEOptionElement } from "./Option";
import { HTMLESelectElement } from "./Select";
export { HTMLEOptionCollection };
interface HTMLEOptionCollectionConstructor {
    readonly prototype: HTMLEOptionCollection;
    new (root: HTMLESelectElement): HTMLEOptionCollection;
}
interface HTMLEOptionCollection {
    length: number;
    item(index: number): HTMLEOptionElement | null;
    namedItem(name: string): HTMLEOptionElement | null;
    values(): IterableIterator<HTMLEOptionElement>;
}
declare var HTMLEOptionCollection: HTMLEOptionCollectionConstructor;
