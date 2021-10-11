export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };

enum Key {
    A = 'a',
    B = 'b',
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
    Shift = "Shift",
}

function displayKeyModifier(mod: KeyModifier): string {
    switch (mod) {
        case KeyModifier.Control:
            return "Ctrl";
        default:
            return mod;
    }
}

enum MouseButton {
    LEFT = 1,
    WHEEL = 2,
    RIGHT = 3,
    FORWARD = 4,
    BACK = 5
}

function testKeyModifier(mod: KeyModifier, event: KeyboardEvent): boolean {
    switch (mod) {
        case 'Alt':
            return event.altKey;
        case 'Control':
            return event.ctrlKey;
        case 'Shift':
            return event.shiftKey;
        default:
            return true;
    }
}

class HotKey {
    public readonly key: Key;
    public readonly mod1?: KeyModifier;
    public readonly mod2?: KeyModifier;

    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier) {
        this.key = key;
        this.mod1 = mod1;
        this.mod2 = mod2;
    }

    public toString(): string {
        return `${this.mod1 ? `${displayKeyModifier(this.mod1)}+` : ''}${this.mod2 ? `${displayKeyModifier(this.mod2)}+` : ''}${(this.key.length === 1) ? this.key.toUpperCase() : this.key}`;
    }

    public test(event: KeyboardEvent): boolean {
        return ((!this.mod1 || testKeyModifier(this.mod1, event)) && (!this.mod2 || testKeyModifier(this.mod2, event)) && event.key === this.key);
    }
}