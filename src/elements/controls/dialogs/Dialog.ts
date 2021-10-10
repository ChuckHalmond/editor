import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";

export { HTMLEDialogElement };

interface HTMLEDialogElementConstructor {
    readonly prototype: HTMLEDialogElement;
    new(): HTMLEDialogElement;
}

type EDialogElementType = "confirm" | "alert";

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
        "e-dialog": HTMLEDialogElement,
    }

    interface HTMLElementEventMap {
        "e_open": Event,
        "e_close": Event,
        "e_cancel": Event,
        "e_confirm": Event,
    }
}

@RegisterCustomHTMLElement({
    name: "e-dialog"
})
@GenerateAttributeAccessors([
    {name: "type", type: "string"},
])
class HTMLEDialogElementBase extends HTMLElement implements HTMLEDialogElement {

    public name!: string;
    public type!: EDialogElementType;

    private _closeButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _confirmButton: HTMLButtonElement;
    private _okButton: HTMLButtonElement;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;

                    padding: 6px;
                    background-color: white;

                    -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                    -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                }

                button {
                    cursor: pointer;
                }

                [part~="actions"] {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }

                [part~="header"] {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }

                [part~="button"]:not(:first-child) {
                    margin-left: 4px;
                }

                :host([type="confirm"]) [part~="ok-button"] {
                    display: none !important;
                }

                :host([type="alert"]) [part~="cancel-button"],
                :host([type="alert"]) [part~="confirm-button"] {
                    display: none !important;
                }
            </style>
            <div part="header">
                <button type="button" tabindex="0" part="button close-button">x</button>
            </div>
            <hr part="separator"/>
            <div part="body">
                <slot></slot>
            </div>
            <hr part="separator"/>
            <div part="actions">
                <button type="button" tabindex="0" part="button cancel-button">Cancel</button>
                <button type="button" tabindex="0" part="button confirm-button">Confirm</button>
                <button type="button" tabindex="0" part="button ok-button">OK</button>
            </div>
        `);

        this._closeButton = this.shadowRoot!.querySelector("[part~='close-button']")!;
        this._cancelButton = this.shadowRoot!.querySelector("[part~='cancel-button']")!;
        this._confirmButton = this.shadowRoot!.querySelector("[part~='confirm-button']")!;
        this._okButton = this.shadowRoot!.querySelector("[part~='ok-button']")!;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.shadowRoot!.addEventListener("mousedown", (event) => {
            let target = event.target as Element;
            if (target === this._closeButton || target === this._cancelButton) {
                this.cancel();
            }
            else if (target === this._confirmButton || target === this._okButton) {
                this.confirm();
            }
        });
    }

    public open(): void {
        this.dispatchEvent(new CustomEvent("e_open", {bubbles: true}));
    }

    public close(): void {
        this.dispatchEvent(new CustomEvent("e_close", {bubbles: true}));
    }

    public cancel(): void {
        this.dispatchEvent(new CustomEvent("e_cancel", {bubbles: true}));
        this.close();
    }

    public confirm(): void {
        this.dispatchEvent(new CustomEvent("e_confirm", {bubbles: true}));
        this.close();
    }
}

var HTMLEDialogElement: HTMLEDialogElementConstructor = HTMLEDialogElementBase;