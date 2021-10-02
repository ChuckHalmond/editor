import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { isViewRoot };
export { ViewBase };
export { ReactiveViewBase };
function isViewRoot(root) {
    return typeof root._view !== "undefined";
}
class ViewBase {
    constructor(model) {
        this.model = model;
        this.root = Object.assign(this.render(), {
            _view: this
        });
    }
}
class ReactiveViewBase extends ViewBase {
    constructor(model) {
        super(model);
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((record) => {
                Array.from(record.removedNodes).map((node) => {
                    if (!isViewRoot(node)) {
                        this.removeReactiveListeners(node);
                    }
                });
                Array.from(record.addedNodes).map((node) => {
                    if (!isViewRoot(node)) {
                        this.addReactiveListeners(node);
                    }
                });
            });
        });
        this.observer.observe(this.root, {
            subtree: true,
            childList: true
        });
        this.addReactiveListeners(this.root);
    }
    disconnect() {
        this.observer.disconnect();
        this.removeReactiveListeners(this.root);
    }
    addReactiveListeners(node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                if (!isViewRoot(childNode)) {
                    this.addReactiveListeners(childNode);
                }
            });
        }
    }
    removeReactiveListeners(node) {
        if (isReactiveNode(node)) {
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                if (!isViewRoot(childNode)) {
                    this.removeReactiveListeners(childNode);
                }
            });
        }
    }
}
//# sourceMappingURL=View.js.map