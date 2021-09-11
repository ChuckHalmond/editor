var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
export { HTMLEDropzoneElementBase };
export { DropzoneDataBase };
export { DropzoneData };
let HTMLEDropzoneElementBase = class HTMLEDropzoneElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*html*/ `
            <style>
                :host {
                    display: block;
                    border: 1px dashed gray;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                :host(:empty) [part~="container"] {
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

                :host(:not([multiple]):not(:empty)) [part="appendarea"],
                :host(:not(:empty):not([dragovered])) [part="appendarea"] {
                    display: none !important;
                }

                [part="appendarea"] {
                    display: block;
                    margin: 2px;
                    border-radius: 4px;
                    border: 1px dotted black;
                }

                :host(:not([dragovered="appendarea"])) [part="appendarea"] {
                    border-color: transparent;
                }
                
                [part="placeholder"] {
                    display: inline-block;
                    color: grey;
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
            <div part="appendarea">
                <span part="placeholder">&nbsp;</span>
            </div>
            `);
        this.draggables = [];
        this.selectedDraggables = [];
        this.droptest = null;
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
                    draggable.draggable = false;
                });
            });
        }
        const appendAreaPart = this.shadowRoot.querySelector("[part='appendarea']");
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Delete":
                    if (this == event.target) {
                        this.removeDraggables();
                    }
                    else {
                        this.removeDraggables(draggable => draggable.selected);
                    }
                    event.stopPropagation();
                    break;
                case "Escape":
                    this.clearSelection();
                    this.focus();
                    break;
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
        this.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        this.shadowRoot.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        this.addEventListener("dragenter", (event) => {
            let target = event.target;
            if (this.draggables.includes(target)) {
                target.dragovered = true;
                this.dragovered = "draggable";
            }
            else {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        this.shadowRoot.addEventListener("dragenter", (event) => {
            let target = event.target;
            if (target == appendAreaPart) {
                this.dragovered = "appendarea";
            }
            event.preventDefault();
        });
        this.addEventListener("dragleave", (event) => {
            let relatedTarget = event.relatedTarget;
            let target = event.target;
            if (target == this || this.draggables.includes(target)) {
                if (target == this) {
                    if (appendAreaPart) {
                        this.dragovered = "self";
                    }
                    if (!this.draggables.includes(relatedTarget)) {
                        this.dragovered = null;
                    }
                }
                else {
                    target.dragovered = false;
                }
            }
            event.preventDefault();
        });
        this.shadowRoot.addEventListener("dragleave", (event) => {
            let target = event.target;
            if (target == appendAreaPart) {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        this.addEventListener("drop", (event) => {
            let target = event.target;
            if (target == this || this.draggables.includes(target)) {
                let dropIndex = this.draggables.length;
                if (target == this) {
                    this.dragovered = null;
                }
                else {
                    target.dragovered = false;
                    dropIndex = this.draggables.indexOf(target);
                }
                let dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    let dragzoneId = dataTransfer.getData("text/plain");
                    let dragzone = document.getElementById(dragzoneId);
                    if (dragzone) {
                        let selectedDraggables = dragzone.selectedDraggables;
                        if (selectedDraggables) {
                            selectedDraggables.forEach((selectedDraggable) => {
                                selectedDraggable.dragged = false;
                            });
                            dragzone.clearSelection();
                            this.addDraggables(selectedDraggables, dropIndex);
                        }
                    }
                }
            }
            this.dragovered = null;
            event.preventDefault();
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var _a;
        if (newValue !== oldValue) {
            switch (name) {
                case "placeholder":
                    if (oldValue !== newValue) {
                        const placeholderPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=placeholder]");
                        if (placeholderPart) {
                            placeholderPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
    addDraggables(draggables, position) {
        var _a;
        if (draggables.length > 0) {
            let dataTransferSuccess = true;
            if (this.droptest) {
                dataTransferSuccess = this.droptest(this, draggables);
            }
            let newDraggables = [];
            let insertionPosition = -1;
            if (dataTransferSuccess) {
                if (this.multiple) {
                    draggables.forEach((draggable) => {
                        let newDraggable = draggable.cloneNode(true);
                        if (position > -1 && position < this.draggables.length) {
                            this.draggables[position].insertAdjacentElement("beforebegin", newDraggable);
                            insertionPosition = (insertionPosition < 0) ? position : insertionPosition;
                        }
                        else {
                            this.appendChild(newDraggable);
                            insertionPosition = (insertionPosition < 0) ? this.draggables.length - 1 : insertionPosition;
                        }
                        newDraggables.push(newDraggable);
                    });
                }
                else {
                    let newDraggable = draggables[0].cloneNode(true);
                    if (this.draggables.length > 0) {
                        this.replaceChild(newDraggable, this.draggables[0]);
                    }
                    else {
                        this.appendChild(newDraggable);
                    }
                    newDraggables.push(newDraggable);
                    insertionPosition = 0;
                }
            }
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    this.dispatchEvent(new CustomEvent("datachange", {
                        bubbles: true,
                        detail: {
                            action: "insert",
                            draggables: newDraggables,
                            position: insertionPosition
                        }
                    }));
                }, { once: true });
            }
            return newDraggables;
        }
        return null;
    }
    removeDraggables(predicate = () => true) {
        var _a;
        let toRemove = this.draggables.filter((value, index) => {
            return predicate(value, index);
        });
        let atPosition = this.draggables.indexOf(toRemove[0]);
        toRemove.forEach((draggable) => {
            draggable.remove();
        });
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                this.dispatchEvent(new CustomEvent("datachange", {
                    bubbles: true,
                    detail: {
                        action: "remove",
                        draggables: toRemove,
                        position: atPosition
                    }
                }));
            }, { once: true });
        }
    }
};
HTMLEDropzoneElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-dropzone",
        observedAttributes: ["placeholder", "label"]
    }),
    GenerateAttributeAccessors([
        { name: "dragovered", type: "string" },
        { name: "placeholder", type: "string" },
        { name: "disabled", type: "boolean" },
        { name: "multiple", type: "boolean" },
        { name: "input", type: "string" },
        { name: "label", type: "string" },
        { name: "name", type: "string" },
        { name: "type", type: "string" },
    ])
], HTMLEDropzoneElementBase);
class DropzoneDataBase {
    constructor(dropzone) {
        this._dropzone = dropzone;
    }
    getData() {
        const data = {};
        let dropzoneData = this._dropzone.multiple ? this._dropzone.draggables.map(draggable => draggable.data) :
            this._dropzone.draggables.length > 0 ? this._dropzone.draggables[0].data : null;
        Object.assign(data, {
            [this._dropzone.name]: dropzoneData
        });
        const descendantDrozpones = Array.from(this._dropzone.querySelectorAll("e-dropzone"));
        descendantDrozpones.forEach((descendantDrozpone) => {
            Object.assign(data, {
                [this._dropzone.name]: {
                    ...new DropzoneDataBase(descendantDrozpone).getData()
                }
            });
        });
        return data;
    }
}
var DropzoneData = DropzoneDataBase;
//# sourceMappingURL=Dropzone.js.map