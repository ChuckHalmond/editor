var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
export { HTMLEDialogElementBase };
let HTMLEDialogElementBase = class HTMLEDialogElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
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
        this._cancelButton = this.shadowRoot.querySelector("[part~='cancel-button']");
        this._confirmButton = this.shadowRoot.querySelector("[part~='confirm-button']");
        this._okButton = this.shadowRoot.querySelector("[part~='ok-button']");
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.shadowRoot.addEventListener("mousedown", (event) => {
            let target = event.target;
            if (target === this._cancelButton) {
                this.cancel();
            }
            else if (target === this._confirmButton || target === this._okButton) {
                this.confirm();
            }
        });
    }
    confirm() {
        this.dispatchEvent(new CustomEvent("e_confirm"));
        this.remove();
    }
    cancel() {
        this.dispatchEvent(new CustomEvent("e_cancel"));
        this.remove();
    }
};
HTMLEDialogElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-dialog"
    }),
    GenerateAttributeAccessors([
        { name: "type", type: "string" },
    ])
], HTMLEDialogElementBase);
//# sourceMappingURL=Dialog.js.map