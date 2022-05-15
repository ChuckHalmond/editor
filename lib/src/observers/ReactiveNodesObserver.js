import { isReactiveNode, isReactiveParentNode } from "../elements/Element";
export { ReactiveNodesObserver };
class ReactiveNodesObserverBase {
    #observer;
    constructor() {
        this.#observer = new MutationObserver(this.#callback.bind(this));
    }
    trigger() {
        this.#callback(this.#observer.takeRecords());
    }
    observe(target) {
        this.#observer.observe(target, {
            childList: true,
            subtree: true
        });
        this.#addReactListenersInSubtree(target);
    }
    disconnect() {
        this.#observer.disconnect();
    }
    #callback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                this.#addReactListenersInSubtree(node);
            });
            mutation.removedNodes.forEach((node) => {
                this.#removeReactListenersInSubtree(node);
            });
        });
    }
    #addReactListenersInSubtree(node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        let childIndex = 0;
        const { childNodes } = node;
        while (childIndex < childNodes.length) {
            const child = childNodes.item(childIndex);
            if (child !== null) {
                this.#addReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }
    #removeReactListenersInSubtree(node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.removeReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.removeReactListener();
        }
        let childIndex = 0;
        const { childNodes } = node;
        while (childIndex < childNodes.length) {
            const child = childNodes.item(childIndex);
            if (child !== null) {
                this.#removeReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }
}
var ReactiveNodesObserver = ReactiveNodesObserverBase;
//# sourceMappingURL=ReactiveNodesObserver.js.map