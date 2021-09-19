export { View };
export { ViewBase };
export { ReactiveViewBase };
interface View<M extends object, E extends HTMLElement> {
    readonly element: E;
    readonly model: M;
    close(): void;
    prerender(): void;
    render(): E;
}
declare abstract class ViewBase<M extends object, E extends HTMLElement> implements View<M, E> {
    private _element;
    private _model;
    constructor(model: M);
    get element(): E;
    close(): void;
    get model(): M;
    prerender(): void;
    abstract render(): E;
}
declare abstract class ReactiveViewBase<M extends object, E extends HTMLElement> extends ViewBase<M, E> implements View<M, E> {
    private _observer;
    constructor(model: M);
    close(): void;
    private _addReactiveListeners;
    private _removeReactiveListeners;
}
