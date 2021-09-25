import { isParentNode, isReactiveNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };

interface View<M extends object = object, E extends Element = Element> {
    readonly root: E;
    readonly model: M;
    render(): E;
}

abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    public readonly root: E;
    public readonly model: M;

    constructor(model: M) {
        this.model = model;
        this.root = this.render();
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

    public disconnect(): void {
        this.observer.disconnect();
        this.removeReactiveListeners(this.root);
    }

    public addReactiveListeners(node: Node): void {
        if (isReactiveNode(node)) {
            node._reactAttributes.addReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                this.addReactiveListeners(childNode);
            });
        }
    }

    public removeReactiveListeners(node: Node): void {
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