var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors } from "../../HTMLElement";
import { HTMLEDragzoneElement } from "./Dragzone";
export { HTMLEDropzoneElement };
let HTMLEDropzoneElementBase = class HTMLEDropzoneElementBase extends HTMLEDragzoneElement {
    constructor() {
        super();
        this.shadowRoot.querySelector("style").innerHTML += /*css*/ `
            :host {
                border: 1px dashed gray;
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
        `;
        this.shadowRoot.innerHTML += /*html*/ `
            <div part="appendarea">
                <span part="placeholder">&nbsp;</span>
            </div>
        `;
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
        super.connectedCallback();
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
            }
        });
        this.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        this.shadowRoot.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        this.addEventListener("dragenter", (event) => {
            const target = event.target;
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
            const target = event.target;
            if (target == appendAreaPart) {
                this.dragovered = "appendarea";
            }
            event.preventDefault();
        });
        this.addEventListener("dragleave", (event) => {
            const relatedTarget = event.relatedTarget;
            const target = event.target;
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
            const target = event.target;
            if (target == appendAreaPart) {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        this.addEventListener("drop", (event) => {
            const target = event.target;
            if (target == this || this.draggables.includes(target)) {
                let dropIndex = this.draggables.length;
                if (target == this) {
                    this.dragovered = null;
                }
                else {
                    target.dragovered = false;
                    dropIndex = this.draggables.indexOf(target);
                }
                const dataTransfer = event.dataTransfer;
                if (dataTransfer) {
                    const dragzoneId = dataTransfer.getData("text/plain");
                    const dragzone = document.getElementById(dragzoneId);
                    if (dragzone instanceof HTMLEDragzoneElement) {
                        const selectedDraggables = dragzone.selectedDraggables;
                        if (selectedDraggables) {
                            selectedDraggables.forEach((selectedDraggable) => {
                                selectedDraggable.dragged = false;
                            });
                            if (dragzone instanceof HTMLEDropzoneElement) {
                                dragzone.removeDraggables((draggable) => selectedDraggables.includes(draggable));
                            }
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
                        let newDraggable = draggable.getReference();
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
                    let newDraggable = draggables[0].getReference();
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
                    this.dispatchEvent(new CustomEvent("e_datachange", {
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
                this.dispatchEvent(new CustomEvent("e_datachange", {
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
        observedAttributes: ["placeholder"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "dragovered", type: "string" },
        { name: "placeholder", type: "string" },
        { name: "multiple", type: "boolean" },
    ])
], HTMLEDropzoneElementBase);
var HTMLEDropzoneElement = HTMLEDropzoneElementBase;
//# sourceMappingURL=Dropzone.js.map