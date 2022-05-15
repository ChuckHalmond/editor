export { Delegate };
interface DelegateConstructor {
    readonly prototype: Delegate;
    new (): Delegate;
}
interface Delegate {
    render(): string | Node;
}
declare var Delegate: DelegateConstructor;
