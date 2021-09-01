define(["require", "exports", "../HTMLElement", "../Snippets"], function (require, exports, HTMLElement_1, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewBase = void 0;
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
            if ((0, HTMLElement_1.isReactiveParentNode)(node) || (0, HTMLElement_1.isReactiveNode)(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
                _reactModel.addEventListener(_reactEvent, _reactListener);
            }
            if ((0, HTMLElement_1.isParentNode)(node)) {
                (0, Snippets_1.forAllSubtreeNodes)(node, (childNode) => {
                    this._addReactiveListeners(childNode);
                });
            }
        }
        _removeReactiveListeners(node) {
            if ((0, HTMLElement_1.isReactiveParentNode)(node) || (0, HTMLElement_1.isReactiveNode)(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
                _reactModel.removeEventListener(_reactEvent, _reactListener);
            }
            if ((0, HTMLElement_1.isParentNode)(node)) {
                (0, Snippets_1.forAllSubtreeNodes)(node, (childNode) => {
                    this._removeReactiveListeners(childNode);
                });
            }
        }
    }
    exports.ViewBase = ViewBase;
});
//# sourceMappingURL=View.js.map