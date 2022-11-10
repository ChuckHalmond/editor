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
var _HTMLEHandleElementBase_instances, _HTMLEHandleElementBase_target, _HTMLEHandleElementBase_onCapture, _HTMLEHandleElementBase_handlePointerUpEvent, _HTMLEHandleElementBase_handlePointerDownEvent, _HTMLEHandleElementBase_handlePointerMoveEvent;
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../stylesheets/Theme";
import { CustomElement, AttributeProperty } from "../Element";
export { HTMLEHandleElement };
var style;
let HTMLEHandleElementBase = class HTMLEHandleElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEHandleElementBase_instances.add(this);
        _HTMLEHandleElementBase_target.set(this, void 0);
        _HTMLEHandleElementBase_onCapture.set(this, void 0);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        __classPrivateFieldSet(this, _HTMLEHandleElementBase_target, null, "f");
        __classPrivateFieldSet(this, _HTMLEHandleElementBase_onCapture, false, "f");
        this.addEventListener("pointerdown", __classPrivateFieldGet(this, _HTMLEHandleElementBase_instances, "m", _HTMLEHandleElementBase_handlePointerDownEvent).bind(this));
        this.addEventListener("pointermove", __classPrivateFieldGet(this, _HTMLEHandleElementBase_instances, "m", _HTMLEHandleElementBase_handlePointerMoveEvent).bind(this));
        this.addEventListener("pointerup", __classPrivateFieldGet(this, _HTMLEHandleElementBase_instances, "m", _HTMLEHandleElementBase_handlePointerUpEvent).bind(this));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "controls": {
                const { controls } = this;
                __classPrivateFieldSet(this, _HTMLEHandleElementBase_target, document.getElementById(controls), "f");
                break;
            }
        }
    }
};
_HTMLEHandleElementBase_target = new WeakMap(), _HTMLEHandleElementBase_onCapture = new WeakMap(), _HTMLEHandleElementBase_instances = new WeakSet(), _HTMLEHandleElementBase_handlePointerUpEvent = function _HTMLEHandleElementBase_handlePointerUpEvent(event) {
    const { pointerId } = event;
    this.releasePointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEHandleElementBase_onCapture, false, "f");
}, _HTMLEHandleElementBase_handlePointerDownEvent = function _HTMLEHandleElementBase_handlePointerDownEvent(event) {
    const { pointerId } = event;
    const { controls } = this;
    __classPrivateFieldSet(this, _HTMLEHandleElementBase_target, document.getElementById(controls), "f");
    this.setPointerCapture(pointerId);
    __classPrivateFieldSet(this, _HTMLEHandleElementBase_onCapture, true, "f");
}, _HTMLEHandleElementBase_handlePointerMoveEvent = function _HTMLEHandleElementBase_handlePointerMoveEvent(event) {
    if (__classPrivateFieldGet(this, _HTMLEHandleElementBase_onCapture, "f")) {
        const target = __classPrivateFieldGet(this, _HTMLEHandleElementBase_target, "f");
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
};
(() => {
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
})();
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