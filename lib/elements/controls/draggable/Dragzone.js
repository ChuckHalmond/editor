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
var _HTMLEDragzoneElementBase_draggables, _HTMLEDragzoneElementBase_selectedDraggables;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
let HTMLEDragzoneElementBase = class HTMLEDragzoneElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEDragzoneElementBase_draggables.set(this, void 0);
        _HTMLEDragzoneElementBase_selectedDraggables.set(this, void 0);
        this.attachShadow({ mode: "open" }).append(element("style", {
            children: [
                /*css*/ `
                        :host {
                            display: block;
                        }
        
                        :host([disabled]) {
                            pointer-events: none;
                        }
        
                        [part="container"] {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            padding-left: 2px;
                            padding-right: 2px;
                        }
        
                        ::slotted(*) {
                            margin-top: 2px;
                            margin-bottom: 2px;
                        }
                    `
            ]
        }), element("div", {
            attributes: {
                part: "container"
            },
            children: [
                element("slot")
            ]
        }));
        __classPrivateFieldSet(this, _HTMLEDragzoneElementBase_draggables, [], "f");
        __classPrivateFieldSet(this, _HTMLEDragzoneElementBase_selectedDraggables, [], "f");
    }
    get draggables() {
        return __classPrivateFieldGet(this, _HTMLEDragzoneElementBase_draggables, "f");
    }
    get selectedDraggables() {
        return __classPrivateFieldGet(this, _HTMLEDragzoneElementBase_selectedDraggables, "f");
    }
    selectDraggable(draggable) {
        if (!this.selectedDraggables.includes(draggable)) {
            this.selectedDraggables.push(draggable);
        }
        if (!draggable.selected) {
            draggable.selected = true;
        }
    }
    unselectDraggable(draggable) {
        const index = this.selectedDraggables.indexOf(draggable);
        if (index > -1) {
            if (draggable.selected) {
                draggable.selected = false;
            }
            this.selectedDraggables.splice(index, 1);
        }
    }
    clearSelection() {
        this.selectedDraggables.forEach((draggable) => {
            draggable.selected = false;
        });
        __classPrivateFieldSet(this, _HTMLEDragzoneElementBase_selectedDraggables, [], "f");
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(elem => elem instanceof HTMLEDraggableElement);
                __classPrivateFieldSet(this, _HTMLEDragzoneElementBase_draggables, draggables, "f");
                this.draggables.forEach((draggable) => {
                    draggable.draggable = true;
                });
            });
        }
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Escape":
                    this.clearSelection();
                    this.focus();
                    break;
            }
        });
        this.addEventListener("dragstart", (event) => {
            const target = event.target;
            if (this.draggables.includes(target)) {
                this.selectedDraggables.forEach((thisSelectedDraggable) => {
                    thisSelectedDraggable.dragged = true;
                });
                const dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    dataTransfer.dropEffect = "move";
                    dataTransfer.setData("text/plain", this.id);
                }
            }
        });
        this.addEventListener("dragleave", (event) => {
            const dataTransfer = event.dataTransfer;
            if (dataTransfer) {
                dataTransfer.dropEffect = "none";
            }
        });
        this.addEventListener("dragend", (event) => {
            const target = event.target;
            if (this.draggables.includes(target)) {
                const thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                    thisDraggedDraggable.dragged = false;
                });
            }
        });
        this.addEventListener("focusout", (event) => {
            const relatedTarget = event.relatedTarget;
            if (!this.contains(relatedTarget)) {
                this.clearSelection();
            }
        });
        this.addEventListener("mousedown", (event) => {
            const target = event.target;
            if (event.button == 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        if (!target.selected) {
                            this.clearSelection();
                            this.selectDraggable(target);
                        }
                    }
                    else if (event.ctrlKey) {
                        (!target.selected) ?
                            this.selectDraggable(target) :
                            this.unselectDraggable(target);
                    }
                    else if (event.shiftKey) {
                        if (this.selectedDraggables.length > 0) {
                            const targetIndex = this.draggables.indexOf(target);
                            const firstIndex = this.draggables.indexOf(this.selectedDraggables[0]);
                            const direction = Math.sign(targetIndex - firstIndex);
                            const fromIndex = (direction > 0) ? 0 : this.draggables.length - 1;
                            const toIndex = (direction > 0) ? this.draggables.length - 1 : 0;
                            const startRangeIndex = (direction > 0) ? firstIndex : targetIndex;
                            const endRangeIndex = (direction > 0) ? targetIndex : firstIndex;
                            for (let index = fromIndex; index !== (toIndex + direction); index += direction) {
                                (index >= startRangeIndex && index <= endRangeIndex) ?
                                    this.selectDraggable(this.draggables[index]) :
                                    this.unselectDraggable(this.draggables[index]);
                            }
                        }
                        else {
                            this.selectDraggable(target);
                        }
                    }
                }
                else {
                    this.clearSelection();
                }
            }
        });
        this.addEventListener("mouseup", (event) => {
            const target = event.target;
            if (event.button == 0) {
                if (this.draggables.includes(target)) {
                    if (!event.shiftKey && !event.ctrlKey) {
                        this.draggables.forEach((thisDraggable) => {
                            if (thisDraggable !== target) {
                                this.unselectDraggable(thisDraggable);
                            }
                        });
                    }
                }
            }
        });
    }
};
_HTMLEDragzoneElementBase_draggables = new WeakMap(), _HTMLEDragzoneElementBase_selectedDraggables = new WeakMap();
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEDragzoneElementBase.prototype, "disabled", void 0);
HTMLEDragzoneElementBase = __decorate([
    CustomElement({
        name: "e-dragzone"
    })
], HTMLEDragzoneElementBase);
var HTMLEDragzoneElement = HTMLEDragzoneElementBase;
//# sourceMappingURL=Dragzone.js.map