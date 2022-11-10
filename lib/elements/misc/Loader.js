var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTMLELoaderElementBase_instances, _HTMLELoaderElementBase_updateTemplate;
import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../Element";
export { HTMLELoaderElement };
var barShadowTemplate;
var spinnerShadowTemplate;
var style;
let HTMLELoaderElementBase = class HTMLELoaderElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLELoaderElementBase_instances.add(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.replaceChildren(barShadowTemplate.content.cloneNode(true));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "type": {
                __classPrivateFieldGet(this, _HTMLELoaderElementBase_instances, "m", _HTMLELoaderElementBase_updateTemplate).call(this);
                break;
            }
        }
    }
};
_HTMLELoaderElementBase_instances = new WeakSet(), _HTMLELoaderElementBase_updateTemplate = function _HTMLELoaderElementBase_updateTemplate() {
    const { type, shadowRoot } = this;
    switch (type) {
        case "spinner": {
            shadowRoot.replaceChildren(spinnerShadowTemplate.content.cloneNode(true));
            break;
        }
        case "bar": {
            shadowRoot.replaceChildren(barShadowTemplate.content.cloneNode(true));
            break;
        }
    }
};
(() => {
    barShadowTemplate = element("template");
    barShadowTemplate.content.append(element("div", {
        attributes: {
            part: "bar"
        },
        children: [
            element("div", {
                attributes: {
                    part: "slider"
                },
                children: [
                    element("div", {
                        attributes: {
                            part: "cursor"
                        }
                    })
                ]
            })
        ]
    }));
    spinnerShadowTemplate = element("template");
    spinnerShadowTemplate.content.append(element("div", {
        attributes: {
            part: "spinner"
        }
    }));
    style = /*css*/ `
            :host {
                display: inline-block;
            }

            :host(:is(:not([type]), [type="bar"])) {
                border: 1px solid gainsboro;
                border-radius: 4px;
            }
        
            [part="bar"] {
                position: relative;
                overflow: hidden;
                height: 6px;
                width: 100%;
                width: 86px;
                border-radius: 4px;
                background-color: whitesmoke;
            }
        
            [part="slider"] {
                display: flex;
                position: absolute;
                width: 100%;
                height: 100%;
                animation-name: slider;
            }
        
            [part="slider"],
            [part="cursor"] {
                border-radius: 4px;
                will-change: transform;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        
            [part="cursor"] {
                display: block;
                width: 32px;
                background-color: var(--theme-activated-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                animation-name: cursor;
            }
        
            :host([type="spinner"]) {
                display: inline-block;
                width: 20px;
                height: 20px;
            }
        
            [part="spinner"] {
                display: inline-block;
                width: 18px;
                height: 18px;
            }
        
            [part="spinner"]::after {
                content: "";
                display: block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border-width: 4px;
                border-style: solid;
                border-color: transparent var(--theme-activated-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                animation: spin 1.2s linear infinite;
            }
        
            @keyframes slider {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        
            @keyframes cursor {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        
            @keyframes spin {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String, defaultValue: "bar", observed: true })
], HTMLELoaderElementBase.prototype, "type", void 0);
HTMLELoaderElementBase = __decorate([
    CustomElement({
        name: "e-loader"
    })
], HTMLELoaderElementBase);
var HTMLELoaderElement = HTMLELoaderElementBase;
//# sourceMappingURL=Loader.js.map