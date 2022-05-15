var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../Element";
export { HTMLEHandleElement };
let HTMLEHandleElementBase = class HTMLEHandleElementBase extends HTMLElement {
    controls;
    #target;
    #targetStyle;
    shadowRoot;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: block;
                            
                            width: 24px;
                            height: 12px;
                            
                            background-color: rgb(0, 128, 255);

                            -webkit-mask-image: url("assets/dots.png");
                            mask-image: url("assets/dots.png");

                            -webkit-mask-repeat: repeat;
                            mask-repeat: repeat;
                            cursor: move;
                        }
                    `
            }
        }));
        this.#target = null;
        this.#targetStyle = null;
    }
    connectedCallback() {
        const onPointerMove = (event) => {
            const target = this.#target;
            const targetStyle = this.#targetStyle;
            if (target && targetStyle) {
                const { movementX, movementY } = event;
                const { width: rectWidth, height: rectHeight } = target.getBoundingClientRect();
                const outerElement = target.parentElement ?? document.documentElement;
                const { left: outerRectLeft, right: outerRectRight, top: outerRectTop, bottom: outerRectBottom } = outerElement.getBoundingClientRect();
                const left = parseFloat(targetStyle.getPropertyValue("left"));
                const newLeft = Math.max(outerRectLeft, Math.min(Math.trunc(left + movementX), outerRectRight - rectWidth));
                const top = parseFloat(targetStyle.getPropertyValue("top"));
                const newTop = Math.max(outerRectTop, Math.min(Math.trunc(top + movementY), outerRectBottom - rectHeight));
                target.style.setProperty("left", `${newLeft}px`);
                target.style.setProperty("top", `${newTop}px`);
                this.dispatchEvent(new CustomEvent("move"));
            }
        };
        this.addEventListener("pointerdown", (event) => {
            const target = document.getElementById(this.controls);
            if (target && this.#target !== target) {
                this.#target = target;
                this.#targetStyle = window.getComputedStyle(target);
            }
            this.setPointerCapture(event.pointerId);
            this.addEventListener("pointermove", onPointerMove);
            this.addEventListener("pointerup", () => {
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
                            this.#target = target;
                            this.#targetStyle = window.getComputedStyle(target);
                        }
                    }
                    break;
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEHandleElementBase.prototype, "controls", void 0);
HTMLEHandleElementBase = __decorate([
    CustomElement({
        name: "e-handle"
    })
], HTMLEHandleElementBase);
var HTMLEHandleElement = HTMLEHandleElementBase;
//# sourceMappingURL=Handle.js.map