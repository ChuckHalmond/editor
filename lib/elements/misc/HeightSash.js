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
var _HTMLEHeightSashElementBase_instances, _HTMLEHeightSashElementBase_target, _HTMLEHeightSashElementBase_onCapture, _HTMLEHeightSashElementBase_queuedPointerCallback, _HTMLEHeightSashElementBase_pointerMovement, _HTMLEHeightSashElementBase_pointerMoveCallback, _HTMLEHeightSashElementBase_handlePointerDownEvent, _HTMLEHeightSashElementBase_handlePointerMoveEvent, _HTMLEHeightSashElementBase_handlePointerUpEvent;
import { DEFAULT_SELECTED_ITEM_COLOR } from "../../stylesheets/Theme";
import { CustomElement, AttributeProperty } from "../Element";
export { HTMLEHeightSashElement };
var style;
let HTMLEHeightSashElementBase = class HTMLEHeightSashElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEHeightSashElementBase_instances.add(this);
        _HTMLEHeightSashElementBase_target.set(this, void 0);
        _HTMLEHeightSashElementBase_onCapture.set(this, void 0);
        _HTMLEHeightSashElementBase_queuedPointerCallback.set(this, void 0);
        _HTMLEHeightSashElementBase_pointerMovement.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_target, null, "f");
        __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_queuedPointerCallback, null, "f");
        __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_pointerMovement, 0, "f");
        __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_onCapture, false, "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.addEventListener("pointerdown", __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_instances, "m", _HTMLEHeightSashElementBase_handlePointerDownEvent).bind(this));
        this.addEventListener("pointermove", __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_instances, "m", _HTMLEHeightSashElementBase_handlePointerMoveEvent).bind(this));
        this.addEventListener("pointerup", __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_instances, "m", _HTMLEHeightSashElementBase_handlePointerUpEvent).bind(this));
    }
    get target() {
        return __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_target, "f");
    }
};
_HTMLEHeightSashElementBase_target = new WeakMap(), _HTMLEHeightSashElementBase_onCapture = new WeakMap(), _HTMLEHeightSashElementBase_queuedPointerCallback = new WeakMap(), _HTMLEHeightSashElementBase_pointerMovement = new WeakMap(), _HTMLEHeightSashElementBase_instances = new WeakSet(), _HTMLEHeightSashElementBase_pointerMoveCallback = function _HTMLEHeightSashElementBase_pointerMoveCallback() {
    const target = __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_target, "f");
    if (target !== null) {
        const targetComputedStyle = window.getComputedStyle(target);
        const { style } = target;
        const { growdir } = this;
        const movementY = __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_pointerMovement, "f");
        const height = parseFloat(targetComputedStyle.getPropertyValue("height"));
        const newHeight = Math.trunc(height + (growdir == "top" ? -1 : 1) * movementY);
        style.setProperty("height", `${newHeight}px`);
        const computedNewHeight = parseFloat(targetComputedStyle.getPropertyValue("height"));
        style.setProperty("height", `${computedNewHeight}px`);
        this.dispatchEvent(new Event("resize"));
    }
    __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_queuedPointerCallback, null, "f");
}, _HTMLEHeightSashElementBase_handlePointerDownEvent = function _HTMLEHeightSashElementBase_handlePointerDownEvent(event) {
    const { pointerId } = event;
    const { controls } = this;
    const rootNode = this.getRootNode();
    __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_target, rootNode.getElementById(controls), "f");
    this.setPointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_onCapture, true, "f");
}, _HTMLEHeightSashElementBase_handlePointerMoveEvent = function _HTMLEHeightSashElementBase_handlePointerMoveEvent(event) {
    if (__classPrivateFieldGet(this, _HTMLEHeightSashElementBase_onCapture, "f")) {
        if (__classPrivateFieldGet(this, _HTMLEHeightSashElementBase_queuedPointerCallback, "f") == null) {
            __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_pointerMovement, event.movementY, "f");
            __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_queuedPointerCallback, __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_instances, "m", _HTMLEHeightSashElementBase_pointerMoveCallback).bind(this), "f");
            requestAnimationFrame(__classPrivateFieldGet(this, _HTMLEHeightSashElementBase_queuedPointerCallback, "f"));
        }
        else {
            __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_pointerMovement, __classPrivateFieldGet(this, _HTMLEHeightSashElementBase_pointerMovement, "f") + event.movementY, "f");
        }
    }
}, _HTMLEHeightSashElementBase_handlePointerUpEvent = function _HTMLEHeightSashElementBase_handlePointerUpEvent(event) {
    const { pointerId } = event;
    this.releasePointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEHeightSashElementBase_onCapture, false, "f");
};
(() => {
    style = /*css*/ `
            :host {
                display: block;
                background-color: ${DEFAULT_SELECTED_ITEM_COLOR};
                transition-property: opacity;
                transition-delay: 0.2s;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
                
                height: 2px;
                cursor: ns-resize;
            }
        `;
})();
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