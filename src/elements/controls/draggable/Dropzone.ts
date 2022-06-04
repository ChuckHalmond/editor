import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";

export { HTMLEDropzoneElement };
export { EDataChangeEvent };

interface HTMLEDropzoneElementConstructor {
    readonly prototype: HTMLEDropzoneElement;
    new(): HTMLEDropzoneElement;
}

interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    readonly shadowRoot: ShadowRoot;
    dragovered: DropzoneDragoveredType | null;
    name: string;
    multiple: boolean;
    placeholder: string;

    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;

    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;

    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
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

@CustomElement({
    name: "e-dropzone"
})
class HTMLEDropzoneElementBase extends HTMLEDragzoneElement implements HTMLEDropzoneElement {
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    dragovered!: DropzoneDragoveredType | null;

    @AttributeProperty({type: String, observed: true})
    placeholder!: string;

    @AttributeProperty({type: Boolean})
    multiple!: boolean;

    droptest!: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => boolean) | null;

    readonly shadowRoot!: ShadowRoot;

    constructor() {
        super();

        this.shadowRoot!.querySelector("style")!.append(/*css*/`
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
        `);

        this.shadowRoot.append(
            element("div", {
                attributes: {
                    part: "appendarea"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "placeholder"
                        },
                        children: [
                            "&nbsp;"
                        ]
                    })
                ]
            })
        );

        this.droptest = null;
    }
    
    connectedCallback() {
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

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "placeholder": {
                const placeholderPart = this.shadowRoot.querySelector("[part='placeholder']");
                if (placeholderPart) {
                    placeholderPart.textContent = newValue;
                }
                break;
            }
        }
    }

    addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null {
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

    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean = () => true) {
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