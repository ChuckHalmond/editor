var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTMLEWidthSashElementBase_instances, _HTMLEWidthSashElementBase_target, _HTMLEWidthSashElementBase_onCapture, _HTMLEWidthSashElementBase_queuedPointerCallback, _HTMLEWidthSashElementBase_pointerMovement, _HTMLEWidthSashElementBase_pointerMoveCallback, _HTMLEWidthSashElementBase_handlePointerDownEvent, _HTMLEWidthSashElementBase_handlePointerMoveEvent, _HTMLEWidthSashElementBase_handlePointerUpEvent;
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty } from "../../Element";
export { HTMLEWidthSashElement };
var style;
let HTMLEWidthSashElementBase = class HTMLEWidthSashElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEWidthSashElementBase_instances.add(this);
        _HTMLEWidthSashElementBase_target.set(this, void 0);
        _HTMLEWidthSashElementBase_onCapture.set(this, void 0);
        _HTMLEWidthSashElementBase_queuedPointerCallback.set(this, void 0);
        _HTMLEWidthSashElementBase_pointerMovement.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_target, null, "f");
        __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_queuedPointerCallback, null, "f");
        __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_pointerMovement, 0, "f");
        __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_onCapture, false, "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.addEventListener("pointerdown", __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_instances, "m", _HTMLEWidthSashElementBase_handlePointerDownEvent).bind(this));
        this.addEventListener("pointermove", __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_instances, "m", _HTMLEWidthSashElementBase_handlePointerMoveEvent).bind(this));
        this.addEventListener("pointerup", __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_instances, "m", _HTMLEWidthSashElementBase_handlePointerUpEvent).bind(this));
    }
    get target() {
        return __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_target, "f");
    }
    setWidth(width) {
        const target = __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_target, "f");
        if (target !== null) {
            const { max } = this;
            const { style } = target;
            style.setProperty("width", `${width}px`);
            if (max) {
                style.setProperty("max-width", `${width}px`);
            }
        }
    }
};
_HTMLEWidthSashElementBase_target = new WeakMap(), _HTMLEWidthSashElementBase_onCapture = new WeakMap(), _HTMLEWidthSashElementBase_queuedPointerCallback = new WeakMap(), _HTMLEWidthSashElementBase_pointerMovement = new WeakMap(), _HTMLEWidthSashElementBase_instances = new WeakSet(), _HTMLEWidthSashElementBase_pointerMoveCallback = function _HTMLEWidthSashElementBase_pointerMoveCallback() {
    const target = __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_target, "f");
    if (target !== null) {
        const targetComputedStyle = window.getComputedStyle(target);
        const { growdir } = this;
        const movementX = __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_pointerMovement, "f");
        const width = parseFloat(targetComputedStyle.getPropertyValue("width"));
        const newWidth = width + (growdir == "right" ? 1 : -1) * movementX;
        this.setWidth(newWidth);
        this.dispatchEvent(new Event("resize"));
    }
    __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_pointerMovement, 0, "f");
    __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_queuedPointerCallback, null, "f");
}, _HTMLEWidthSashElementBase_handlePointerDownEvent = function _HTMLEWidthSashElementBase_handlePointerDownEvent(event) {
    const { pointerId } = event;
    const { controls } = this;
    const rootNode = this.getRootNode();
    __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_target, rootNode.getElementById(controls), "f");
    this.setPointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_onCapture, true, "f");
}, _HTMLEWidthSashElementBase_handlePointerMoveEvent = function _HTMLEWidthSashElementBase_handlePointerMoveEvent(event) {
    if (__classPrivateFieldGet(this, _HTMLEWidthSashElementBase_onCapture, "f")) {
        if (__classPrivateFieldGet(this, _HTMLEWidthSashElementBase_queuedPointerCallback, "f") == null) {
            __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_queuedPointerCallback, __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_instances, "m", _HTMLEWidthSashElementBase_pointerMoveCallback).bind(this), "f");
            requestAnimationFrame(__classPrivateFieldGet(this, _HTMLEWidthSashElementBase_queuedPointerCallback, "f"));
        }
        __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_pointerMovement, __classPrivateFieldGet(this, _HTMLEWidthSashElementBase_pointerMovement, "f") + event.movementX, "f");
    }
}, _HTMLEWidthSashElementBase_handlePointerUpEvent = function _HTMLEWidthSashElementBase_handlePointerUpEvent(event) {
    const { pointerId } = event;
    this.releasePointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEWidthSashElementBase_onCapture, false, "f");
};
(() => {
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
})();
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