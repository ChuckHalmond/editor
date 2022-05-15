export { State };

interface StateConstructor {
    readonly prototype: State;
    new(): State;
}

interface State {
    enter(): void;
    leave(): void;
}

class StateBase implements State {

    enter(): void {

    }

    leave(): void {

    }
}

var State: StateConstructor = StateBase;