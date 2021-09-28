export { HTMLEDialogElement };
export { HTMLEDialogElementBase };
declare type EDialogElementType = "confirm" | "alert";
interface HTMLEDialogElement extends HTMLElement {
    name: string;
    type: EDialogElementType;
    open(): void;
    close(): void;
    cancel(): void;
    confirm(): void;
}
declare class HTMLEDialogElementBase extends HTMLElement implements HTMLEDialogElement {
    name: string;
    type: EDialogElementType;
    private _closeButton;
    private _cancelButton;
    private _confirmButton;
    private _okButton;
    constructor();
    connectedCallback(): void;
    open(): void;
    close(): void;
    cancel(): void;
    confirm(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dialog": HTMLEDialogElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_open": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_close": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_cancel": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_confirm": Event;
    }
}
