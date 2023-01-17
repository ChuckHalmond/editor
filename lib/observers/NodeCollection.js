export { NodeCollection };
class NodeCollectionBase {
    #root;
    #filter;
    #observer;
    #observerTargets;
    #items;
    constructor(root, filter) {
        this.#root = root;
        this.#filter = filter;
        this.#items = [];
        this.#observer = new MutationObserver(this.#handleMutationRecords.bind(this));
        this.#observerTargets = [root];
        this.#observer.observe(root, {
            childList: true
        });
        this.#handleAddedNodes(root.childNodes);
    }
    get root() {
        return this.#root;
    }
    get filter() {
        return this.#filter;
    }
    get length() {
        return this.#update(), this.#items.length;
    }
    item(index) {
        return this.#update(), this.#items[index];
    }
    values() {
        return this.#update(), this.#items.values();
    }
    #update() {
        const records = this.#observer.takeRecords();
        if (records.length > 0) {
            this.#handleMutationRecords(records);
        }
    }
    #addObserverTargets(targets) {
        const observer = this.#observer;
        observer.disconnect();
        this.#observerTargets.push(...targets);
        this.#observerTargets.forEach((group_i) => {
            observer.observe(group_i, {
                childList: true
            });
        });
    }
    #removeObserverTargets(targets) {
        const observer = this.#observer;
        observer.disconnect();
        this.#observerTargets = this.#observerTargets.filter(target_i => !targets.includes(target_i));
        this.#observerTargets.forEach((group_i) => {
            observer.observe(group_i, {
                childList: true
            });
        });
    }
    #handleAddedNodes(nodes) {
        if (nodes.length > 0) {
            const filter = this.#filter;
            const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
            const addedItems = [];
            const addedObserverTargets = [];
            nodes.forEach((node) => {
                const acceptNodeResult = acceptNode(node);
                switch (acceptNodeResult) {
                    case NodeFilter.FILTER_ACCEPT: {
                        addedItems.push(node);
                        break;
                    }
                    case NodeFilter.FILTER_SKIP: {
                        addedObserverTargets.push(node);
                        break;
                    }
                }
            });
            if (addedObserverTargets.length > 0) {
                this.#addObserverTargets(addedObserverTargets);
                addedObserverTargets.forEach((target_i) => {
                    this.#handleAddedNodes(target_i.childNodes);
                });
            }
            if (addedItems.length > 0) {
                addedItems.forEach((item_i) => {
                    const index = this.#items.findIndex(item_i => item_i.compareDocumentPosition(item_i) & Node.DOCUMENT_POSITION_FOLLOWING);
                    this.#items.splice(index > -1 ? index : 0, 0, item_i);
                });
            }
        }
    }
    #handleRemovedNodes(nodes) {
        if (nodes.length > 0) {
            const filter = this.#filter;
            const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
            const removedItems = [];
            const removedObserverTargets = [];
            nodes.forEach((node) => {
                const acceptNodeResult = acceptNode(node);
                switch (acceptNodeResult) {
                    case NodeFilter.FILTER_ACCEPT: {
                        removedItems.push(node);
                        break;
                    }
                    case NodeFilter.FILTER_SKIP: {
                        removedObserverTargets.push(node);
                        break;
                    }
                }
            });
            if (removedObserverTargets.length > 0) {
                this.#removeObserverTargets(removedObserverTargets);
                removedObserverTargets.forEach((target_i) => {
                    this.#handleRemovedNodes(target_i.childNodes);
                });
            }
            if (removedItems.length > 0) {
                this.#items = this.#items.filter(item_i => !removedItems.includes(item_i));
            }
        }
    }
    #handleMutationRecords(mutationsList) {
        mutationsList.forEach((mutation) => {
            const { addedNodes, removedNodes } = mutation;
            this.#handleRemovedNodes(removedNodes);
            this.#handleAddedNodes(addedNodes);
        });
    }
}
var NodeCollection = NodeCollectionBase;
//# sourceMappingURL=NodeCollection.js.map