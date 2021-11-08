import { CustomElement, AttributeProperty, HTML } from "../../Element";

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

@CustomElement({
    name: "e-dialog"
})
class HTMLEDialogElementBase extends HTMLElement implements HTMLEDialogElement {

    public name!: string;

    @AttributeProperty({type: "string"})
    public type!: EDialogElementType;

    private _closeButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _confirmButton: HTMLButtonElement;
    private _okButton: HTMLButtonElement;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
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
                    `
                }
            }),
            HTML("div", {
                part: ["header"],
                children: [
                    HTML("button", {
                        part: ["button", "close-button"],
                        properties: {
                            textContent: "x",
                            type: "button",
                            tabIndex: 0
                        }
                    })
                ]
            }),
            HTML("hr", {
                part: ["separator"]
            }),
            HTML("div", {
                part: ["body"],
                children: [
                    HTML("slot")
                ]
            }),
            HTML("hr", {
                part: ["separator"]
            }),
            HTML("div", {
                part: ["actions"],
                children: [
                    HTML("button", {
                        part: ["button", "cancel-button"],
                        properties: {
                            textContent: "Cancel",
                            type: "button",
                            tabIndex: 0
                        }
                    }),
                    HTML("button", {
                        part: ["button", "confirm-button"],
                        properties: {
                            textContent: "Confirm",
                            type: "button",
                            tabIndex: 0
                        }
                    }),
                    HTML("button", {
                        part: ["button", "ok-button"],
                        properties: {
                            textContent: "OK",
                            type: "button",
                            tabIndex: 0
                        }
                    })
                ]
            }),
        );

        this._closeButton = this.shadowRoot!.querySelector("[part~=close-button]")!;
        this._cancelButton = this.shadowRoot!.querySelector("[part~=cancel-button]")!;
        this._confirmButton = this.shadowRoot!.querySelector("[part~=confirm-button]")!;
        this._okButton = this.shadowRoot!.querySelector("[part~=ok-button]")!;
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