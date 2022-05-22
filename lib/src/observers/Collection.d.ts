export { Collection };
interface CollectionConstructor {
    readonly prototype: Collection;
    new (root: Element, filter: NodeFilter): Collection;
}
interface Collection<E extends Element = Element> {
    readonly length: number;
    item(index: number): E | null;
    values(): IterableIterator<E>;
}
declare var Collection: CollectionConstructor;
