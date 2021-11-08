import { CustomElement, AttributeProperty, HTML } from "../Element";

export { HTMLEHeightSashElement };

type EHeightSashDirection = "top" | "bottom";

interface HTMLEHeightSashElementConstructor {
    readonly prototype: HTMLEHeightSashElement;
    new(): HTMLEHeightSashElement;
    readonly observedAttributes: string[];
}

interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
    growdir: EHeightSashDirection;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }

    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}

@CustomElement({
    name: "e-hsash"
})
class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {

    @AttributeProperty({type: "string"})
    public controls!: string;

    @AttributeProperty({type: "string"})
    public growdir!: EHeightSashDirection;

    private _target: HTMLElement | null;
    private _targetStyle: CSSStyleDeclaration | null;

    public static get observedAttributes() {
        return ["controls"];
    }

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                            z-index: 1;
        
                            max-height: 4px;
                            height: 4px;
                            min-height: 4px;
        
                            margin-top: -2px;
                            margin-bottom: -2px;
                            
                            background-color: rgb(0, 128, 255);
                            cursor: ns-resize;
        
                            transition-property: opacity;
                            transition-delay: 0.2s;
                            transition-duration: 0.2s;
                            transition-timing-function: ease-out;
                            opacity: 0;
                        }
        
                        :host(:active),
                        :host(:hover) {
                            opacity: 1;
                        }
                    `
                }
            })
        );
        
        this._target = null;
        this._targetStyle = null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        let onPointerMove = (event: PointerEvent) => {
            if (this._target && this._targetStyle) {
                let height = parseFloat(this._targetStyle.getPropertyValue("height"));
                let newHeight = Math.trunc(height + ((this.growdir === "top") ? -1 : 1) * event.movementY);
                this._target.style.setProperty("height", `${newHeight}px`);
                this.dispatchEvent(new CustomEvent("e_resize"));
            }
        };

        this.addEventListener("pointerdown", (event: PointerEvent) => {
            const target = document.getElementById(this.controls);
            if (target && this._target !== target) {
                this._target = target;
                this._targetStyle = window.getComputedStyle(target);
            }
            this.setPointerCapture(event.pointerId);
            this.addEventListener("pointermove", onPointerMove);
            this.addEventListener("pointerup", (event) => {
                this.removeEventListener("pointermove", onPointerMove);
                this.releasePointerCapture(event.pointerId);
            });
        });
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "controls":
                    if (oldValue !== newValue) {
                        const target = document.getElementById(this.controls);
                        if (target) {
                            this._target = target;
                            this._targetStyle = window.getComputedStyle(target);
                        }
                    }
                    break;
            }
        }
    }
}

var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor = HTMLEHeightSashElementBase;