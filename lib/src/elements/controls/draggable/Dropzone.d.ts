import { HTMLEDraggableElement } from "./Draggable";
export { HTMLEDropzoneElement };
interface HTMLEDropzoneElementConstructor {
    readonly prototype: HTMLEDropzoneElement;
    new (): HTMLEDropzoneElement;
}
interface HTMLEDropzoneElement extends HTMLElement {
    selectedDraggables: HTMLEDraggableElement[];
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
