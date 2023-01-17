var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty } from "../../Element";
export { HTMLEWidthSashElement };
var style;
let HTMLEWidthSashElementBase = class HTMLEWidthSashElementBase extends HTMLElement {
    get target() {
        return this.#target;
    }
    #target;
    #onCapture;
    #queuedPointerCallback;
    #pointerMovement;
    static {
        style = /*css*/ `
            :host {
                display: block;
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                transition-property: opacity;
                transition-delay: 0.2s;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
                
                width: 2px;
                cursor: ew-resize;
            }
        `;
    }
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
    setWidth(width) {
        const target = this.#target;
        if (target !== null) {
            const { max } = this;
            const { style } = target;
            style.setProperty("width", `${width}px`);
            if (max) {
                style.setProperty("max-width", `${width}px`);
            }
        }
    }
    #pointerMoveCallback() {
        const target = this.#target;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const { growdir } = this;
            const movementX = this.#pointerMovement;
            const width = parseFloat(targetComputedStyle.getPropertyValue("width"));
            const newWidth = width + (growdir == "right" ? 1 : -1) * movementX;
            this.setWidth(newWidth);
            this.dispatchEvent(new Event("resize"));
        }
        this.#pointerMovement = 0;
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
                this.#queuedPointerCallback = this.#pointerMoveCallback.bind(this);
                requestAnimationFrame(this.#queuedPointerCallback);
            }
            this.#pointerMovement += event.movementX;
        }
    }
    #handlePointerUpEvent(event) {
        const { pointerId } = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }
};
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEWidthSashElementBase.prototype, "controls", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "right" })
], HTMLEWidthSashElementBase.prototype, "growdir", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEWidthSashElementBase.prototype, "max", void 0);
HTMLEWidthSashElementBase = __decorate([
    CustomElement({
        name: "e-wsash"
    })
], HTMLEWidthSashElementBase);
var HTMLEWidthSashElement = HTMLEWidthSashElementBase;
//# sourceMappingURL=WidthSash.js.map