import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";

export { DataChangeEvent };
export { HTMLEDropzoneElement };
export { HTMLEDropzoneElementBase };
export { DropzoneDataBase };
export { DropzoneData };

interface HTMLEDropzoneElement extends HTMLElement {
    selectedDraggables: HTMLEDraggableElement[]
    draggables: HTMLEDraggableElement[];
    dragovered: DropzoneDragoveredType | null;
    name: string;
    type: string;
    multiple: boolean;
    disabled: boolean;
    placeholder: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}

type DropzoneDragoveredType = "self" | "draggable" | "appendarea";

type DataChangeEvent = CustomEvent<{
    action: "insert" | "remove";
    draggables: HTMLEDraggableElement[];
    position: number;
}>;

@RegisterCustomHTMLElement({
    name: "e-dropzone",
    observedAttributes: ["placeholder", "label"]
})
@GenerateAttributeAccessors([
    {name: "dragovered", type: "string"},
    {name: "placeholder", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "multiple", type: "boolean"},
    {name: "input", type: "string"},
    {name: "label", type: "string"},
    {name: "name", type: "string"},
    {name: "type", type: "string"},
])
class HTMLEDropzoneElementBase extends HTMLElement implements HTMLEDropzoneElement {
    
    public dragovered!: DropzoneDragoveredType | null;
    public placeholder!: string;
    public input!: string;
    public multiple!: boolean;
    public disabled!: boolean;
    public name!: string;
    public type!: string;

    public droptest!: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => boolean) | null;
    public value: any;

    public draggables: HTMLEDraggableElement[];
    public selectedDraggables: HTMLEDraggableElement[];

    constructor() {
        super();
        
        bindShadowRoot(this, /*html*/`
            <style>
                :host {
                    display: block;
                    border: 1px dashed gray;
                }

                :host([disabled]) {
                    pointer-events: none;
                    border-color: gainsboro;
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
            `
        );
        this.draggables = [];
        this.selectedDraggables = [];
        this.droptest = null;
    }

    public selectDraggable(draggable: HTMLEDraggableElement): void {
        draggable.selected = true;
        if (!this.selectedDraggables.includes(draggable)) {
            this.selectedDraggables.push(draggable);
        }
    }

    public unselectDraggable(draggable: HTMLEDraggableElement): void {
        let index = this.selectedDraggables.indexOf(draggable);
        if (index > -1) {
            draggable.selected = false;
            this.selectedDraggables.splice(index, 1);
        }
    }

    public clearSelection(): void {
        this.selectedDraggables.forEach((draggable) => {
            draggable.selected = false;
        });
        this.selectedDraggables = [];
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(
                    elem => isTagElement("e-draggable", elem)
                ) as HTMLEDraggableElement[];
                this.draggables = draggables;
                this.draggables.forEach((draggable) => {
                    draggable.draggable = false;
                });
            });
        }

        const appendAreaPart = this.shadowRoot!.querySelector<HTMLDivElement>("[part='appendarea']");

        this.addEventListener("keydown", (event: KeyboardEvent) => {
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

        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.clearSelection();
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
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
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            let target = event.target as any;
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

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        this.addEventListener("dragenter", (event: DragEvent) => {
            let target = event.target as any;
            if (this.draggables.includes(target)) {
                target.dragovered = true;
                this.dragovered = "draggable";
            }
            else {
                this.dragovered = "self";
            }
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragenter", (event) => {
            let target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "appendarea";
            }
            event.preventDefault();
        });

        this.addEventListener("dragleave", (event: DragEvent) => {
            let relatedTarget = event.relatedTarget as any;
            let target = event.target as any;
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

        this.shadowRoot!.addEventListener("dragleave", (event) => {
            let target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        
        this.addEventListener("drop", (event) => {
            let target = event.target as any;
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
                    let dragzone = document.getElementById(dragzoneId) as HTMLEDragzoneElement;
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

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "placeholder":
                    if (oldValue !== newValue) {
                        const placeholderPart = this.shadowRoot?.querySelector("[part~=placeholder]");
                        if (placeholderPart) {
                            placeholderPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }

    public addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null {
        if (draggables.length > 0) {
            let dataTransferSuccess = true;
            if (this.droptest) {
                dataTransferSuccess = this.droptest(this, draggables);
            }
            
            let newDraggables: HTMLEDraggableElement[] = [];
            let insertionPosition = -1;
            if (dataTransferSuccess) {
                if (this.multiple) {
                    draggables.forEach((draggable) => {
                        let newDraggable = draggable.cloneNode(true) as HTMLEDraggableElement;
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
                    let newDraggable = draggables[0].cloneNode(true) as HTMLEDraggableElement;
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
            
            const slot = this.shadowRoot?.querySelector("slot");
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
                }, {once: true});
            }
            return newDraggables;
        }
        return null;
    }

    public removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean = () => true) {
        let toRemove = this.draggables.filter(
            (value: HTMLEDraggableElement, index: number) => {
                return predicate(value, index);
            }
        );
        let atPosition = this.draggables.indexOf(toRemove[0]);
        toRemove.forEach((draggable) => {
            draggable.remove(); 
        });
        const slot = this.shadowRoot?.querySelector("slot");
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
            }, {once: true});
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "datachange": DataChangeEvent,
    }
}

interface DropzoneData {
    getData(): object | null;
}

interface DropzoneDataConstructor {
    readonly prototype: DropzoneData;
    new(dropzone: HTMLEDropzoneElement): DropzoneData;
}

class DropzoneDataBase {
    private _dropzone: HTMLEDropzoneElement;

    constructor(dropzone: HTMLEDropzoneElement) {
        this._dropzone = dropzone;
    }

    public getData(): object | null {
        let dropzoneData = 
            this._dropzone.multiple ? this._dropzone.draggables.map(draggable => draggable.data) :
            this._dropzone.draggables.length > 0 ? this._dropzone.draggables[0].data : null;

        const childDropzones = Array.from(this._dropzone.querySelectorAll("e-dropzone")).filter(
            dropzone => dropzone.parentElement!.closest("e-dropzone") === this._dropzone
        );

        childDropzones.forEach((childDropzone) => {
            Object.assign(dropzoneData, {
                ...new DropzoneDataBase(childDropzone).getData()
            });
        });

        return dropzoneData;
    }
}

var DropzoneData: DropzoneDataConstructor = DropzoneDataBase;