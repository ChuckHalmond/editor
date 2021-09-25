import { isParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { ViewBase };
export { ReactiveViewBase };
class ViewBase {
    constructor(model) {
        this.model = model;
        this.root = this.render();
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
    disconnect() {
        this.observer.disconnect();
        this.removeReactiveListeners(this.root);
    }
    addReactiveListeners(node) {
        if (isReactiveNode(node)) {
            node._reactAttributes.addReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.addReactiveListeners(childNode);
            });
        }
    }
    removeReactiveListeners(node) {
        if (isReactiveNode(node)) {
            node._reactAttributes.removeReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.removeReactiveListeners(childNode);
            });
        }
    }
}
//# sourceMappingURL=View.js.map