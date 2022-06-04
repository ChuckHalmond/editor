import { HTMLEActionElement } from "./elements/containers/actions/Action";
import { HotKey } from "./Input";
export { Editor };
export { EditorBase };
interface ButtonAction {
    name: string;
    type: "button";
    trigger: () => void;
}
interface RadioAction {
    name: string;
    type: "radio";
    trigger: (oldValue: string, newValue: string) => void;
    value: string;
    key?: string;
}
interface CheckboxAction {
    name: string;
    type: "checkbox";
    trigger: (oldValue: boolean, newValue: boolean) => void;
    checked: boolean;
    key?: string;
}
interface EditorConstructor {
    readonly prototype: Editor;
    new (): Editor;
}
interface Editor {
    registerButtonAction(name: string, trigger: () => void, init?: {
        hotkey?: HotKey;
        key?: string;
    }): ButtonAction;
    registerRadioAction(name: string, trigger: (oldValue: string, newValue: string) => void, init?: {
        hotkey?: HotKey;
        key?: string;
        value?: string;
    }): RadioAction;
    registerCheckboxAction(name: string, trigger: (oldValue: boolean, newValue: boolean) => void, init?: {
        hotkey?: HotKey;
        key?: string;
        checked?: boolean;
    }): CheckboxAction;
    executeButtonAction(name: string): void;
    executeCheckboxAction(name: string, newChecked: boolean): void;
    executeRadioAction(name: string, newValue: string): void;
    setCheckboxActionValue(name: string, checked: boolean): void;
    setRadioActionValue(name: string, value: string): void;
    unregisterActionElement(action: string, element: HTMLEActionElement): void;
    registerActionElement(action: string, element: HTMLEActionElement): void;
    setup(): void;
}
declare class EditorBase implements Editor {
    private _actions;
    private _actionElements;
    private _hotkeys;
    private _pairs;
    private _pairsListeners;
    private _actionsObserver;
    constructor();
    private _actionsObserverCallback;
    setup(): void;
    handleEvent(event: Event): void;
    registerButtonAction(name: string, trigger: () => void, init?: {
        hotkey?: HotKey;
        key?: string;
    }): ButtonAction;
    registerRadioAction(name: string, trigger: (oldValue: string, newValue: string) => void, init?: {
        hotkey?: HotKey;
        key?: string;
        value?: string;
    }): RadioAction;
    registerCheckboxAction(name: string, trigger: (oldValue: boolean, newValue: boolean) => void, init?: {
        hotkey?: HotKey;
        key?: string;
        checked?: boolean;
    }): CheckboxAction;
    registerAction(name: string, trigger: () => void, type: "button", init?: {
        hotkey?: HotKey;
        key?: string;
    }): ButtonAction;
    registerAction(name: string, trigger: (oldValue: boolean, newValue: boolean) => void, type: "checkbox", init?: {
        hotkey?: HotKey;
        key?: string;
        checked?: boolean;
    }): CheckboxAction;
    registerAction(name: string, trigger: (oldValue: string, newValue: string) => void, type: "radio", init?: {
        hotkey?: HotKey;
        key?: string;
        value?: string;
    }): RadioAction;
    executeButtonAction(name: string): void;
    executeCheckboxAction(name: string, newChecked: boolean): void;
    executeRadioAction(name: string, newValue: string): void;
    executeAction(name: string, type: "button"): void;
    executeAction(name: string, type: "checkbox", newChecked: boolean): void;
    executeAction(name: string, type: "radio", newValue: string): void;
    setCheckboxActionValue(name: string, checked: boolean): void;
    setRadioActionValue(name: string, value: string): void;
    setActionValue(name: string, value?: any): void;
    registerActionElement(name: string, element: HTMLEActionElement): void;
    unregisterActionElement(name: string, element: HTMLEActionElement): void;
}
declare var Editor: EditorConstructor;
