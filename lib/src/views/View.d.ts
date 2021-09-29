export { ViewRoot };
export { isViewRoot };
export { isView };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
declare type ViewRoot = Element & {
    _view: View;
};
interface View<M extends object = object, E extends Element = Element> {
    root: ViewRoot;
    readonly model: M;
    name(): string;
    render(): E;
}
declare function isViewRoot(root: Element): root is ViewRoot;
declare function isView<K extends keyof ViewNameMap>(name: K, view: View): view is ViewNameMap[K];
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root;
    readonly model: M;
    constructor(model: M);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    abstract name(): string;
    abstract render(): E;
}
interface ReactiveView<M extends object = object, E extends Element = Element> extends View<M, E> {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView<M, E> {
    readonly observer: MutationObserver;
    constructor(model: M);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
declare global {
    interface ViewNameMap {
    }
}
