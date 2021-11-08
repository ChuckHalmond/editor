import { isReactiveNode, isReactiveParentNode } from "../elements/Element";

export { ReactiveNodesObserver };

interface ReactiveNodesObserverConstructor {
    readonly prototype: ReactiveNodesObserver;
    new(): ReactiveNodesObserver;
}

interface ReactiveNodesObserver {
    observe(target: Node): void;
    disconnect(): void;
}

class ReactiveNodesObserverBase implements ReactiveNodesObserver {
    private _observer: MutationObserver;

    constructor() {
        this._observer = new MutationObserver(
            this.callback.bind(this)
        );
    }

    public callback(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                this.addReactListenersInSubtree(node);
            });
            mutation.removedNodes.forEach((node: Node) => {
                this.removeReactListenersInSubtree(node);
            });
        });
    }

    public observe(target: Node): void  {
        this._observer.observe(target, {
            childList: true,
            subtree: true
        });
        
        this.addReactListenersInSubtree(target);
    }

    public disconnect(): void {
        this._observer.disconnect();
    }

    private addReactListenersInSubtree(node: Node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        let childIndex = 0;
        while (childIndex < node.childNodes.length) {
            const child = node.childNodes.item(childIndex);
            if (child !== null) {
                this.addReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }

    private removeReactListenersInSubtree(node: Node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.removeReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.removeReactListener();
        }
        let childIndex = 0;
        while (childIndex < node.childNodes.length) {
            const child = node.childNodes.item(childIndex);
            if (child !== null) {
                this.removeReactListenersInSubtree(child);
            }
            childIndex++;
        }
    }
}

var ReactiveNodesObserver: ReactiveNodesObserverConstructor = ReactiveNodesObserverBase;