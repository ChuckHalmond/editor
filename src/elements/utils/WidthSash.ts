import { CustomElement, AttributeProperty, HTML } from "../Element";

export { HTMLEWidthSashElement };

type EWidthSashDirection = "left" | "right";

interface HTMLEWidthSashElementConstructor {
    readonly prototype: HTMLEWidthSashElement;
    new(): HTMLEWidthSashElement;
    readonly observedAttributes: string[];
}

interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
    growdir: EWidthSashDirection;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }

    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}

@CustomElement({
    name: "e-wsash"
})
class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {

    @AttributeProperty({type: "string"})
    public controls!: string;

    @AttributeProperty({type: "string"})
    public growdir!: EWidthSashDirection;

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
        
                            min-width: 4px;
                            width: 4px;
                            max-width: 4px;
        
                            margin-left: -2px;
                            margin-right: -2px;
                            
                            background-color: rgb(0, 128, 255);
                            cursor: ew-resize;
        
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
                let width = parseFloat(this._targetStyle.getPropertyValue("width"));
                let newWidth = Math.trunc(width + ((this.growdir === "left") ? -1 : 1) * event.movementX);
                this._target.style.setProperty("width", `${newWidth}px`);
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
            this.addEventListener("pointerup", () => {
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

var HTMLEHeightSashElement: HTMLEWidthSashElementConstructor = HTMLEWidthSashElementBase;