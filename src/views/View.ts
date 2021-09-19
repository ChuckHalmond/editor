import { isParentNode, isReactiveParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { View };
export { ViewBase };
export { ReactiveViewBase };

interface View<M extends object = object, E extends Element = Element> {
    readonly root: E;
    readonly model: M;
    render(): E;
}

abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root: E;
    private _model: M;

    constructor(model: M) {
        this._model = model;
        this._root = this.render();
    }

    public get root(): E {
        return this._root;
    }

    public get model(): M {
        return this._model;
    }

    public abstract render(): E;
}

abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements View<M, E> {
    private _observer: MutationObserver;

    constructor(model: M) {
        super(model);
        this._observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((record: MutationRecord) => {
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

    private addReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.addEventListener(_reactEvent as any, _reactListener as any);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.addReactiveListeners(childNode);
            });
        }
    }

    private removeReactiveListeners(node: Node): void {
        if (isReactiveParentNode(node) || isReactiveNode(node)) {
            const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes; 
            _reactModel.removeEventListener(_reactEvent as any, _reactListener as any);
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.removeReactiveListeners(childNode);
            });
        }
    }
}