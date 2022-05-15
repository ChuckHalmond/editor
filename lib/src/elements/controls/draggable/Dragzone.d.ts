import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDragzoneElement };
interface HTMLEDragzoneElementConstructor {
    readonly prototype: HTMLEDragzoneElement;
    new (): HTMLEDragzoneElement;
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
        "e-dragzone": HTMLEDragzoneElement;
    }
}
declare var HTMLEDragzoneElement: HTMLEDragzoneElementConstructor;
