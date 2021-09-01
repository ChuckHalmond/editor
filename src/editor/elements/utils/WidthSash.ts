import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";

export { HTMLEWidthSashElement };
export { HTMLEWidthSashElementBase };

interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
}

@RegisterCustomHTMLElement({
    name: "e-wsash",
    observedAttributes: ["controls"]
})
@GenerateAttributeAccessors([
    {name: "controls", type: "string"},
])
class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {

    public controls!: string;

    private _target: HTMLElement | null;
    private _targetStyle: CSSStyleDeclaration | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;

                    width: 4px;
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
            </style>
        `);
        this._target = null;
        this._targetStyle = null;
    }

    public connectedCallback(): void {
        let onPointerMove = (event: PointerEvent) => {
            if (this._target && this._targetStyle) {
                let directionToTarget = Math.sign(
                    ((this.getBoundingClientRect().left + this.getBoundingClientRect().right) / 2) -
                    ((this._target.getBoundingClientRect().right + this._target.getBoundingClientRect().right) / 2)
                );
                let width = parseFloat(this._targetStyle.getPropertyValue("width"));
                let minWidth = parseFloat(this._targetStyle.getPropertyValue("min-width"));
                let maxWidth = parseFloat(this._targetStyle.getPropertyValue("max-width"));
                let newWidth = Math.trunc(width + directionToTarget * event.movementX);
                if (!isNaN(minWidth)) {
                    newWidth = Math.max(newWidth, minWidth);
                }
                if (!isNaN(maxWidth)) {
                    newWidth = Math.min(newWidth, maxWidth);
                }
                this._target.style.setProperty("width", `${newWidth}px`);
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
        "e-wsash": HTMLEWidthSashElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "resize": CustomEvent,
    }
}