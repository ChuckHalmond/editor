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
var _HTMLEDraggableElementBase_referee;
import { CustomElement, AttributeProperty, element } from "../../Element";
export { HTMLEDraggableElement };
let HTMLEDraggableElementBase = class HTMLEDraggableElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEDraggableElementBase_referee.set(this, void 0);
        this.attachShadow({ mode: "open" }).append(element("style", {
            children: [
                /*css*/ `
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
                            color: lightgray;
                            border-color: lightgray;
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
            ]
        }), element("div", {
            attributes: {
                part: "container"
            },
            children: [
                element("slot", {
                    children: [
                        "&nbsp;"
                    ]
                })
            ]
        }));
        this.references = [];
        __classPrivateFieldSet(this, _HTMLEDraggableElementBase_referee, null, "f");
    }
    get referee() {
        return __classPrivateFieldGet(this, _HTMLEDraggableElementBase_referee, "f");
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
        __classPrivateFieldSet(reference, _HTMLEDraggableElementBase_referee, this, "f");
        return reference;
    }
};
_HTMLEDraggableElementBase_referee = new WeakMap();
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