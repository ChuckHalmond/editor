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
    close() {
        this._root.remove();
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
                    this._removeReactiveListeners(node);
                });
                Array.from(record.addedNodes).map((node) => {
                    this._addReactiveListeners(node);
                });
            });
        });
        this._observer.observe(this.root, {
            subtree: true,
            childList: true
        });
        this._addReactiveListeners(this.root);
    }
    close() {
        super.close();
        this._observer.disconnect();
        this._removeReactiveListeners(this.root);
    }
    _addReactiveListeners(node) {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
            _reactModel.addEventListener(_reactEvent, _reactListener);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this._addReactiveListeners(childNode);
            });
        }
    }
    _removeReactiveListeners(node) {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
            _reactModel.removeEventListener(_reactEvent, _reactListener);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this._removeReactiveListeners(childNode);
            });
        }
    }
}
//# sourceMappingURL=View.js.map