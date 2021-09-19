import { isParentNode, isReactiveParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { View };
export { ViewBase };
export { ReactiveViewBase };

interface View<M extends object, E extends HTMLElement> {
    readonly root: E;
    readonly model: M;
    close(): void;
    render(): E;
}

abstract class ViewBase<M extends object, E extends HTMLElement> implements View<M, E> {
    private _root: E;
    private _model: M;

    constructor(model: M) {
        this._model = model;
        this._root = this.render();
    }

    public get root(): E {
        return this._root;
    }

    public close(): void {
        this._root.remove();
    }

    public get model(): M {
        return this._model;
    }

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
        this._observer.observe(this.root, {
            subtree: true,
            childList: true
        });
        this._addReactiveListeners(this.root);
    }

    public close(): void {
        super.close();
        this._observer.disconnect();
        this._removeReactiveListeners(this.root);
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