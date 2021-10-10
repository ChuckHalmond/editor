import { isUndoCommand } from "./commands/Command";
import { isTagElement } from "./elements/HTMLElement";
import { ObjectModelBase } from "./models/Model";
export { Editor };
export { EditorBase };
class EditorBase {
    constructor() {
        this._commands = new Map();
        this._hotkeys = new Map();
        this.state = new ObjectModelBase();
    }
    setup() {
        document.body.addEventListener("keydown", (event) => {
            Array.from(this._hotkeys.keys()).forEach((hotkey) => {
                if (hotkey.test(event)) {
                    const execs = this._hotkeys.get(hotkey);
                    if (execs) {
                        execs.forEach((exec) => {
                            exec();
                        });
                    }
                }
            });
        });
        document.body.addEventListener("e_hotkeychange", (event) => {
            const target = event.target;
            if (isTagElement("e-menuitem", target)) {
                if (event.detail.oldHotKey) {
                    this.removeHotkeyExec(event.detail.oldHotKey, target.trigger.bind(target));
                }
                if (event.detail.newHotKey) {
                    this.addHotkeyExec(event.detail.newHotKey, target.trigger.bind(target));
                }
            }
        });
        document.body.addEventListener("e_trigger", (event) => {
            const target = event.target;
            if (isTagElement("e-menuitem", target)) {
                if (target.command) {
                    this.executeCommand(target.command, target.commandArgs);
                }
            }
        });
    }
    registerCommand(name, command) {
        this._commands.set(name, command);
    }
    executeCommand(name, args, opts) {
        const command = this._commands.get(name);
        if (command) {
            if (opts && opts.undo && isUndoCommand(command)) {
                command.undo(args);
            }
            else {
                command.exec(args);
            }
        }
    }
    addHotkeyExec(hotkey, exec) {
        const hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys === "undefined") {
            this._hotkeys.set(hotkey, [exec]);
        }
        ;
    }
    removeHotkeyExec(hotkey, exec) {
        const hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys !== "undefined") {
            const index = hotkeys.indexOf(exec);
            if (index >= 0) {
                hotkeys.splice(index, 1);
            }
            if (hotkeys.length === 0) {
                this._hotkeys.delete(hotkey);
            }
        }
    }
}
var Editor = EditorBase;
//# sourceMappingURL=Editor.js.map