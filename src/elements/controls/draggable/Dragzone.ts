import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEDraggableElement } from "./Draggable";

export { HTMLEDragzoneElement };

interface HTMLEDragzoneElementConstructor {
    readonly prototype: HTMLEDragzoneElement;
    new(): HTMLEDragzoneElement
}

interface HTMLEDragzoneElement extends HTMLElement {
    readonly draggables: HTMLEDraggableElement[];
    readonly selectedDraggables: HTMLEDraggableElement[];
    disabled: boolean;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
    connectedCallback(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-dragzone": HTMLEDragzoneElement,
    }
}

@CustomElement({
    name: "e-dragzone"
})
class HTMLEDragzoneElementBase extends HTMLElement implements HTMLEDragzoneElement {

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    #draggables: HTMLEDraggableElement[];
    #selectedDraggables: HTMLEDraggableElement[];

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            element("style", {
                properties: {
                    innerText: /*css*/`
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
            }),
            element("div", {
                part: ["container"],
                children: [
                    element("slot")
                ]
            })
        );
        this.#draggables = [];
        this.#selectedDraggables = [];
    }

    get draggables(): HTMLEDraggableElement[] {
        return this.#draggables;
    }

    get selectedDraggables(): HTMLEDraggableElement[] {
        return this.#selectedDraggables;
    }

    selectDraggable(draggable: HTMLEDraggableElement): void {
        if (!this.selectedDraggables.includes(draggable)) {
            this.selectedDraggables.push(draggable);
        }
        if (!draggable.selected) {
            draggable.selected = true;
        }
    }

    unselectDraggable(draggable: HTMLEDraggableElement): void {
        const index = this.selectedDraggables.indexOf(draggable);
        if (index > -1) {
            if (draggable.selected) {
                draggable.selected = false;
            }
            this.selectedDraggables.splice(index, 1);
        }
    }

    clearSelection(): void {
        this.selectedDraggables.forEach((draggable) => {
            draggable.selected = false;
        });
        this.#selectedDraggables = [];
    }
    
    connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const draggables = slot.assignedElements().filter(
                    elem => elem instanceof HTMLEDraggableElement
                ) as HTMLEDraggableElement[];
                this.#draggables = draggables;
                this.draggables.forEach((draggable) => {
                    draggable.draggable = true;
                });
            });
        }

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "Escape":
                    this.clearSelection();
                    this.focus();
                    break;
            }
        });

        this.addEventListener("dragstart", (event: DragEvent) => {
            const target = event.target as any;
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
        
        this.addEventListener("dragend", (event: DragEvent) => {
            const target = event.target as any;
            if (this.draggables.includes(target)) {
                const thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                    thisDraggedDraggable.dragged = false;
                });
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            const relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.clearSelection();
            }
        });
        
        this.addEventListener("mousedown", (event: MouseEvent) => {
            const target = event.target as any;
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
        
        this.addEventListener("mouseup", (event: MouseEvent) => {
            const target = event.target as any;
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
}

var HTMLEDragzoneElement: HTMLEDragzoneElementConstructor = HTMLEDragzoneElementBase;