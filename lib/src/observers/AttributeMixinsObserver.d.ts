import { AttributeMutationMixin } from "../elements/Element";
export { AttributeMixinsObserver };
interface AttributeMixinsObserverConstructor {
    readonly prototype: AttributeMixinsObserver;
    new (mixins: AttributeMutationMixin[]): AttributeMixinsObserver;
}
interface AttributeMixinsObserver {
    observe(target: Node): void;
    disconnect(): void;
}
declare var AttributeMixinsObserver: AttributeMixinsObserverConstructor;
