export { ViewRoot };
export { isViewRoot };
export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
declare type ViewRoot = Element & {
    _view: View;
};
interface View {
    root: ViewRoot;
    readonly model: object;
    render(): Element;
}
declare function isViewRoot(root: Element): root is ViewRoot;
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View {
    private _root;
    readonly model: M;
    constructor(model: M);
    get root(): ViewRoot & E;
    set root(root: ViewRoot & E);
    abstract render(): E;
}
interface ReactiveView extends View {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView {
    readonly observer: MutationObserver;
    constructor(model: M);
    get root(): ViewRoot & E;
    set root(root: ViewRoot & E);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
declare global {
    interface ViewNameMap {
    }
}
