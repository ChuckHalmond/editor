var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";
export { HTMLEHeightSashElementBase };
let HTMLEHeightSashElementBase = class HTMLEHeightSashElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
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
    connectedCallback() {
        let onPointerMove = (event) => {
            if (this._target && this._targetStyle) {
                let directionToTarget = Math.sign(((this.getBoundingClientRect().top + this.getBoundingClientRect().bottom) / 2) -
                    ((this._target.getBoundingClientRect().top + this._target.getBoundingClientRect().bottom) / 2));
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
HTMLEHeightSashElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-hsash",
        observedAttributes: ["controls"]
    }),
    GenerateAttributeAccessors([
        { name: "controls", type: "string" },
    ])
], HTMLEHeightSashElementBase);
//# sourceMappingURL=HeightSash.js.map