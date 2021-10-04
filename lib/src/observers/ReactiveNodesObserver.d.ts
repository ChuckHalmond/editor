export { ReactiveNodesObserverConstructor };
export { ReactiveNodesObserver };
export { ReactiveNodesObserverBase };
interface ReactiveNodesObserverConstructor {
    readonly prototype: ReactiveNodesObserver;
    new (): ReactiveNodesObserver;
}
interface ReactiveNodesObserver {
    observe(target: Node): void;
    disconnect(): void;
}
declare class ReactiveNodesObserverBase implements ReactiveNodesObserver {
    private _observer;
    constructor();
    callback(mutationsList: MutationRecord[]): void;
    observe(target: Node): void;
    disconnect(): void;
}
declare var ReactiveNodesObserver: ReactiveNodesObserverConstructor;
