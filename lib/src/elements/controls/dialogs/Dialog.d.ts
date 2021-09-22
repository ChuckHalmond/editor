export { HTMLEDialogElement };
export { HTMLEDialogElementBase };
declare type EDialogElementType = "confirm" | "alert";
interface HTMLEDialogElement extends HTMLElement {
    name: string;
    type: EDialogElementType;
    confirm(): void;
    cancel(): void;
}
declare class HTMLEDialogElementBase extends HTMLElement implements HTMLEDialogElement {
    name: string;
    type: EDialogElementType;
    private _cancelButton;
    private _confirmButton;
    private _okButton;
    constructor();
    connectedCallback(): void;
    confirm(): void;
    cancel(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dialog": HTMLEDialogElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_confirm": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_cancel": Event;
    }
}
