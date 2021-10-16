import { RegisterCustomHTMLElement, GenerateAttributeAccessors } from "../../HTMLElement";
import { HTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";

export { HTMLEDropzoneElement };
export { EDataChangeEvent };

interface HTMLEDropzoneElementConstructor {
    readonly prototype: HTMLEDropzoneElement;
    new(): HTMLEDropzoneElement;
}

interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    dragovered: DropzoneDragoveredType | null;
    name: string;
    multiple: boolean;
    placeholder: string;

    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;

    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
}

type DropzoneDragoveredType = "self" | "draggable" | "appendarea";

type EDataChangeEvent = CustomEvent<{
    action: "insert" | "remove";
    draggables: HTMLEDraggableElement[];
    position: number;
}>;

declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement,
    }
    
    interface HTMLElementEventMap {
        "e_datachange": EDataChangeEvent,
    }
}

@RegisterCustomHTMLElement({
    name: "e-dropzone",
    observedAttributes: ["placeholder"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "dragovered", type: "string"},
    {name: "placeholder", type: "string"},
    {name: "multiple", type: "boolean"},
])
class HTMLEDropzoneElementBase extends HTMLEDragzoneElement implements HTMLEDropzoneElement {
    public name!: string;
    public dragovered!: DropzoneDragoveredType | null;
    public placeholder!: string;
    public multiple!: boolean;

    public droptest!: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => boolean) | null;

    constructor() {
        super();

        this.shadowRoot!.querySelector("style")!.innerHTML += /*css*/`
            :host {
                border: 1px dashed gray;
            }

            :host(:not([multiple]):not(:empty)) [part="appendarea"],
            :host(:not(:empty):not([dragovered])) [part="appendarea"] {
                display: none !important;
            }

            :host(:not([dragovered])) [part="dragovered"] {
                display: none;
            }

            :host([dragovered]) [part="placeholder"] {
                display: none;
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
            
            [part="dragovered"],
            [part="placeholder"] {
                display: inline-block;
                color: grey;
                pointer-events: none;
                user-select: none;
            }
        `;

        this.shadowRoot!.innerHTML += /*html*/`
            <div part="appendarea">
                <span part="placeholder">&nbsp;</span>
                <span part="dragovered">&nbsp;</span>
            </div>
        `;

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
        super.connectedCallback();
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
            }
        });

        this.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });

        this.shadowRoot!.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        this.addEventListener("dragenter", (event: DragEvent) => {
            const target = event.target as any;
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
            const target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "appendarea";
            }
            event.preventDefault();
        });

        this.addEventListener("dragleave", (event: DragEvent) => {
            const relatedTarget = event.relatedTarget as any;
            const target = event.target as any;
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
            const target = event.target as any;
            if (target == appendAreaPart) {
                this.dragovered = "self";
            }
            event.preventDefault();
        });
        
        this.addEventListener("drop", (event) => {
            const target = event.target as any;
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
            
            const slot = this.shadowRoot?.querySelector("slot");
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
                this.dispatchEvent(new CustomEvent("e_datachange", {
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

var HTMLEDropzoneElement: HTMLEDropzoneElementConstructor = HTMLEDropzoneElementBase;