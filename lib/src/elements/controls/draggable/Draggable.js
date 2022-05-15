var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
export { HTMLEDraggableElement };
let HTMLEDraggableElementBase = class HTMLEDraggableElementBase extends HTMLElement {
    selected;
    dragovered;
    dragged;
    disabled;
    #referee;
    references;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
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
                    `
            }
        }), HTML("div", {
            part: ["container"],
            children: [
                HTML("slot", {
                    properties: {
                        textContent: "&nbsp;"
                    }
                })
            ]
        }));
        this.references = [];
        this.#referee = null;
    }
    get referee() {
        return this.#referee;
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }
    disconnectedCallback() {
        if (this.referee) {
            const thisRefIndex = this.referee.references.indexOf(this);
            if (thisRefIndex > -1) {
                this.referee.references.splice(thisRefIndex, 1);
            }
        }
    }
    getReference() {
        const reference = this.cloneNode(true);
        reference.#referee = this;
        return reference;
    }
};
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEDraggableElementBase.prototype, "selected", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEDraggableElementBase.prototype, "dragovered", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEDraggableElementBase.prototype, "dragged", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEDraggableElementBase.prototype, "disabled", void 0);
HTMLEDraggableElementBase = __decorate([
    CustomElement({
        name: "e-draggable"
    })
], HTMLEDraggableElementBase);
var HTMLEDraggableElement = HTMLEDraggableElementBase;
//# sourceMappingURL=Draggable.js.map