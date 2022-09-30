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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HTMLELoaderElementBase_instances, _HTMLELoaderElementBase_promise, _HTMLELoaderElementBase_updateTemplate;
import { CustomElement, AttributeProperty, element } from "../Element";
export { HTMLELoaderElement };
var barShadowTemplate;
var circleShadowTemplate;
let HTMLELoaderElementBase = class HTMLELoaderElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLELoaderElementBase_instances.add(this);
        _HTMLELoaderElementBase_promise.set(this, void 0);
        this.attachShadow({ mode: "open" });
        __classPrivateFieldGet(this, _HTMLELoaderElementBase_instances, "m", _HTMLELoaderElementBase_updateTemplate).call(this);
        __classPrivateFieldSet(this, _HTMLELoaderElementBase_promise, null, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "type": {
                __classPrivateFieldGet(this, _HTMLELoaderElementBase_instances, "m", _HTMLELoaderElementBase_updateTemplate).call(this);
                break;
            }
        }
    }
    set promise(promise) {
        if (promise) {
            promise.finally(() => {
                this.remove();
            });
        }
        __classPrivateFieldSet(this, _HTMLELoaderElementBase_promise, promise, "f");
    }
    get promise() {
        return __classPrivateFieldGet(this, _HTMLELoaderElementBase_promise, "f");
    }
};
_HTMLELoaderElementBase_promise = new WeakMap(), _HTMLELoaderElementBase_instances = new WeakSet(), _HTMLELoaderElementBase_updateTemplate = function _HTMLELoaderElementBase_updateTemplate() {
    const { type, shadowRoot } = this;
    switch (type) {
        case "circle": {
            shadowRoot.replaceChildren(circleShadowTemplate.content.cloneNode(true));
            break;
        }
        case "bar": {
            shadowRoot.replaceChildren(barShadowTemplate.content.cloneNode(true));
            break;
        }
    }
};
(() => {
    const commonStyle = element("style", {
        children: [
            /*css*/ `
                    :host {
                        display: inline-block;
                        --default-loader-color: rgb(0, 128, 255);
                        --default-animation-duration: 2s;
                    }
                `
        ]
    });
    const barStyle = commonStyle.cloneNode(true);
    const circleStyle = commonStyle.cloneNode(true);
    barStyle.textContent += /*css*/ `
            :host {
                display: block;
            }

            [part="bar"] {
                position: relative;
                display: block;
                overflow: hidden;
                height: 6px;
                width: 100%;
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
                animation-duration: var(--animation-duration, var(--default-animation-duration));
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }

            [part="cursor"] {
                display: block;
                width: 128px;
                background-color: var(--loader-color, var(--default-loader-color));
                animation-name: cursor;
            }

            [part="bar"]:after {
                animation-name: shine;
                animation-duration: var(--animation-duration, var(--default-animation-duration));
                animation-iteration-count: infinite;
                animation-fill-mode: forwards;  
                content: "";
                position: absolute;
                left: -100%;
                width: 100%;
                height: 100%;
                top: 0;
                opacity: 0;
                
                background: rgba(255, 255, 255, 0.13);
                background: linear-gradient(
                    to right, 
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.1) 10%,
                    rgba(255, 255, 255, 0.9) 80%,
                    rgba(255, 255, 255, 0) 100%
                );
            }

            @keyframes shine {
                25% {
                    opacity: 1;
                    left: -100%;
                }
                100% {
                    opacity: 0;
                    left: 100%;
                }
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
        `;
    circleStyle.textContent += /*css*/ `
            :host {
                display: inline-block;
            }

            [part="circle"] {
                width: 12px;
                height: 12px;
                border-top: 4px solid var(--loader-color, var(--default-loader-color));
                border-right: 4px solid var(--loader-color, var(--default-loader-color));
                border-left: 4px solid transparent;
                border-bottom: 4px solid transparent;
                border-radius: 50%;
                animation-duration: 1s;
                animation-name: circle;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }

            @keyframes circle {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
    barShadowTemplate = element("template");
    barShadowTemplate.content.append(barStyle, element("div", {
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
    circleShadowTemplate = element("template");
    circleShadowTemplate.content.append(circleStyle, element("div", {
        attributes: {
            part: "circle"
        }
    }));
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