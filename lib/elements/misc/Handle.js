var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../stylesheets/Theme";
import { CustomElement, AttributeProperty } from "../Element";
export { HTMLEHandleElement };
var style;
let HTMLEHandleElementBase = class HTMLEHandleElementBase extends HTMLElement {
    #target;
    #onCapture;
    static {
        style = /*css*/ `
            :host {
                display: block;
                            
                width: 24px;
                height: 12px;
                
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});

                -webkit-mask-image: url("/assets/dots.png");
                mask-image: url("/assets/dots.png");

                -webkit-mask-repeat: repeat;
                mask-repeat: repeat;
                cursor: move;
            }
        `;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.#target = null;
        this.#onCapture = false;
        this.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        this.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        this.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "controls": {
                const { controls } = this;
                this.#target = document.getElementById(controls);
                break;
            }
        }
    }
    #handlePointerUpEvent(event) {
        const { pointerId } = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }
    #handlePointerDownEvent(event) {
        const { pointerId } = event;
        const { controls } = this;
        this.#target = document.getElementById(controls);
        this.setPointerCapture(pointerId);
        this.#onCapture = true;
    }
    #handlePointerMoveEvent(event) {
        if (this.#onCapture) {
            const target = this.#target;
            if (target !== null) {
                const targetComputedStyle = window.getComputedStyle(target);
                const { movementX, movementY } = event;
                const { width: rectWidth, height: rectHeight } = target.getBoundingClientRect();
                const outerElement = target.parentElement ?? document.body;
                const { left: outerRectLeft, right: outerRectRight, top: outerRectTop, bottom: outerRectBottom } = outerElement.getBoundingClientRect();
                const left = parseFloat(targetComputedStyle.getPropertyValue("left"));
                const newLeft = Math.max(outerRectLeft, Math.min(Math.trunc(left + movementX), outerRectRight - rectWidth));
                const top = parseFloat(targetComputedStyle.getPropertyValue("top"));
                const newTop = Math.max(outerRectTop, Math.min(Math.trunc(top + movementY), outerRectBottom - rectHeight));
                target.style.setProperty("left", `${newLeft}px`);
                target.style.setProperty("top", `${newTop}px`);
                this.dispatchEvent(new CustomEvent("move"));
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