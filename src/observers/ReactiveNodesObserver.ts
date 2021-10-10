import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

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
                if (isReactiveNode(node)) {
                    node._reactiveNodeAttributes.addReactListener();
                }
                if (isReactiveParentNode(node)) {
                    node._reactiveParentNodeAttributes.addReactListener();
                }
                if (isParentNode(node)) {
                    forAllSubtreeNodes(node, (childNode) => {
                        if (isReactiveNode(childNode)) {
                            childNode._reactiveNodeAttributes.addReactListener();
                        }
                        if (isReactiveParentNode(childNode)) {
                            childNode._reactiveParentNodeAttributes.addReactListener();
                        }
                    });
                }
            });
            mutation.removedNodes.forEach((node: Node) => {
                if (isReactiveNode(node)) {
                    node._reactiveNodeAttributes.addReactListener();
                }
                if (isReactiveParentNode(node)) {
                    node._reactiveParentNodeAttributes.addReactListener();
                }
                if (isParentNode(node)) {
                    forAllSubtreeNodes(node, (childNode) => {
                        if (isReactiveNode(childNode)) {
                            childNode._reactiveNodeAttributes.addReactListener();
                        }
                        if (isReactiveParentNode(childNode)) {
                            childNode._reactiveParentNodeAttributes.addReactListener();
                        }
                    });
                }
            });
        });
    }

    public observe(target: Node): void  {
        this._observer.observe(target, {
            childList: true,
            subtree: true
        });
    }

    public disconnect(): void {
        this._observer.disconnect();
    }
}

var ReactiveNodesObserver: ReactiveNodesObserverConstructor = ReactiveNodesObserverBase;