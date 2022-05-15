export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };

enum Key {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    O = "o",
    P = "p",
    Q = "q",
    R = "r",
    S = "s",
    T = "t",
    U = "u",
    V = "v",
    W = "w",
    X = "x",
    Y = "y",
    Z = "z",
    ENTER = "Enter",
    BACKSPACE = "Backspace",
    ARROW_DOWN = "ArrowDown",
    ARROW_LEFT = "ArrowLeft",
    ARROW_RIGHT = "ArrowRight",
    ARROW_UP = "ArrowUp",
    SHIFT = "Shift"
}

enum KeyModifier {
    Alt = "Alt",
    Control = "Control",
    Shift = "Shift"
}

enum MouseButton {
    LEFT = 1,
    WHEEL = 2,
    RIGHT = 3,
    FORWARD = 4,
    BACK = 5
}

class HotKey {
    readonly key: Key;
    readonly mod1?: KeyModifier;
    readonly mod2?: KeyModifier;

    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier) {
        this.key = key;
        this.mod1 = mod1;
        this.mod2 = mod2;
    }

    toString(): string {
        return `${this.mod1 ? `${this.#modifierString(this.mod1)}+` : ""}${this.mod2 ? `${this.#modifierString(this.mod2)}+` : ""}${(this.key.length == 1) ? this.key.toUpperCase() : this.key}`;
    }

    test(event: KeyboardEvent): boolean {
        return (!this.mod1 || this.#testModifier(this.mod1, event)) && (!this.mod2 || this.#testModifier(this.mod2, event)) && event.key == this.key;
    }

    #modifierString(mod: KeyModifier): string {
        switch (mod) {
            case KeyModifier.Control:
                return "Ctrl";
            default:
                return mod;
        }
    }

    #testModifier(mod: KeyModifier, event: KeyboardEvent): boolean {
        switch (mod) {
            case "Alt":
                return event.altKey;
            case "Control":
                return event.ctrlKey;
            case "Shift":
                return event.shiftKey;
            default:
                return true;
        }
    }
}