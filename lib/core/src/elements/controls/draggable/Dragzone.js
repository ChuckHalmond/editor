var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "../../HTMLElement";
export { HTMLEDragzoneElementBase };
let HTMLEDragzoneElementBase = class HTMLEDragzoneElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                [part~="container"]:empty {
                    display: none !important;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 2px;
                }

                ::slotted(e-draggable:not(:only-child)) {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }
            </style>
            <div part="container">
                <span part="label"/></span>
                <slot></slot>
            </div>
        `);
        this.draggables = [];
        this.selectedDraggables = [];
    }
    selectDraggable(draggable) {
        draggable.selected = true;
        if (!this.selectedDraggables.includes(draggable)) {
            this.selectedDraggables.push(draggable);
        }
    }
    unselectDraggable(draggable) {
        let index = this.selectedDraggables.indexOf(draggable);
        if (index > -1) {
            draggable.selected = false;
            this.selectedDraggables.splice(index, 1);
        }
    }
    clearSelection() {
        this.selectedDraggables.forEach((draggable) => {
            draggable.selected = false;
        });
        this.selectedDraggables = [];
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(elem => isTagElement("e-draggable", elem));
                this.draggables = draggables;
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
            let target = event.target;
            if (this.draggables.includes(target)) {
                this.selectedDraggables.forEach((thisSelectedDraggable) => {
                    thisSelectedDraggable.dragged = true;
                });
                let dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    dataTransfer.effectAllowed = "move";
                    dataTransfer.setData("text/plain", this.id);
                }
            }
        });
        this.addEventListener("dragend", (event) => {
            let target = event.target;
            if (this.draggables.includes(target)) {
                let thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                    thisDraggedDraggable.dragged = false;
                });
            }
        });
        this.addEventListener("focusout", (event) => {
            let relatedTarget = event.relatedTarget;
            if (!this.contains(relatedTarget)) {
                this.clearSelection();
            }
        });
        this.addEventListener("mousedown", (event) => {
            let target = event.target;
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
                            let targetIndex = this.draggables.indexOf(target);
                            let firstIndex = this.draggables.indexOf(this.selectedDraggables[0]);
                            let direction = Math.sign(targetIndex - firstIndex);
                            let fromIndex = (direction > 0) ? 0 : this.draggables.length - 1;
                            let toIndex = (direction > 0) ? this.draggables.length - 1 : 0;
                            let startRangeIndex = (direction > 0) ? firstIndex : targetIndex;
                            let endRangeIndex = (direction > 0) ? targetIndex : firstIndex;
                            for (let index = fromIndex; index !== toIndex; index += direction) {
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
            let target = event.target;
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
HTMLEDragzoneElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-dragzone"
    })
], HTMLEDragzoneElementBase);
//# sourceMappingURL=Dragzone.js.map