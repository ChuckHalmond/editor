import { isParentNode, isReactiveParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { ViewBase };
export { ReactiveViewBase };
class ViewBase {
    constructor(model) {
        this._model = model;
        this._root = this.render();
    }
    get root() {
        return this._root;
    }
    get model() {
        return this._model;
    }
}
class ReactiveViewBase extends ViewBase {
    constructor(model) {
        super(model);
        this._observer = new MutationObserver((mutations) => {
            mutations.forEach((record) => {
                Array.from(record.removedNodes).map((node) => {
                    this.removeReactiveListeners(node);
                });
                Array.from(record.addedNodes).map((node) => {
                    this.addReactiveListeners(node);
                });
            });
        });
        this._observer.observe(this.root, {
            subtree: true,
            childList: true
        });
        this.addReactiveListeners(this.root);
    }
    addReactiveListeners(node) {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
            _reactModel.addEventListener(_reactEvent, _reactListener);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.addReactiveListeners(childNode);
            });
        }
    }
    removeReactiveListeners(node) {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
            _reactModel.removeEventListener(_reactEvent, _reactListener);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.removeReactiveListeners(childNode);
            });
        }
    }
}
//# sourceMappingURL=View.js.map