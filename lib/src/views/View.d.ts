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
declare abstract class ViewBase implements View {
    private _root;
    readonly model: object;
    constructor(model: object);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    abstract render(): Element;
}
interface ReactiveView extends View {
    disconnect(): void;
}
declare abstract class ReactiveViewBase extends ViewBase implements ReactiveView {
    readonly observer: MutationObserver;
    constructor(model: object);
    get root(): ViewRoot;
    set root(root: ViewRoot);
    disconnect(): void;
    addReactiveListeners(node: Node): void;
    removeReactiveListeners(node: Node): void;
}
