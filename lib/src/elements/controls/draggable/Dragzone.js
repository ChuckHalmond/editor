var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
let HTMLEDragzoneElementBase = class HTMLEDragzoneElementBase extends HTMLElement {
    disabled;
    #draggables;
    #selectedDraggables;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
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
            }
        }), HTML("div", {
            part: ["container"],
            children: [
                HTML("slot")
            ]
        }));
        this.#draggables = [];
        this.#selectedDraggables = [];
    }
    get draggables() {
        return this.#draggables;
    }
    get selectedDraggables() {
        return this.#selectedDraggables;
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
        this.#selectedDraggables = [];
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(elem => elem instanceof HTMLEDraggableElement);
                this.#draggables = draggables;
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
            if (event.button === 0) {
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
            if (event.button === 0) {
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