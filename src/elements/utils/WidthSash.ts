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
    private _directionToTarget: number;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    z-index: 1;

                    width: 4px;
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
            </style>
        `);
        this._target = null;
        this._targetStyle = null;
        this._directionToTarget = 0;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        let onPointerMove = (event: PointerEvent) => {
            if (this._target && this._targetStyle) {
                let width = parseFloat(this._targetStyle.getPropertyValue("width"));
                let newWidth = Math.trunc(width + this._directionToTarget * event.movementX);
                this._target.style.setProperty("width", `${newWidth}px`);
                this.dispatchEvent(new CustomEvent("e_resize"));
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
                            const thisBoundingRect = this.getBoundingClientRect();
                            const thisTargetBoundingRect = this._target.getBoundingClientRect();
                            this._directionToTarget = Math.sign(
                                ((thisBoundingRect.left + thisBoundingRect.right) / 2) -
                                ((thisTargetBoundingRect.left + thisTargetBoundingRect.right) / 2)
                            );
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
        "e_resize": CustomEvent,
    }
}