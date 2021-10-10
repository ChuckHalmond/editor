export { ReactiveNodesObserver };
interface ReactiveNodesObserverConstructor {
    readonly prototype: ReactiveNodesObserver;
    new (): ReactiveNodesObserver;
}
interface ReactiveNodesObserver {
    observe(target: Node): void;
    disconnect(): void;
}
declare var ReactiveNodesObserver: ReactiveNodesObserverConstructor;
