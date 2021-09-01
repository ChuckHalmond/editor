import { isParentNode, isReactiveParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";
export { ViewBase };
class ViewBase {
    constructor(model) {
        this._model = model;
        this._element = this.render();
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
        this._observer.observe(this._element, {
            subtree: true,
            childList: true
        });
        this._addReactiveListeners(this._element);
    }
    get element() {
        return this._element;
    }
    close() {
        this._element.remove();
        this._observer.disconnect();
        this._removeReactiveListeners(this._element);
    }
    get model() {
        return this._model;
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