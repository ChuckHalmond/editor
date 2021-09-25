export { View };
export { ViewBase };
export { ReactiveView };
export { ReactiveViewBase };
interface View<M extends object = object, E extends Element = Element> {
    readonly root: E;
    readonly model: M;
    render(): E;
}
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    readonly root: E;
    readonly model: M;
    constructor(model: M);
    abstract render(): E;
}
interface ReactiveView<M extends object = object, E extends Element = Element> extends View<M, E> {
    disconnect(): void;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements ReactiveView<M, E> {
    readonly observer: MutationObserver;
    constructor(model: M);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
