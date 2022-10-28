var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HotKey_instances, _HotKey_modifierString, _HotKey_testModifier;
export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };
var Key;
(function (Key) {
    Key["A"] = "a";
    Key["B"] = "b";
    Key["C"] = "c";
    Key["D"] = "d";
    Key["E"] = "e";
    Key["F"] = "f";
    Key["G"] = "g";
    Key["H"] = "h";
    Key["I"] = "i";
    Key["J"] = "j";
    Key["K"] = "k";
    Key["L"] = "l";
    Key["M"] = "m";
    Key["O"] = "o";
    Key["P"] = "p";
    Key["Q"] = "q";
    Key["R"] = "r";
    Key["S"] = "s";
    Key["T"] = "t";
    Key["U"] = "u";
    Key["V"] = "v";
    Key["W"] = "w";
    Key["X"] = "x";
    Key["Y"] = "y";
    Key["Z"] = "z";
    Key["ENTER"] = "Enter";
    Key["BACKSPACE"] = "Backspace";
    Key["ARROW_DOWN"] = "ArrowDown";
    Key["ARROW_LEFT"] = "ArrowLeft";
    Key["ARROW_RIGHT"] = "ArrowRight";
    Key["ARROW_UP"] = "ArrowUp";
    Key["SHIFT"] = "Shift";
})(Key || (Key = {}));
var KeyModifier;
(function (KeyModifier) {
    KeyModifier["Alt"] = "Alt";
    KeyModifier["Control"] = "Control";
    KeyModifier["Shift"] = "Shift";
})(KeyModifier || (KeyModifier = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["LEFT"] = 1] = "LEFT";
    MouseButton[MouseButton["WHEEL"] = 2] = "WHEEL";
    MouseButton[MouseButton["RIGHT"] = 3] = "RIGHT";
    MouseButton[MouseButton["FORWARD"] = 4] = "FORWARD";
    MouseButton[MouseButton["BACK"] = 5] = "BACK";
})(MouseButton || (MouseButton = {}));
class HotKey {
    constructor(key, mod1, mod2) {
        _HotKey_instances.add(this);
        this.key = key;
        this.mod1 = mod1;
        this.mod2 = mod2;
    }
    toString() {
        return `${this.mod1 ? `${__classPrivateFieldGet(this, _HotKey_instances, "m", _HotKey_modifierString).call(this, this.mod1)}+` : ""}${this.mod2 ? `${__classPrivateFieldGet(this, _HotKey_instances, "m", _HotKey_modifierString).call(this, this.mod2)}+` : ""}${(this.key.length == 1) ? this.key.toUpperCase() : this.key}`;
    }
    test(event) {
        return (!this.mod1 || __classPrivateFieldGet(this, _HotKey_instances, "m", _HotKey_testModifier).call(this, this.mod1, event)) && (!this.mod2 || __classPrivateFieldGet(this, _HotKey_instances, "m", _HotKey_testModifier).call(this, this.mod2, event)) && event.key == this.key;
    }
}
_HotKey_instances = new WeakSet(), _HotKey_modifierString = function _HotKey_modifierString(mod) {
    switch (mod) {
        case KeyModifier.Control:
            return "Ctrl";
        default:
            return mod;
    }
}, _HotKey_testModifier = function _HotKey_testModifier(mod, event) {
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
};
//# sourceMappingURL=Input.js.map