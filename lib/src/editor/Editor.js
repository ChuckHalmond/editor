import { isUndoCommand } from "src/editor/libs/commands/Command";
import { EventDispatcher } from "src/editor/libs/events/EventDispatcher";
import { isTagElement } from "./elements/HTMLElement";
import { getPropertyFromPath, setPropertyFromPath } from "./elements/Snippets";
import { HTMLEMenubarTemplate } from "./templates/menus/MenubarTemplate";
export { EditorBase };
/*


createStatement(statementData)
deleteStatement(statement)
focusStatement(statement)

executeRemoteStatement(statement);

invalidateStatement(statement, reason)
validateStatement(statement, result)

fetchStatements()
fetchExpressions()

statments
expressions

*/
class EditorBase extends EventDispatcher {
    /*readonly toolbar: HTMLElement;
    readonly statusbar: HTMLElement;*/
    /*public readonly state: HTMLFormElement;
    */
    constructor() {
        super();
        this._commands = new Map();
        this._context = 'default';
        this._hotkeys = new Map();
        this._undoCommandsCallStack = [];
        this._redoCommandsCallStack = [];
        this.menubar = null;
        this.statusbar = null;
        this._state = {};
        this._stateListeners = new Map();
    }
    get context() {
        return this._context;
    }
    setup() {
        const menubarContainer = document.getElementById("menubar-container");
        this.statusbar = document.body.querySelector("e-statusbar");
        document.addEventListener("keydown", (event) => {
            Array.from(this._hotkeys.keys()).forEach((hotkey) => {
                if (hotkey.test(event)) {
                    let execs = this._hotkeys.get(hotkey);
                    execs.forEach((exec) => {
                        exec();
                    });
                }
            });
        });
        document.body.addEventListener("hotkeychange", (event) => {
            let target = event.target;
            if (isTagElement("e-menuitem", target)) {
                if (event.detail.oldHotKey) {
                    this.removeHotkeyExec(event.detail.oldHotKey, target.trigger.bind(target));
                }
                if (event.detail.newHotKey) {
                    this.addHotkeyExec(event.detail.newHotKey, target.trigger.bind(target));
                }
            }
        });
        /*document.body.addEventListener("trigger", (event: Event) => {
            let target = event.target as any;
            if (isTagElement("e-menuitem", target)) {
                if (target.command) {
                    this.executeCommand(target.command, target.commandArgs)
                }
            }
        });*/
        return Promise.all([
            new Promise((resolve, reject) => {
                if (menubarContainer) {
                    fetch("assets/editor/editor.json").then((response) => {
                        if (response.ok) {
                            response.json().then((json) => {
                                const menubar = HTMLEMenubarTemplate(json);
                                this.menubar = menubar;
                                menubarContainer.append(menubar);
                                resolve();
                            });
                        }
                        reject();
                    });
                }
                else {
                    reject();
                }
            })
        ]);
    }
    setContext(context) {
        if (context !== this._context) {
            //this.dispatchEvent(new CustomEvent("e-contextchange"));
            this._context = context;
            /*if (this.menubar) {
                this.menubar.findItems((item) => {
                    return !!item.command && (item.command.context === this._context)
                }).forEach((item) => {
                    item.disabled = true;
                });
            }*/
        }
    }
    getState(key) {
        return getPropertyFromPath(this._state, key);
    }
    //TODO: Create a listeners object with the same structure as the state object
    setState(key, value) {
        setPropertyFromPath(this._state, key, value);
        const listenedStates = Array.from(this._stateListeners.keys());
        listenedStates.filter((state) => {
            return (state.startsWith(key) && (state.charAt(key.length) === "." || state.charAt(key.length) === "")) ||
                (key.startsWith(state) && (key.charAt(state.length) === "." || key.charAt(state.length) === ""));
        }).forEach((state) => {
            let stateListeners = this._stateListeners.get(state);
            if (stateListeners) {
                let newStateValue = (state.length === key.length) ? value :
                    (state.length >= key.length) ? getPropertyFromPath(value, state.substring(key.length + 1)) :
                        getPropertyFromPath(this._state, state);
                stateListeners.forEach((stateListener) => {
                    stateListener(newStateValue);
                });
            }
        });
    }
    addStateListener(statekey, listener) {
        let stateListeners = this._stateListeners.get(statekey);
        if (typeof stateListeners === "undefined") {
            this._stateListeners.set(statekey, [listener]);
            return 0;
        }
        else {
            return stateListeners.push(listener) - 1;
        }
    }
    removeStateListener(statekey, listener) {
        let stateListeners = this._stateListeners.get(statekey);
        if (typeof stateListeners !== "undefined") {
            let index = stateListeners.indexOf(listener);
            if (index >= 0) {
                stateListeners.splice(index, 1);
            }
            if (stateListeners.length === 0) {
                this._stateListeners.delete(statekey);
            }
        }
    }
    registerCommand(name, command) {
        this._commands.set(name, command);
    }
    executeCommand(name, args, opts) {
        const command = this._commands.get(name);
        if (command && command.context === this._context) {
            if (opts && opts.undo && isUndoCommand(command)) {
                command.undo(args);
                this._redoCommandsCallStack.push({ ...command, args: args });
            }
            else {
                command.exec(args);
                if (isUndoCommand(command)) {
                    this._undoCommandsCallStack.push({ ...command, args: args });
                }
            }
        }
    }
    undoLastCommand() {
        const lastCommand = this._undoCommandsCallStack.pop();
        if (lastCommand) {
            if (isUndoCommand(lastCommand) && lastCommand.context === this._context) {
                lastCommand.undo();
                this._redoCommandsCallStack.push(lastCommand);
            }
        }
    }
    redoLastCommand() {
        const lastCommand = this._redoCommandsCallStack.pop();
        if (lastCommand) {
            if (lastCommand.context === this._context) {
                lastCommand.exec();
                if (isUndoCommand(lastCommand)) {
                    this._undoCommandsCallStack.push(lastCommand);
                }
            }
        }
    }
    addHotkeyExec(hotkey, exec) {
        let hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys === "undefined") {
            this._hotkeys.set(hotkey, [exec]);
            return 0;
        }
        else {
            return hotkeys.push(exec) - 1;
        }
    }
    removeHotkeyExec(hotkey, exec) {
        let hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys !== "undefined") {
            let index = hotkeys.indexOf(exec);
            if (index >= 0) {
                hotkeys.splice(index, 1);
            }
            if (hotkeys.length === 0) {
                this._hotkeys.delete(hotkey);
            }
        }
    }
}
//# sourceMappingURL=Editor.js.map