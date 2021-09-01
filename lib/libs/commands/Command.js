define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUndoCommand = exports.isCommand = void 0;
    function isCommand(obj) {
        return (typeof obj.exec === 'function');
    }
    exports.isCommand = isCommand;
    function isUndoCommand(obj) {
        return (typeof obj.exec === 'function')
            && (typeof obj.undo === 'function');
    }
    exports.isUndoCommand = isUndoCommand;
});
//# sourceMappingURL=Command.js.map