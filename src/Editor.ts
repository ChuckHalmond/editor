
import { Command, isUndoCommand } from "./commands/Command";
import { isTagElement } from "./elements/HTMLElement";
import { HotKeyChangeEvent } from "./elements/containers/menus/MenuItem";
import { HotKey } from "./Input";
import { ObjectModel, ObjectModelBase } from "./models/Model";

export { Editor };
export { EditorBase };

interface EditorConstructor {
    readonly prototype: Editor;
    new(): Editor;
}

interface Editor {
    addHotkeyExec(hotkey: HotKey, exec: () => void): void;
    removeHotkeyExec(hotkey: HotKey, exec: () => void): void;
    registerCommand(name: string, command: Command): void;
    executeCommand(name: string, args?: any, opts?: {undo?: boolean}): void;
    setup(): void;
}

declare global {
    interface EditorState {}
}

class EditorBase implements Editor {
    readonly state: ObjectModel<EditorState>;
    private _commands: Map<string, Command>;
    private _hotkeys: Map<HotKey, (() => void)[]>;

    constructor() {
        this._commands = new Map();
        this._hotkeys = new Map();
        this.state = new ObjectModelBase({});
    }
    
    public setup(): void {
        document.body.addEventListener("keydown", (event: KeyboardEvent) => {
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
        
        document.body.addEventListener("e_hotkeychange", (event: HotKeyChangeEvent) => {
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
                    this.executeCommand(target.command, target.commandArgs)
                }
            }
        });
    }

    public registerCommand(name: string, command: Command) {
        this._commands.set(name, command);
    }

    public executeCommand(name: string, args?: any, opts?: {undo?: boolean}): void {
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

    public addHotkeyExec(hotkey: HotKey, exec: () => void): void {
        const hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys === "undefined") {
            this._hotkeys.set(hotkey, [exec]);
        };
    }

    public removeHotkeyExec(hotkey: HotKey, exec: () => void): void {
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

var Editor: EditorConstructor = EditorBase;