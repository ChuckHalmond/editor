var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
export { HTMLEDraggableElementBase };
let HTMLEDraggableElementBase = class HTMLEDraggableElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    padding: 3px 4px;
                    cursor: pointer;
                    white-space: nowrap;
                    border-radius: 4px;
                    border: 1px solid black;
                    user-select: none;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }

                :host([selected]:active) {
                    cursor: grabbing;
                }
                
                :host([selected]) {
                    cursor: grab;
                    font-weight: bold;
                    outline: 1px auto black;
                }

                :host([dragovered]) {
                    border-style: dotted;
                }
                
                [part="container"] {
                    display: flex;
                    align-items: center;
                }
            </style>
            <div part="container">
                <slot>&nbsp;</slot>
            </div>
        `);
        this.data = null;
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }
};
HTMLEDraggableElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-draggable"
    }),
    GenerateAttributeAccessors([
        { name: "selected", type: "boolean" },
        { name: "dragged", type: "boolean" },
        { name: "dragovered", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "type", type: "string" },
        { name: "data", type: "json" }
    ])
], HTMLEDraggableElementBase);
//# sourceMappingURL=Draggable.js.map