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
var _HTMLEToolTipElementBase_instances, _HTMLEToolTipElementBase_target, _HTMLEToolTipElementBase_targetListenerObject, _HTMLEToolTipElementBase_documentListenerObject, _HTMLEToolTipElementBase_toggleAnimation, _HTMLEToolTipElementBase_arrow, _HTMLEToolTipElementBase_setTarget, _HTMLEToolTipElementBase_position, _HTMLEToolTipElementBase_handleTargetMouseEnterEvent, _HTMLEToolTipElementBase_handleTargetMouseLeaveEvent, _HTMLEToolTipElementBase_handleDocumentKeyDownEvent;
import { CustomElement, AttributeProperty, element } from "../Element";
export { HTMLEToolTipElement };
var shadowTemplate;
var style;
var HIDE_DELAY_MS = 200;
var SHOW_DELAY_MS = 200;
let HTMLEToolTipElementBase = class HTMLEToolTipElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEToolTipElementBase_instances.add(this);
        _HTMLEToolTipElementBase_target.set(this, void 0);
        _HTMLEToolTipElementBase_targetListenerObject.set(this, void 0);
        _HTMLEToolTipElementBase_documentListenerObject.set(this, void 0);
        _HTMLEToolTipElementBase_toggleAnimation.set(this, void 0);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_target, null, "f");
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_toggleAnimation, null, "f");
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_targetListenerObject, (function (tooltip) {
            return {
                handleEvent(event) {
                    const { type } = event;
                    switch (type) {
                        case "mouseenter": {
                            __classPrivateFieldGet(tooltip, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_handleTargetMouseEnterEvent).call(tooltip);
                            break;
                        }
                        case "mouseleave": {
                            __classPrivateFieldGet(tooltip, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_handleTargetMouseLeaveEvent).call(tooltip);
                            break;
                        }
                    }
                }
            };
        })(this), "f");
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_documentListenerObject, (function (tooltip) {
            return {
                handleEvent(event) {
                    const { type } = event;
                    switch (type) {
                        case "keydown": {
                            __classPrivateFieldGet(tooltip, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_handleDocumentKeyDownEvent).call(tooltip, event);
                            break;
                        }
                    }
                }
            };
        })(this), "f");
    }
    get target() {
        return __classPrivateFieldGet(this, _HTMLEToolTipElementBase_target, "f");
    }
    connectedCallback() {
        const { htmlFor } = this;
        __classPrivateFieldGet(this, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_setTarget).call(this, htmlFor);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "for": {
                __classPrivateFieldGet(this, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_setTarget).call(this, newValue);
                break;
            }
        }
    }
    show() {
        this.visible = true;
        let toggleAnimation = __classPrivateFieldGet(this, _HTMLEToolTipElementBase_toggleAnimation, "f");
        if (toggleAnimation !== null) {
            const { id } = toggleAnimation;
            if (id === "hide") {
                toggleAnimation.cancel();
            }
        }
        toggleAnimation = this.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            id: "show",
            duration: SHOW_DELAY_MS
        });
        const { finished } = toggleAnimation;
        finished.then(() => {
            __classPrivateFieldSet(this, _HTMLEToolTipElementBase_toggleAnimation, null, "f");
        }, () => {
            this.visible = false;
        });
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_toggleAnimation, toggleAnimation, "f");
        __classPrivateFieldGet(this, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_position).call(this);
    }
    hide() {
        let toggleAnimation = __classPrivateFieldGet(this, _HTMLEToolTipElementBase_toggleAnimation, "f");
        if (toggleAnimation !== null) {
            const { id } = toggleAnimation;
            if (id === "show") {
                toggleAnimation.cancel();
            }
        }
        toggleAnimation = this.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            id: "hide",
            duration: HIDE_DELAY_MS
        });
        const { finished } = toggleAnimation;
        finished.then(() => {
            this.visible = false;
        }, () => {
            this.visible = true;
        });
        __classPrivateFieldSet(this, _HTMLEToolTipElementBase_toggleAnimation, toggleAnimation, "f");
    }
};
_HTMLEToolTipElementBase_target = new WeakMap(), _HTMLEToolTipElementBase_targetListenerObject = new WeakMap(), _HTMLEToolTipElementBase_documentListenerObject = new WeakMap(), _HTMLEToolTipElementBase_toggleAnimation = new WeakMap(), _HTMLEToolTipElementBase_instances = new WeakSet(), _HTMLEToolTipElementBase_arrow = function _HTMLEToolTipElementBase_arrow() {
    return this.shadowRoot.querySelector("[part=arrow]");
}, _HTMLEToolTipElementBase_setTarget = function _HTMLEToolTipElementBase_setTarget(id) {
    const target = id ? document.getElementById(id) : null;
    if (target !== null) {
        const oldTarget = __classPrivateFieldGet(this, _HTMLEToolTipElementBase_target, "f");
        if (oldTarget) {
            oldTarget.removeEventListener("mouseenter", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_targetListenerObject, "f"));
            oldTarget.removeEventListener("mouseleave", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_targetListenerObject, "f"));
        }
        target.addEventListener("mouseenter", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_targetListenerObject, "f"));
        target.addEventListener("mouseleave", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_targetListenerObject, "f"));
    }
    __classPrivateFieldSet(this, _HTMLEToolTipElementBase_target, target, "f");
}, _HTMLEToolTipElementBase_position = function _HTMLEToolTipElementBase_position() {
    const target = __classPrivateFieldGet(this, _HTMLEToolTipElementBase_target, "f");
    if (target !== null) {
        const { top: targetTop, bottom: targetBottom, left: targetLeft, right: targetRight } = target.getBoundingClientRect();
        const { width: tooltipWidth, height: tooltipHeight } = this.getBoundingClientRect();
        const tooltipHalfWidth = tooltipWidth / 2;
        const tooltipHalfHeight = tooltipHeight / 2;
        const targetCenter = (targetRight + targetLeft) / 2;
        const targetMiddle = (targetBottom + targetTop) / 2;
        const { position, style: tooltipStyle } = this;
        const arrow = __classPrivateFieldGet(this, _HTMLEToolTipElementBase_instances, "m", _HTMLEToolTipElementBase_arrow).call(this);
        const { style: arrowStyle } = arrow;
        const { width: arrowWidth, height: arrowHeight } = arrow.getBoundingClientRect();
        const arrowHalfWidth = arrowWidth / 2;
        const arrowHalfHeight = arrowHeight / 2;
        const { clientWidth } = document.body;
        switch (position) {
            case "top": {
                tooltipStyle.setProperty("top", `${targetTop - tooltipHeight - arrowHalfHeight}px`);
                tooltipStyle.setProperty("left", `${Math.max(0, Math.min(targetCenter - tooltipHalfWidth, clientWidth - tooltipWidth))}px`);
                arrowStyle.setProperty("top", `${targetTop - arrowHalfHeight}px`);
                arrowStyle.setProperty("left", `${targetCenter}px`);
                break;
            }
            case "bottom": {
                tooltipStyle.setProperty("top", `${targetBottom + arrowHalfHeight}px`);
                tooltipStyle.setProperty("left", `${Math.max(0, Math.min(targetCenter - tooltipHalfWidth, clientWidth - tooltipWidth))}px`);
                arrowStyle.setProperty("top", `${targetBottom + arrowHalfHeight}px`);
                arrowStyle.setProperty("left", `${targetCenter}px`);
                break;
            }
            case "left": {
                tooltipStyle.setProperty("top", `${targetMiddle - tooltipHalfHeight}px`);
                tooltipStyle.setProperty("left", `${targetLeft - tooltipWidth - arrowHalfWidth}px`);
                arrowStyle.setProperty("top", `${targetMiddle}px`);
                arrowStyle.setProperty("left", `${targetLeft - arrowHalfWidth}px`);
                break;
            }
            case "right": {
                tooltipStyle.setProperty("top", `${targetMiddle - tooltipHalfHeight}px`);
                tooltipStyle.setProperty("left", `${targetRight + arrowHalfWidth}px`);
                arrowStyle.setProperty("top", `${targetMiddle}px`);
                arrowStyle.setProperty("left", `${targetRight + arrowHalfWidth}px`);
                break;
            }
        }
    }
}, _HTMLEToolTipElementBase_handleTargetMouseEnterEvent = function _HTMLEToolTipElementBase_handleTargetMouseEnterEvent() {
    this.show();
    document.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_documentListenerObject, "f"));
}, _HTMLEToolTipElementBase_handleTargetMouseLeaveEvent = function _HTMLEToolTipElementBase_handleTargetMouseLeaveEvent() {
    this.hide();
    document.removeEventListener("keydown", __classPrivateFieldGet(this, _HTMLEToolTipElementBase_documentListenerObject, "f"));
}, _HTMLEToolTipElementBase_handleDocumentKeyDownEvent = function _HTMLEToolTipElementBase_handleDocumentKeyDownEvent(event) {
    const { key } = event;
    switch (key) {
        case "Escape": {
            this.hide();
            break;
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("div", {
        attributes: {
            part: "container"
        },
        children: [
            element("span", {
                attributes: {
                    part: "arrow"
                }
            }),
            element("slot")
        ]
    }));
    style = /*css*/ `
            :host {
                display: inline-block;
                position: fixed;
                padding: 4px;
                border-radius: 4px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                pointer-events: none;
            }
            
            :host(:not([visible])) {
                display: none;
            }
            
            [part="arrow"] {
                display: inline-block;
                position: fixed;
                z-index: 1;
                width: 6px;
                height: 6px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                border-width: 0 1px 1px 0;
            }
            
            :host(:is(:not([position]), [position="top"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(45deg);
            }
            
            :host(:is([position="bottom"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(225deg);
            }
            
            :host(:is([position="left"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(315deg);
            }
            
            :host(:is([position="right"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(135deg);
            }        
        `;
})();
__decorate([
    AttributeProperty({ type: String, observed: true, name: "for" })
], HTMLEToolTipElementBase.prototype, "htmlFor", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "top" })
], HTMLEToolTipElementBase.prototype, "position", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolTipElementBase.prototype, "visible", void 0);
HTMLEToolTipElementBase = __decorate([
    CustomElement({
        name: "e-tooltip"
    })
], HTMLEToolTipElementBase);
var HTMLEToolTipElement = HTMLEToolTipElementBase;
//# sourceMappingURL=ToolTip.js.map