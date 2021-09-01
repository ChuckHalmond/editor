var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
export { HTMLEStatusItemElementBase };
let HTMLEStatusItemElementBase = class HTMLEStatusItemElementBase extends HTMLElement {
    // TODO: Add sync with Promise (icons, etc.)
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    background-color: white;
                }

                :host(:focus-visible) {
                    outline: none;
                }

                :host(:hover),
                :host([active]) {
                    background-color: rgb(180, 180, 180);
                }
                
                li {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }
            </style>
            <li>
                <slot></slot>
            </li>
        `);
        this.command = null;
        this._stateMap = null;
    }
    get stateMap() {
        return this._stateMap;
    }
    set stateMap(stateMap) {
        this._stateMap = stateMap;
    }
    update(newValue) {
        const { content } = (typeof this.stateMap === "function") ? this.stateMap(newValue) : newValue;
        this.textContent = content;
    }
    activate() {
        this.dispatchEvent(new CustomEvent("activate"));
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.addEventListener("click", (event) => {
            this.activate();
            event.stopPropagation();
        });
    }
};
HTMLEStatusItemElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-statusitem",
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "icon", type: "string" },
        { name: "type", type: "string" },
    ])
], HTMLEStatusItemElementBase);
//# sourceMappingURL=StatusItem.js.map