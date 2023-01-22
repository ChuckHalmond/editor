var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, element } from "../Element";
export { HTMLEToolTipElement };
var shadowTemplate;
var style;
var HIDE_DELAY_MS = 100;
var SHOW_DELAY_MS = 200;
var ANIMATION_DURATION = 100;
let HTMLEToolTipElementBase = class HTMLEToolTipElementBase extends HTMLElement {
    get target() {
        return this.#target;
    }
    #target;
    #targetListenerObject;
    #documentListenerObject;
    #toggleAnimation;
    static {
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
                position: fixed;
                display: inline-block;
                z-index: 1;
                padding: 4px;
                border-radius: 3px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                pointer-events: none;
            }
            
            :host([hidden]) {
                display: none;
            }

            :host(:not([visible])) {
                opacity: 0;
            }
            
            [part="arrow"] {
                display: inline-block;
                position: fixed;
                z-index: 1;
                width: 4px;
                height: 4px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                border-width: 0 1px 1px 0;
            }
            
            :host(:is(:not([position]), [position="top"])) [part="arrow"] {
                transform: translate(-2px, -2px) rotate(45deg);
            }
            
            :host(:is([position="bottom"])) [part="arrow"] {
                transform: translate(-2px, -2px) rotate(225deg);
            }
            
            :host(:is([position="left"])) [part="arrow"] {
                transform: translate(-2px, -2px) rotate(315deg);
            }
            
            :host(:is([position="right"])) [part="arrow"] {
                transform: translate(-2px, -2px) rotate(135deg);
            }        
        `;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.#target = null;
        this.#toggleAnimation = null;
        this.#targetListenerObject = (function (tooltip) {
            return {
                handleEvent(event) {
                    const { type } = event;
                    switch (type) {
                        case "mouseenter": {
                            tooltip.#handleTargetMouseEnterEvent();
                            break;
                        }
                        case "mouseleave": {
                            tooltip.#handleTargetMouseLeaveEvent();
                            break;
                        }
                    }
                }
            };
        })(this);
        this.#documentListenerObject = (function (tooltip) {
            return {
                handleEvent(event) {
                    const { type } = event;
                    switch (type) {
                        case "keydown": {
                            tooltip.#handleDocumentKeyDownEvent(event);
                            break;
                        }
                    }
                }
            };
        })(this);
    }
    connectedCallback() {
        this.#setTarget();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "for": {
                this.#setTarget();
                break;
            }
        }
    }
    #setTarget() {
        const { htmlFor } = this;
        if (htmlFor) {
            const rootNode = this.getRootNode();
            if (rootNode instanceof Document || rootNode instanceof ShadowRoot) {
                const target = rootNode.getElementById(htmlFor);
                if (target !== null) {
                    const oldTarget = this.#target;
                    const targetListenerObject = this.#targetListenerObject;
                    if (oldTarget) {
                        oldTarget.removeEventListener("mouseenter", targetListenerObject);
                        oldTarget.removeEventListener("mouseleave", targetListenerObject);
                    }
                    target.addEventListener("mouseenter", targetListenerObject);
                    target.addEventListener("mouseleave", targetListenerObject);
                }
                this.#target = target;
            }
            this.#position();
        }
    }
    show(options) {
        const { immediate = false } = options ?? {};
        let toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation !== null) {
            const { id } = toggleAnimation;
            if (id === "hide") {
                toggleAnimation.cancel();
            }
            else if (!immediate) {
                return;
            }
        }
        if (!this.visible) {
            this.hidden = false;
            toggleAnimation = this.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                id: "show",
                delay: immediate ? 0 : SHOW_DELAY_MS,
                duration: immediate ? 0 : ANIMATION_DURATION
            });
            const { finished } = toggleAnimation;
            finished.then(() => {
                this.visible = true;
            }).catch(_ => void 0);
            this.#toggleAnimation = toggleAnimation;
            this.#position();
        }
        else {
            this.#toggleAnimation = null;
        }
    }
    hide(options) {
        const { immediate = false } = options ?? {};
        let toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation !== null) {
            const { id } = toggleAnimation;
            if (id === "show") {
                toggleAnimation.cancel();
            }
            else if (!immediate) {
                return;
            }
        }
        if (this.visible) {
            toggleAnimation = this.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                id: "hide",
                delay: immediate ? 0 : HIDE_DELAY_MS,
                duration: immediate ? 0 : ANIMATION_DURATION
            });
            const { finished } = toggleAnimation;
            finished.then(() => {
                this.visible = false;
                this.hidden = true;
            }).catch(_ => void 0);
            this.#toggleAnimation = toggleAnimation;
        }
        else {
            this.#toggleAnimation = null;
        }
    }
    #arrow() {
        return this.shadowRoot.querySelector("[part=arrow]");
    }
    #position() {
        const target = this.#target;
        if (target !== null) {
            const { top: targetTop, bottom: targetBottom, left: targetLeft, right: targetRight } = target.getBoundingClientRect();
            const { width: tooltipWidth, height: tooltipHeight } = this.getBoundingClientRect();
            const tooltipHalfWidth = tooltipWidth / 2;
            const tooltipHalfHeight = tooltipHeight / 2;
            const targetCenter = (targetRight + targetLeft) / 2;
            const targetMiddle = (targetBottom + targetTop) / 2;
            const { position, style: tooltipStyle } = this;
            const arrow = this.#arrow();
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
    }
    #handleTargetMouseEnterEvent() {
        this.show();
        const toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation) {
            const documentListenerObject = this.#documentListenerObject;
            const { finished } = toggleAnimation;
            finished.then(() => {
                document.addEventListener("keydown", documentListenerObject);
            }).catch(_ => void 0);
        }
    }
    #handleTargetMouseLeaveEvent() {
        this.hide();
        const toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation) {
            const documentListenerObject = this.#documentListenerObject;
            const { finished } = toggleAnimation;
            finished.then(() => {
                document.removeEventListener("keydown", documentListenerObject);
            }).catch(_ => void 0);
        }
    }
    #handleDocumentKeyDownEvent(event) {
        const { key } = event;
        switch (key) {
            case "Escape": {
                this.hide({
                    immediate: true
                });
                break;
            }
        }
    }
};
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