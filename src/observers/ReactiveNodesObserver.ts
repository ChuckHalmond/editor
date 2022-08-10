/*import { isReactiveNode, isReactiveParentNode } from "../elements/Element";

export { ReactiveNodesObserver };

interface ReactiveNodesObserverConstructor {
    prototype: ReactiveNodesObserver;
    new(): ReactiveNodesObserver;
}

interface ReactiveNodesObserver {
    trigger(): void;
    observe(target: Node): void;
    disconnect(): void;
}

class ReactiveNodesObserverBase implements ReactiveNodesObserver {
    #observer: MutationObserver;
    
    constructor() {
        this.#observer = new MutationObserver(
            this.#callback.bind(this)
        );
    }

    trigger(): void {
        this.#callback(this.#observer.takeRecords());
    }

    observe(target: Node): void  {
        this.#observer.observe(target, {
            childList: true,
            subtree: true
        });
        this.#addReactListenersInSubtree(target);
    }

    disconnect(): void {
        this.#observer.disconnect();
    }

    #callback(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                this.#addReactListenersInSubtree(node);
            });
            mutation.removedNodes.forEach((node: Node) => {
                this.#removeReactListenersInSubtree(node);
            });
        });
    }

    #addReactListenersInSubtree(node: Node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        let childIndex = 0;
        const {childNodes} = node;
        while (childIndex < childNodes.length) {
            const child = childNodes.item(childIndex);
            if (child !== null) {
                this.#addReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }

    #removeReactListenersInSubtree(node: Node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.removeReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.removeReactListener();
        }
        let childIndex = 0;
        const {childNodes} = node;
        while (childIndex < childNodes.length) {
            const child = childNodes.item(childIndex);
            if (child !== null) {
                this.#removeReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }
}

var ReactiveNodesObserver: ReactiveNodesObserverConstructor = ReactiveNodesObserverBase;*/