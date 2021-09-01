define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseButton = exports.HotKey = exports.KeyModifier = exports.Key = void 0;
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
    exports.Key = Key;
    var KeyModifier;
    (function (KeyModifier) {
        KeyModifier["Alt"] = "Alt";
        KeyModifier["Control"] = "Control";
        KeyModifier["Shift"] = "Shift";
    })(KeyModifier || (KeyModifier = {}));
    exports.KeyModifier = KeyModifier;
    function displayKeyModifier(mode) {
        switch (mode) {
            case KeyModifier.Control:
                return "Ctrl";
            default:
                return mode;
        }
    }
    var MouseButton;
    (function (MouseButton) {
        MouseButton[MouseButton["LEFT"] = 1] = "LEFT";
        MouseButton[MouseButton["WHEEL"] = 2] = "WHEEL";
        MouseButton[MouseButton["RIGHT"] = 3] = "RIGHT";
        MouseButton[MouseButton["FORWARD"] = 4] = "FORWARD";
        MouseButton[MouseButton["BACK"] = 5] = "BACK";
    })(MouseButton || (MouseButton = {}));
    exports.MouseButton = MouseButton;
    const testKeyModifier = (mod, event) => {
        switch (mod) {
            case 'Alt':
                return event.altKey;
            case 'Control':
                return event.ctrlKey;
            case 'Shift':
                return event.shiftKey;
            default:
                return () => true;
        }
    };
    class HotKey {
        constructor(key, mod1, mod2) {
            this.key = key;
            this.mod1 = mod1;
            this.mod2 = mod2;
        }
        toString() {
            return `${this.mod1 ? `${displayKeyModifier(this.mod1)}+` : ''}${this.mod2 ? `${displayKeyModifier(this.mod2)}+` : ''}${(this.key.length === 1) ? this.key.toUpperCase() : this.key}`;
        }
        test(event) {
            return ((!this.mod1 || testKeyModifier(this.mod1, event)) && (!this.mod2 || testKeyModifier(this.mod2, event)) && event.key === this.key);
        }
    }
    exports.HotKey = HotKey;
});
//# sourceMappingURL=Input.js.map