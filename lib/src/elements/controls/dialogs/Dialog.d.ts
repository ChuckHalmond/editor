export { HTMLEDialogElement };
interface HTMLEDialogElementConstructor {
    readonly prototype: HTMLEDialogElement;
    new (): HTMLEDialogElement;
}
declare type DialogElementType = "confirm" | "alert";
interface HTMLEDialogElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    type: DialogElementType;
    open(): void;
    close(): void;
    cancel(): void;
    confirm(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dialog": HTMLEDialogElement;
    }
    interface HTMLElementEventMap {
        "open": Event;
        "close": Event;
        "cancel": Event;
        "confirm": Event;
    }
}
declare var HTMLEDialogElement: HTMLEDialogElementConstructor;
