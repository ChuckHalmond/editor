import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { ReactiveNodesObserver };
class ReactiveNodesObserverBase {
    constructor() {
        this._observer = new MutationObserver(this.callback.bind(this));
    }
    callback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
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
            mutation.removedNodes.forEach((node) => {
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
    observe(target) {
        this._observer.observe(target, {
            childList: true,
            subtree: true
        });
    }
    disconnect() {
        this._observer.disconnect();
    }
}
var ReactiveNodesObserver = ReactiveNodesObserverBase;
//# sourceMappingURL=ReactiveNodesObserver.js.map