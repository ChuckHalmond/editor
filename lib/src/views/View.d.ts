export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
declare type ViewRoot<E extends Element> = E & {
    _view: View;
};
interface View<M extends object = object, E extends Element = Element> {
    root: ViewRoot<E>;
    readonly model: M;
    render(): E;
}
declare function isViewRoot<E extends Element>(root: E): root is ViewRoot<E>;
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root;
    readonly model: M;
    constructor(model: M);
    get root(): ViewRoot<E>;
    set root(root: ViewRoot<E>);
    abstract render(): E;
}
interface ReactiveView<M extends object = object, E extends Element = Element> extends View<M, E> {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView<M, E> {
    readonly observer: MutationObserver;
    constructor(model: M);
    get root(): ViewRoot<E>;
    set root(root: ViewRoot<E>);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
declare global {
    interface ViewNameMap {
    }
}
