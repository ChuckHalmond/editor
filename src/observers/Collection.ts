export { Collection };

interface CollectionConstructor {
    readonly prototype: Collection;
    new(root: Element, filter: NodeFilter): Collection;
}

interface Collection<E extends Element = Element> {
    readonly length: number;
    item(index: number): E | null;
    values(): IterableIterator<E>;
}

class CollectionBase<E extends Element = Element> {
    #filter: NodeFilter;
    #rootObserver: MutationObserver;
    #groupObservers: WeakMap<Node, MutationObserver>;

    #items: E[];

    constructor(root: Element, filter: NodeFilter) {
        this.#filter = filter;
        this.#items = [];
        this.#rootObserver = new MutationObserver(
            this.#handleMutationRecords.bind(this)
        );
        this.#rootObserver.observe(root, {
            childList: true
        });
        this.#groupObservers = new WeakMap();
    }

    get length() {
        this.#update();
        return this.#items.length;
    }

    item(index: number): E | null {
        this.#update();
        return this.#items[index] ?? null;
    }

    values(): IterableIterator<E> {
        this.#update();
        return this.#items.values();
    }

    #update(): void {
        this.#handleMutationRecords(this.#rootObserver.takeRecords());
    }

    #handleAddedGroup(group: Node): void {
        const observer = new MutationObserver(
            this.#handleMutationRecords.bind(this)
        );
        observer.observe(group, {
            childList: true
        });
        this.#groupObservers.set(group, observer);
        this.#handleAddedNodes(group.childNodes);
    }

    #handleRemovedGroup(group: Node): void {
        const observer = this.#groupObservers.get(group);
        if (observer !== void 0) {
            observer.disconnect();
            this.#groupObservers.delete(group);
        }
        this.#handleRemovedNodes(group.childNodes);
    }

    #handleAddedNodes(nodes: NodeList): void {
        if (nodes.length > 0) {
            const filter = this.#filter;
            const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
            const addedItems = <E[]>[];
            nodes.forEach((node: Node) => {
                const acceptNodeResult = acceptNode(node);
                switch (acceptNodeResult) {
                    case NodeFilter.FILTER_ACCEPT: {
                        addedItems.push(<E>node);
                        break;
                    }
                    case NodeFilter.FILTER_SKIP: {
                        this.#handleAddedGroup(node);
                        break;
                    }
                    case NodeFilter.FILTER_REJECT: {
                        break;
                    }
                }
            });
            if (addedItems.length > 0) {
                const index = this.#items.findIndex(
                    item_i => item_i.compareDocumentPosition(addedItems[0]) & Node.DOCUMENT_POSITION_FOLLOWING
                );
                this.#items.splice(index > -1 ? index : 0, 0, ...addedItems);
            }
        }
    }

    #handleRemovedNodes(nodes: NodeList): void {
        if (nodes.length > 0) {
            const filter = this.#filter;
            const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
            const removedItems = <E[]>[];
            nodes.forEach((node: Node) => {
                const acceptNodeResult = acceptNode(node);
                switch (acceptNodeResult) {
                    case NodeFilter.FILTER_ACCEPT: {
                        removedItems.push(<E>node);
                        break;
                    }
                    case NodeFilter.FILTER_SKIP: {
                        console.log(node);
                        this.#handleRemovedGroup(node);
                        break;
                    }
                    case NodeFilter.FILTER_REJECT: {
                        break;
                    }
                }
            });
            this.#items = this.#items.filter(item_i => !removedItems.includes(item_i));
        }
    }

    #handleMutationRecords(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {addedNodes, removedNodes} = mutation;
            this.#handleRemovedNodes(removedNodes);
            this.#handleAddedNodes(addedNodes);
        });
    }
}

var Collection: CollectionConstructor = CollectionBase;