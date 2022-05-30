export { NodeCollection };
interface NodeCollectionConstructor {
    readonly prototype: NodeCollection;
    new (root: Node, filter: NodeFilter): NodeCollection<Node>;
    new <N extends Node>(root: Node, filter: NodeFilter): NodeCollection<N>;
}
interface NodeCollection<N extends Node = Node> {
    readonly root: Node;
    readonly filter: NodeFilter;
    readonly length: number;
    item(index: number): N | undefined;
    values(): IterableIterator<N>;
}
declare var NodeCollection: NodeCollectionConstructor;
