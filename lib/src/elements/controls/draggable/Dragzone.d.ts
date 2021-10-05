import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
export { HTMLEDragzoneElementBase };
interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    disabled: boolean;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}
declare class HTMLEDragzoneElementBase extends HTMLElement implements HTMLEDragzoneElement {
    disabled: boolean;
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
