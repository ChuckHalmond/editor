import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";

export { HTMLEHeightSashElement };
export { HTMLEHeightSashElementBase };

type EHeightSashDirection = "top" | "bottom";

interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
    growdir: EHeightSashDirection;
}

@RegisterCustomHTMLElement({
    name: "e-hsash",
    observedAttributes: ["controls"]
})
@GenerateAttributeAccessors([
    {name: "controls", type: "string"},
    {name: "growdir", type: "string"},
])
class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {

    public controls!: string;
    public growdir!: EHeightSashDirection;

    private _target: HTMLElement | null;
    private _targetStyle: CSSStyleDeclaration | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    z-index: 1;

                    height: 4px;
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
            </style>
        `);
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
            this.setPointerCapture(event.pointerId);
            this.addEventListener("pointermove", onPointerMove);
            this.addEventListener("pointerup", (event: PointerEvent) => {
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

declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_resize": CustomEvent,
    }
}