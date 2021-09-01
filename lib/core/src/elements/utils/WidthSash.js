var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";
export { HTMLEWidthSashElementBase };
let HTMLEWidthSashElementBase = class HTMLEWidthSashElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
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
    connectedCallback() {
        let onPointerMove = (event) => {
            if (this._target && this._targetStyle) {
                let directionToTarget = Math.sign(((this.getBoundingClientRect().left + this.getBoundingClientRect().right) / 2) -
                    ((this._target.getBoundingClientRect().right + this._target.getBoundingClientRect().right) / 2));
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
        this.addEventListener("pointerdown", (event) => {
            this.setPointerCapture(event.pointerId);
            this.addEventListener("pointermove", onPointerMove);
            this.addEventListener("pointerup", (event) => {
                this.removeEventListener("pointermove", onPointerMove);
                this.releasePointerCapture(event.pointerId);
            }, { once: true });
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
};
HTMLEWidthSashElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-wsash",
        observedAttributes: ["controls"]
    }),
    GenerateAttributeAccessors([
        { name: "controls", type: "string" },
    ])
], HTMLEWidthSashElementBase);
//# sourceMappingURL=WidthSash.js.map