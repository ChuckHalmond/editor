export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
declare type ViewRoot = Element & {
    _view: View;
};
interface View<M extends object = object> {
    root: ViewRoot;
    readonly model: M;
    render(): Element;
}
declare function isViewRoot(root: Element): root is ViewRoot;
declare abstract class ViewBase<M extends object = object> implements View {
    private _root;
    readonly model: M;
    constructor(model: M);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    abstract render(): Element;
}
interface ReactiveView<M extends object = object> extends View<M> {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object> extends ViewBase<M> implements ReactiveView<M> {
    readonly observer: MutationObserver;
    constructor(model: M);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
