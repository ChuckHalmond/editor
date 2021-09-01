var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLELoaderElementBase = void 0;
    let HTMLELoaderElementBase = class HTMLELoaderElementBase extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                }
                
                :host([type="bar"]) {
                    display: inline-block;
                    width: 64px;
                }

                :host([type]:not([type="circle"])) [part~="circle"] {
                    display: none !important;
                }
                
                :host(:not([type="bar"])) [part~="bar"] {
                    display: none !important;
                }

                [part~="circle"] {
                    position: relative;
                    width: 12px;
                    height: 12px;
                    border-top: 4px solid var(--loader-color, rgb(0, 128, 255));
                    border-right: 4px solid var(--loader-color, rgb(0, 128, 255));
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

                [part~="bar"] {
                    display: block;
                    position: relative;
                    overflow: hidden;
                }

                [part~="slider"] {
                    position: relative;
                    display: flex;
                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: slider;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                [part~="cursor"] {
                    position: relative;
                    display: inline-block;
                    width: 32px;
                    height: 4px;
                    background-color: var(--loader-color, rgb(0, 128, 255));
                    border-radius: 4px;

                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: cursor;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes slider {
                    0% {
                        transform: translateX(0);
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
            </style>
            <div part="bar">
                <div part="slider">
                    <div part="cursor"></div>
                </div>
            </div>
            <div part="circle"></div>
        `);
            this._promise = null;
        }
        set promise(promise) {
            if (promise) {
                promise.finally(() => {
                    this.remove();
                });
            }
            this._promise = promise;
        }
        get promise() {
            return this._promise;
        }
    };
    HTMLELoaderElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-loader"
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "type", type: "string" }
        ])
    ], HTMLELoaderElementBase);
    exports.HTMLELoaderElementBase = HTMLELoaderElementBase;
});
//# sourceMappingURL=Loader.js.map