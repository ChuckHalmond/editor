var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { AttributeProperty, CustomElement } from "../../Element";
export { HTMLEHeightSashElement };
var style;
let HTMLEHeightSashElementBase = class HTMLEHeightSashElementBase extends HTMLElement {
    get target() {
        return this.#target;
    }
    static {
        style = /*css*/ `
            :host {
                display: block;
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                transition-property: opacity;
                transition-delay: 0.2s;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
                
                height: 2px;
                cursor: ns-resize;
            }
        `;
    }
    #target;
    #onCapture;
    #queuedPointerCallback;
    #pointerMovement;
    constructor() {
        super();
        this.#target = null;
        this.#queuedPointerCallback = null;
        this.#pointerMovement = 0;
        this.#onCapture = false;
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        this.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        this.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
    }
    #pointerMoveCallback() {
        const target = this.#target;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const { style } = target;
            const { growdir } = this;
            const movementY = this.#pointerMovement;
            const height = parseFloat(targetComputedStyle.getPropertyValue("height"));
            const newHeight = Math.trunc(height + (growdir == "top" ? -1 : 1) * movementY);
            style.setProperty("height", `${newHeight}px`);
            const computedNewHeight = parseFloat(targetComputedStyle.getPropertyValue("height"));
            style.setProperty("height", `${computedNewHeight}px`);
            this.dispatchEvent(new Event("resize"));
        }
        this.#queuedPointerCallback = null;
    }
    #handlePointerDownEvent(event) {
        const { pointerId } = event;
        const { controls } = this;
        const rootNode = this.getRootNode();
        this.#target = rootNode.getElementById(controls);
        this.setPointerCapture(pointerId);
        this.#onCapture = true;
    }
    #handlePointerMoveEvent(event) {
        if (this.#onCapture) {
            if (this.#queuedPointerCallback == null) {
                this.#pointerMovement = event.movementY;
                this.#queuedPointerCallback = this.#pointerMoveCallback.bind(this);
                requestAnimationFrame(this.#queuedPointerCallback);
            }
            else {
                this.#pointerMovement += event.movementY;
            }
        }
    }
    #handlePointerUpEvent(event) {
        const { pointerId } = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEHeightSashElementBase.prototype, "controls", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "top" })
], HTMLEHeightSashElementBase.prototype, "growdir", void 0);
HTMLEHeightSashElementBase = __decorate([
    CustomElement({
        name: "e-hsash"
    })
], HTMLEHeightSashElementBase);
var HTMLEHeightSashElement = HTMLEHeightSashElementBase;
//# sourceMappingURL=HeightSash.js.map