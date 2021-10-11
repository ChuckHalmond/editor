import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDropzoneElement };
export { EDataChangeEvent };
interface HTMLEDropzoneElementConstructor {
    readonly prototype: HTMLEDropzoneElement;
    new (): HTMLEDropzoneElement;
}
interface HTMLEDropzoneElement extends HTMLElement {
    dragovered: DropzoneDragoveredType | null;
    name: string;
    multiple: boolean;
    disabled: boolean;
    placeholder: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}
declare type DropzoneDragoveredType = "self" | "draggable" | "appendarea";
declare type EDataChangeEvent = CustomEvent<{
    action: "insert" | "remove";
    draggables: HTMLEDraggableElement[];
    position: number;
}>;
declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement;
    }
    interface HTMLElementEventMap {
        "e_datachange": EDataChangeEvent;
    }
}
declare var HTMLEDropzoneElement: HTMLEDropzoneElementConstructor;
