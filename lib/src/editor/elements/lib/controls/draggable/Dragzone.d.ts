import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
export { HTMLEDragzoneElementBase };
interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    label: string;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}
declare class HTMLEDragzoneElementBase extends HTMLElement implements HTMLEDragzoneElement {
    label: string;
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    constructor();
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dragzone": HTMLEDragzoneElement;
    }
}
