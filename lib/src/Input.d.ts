export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };
declare enum Key {
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
declare enum KeyModifier {
    Alt = "Alt",
    Control = "Control",
    Shift = "Shift"
}
declare enum MouseButton {
    LEFT = 1,
    WHEEL = 2,
    RIGHT = 3,
    FORWARD = 4,
    BACK = 5
}
declare class HotKey {
    readonly key: Key;
    readonly mod1?: KeyModifier;
    readonly mod2?: KeyModifier;
    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier);
    toString(): string;
    test(event: KeyboardEvent): boolean;
}
