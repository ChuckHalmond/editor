import { Command } from "./commands/Command";
import { HotKey } from "./Input";
import { ObjectModel } from "./models/Model";
export { Editor };
export { EditorBase };
interface EditorConstructor {
    readonly prototype: Editor;
    new (): Editor;
}
interface Editor {
    addHotkeyExec(hotkey: HotKey, exec: () => void): void;
    removeHotkeyExec(hotkey: HotKey, exec: () => void): void;
    registerCommand(name: string, command: Command): void;
    executeCommand(name: string, args?: any, opts?: {
        undo?: boolean;
    }): void;
    setup(): void;
}
declare global {
    interface EditorState {
    }
}
declare class EditorBase implements Editor {
    readonly state: ObjectModel<EditorState>;
    private _commands;
    private _hotkeys;
    constructor();
    setup(): void;
    registerCommand(name: string, command: Command): void;
    executeCommand(name: string, args?: any, opts?: {
        undo?: boolean;
    }): void;
    addHotkeyExec(hotkey: HotKey, exec: () => void): void;
    removeHotkeyExec(hotkey: HotKey, exec: () => void): void;
}
declare var Editor: EditorConstructor;
