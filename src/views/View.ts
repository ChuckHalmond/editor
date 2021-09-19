import { isParentNode, isReactiveParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { View };
export { ViewBase };
export { ReactiveViewBase };

interface View<M extends object, E extends HTMLElement> {
    readonly element: E;
    readonly model: M;
    close(): void;
    prerender(): void;
    render(): E;
}

abstract class ViewBase<M extends object, E extends HTMLElement> implements View<M, E> {
    private _element: E;
    private _model: M;

    constructor(model: M) {
        this._model = model;
        this.prerender();
        this._element = this.render();
    }

    public get element(): E {
        return this._element;
    }

    public close(): void {
        this._element.remove();
    }

    public get model(): M {
        return this._model;
    }

    public prerender(): void {};
    public abstract render(): E;
}

abstract class ReactiveViewBase<M extends object, E extends HTMLElement> extends ViewBase<M, E> implements View<M, E> {
    private _observer: MutationObserver;

    constructor(model: M) {
        super(model);
        this._observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((record: MutationRecord) => {
                Array.from(record.removedNodes).map((node) => {
                    this._removeReactiveListeners(node);
                });
                Array.from(record.addedNodes).map((node) => {
                    this._addReactiveListeners(node);
                });
            });
        });
        this._observer.observe(this.element, {
            subtree: true,
            childList: true
        });
        this._addReactiveListeners(this.element);
    }

    public close(): void {
        super.close();
        this._observer.disconnect();
        this._removeReactiveListeners(this.element);
    }

    private _addReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.addEventListener(_reactEvent as any, _reactListener as any);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this._addReactiveListeners(childNode);
            });
        }
    }

    private _removeReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.removeEventListener(_reactEvent as any, _reactListener as any);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this._removeReactiveListeners(childNode);
            });
        }
    }
}