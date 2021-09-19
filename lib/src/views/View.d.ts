export { View };
export { ViewBase };
export { ReactiveViewBase };
interface View<M extends object = object, E extends Element = Element> {
    readonly root: E;
    readonly model: M;
    render(): E;
}
declare abstract class ViewBase<M extends object = object, E extends Element = Element> implements View<M, E> {
    private _root;
    private _model;
    constructor(model: M);
    get root(): E;
    get model(): M;
    abstract render(): E;
}
declare abstract class ReactiveViewBase<M extends object = object, E extends Element = Element> extends ViewBase<M, E> implements View<M, E> {
    private _observer;
    constructor(model: M);
    private addReactiveListeners;
    private removeReactiveListeners;
}
