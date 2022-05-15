export { State };
interface StateConstructor {
    readonly prototype: State;
    new (): State;
}
interface State {
    enter(): void;
    leave(): void;
}
declare var State: StateConstructor;
