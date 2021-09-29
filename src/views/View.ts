import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };

function isViewRoot<E extends Element>(elem: E): elem is ViewRoot<object, E> {
    return typeof (elem as ViewRoot)._view !== "undefined";
}

type ViewRoot<M extends object = object, E extends Element = Element> = E & {_view?: View<M, E>};

interface View<M extends object = object, E extends Element = Element> {
    root: ViewRoot<M, E>;
    readonly model: M;
    render(): ViewRoot<M, E>;
}

abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root: ViewRoot<M, E>;
    public readonly model: M;

    constructor(model: M) {
        this.model = model;
        this._root = this.render();
    }

    public get root(): ViewRoot<M, E> {
        return this._root;
    }

    public set root(root: ViewRoot<M, E>) {
        this._root = root;
        Object.assign(this._root, {
            _view: this
        });
    }
    
    public abstract render(): E;
}

interface ReactiveView<M extends object = object, E extends Element = Element> extends View<M, E> {
    disconnect(): void;
}

abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView<M, E> {
    readonly observer: MutationObserver;

    constructor(model: M) {
        super(model);
        this.observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((record: MutationRecord) => {
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

    public set root(root: ViewRoot<M, E>) {
        if (this.root) {
            this.removeReactiveListeners(this.root);
        }
        super.root = root;
        this.addReactiveListeners(this.root);
    }

    public disconnect(): void {
        this.observer.disconnect();
        this.removeReactiveListeners(this.root);
    }

    public addReactiveListeners(node: Node): void {
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

    public removeReactiveListeners(node: Node): void {
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