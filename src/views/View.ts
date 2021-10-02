import { isParentNode, isReactiveNode, isReactiveParentNode } from "../elements/HTMLElement";
import { forAllSubtreeNodes } from "../elements/Snippets";

export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };

type ViewRoot = Element & {
    _view: View;
}

interface View<M extends object = object> {
    root: ViewRoot;
    readonly model: M;
    render(): Element;
}

function isViewRoot(root: Node): root is ViewRoot {
    return typeof (root as ViewRoot)._view !== "undefined";
}

abstract class ViewBase<M extends object = object> implements View {
    public readonly root: ViewRoot;
    public readonly model: M;

    constructor(model: M) {
        this.model = model;
        this.root = Object.assign(
            this.render(), {
                _view: this
            }
        );
    }
    
    public abstract render(): Element;
}

interface ReactiveView<M extends object = object> extends View<M> {
    disconnect(): void;
}

abstract class ReactiveViewBase<M extends object = object> extends ViewBase<M> implements ReactiveView<M> {
    readonly observer: MutationObserver;
    
    constructor(model: M) {
        super(model);
        this.observer = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((record: MutationRecord) => {
                Array.from(record.removedNodes).map((node) => {
                    if (!isViewRoot(node)) {
                        this.removeReactiveListeners(node);
                    }
                });
                Array.from(record.addedNodes).map((node) => {
                    if (!isViewRoot(node)) {
                        this.addReactiveListeners(node);
                    }
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
            node._reactiveNodeAttributes.addReactListener();
        }
        if (isReactiveParentNode(node)) {
            node._reactiveParentNodeAttributes.addReactListener();
        }
        if (isParentNode(node)) {
            forAllSubtreeNodes(node, (childNode) => {
                if (!isViewRoot(childNode)) {
                    this.addReactiveListeners(childNode);
                }
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
                if (!isViewRoot(childNode)) {
                    this.removeReactiveListeners(childNode);
                }
            });
        }
    }
}