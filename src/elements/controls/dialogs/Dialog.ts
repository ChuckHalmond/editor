import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";

export { HTMLEDialogElement };
export { HTMLEDialogElementBase };

type EDialogElementType = "confirm" | "alert";

interface HTMLEDialogElement extends HTMLElement {
    name: string;
    type: EDialogElementType;
    confirm(): void;
    cancel(): void;
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

        this._cancelButton = this.shadowRoot!.querySelector("[part~='cancel-button']")!;
        this._confirmButton = this.shadowRoot!.querySelector("[part~='confirm-button']")!;
        this._okButton = this.shadowRoot!.querySelector("[part~='ok-button']")!;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.shadowRoot!.addEventListener("mousedown", (event) => {
            let target = event.target as Element;
            if (target === this._cancelButton) {
                this.cancel();
            }
            else if (target === this._confirmButton || target === this._okButton) {
                this.confirm();
            }
        });
    }

    public confirm(): void {
        this.dispatchEvent(new CustomEvent("e_confirm"));
        this.remove();
    }

    public cancel(): void {
        this.dispatchEvent(new CustomEvent("e_cancel"));
        this.remove();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dialog": HTMLEDialogElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_confirm": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_cancel": Event,
    }
}