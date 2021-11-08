var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";
export { HTMLEHeightSashElement };
let HTMLEHeightSashElementBase = class HTMLEHeightSashElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
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
            </style>
        `);
        this._target = null;
        this._targetStyle = null;
    }
    static get observedAttributes() {
        return ["controls"];
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        let onPointerMove = (event) => {
            if (this._target && this._targetStyle) {
                let height = parseFloat(this._targetStyle.getPropertyValue("height"));
                let newHeight = Math.trunc(height + ((this.growdir === "top") ? -1 : 1) * event.movementY);
                this._target.style.setProperty("height", `${newHeight}px`);
                this.dispatchEvent(new CustomEvent("e_resize"));
            }
        };
        this.addEventListener("pointerdown", (event) => {
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
        name: "e-hsash"
    }),
    GenerateAttributeAccessors([
        { name: "controls", type: "string" },
        { name: "growdir", type: "string" },
    ])
], HTMLEHeightSashElementBase);
var HTMLEHeightSashElement = HTMLEHeightSashElementBase;
//# sourceMappingURL=HeightSash.js.map