export { HTMLEActionElement };
export { ActionType };
interface HTMLEActionElementConstructor {
    readonly prototype: HTMLEActionElement;
    new (): HTMLEActionElement;
}
interface HTMLEActionElement extends HTMLElement {
    name: string;
    value: string;
    checked: boolean;
    type: string;
    disabled: boolean;
    hotkey: string;
    trigger(): void;
    enable(): void;
    disable(): void;
}
declare global {
    interface HTMLElementEventMap {
        "trigger": Event;
    }
}
declare type ActionType = "button" | "checkbox" | "radio" | "select";
declare var HTMLEActionElement: HTMLEActionElementConstructor;
