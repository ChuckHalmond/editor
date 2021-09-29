import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };

type ViewRoot<E extends Element> = E & {
    _view: View;
}

interface View<M extends object = object, E extends Element = Element> {
    root: ViewRoot<E>;
    readonly model: M;
    render(): E;
}

function isViewRoot<E extends Element>(root: E): root is ViewRoot<E> {
    return typeof (root as ViewRoot<E>)._view !== "undefined";
}

abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root!: ViewRoot<E>;
    public readonly model: M;

    constructor(model: M) {
        this.model = model;
        this.root = Object.assign(
            this.render(), {
                _view: this
            }
        );
    }

    get root(): ViewRoot<E> {
        return this._root;
    }

    set root(root: ViewRoot<E>) {
        const oldRoot = this._root as Partial<ViewRoot<E>>;
        if (oldRoot) {
            delete oldRoot._view;
        }
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

    public get root(): ViewRoot<E> {
        return super.root;
    }

    public set root(root: ViewRoot<E>) {
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

declare global {
    interface ViewNameMap {}
}