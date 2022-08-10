export { State };

interface StateConstructor {
    prototype: State;
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