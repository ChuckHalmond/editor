import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";

export { HTMLEHeightSashElement };
export { HTMLEHeightSashElementBase };

interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
}

@RegisterCustomHTMLElement({
    name: "e-hsash",
    observedAttributes: ["controls"]
})
@GenerateAttributeAccessors([
    {name: "controls", type: "string"},
])
class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {

    public controls!: string;

    private _target: HTMLElement | null;
    private _targetStyle: CSSStyleDeclaration | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;

                    height: 4px;
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
        let onPointerMove = (event: PointerEvent) => {
            if (this._target && this._targetStyle) {
                let directionToTarget = Math.sign(
                    ((this.getBoundingClientRect().top + this.getBoundingClientRect().bottom) / 2) -
                    ((this._target.getBoundingClientRect().top + this._target.getBoundingClientRect().bottom) / 2)
                );
                let height = parseFloat(this._targetStyle.getPropertyValue("height"));
                let minHeight = parseFloat(this._targetStyle.getPropertyValue("min-height"));
                let maxHeight = parseFloat(this._targetStyle.getPropertyValue("max-height"));
                let newHeight = Math.trunc(height + directionToTarget * event.movementY);
                if (!isNaN(minHeight)) {
                    newHeight = Math.max(newHeight, minHeight);
                }
                if (!isNaN(maxHeight)) {
                    newHeight = Math.min(newHeight, maxHeight);
                }
                this._target.style.setProperty("height", `${newHeight}px`);
                this.dispatchEvent(new CustomEvent("resize"));
            }
        };

        this.addEventListener("pointerdown", (event: PointerEvent) => {
            this.setPointerCapture(event.pointerId);
            this.addEventListener("pointermove", onPointerMove);
            this.addEventListener("pointerup", (event: PointerEvent) => {
                this.removeEventListener("pointermove", onPointerMove);
                this.releasePointerCapture(event.pointerId);
            }, {once: true});
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
        "resize": CustomEvent,
    }
}