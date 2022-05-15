import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEDialogElement };

interface HTMLEDialogElementConstructor {
    readonly prototype: HTMLEDialogElement;
    new(): HTMLEDialogElement;
}

type DialogElementType = "confirm" | "alert";

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
        "e-dialog": HTMLEDialogElement,
    }
    
    interface HTMLElementEventMap {
        "open": Event,
        "close": Event,
        "cancel": Event,
        "confirm": Event,
    }
}

@CustomElement({
    name: "e-dialog"
})
class HTMLEDialogElementBase extends HTMLElement implements HTMLEDialogElement {

    readonly shadowRoot!: ShadowRoot;

    name!: string;

    @AttributeProperty({type: String})
    type!: DialogElementType;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            element("style", {
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
                }
            }),
            element("div", {
                part: ["header"],
                children: [
                    element("button", {
                        part: ["button", "close-button"],
                        properties: {
                            textContent: "x",
                            type: "button",
                            tabIndex: 0
                        }
                    })
                ]
            }),
            element("hr", {
                part: ["separator"]
            }),
            element("div", {
                part: ["body"],
                children: [
                    element("slot")
                ]
            }),
            element("hr", {
                part: ["separator"]
            }),
            element("div", {
                part: ["actions"],
                children: [
                    element("button", {
                        part: ["button", "cancel-button"],
                        properties: {
                            textContent: "Cancel",
                            type: "button",
                            tabIndex: 0
                        }
                    }),
                    element("button", {
                        part: ["button", "confirm-button"],
                        properties: {
                            textContent: "Confirm",
                            type: "button",
                            tabIndex: 0
                        }
                    }),
                    element("button", {
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
    }

    connectedCallback() {
        this.shadowRoot.addEventListener("click", this);
    }

    handleEvent(event: Event) {
        const {type, target} = event;
        switch (type) {
            case "click":
                const {part} = <Element>target;
                if (part.contains("close-button") || part.contains("cancel-button")) {
                    this.cancel();
                }
                else if (part.contains("confirm-button") || part.contains("ok-button")) {
                    this.confirm();
                }
                break;
        }
    }

    open(): void {
        this.dispatchEvent(new CustomEvent("open", {bubbles: true}));
    }

    close(): void {
        this.dispatchEvent(new CustomEvent("close", {bubbles: true}));
    }

    cancel(): void {
        this.dispatchEvent(new CustomEvent("cancel", {bubbles: true}));
        this.close();
    }

    confirm(): void {
        this.dispatchEvent(new CustomEvent("confirm", {bubbles: true}));
        this.close();
    }
}

var HTMLEDialogElement: HTMLEDialogElementConstructor = HTMLEDialogElementBase;