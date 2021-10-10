import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
interface HTMLEDragzoneElementConstructor {
    readonly prototype: HTMLEDragzoneElement;
    new (): HTMLEDragzoneElement;
}
interface HTMLEDragzoneElement extends HTMLElement {
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    disabled: boolean;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dragzone": HTMLEDragzoneElement;
    }
}
declare var HTMLEDragzoneElement: HTMLEDragzoneElementConstructor;
