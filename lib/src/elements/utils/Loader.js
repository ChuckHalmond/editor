var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML, Fragment } from "../Element";
export { HTMLELoaderElementBase };
let HTMLELoaderElementBase = class HTMLELoaderElementBase extends HTMLElement {
    shadowRoot;
    type;
    #promise;
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.#promise = null;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "type":
                    if (!(oldValue === "bar" && newValue !== "circle")) {
                        this.#updateTypeShadowRoot();
                    }
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
        this.#promise = promise;
    }
    get promise() {
        return this.#promise;
    }
    #updateTypeShadowRoot() {
        const { type } = this;
        const template = Fragment(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: inline-block;
                            --default-loader-color: rgb(0, 128, 255);
                            --default-animation-duration: 2s;
                        }
                    `
            }
        }));
        switch (type) {
            case "circle":
                {
                    const style = template.querySelector("style");
                    style.textContent += /*css*/ `
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
                    template.append(HTML("div", {
                        part: ["circle"]
                    }));
                }
                break;
            case "bar":
            default:
                {
                    const style = template.querySelector("style");
                    style.textContent += /*css*/ `
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
                    template.append(HTML("div", {
                        part: ["bar"],
                        children: [
                            HTML("div", {
                                part: ["slider"],
                                children: [
                                    HTML("div", {
                                        part: ["cursor"]
                                    })
                                ]
                            })
                        ]
                    }));
                }
                break;
        }
        this.shadowRoot.replaceChildren(template);
    }
};
__decorate([
    AttributeProperty({ type: String, defaultValue: "bar", observed: true })
], HTMLELoaderElementBase.prototype, "type", void 0);
HTMLELoaderElementBase = __decorate([
    CustomElement({
        name: "e-loader"
    })
], HTMLELoaderElementBase);
//# sourceMappingURL=Loader.js.map