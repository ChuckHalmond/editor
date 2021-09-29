import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { isViewRoot };
export { ViewBase };
export { ReactiveViewBase };
function isViewRoot(elem) {
    return typeof elem._view !== "undefined";
}
class ViewBase {
    constructor(model) {
        this.model = model;
        this._root = this.render();
    }
    get root() {
        return this._root;
    }
    set root(root) {
        this._root = root;
        Object.assign(this._root, {
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
                    this.removeReactiveListeners(node);
                });
                Array.from(record.addedNodes).map((node) => {
                    this.addReactiveListeners(node);
                });
            });
        });
        this.observer.observe(this.root, {
            subtree: true,
            childList: true
        });
        this.addReactiveListeners(this.root);
    }
    set root(root) {
        if (this.root) {
            this.removeReactiveListeners(this.root);
        }
        super.root = root;
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
                this.addReactiveListeners(childNode);
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
                this.removeReactiveListeners(childNode);
            });
        }
    }
}
//# sourceMappingURL=View.js.map