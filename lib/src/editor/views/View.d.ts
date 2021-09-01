export { ViewBase };
export { View };
interface View<M extends object, E extends HTMLElement> {
    readonly element: E;
    readonly model: M;
    close(): void;
    render(): E;
}
declare abstract class ViewBase<M extends object, E extends HTMLElement> implements View<M, E> {
    private _element;
    private _model;
    private _observer;
    constructor(model: M);
    get element(): E;
    close(): void;
    get model(): M;
    abstract render(): E;
    private _addReactiveListeners;
    private _removeReactiveListeners;
}
