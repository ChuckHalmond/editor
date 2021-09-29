export { View };
export { ViewRoot };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
declare type ViewRoot<M extends object = object, E extends Element = Element> = E & {
    _view?: View<M, E>;
};
interface View<M extends object = object, E extends Element = Element> {
    root: ViewRoot<M, E>;
    readonly model: M;
    render(): ViewRoot<M, E>;
}
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root;
    readonly model: M;
    constructor(model: M);
    get root(): ViewRoot<M, E>;
    set root(root: ViewRoot<M, E>);
    abstract render(): E;
}
interface ReactiveView<M extends object = object, E extends Element = Element> extends View<M, E> {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView<M, E> {
    readonly observer: MutationObserver;
    constructor(model: M);
    set root(root: ViewRoot<M, E>);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
