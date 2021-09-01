import { Command } from "src/libs/commands/Command";
import { Event, EventDispatcher } from "src/libs/events/EventDispatcher";
import { HTMLEMenuBarElement } from "./elements/lib/containers/menus/MenuBar";
import { HTMLEStatusBarElement } from "./elements/lib/containers/status/StatusBar";
import { HotKey } from "./Input";
export { Editor };
export { EditorBase };
export { EditorCommand };
export { EditorHotKey };
declare type EditorEventsMap = {
    "e-context-change": Event<"e-context-change">;
};
interface Editor extends EventDispatcher<EditorEventsMap> {
    getState(key: string): any;
    setState(key: string, value: any): void;
    addStateListener(statekey: string, listener: (newValue: any) => void): number;
    removeStateListener(statekey: string, listener: (newValue: any) => void): void;
    addHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
    removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
    readonly statusbar: HTMLEStatusBarElement | null;
    readonly menubar: HTMLEMenuBarElement | null;
    registerCommand(name: string, command: EditorCommand): void;
    executeCommand(name: string, args?: any, opts?: {
        undo?: boolean;
    }): void;
    undoLastCommand(): void;
    redoLastCommand(): void;
    setContext(context: string): void;
    setup(): Promise<void>;
}
interface EditorCommand extends Command {
    context: string;
}
interface EditorHotKey extends HotKey {
}
declare class EditorBase<State extends object> extends EventDispatcher<EditorEventsMap> implements Editor {
    private _commands;
    private _hotkeys;
    private _undoCommandsCallStack;
    private _redoCommandsCallStack;
    private _context;
    private _state;
    private _stateListeners;
    menubar: HTMLEMenuBarElement | null;
    statusbar: HTMLEStatusBarElement | null;
    constructor();
    get context(): string;
    setup(): Promise<any>;
    setContext(context: string): void;
    getState(key: string): any;
    setState(key: string, value: any): void;
    addStateListener(statekey: string, listener: (newValue: any) => void): number;
    removeStateListener(statekey: string, listener: (newValue: any) => void): void;
    registerCommand(name: string, command: EditorCommand): void;
    executeCommand(name: string, args?: any, opts?: {
        undo?: boolean;
    }): void;
    undoLastCommand(): void;
    redoLastCommand(): void;
    addHotkeyExec(hotkey: EditorHotKey, exec: () => void): number;
    removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
}
