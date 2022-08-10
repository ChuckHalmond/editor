export { State };
interface StateConstructor {
    prototype: State;
    new (): State;
}
interface State {
    enter(): void;
    leave(): void;
}
declare var State: StateConstructor;
