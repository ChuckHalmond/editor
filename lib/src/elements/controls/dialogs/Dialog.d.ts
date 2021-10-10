export { HTMLEDialogElement };
interface HTMLEDialogElementConstructor {
    readonly prototype: HTMLEDialogElement;
    new (): HTMLEDialogElement;
}
declare type EDialogElementType = "confirm" | "alert";
interface HTMLEDialogElement extends HTMLElement {
    name: string;
    type: EDialogElementType;
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
        "e_open": Event;
        "e_close": Event;
        "e_cancel": Event;
        "e_confirm": Event;
    }
}
declare var HTMLEDialogElement: HTMLEDialogElementConstructor;
