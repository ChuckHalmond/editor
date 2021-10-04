import { AttributeMutationMixin } from "../elements/HTMLElement";
export { AttributeMixinsObserverConstructor };
export { AttributeMixinsObserver };
export { AttributeMixinsObserverBase };
interface AttributeMixinsObserverConstructor {
    readonly prototype: AttributeMixinsObserver;
    new (mixins: AttributeMutationMixin[]): AttributeMixinsObserver;
}
interface AttributeMixinsObserver {
    observe(target: Node): void;
    disconnect(): void;
}
declare class AttributeMixinsObserverBase implements AttributeMixinsObserver {
    private _observer;
    private _mixins;
    constructor(mixins: AttributeMutationMixin[]);
    callback(mutationsList: MutationRecord[]): void;
    observe(target: Node): void;
    disconnect(): void;
}
declare var AttributeMixinsObserver: AttributeMixinsObserverConstructor;
