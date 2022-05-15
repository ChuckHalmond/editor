var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../Element";
let HTMLEWidthSashElementBase = class HTMLEWidthSashElementBase extends HTMLElement {
    controls;
    growdir;
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
        }));
        this.#target = null;
        this.#targetStyle = null;
    }
    connectedCallback() {
        const onPointerMove = (event) => {
            const target = this.#target;
            const targetStyle = this.#targetStyle;
            if (target && targetStyle) {
                const { growdir } = this;
                const { movementX } = event;
                const width = parseFloat(targetStyle.getPropertyValue("width"));
                const newWidth = Math.trunc(width + ((growdir === "left") ? -1 : 1) * movementX);
                target.style.setProperty("width", `${newWidth}px`);
                this.dispatchEvent(new CustomEvent("resize"));
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
                        const { controls } = this;
                        const target = document.getElementById(controls);
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
], HTMLEWidthSashElementBase.prototype, "controls", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEWidthSashElementBase.prototype, "growdir", void 0);
HTMLEWidthSashElementBase = __decorate([
    CustomElement({
        name: "e-wsash"
    })
], HTMLEWidthSashElementBase);
var HTMLEHeightSashElement = HTMLEWidthSashElementBase;
//# sourceMappingURL=WidthSash.js.map