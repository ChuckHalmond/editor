var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, element } from "../../Element";
export { HTMLEDialogElement };
let HTMLEDialogElementBase = class HTMLEDialogElementBase extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(element("style", {
            children: [
                /*css*/ `
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
        
                        [part="actions"] {
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-end;
                        }
        
                        [part="header"] {
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-end;
                        }
        
                        [part="button"]:not(:first-child) {
                            margin-left: 4px;
                        }
        
                        :host([type="confirm"]) [part="ok-button"] {
                            display: none !important;
                        }
        
                        :host([type="alert"]) [part="cancel-button"],
                        :host([type="alert"]) [part="confirm-button"] {
                            display: none !important;
                        }
                    `
            ]
        }), element("div", {
            attributes: {
                part: "header"
            },
            children: [
                element("button", {
                    attributes: {
                        part: "button close-button",
                        type: "button",
                        tabindex: 0
                    },
                    children: [
                        "x"
                    ]
                })
            ]
        }), element("hr", {
            attributes: {
                part: "separator"
            }
        }), element("div", {
            attributes: {
                part: "body"
            },
            children: [
                element("slot")
            ]
        }), element("hr", {
            attributes: {
                part: "separator"
            }
        }), element("div", {
            attributes: {
                part: "actions",
            },
            children: [
                element("button", {
                    attributes: {
                        part: "button cancel-button",
                        type: "button",
                        tabindex: 0
                    },
                    children: [
                        "Cancel"
                    ]
                }),
                element("button", {
                    attributes: {
                        part: "button confirm-button",
                        type: "button",
                        tabindex: 0
                    },
                    children: [
                        "Confirm"
                    ]
                }),
                element("button", {
                    attributes: {
                        part: "button ok-button",
                        type: "button",
                        tabindex: 0
                    },
                    children: [
                        "OK"
                    ]
                })
            ]
        }));
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("click", this);
    }
    handleEvent(event) {
        const { type, target } = event;
        switch (type) {
            case "click":
                const { part } = target;
                if (part.contains("close-button") || part.contains("cancel-button")) {
                    this.cancel();
                }
                else if (part.contains("confirm-button") || part.contains("ok-button")) {
                    this.confirm();
                }
                break;
        }
    }
    open() {
        this.dispatchEvent(new CustomEvent("open", { bubbles: true }));
    }
    close() {
        this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
    }
    cancel() {
        this.dispatchEvent(new CustomEvent("cancel", { bubbles: true }));
        this.close();
    }
    confirm() {
        this.dispatchEvent(new CustomEvent("confirm", { bubbles: true }));
        this.close();
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEDialogElementBase.prototype, "type", void 0);
HTMLEDialogElementBase = __decorate([
    CustomElement({
        name: "e-dialog"
    })
], HTMLEDialogElementBase);
var HTMLEDialogElement = HTMLEDialogElementBase;
//# sourceMappingURL=Dialog.js.map